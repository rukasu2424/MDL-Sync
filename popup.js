function renderLastDetected(lastDetected) {
  const el = document.getElementById("lastDetected");
  if (!lastDetected) return;
  el.className = "item";
  el.textContent = `${lastDetected.title} — S${lastDetected.season}E${lastDetected.episode} (${lastDetected.site})`;
}

function renderMappings(mdlMap) {
  const container = document.getElementById("mappings");
  const entries = Object.entries(mdlMap || {});

  if (entries.length === 0) {
    container.className = "empty";
    container.textContent = "No titles mapped yet.";
    return;
  }

  container.className = "";
  container.innerHTML = "";

  for (const [key, entry] of entries) {
    // Compatibilidade: mapeamentos salvos antes da v0.1.2 eram só a URL
    // como string; agora é um objeto { url, total }.
    const url = typeof entry === "string" ? entry : entry.url;
    const total = typeof entry === "string" ? null : entry.total;

    const row = document.createElement("div");
    row.className = "map-row";

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = total ? `${key} (${total} eps)` : key;
    link.title = url;
    row.appendChild(link);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "remove";
    removeBtn.onclick = async () => {
      const { mdlMap } = await chrome.storage.local.get("mdlMap");
      delete mdlMap[key];
      await chrome.storage.local.set({ mdlMap });
      row.remove();
      if (Object.keys(mdlMap).length === 0) renderMappings({});
    };
    row.appendChild(removeBtn);

    container.appendChild(row);
  }
}

chrome.storage.local.get(["lastDetected", "mdlMap"], ({ lastDetected, mdlMap }) => {
  renderLastDetected(lastDetected);
  renderMappings(mdlMap);
});
