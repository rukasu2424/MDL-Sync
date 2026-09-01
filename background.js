// ============================================================
// BACKGROUND SCRIPT
// Recebe o episódio detectado no site de streaming e tenta
// sincronizar com o MyDramaList numa aba oculta.
// ============================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SYNC_EPISODE") {
    const isAuto = message.source === "auto";

    syncEpisodeToMDL(message.data)
      .then((result) => {
        if (isAuto) notify(`✓ ${result.title} — Ep ${result.episode}`, "Sincronizado automaticamente no MDL.");
        sendResponse({ ok: true, result });
      })
      .catch((err) => {
        if (isAuto) notify(`✗ Falha ao sincronizar`, err.message);
        sendResponse({ ok: false, error: err.message });
      });
    return true; // resposta assíncrona
  }
});

// Notificação nativa do sistema — ao contrário do badge na página, essa
// aparece mesmo com o vídeo em tela cheia ou a aba em segundo plano.
function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/icon128.png"),
    title,
    message
  });
}

async function syncEpisodeToMDL({ title, season, episode, key }) {
  // 1) Já sabemos pra onde esse título aponta no MDL?
  const stored = await chrome.storage.local.get("mdlMap");
  const mdlMap = stored.mdlMap || {};
  let mdlUrl = mdlMap[key];

  if (!mdlUrl) {
    // 2) Primeira vez: abre a busca numa aba VISÍVEL e deixa o usuário
    // clicar no resultado certo (evita sync errado por título diferente
    // entre sites, ex: "Awaken" no site vs "The Awake" no MDL).
    mdlUrl = await resolveTitleManually(title);
    if (!mdlUrl) throw new Error("Você fechou a aba antes de escolher o título certo.");

    mdlMap[key] = mdlUrl;
    await chrome.storage.local.set({ mdlMap });
  }

  // 3) Já sabemos a página certa — marca o episódio (aba oculta agora, já
  // que não precisa mais de intervenção manual).
  const tab = await chrome.tabs.create({ url: mdlUrl, active: false });
  await waitForTabLoad(tab.id);

  const [{ result: marked }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: markEpisodeWatchedOnMDL,
    args: [episode]
  });

  await chrome.tabs.remove(tab.id);

  if (!marked) {
    throw new Error("Cheguei na página do título, mas não consegui marcar o episódio.");
  }

  return { title, season, episode, url: mdlUrl };
}

// Abre a busca numa aba ativa e espera o usuário navegar até a página
// correta do título (URL no formato mydramalist.com/{id}-{slug}).
function resolveTitleManually(title) {
  return new Promise(async (resolve) => {
    const searchUrl = `https://mydramalist.com/search?q=${encodeURIComponent(title)}`;
    const tab = await chrome.tabs.create({ url: searchUrl, active: true });

    function isTitlePage(url) {
      try {
        const u = new URL(url);
        return u.hostname === "mydramalist.com" && /^\/\d+-/.test(u.pathname);
      } catch {
        return false;
      }
    }

    function updateListener(tabId, info, updatedTab) {
      if (tabId !== tab.id || info.status !== "complete") return;
      if (isTitlePage(updatedTab.url)) {
        cleanup();
        resolve(updatedTab.url);
      }
    }

    function removeListener(tabId) {
      if (tabId !== tab.id) return;
      cleanup();
      resolve(null); // usuário fechou a aba sem escolher
    }

    function cleanup() {
      chrome.tabs.onUpdated.removeListener(updateListener);
      chrome.tabs.onRemoved.removeListener(removeListener);
    }

    chrome.tabs.onUpdated.addListener(updateListener);
    chrome.tabs.onRemoved.addListener(removeListener);
  });
}

// ------------------------------------------------------------
// Roda DENTRO da página do MDL (contexto da aba), via chrome.scripting.
// Fluxo: clica em "Add to List" -> espera o dialog abrir -> escreve o
// número de episódios assistidos no input -> clica em "Submit".
// ------------------------------------------------------------
function markEpisodeWatchedOnMDL(episodeNumber) {
  function waitFor(selector, timeout = 6000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject(new Error("timeout esperando: " + selector));
        }
      }, 200);
    });
  }

  return (async () => {
    try {
      const addBtn = document.querySelector(".btn-manage-list");
      if (!addBtn) throw new Error("Botão 'Add to List' não encontrado nesta página.");
      addBtn.click();

      // espera o dialog do Element UI renderizar e o input aparecer
      const input = await waitFor('.el-input__inner[type="number"]');

      // setter nativo — necessário pra frameworks reativos (Vue/React)
      // perceberem a mudança de valor, já que setar .value direto é ignorado.
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeSetter.call(input, episodeNumber);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));

      // acha o botão de submit pelo texto do <span> filho
      const submitSpan = Array.from(document.querySelectorAll("span")).find(
        (s) => s.textContent.trim() === "Submit"
      );
      if (!submitSpan) throw new Error("Botão 'Submit' não encontrado.");
      const submitBtn = submitSpan.closest("button") || submitSpan;
      submitBtn.click();

      return true;
    } catch (err) {
      console.warn("[MDL Sync] Erro ao marcar episódio:", err.message);
      return false;
    }
  })();
}

function waitForTabLoad(tabId) {
  return new Promise((resolve) => {
    function listener(id, info) {
      if (id === tabId && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(listener);
  });
}
