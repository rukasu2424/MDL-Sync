🇬🇧 English

# MDL Sync (prototype) — v0.1.1

## What's New in This Version — Auto-sync Based on Watch Percentage

If a title **already has a saved mapping** (you have manually selected the correct MDL entry at least once), the extension now monitors the page's `<video>` element and automatically syncs the episode once it passes 80% — without requiring you to click the "Mark on MDL" button.

* **New titles** (without a mapping yet) still require a manual click the first time — this is how the mapping is created.
* The badge displays "🔄 auto 80%" when auto-sync is active for the current episode.
* **Permanent "already synced" indicator**: as soon as an episode is synced (manually or automatically), this information is saved. The next time the page loads — even after exiting fullscreen, reloading the page, or reopening the browser — the button will already appear as "Already synced ✓" instead of the default "Mark on MDL". This is important for users who don't know that auto-sync exists (e.g. friends using the extension), so they won't be confused and click the button unnecessarily thinking nothing has been done.
* **Native system notification**: since the badge is hidden when the video is in fullscreen (the browser only renders the fullscreen element, not the rest of the page), auto-sync also triggers a browser/OS notification when completed. This notification appears regardless of whether the video is in fullscreen or the tab is in the background.
* Works best on sites that use the native HTML5 `<video>` tag. Sites that hide the video inside a third-party `<iframe>` may not work (due to the browser's cross-origin limitations) — in these cases, the manual button remains available as an alternative.

## How to Install (Developer Mode)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select this folder.
4. Open an episode page on clubdodorama, e.g.:
   https://clubdodorama.com/episodios/awaken-1x10/
5. A badge should appear in the bottom-right corner showing the detected title/episode.

## Current Status

* ✅ Title + season + episode detection on clubdodorama.com
* ✅ UI badge with a "Mark on MDL" button
* ✅ Episode marking through the "Add to List" dialog (click → fill input → Submit)
* ✅ Manual matching the first time (you choose the correct result from the search, since titles may differ between sites — e.g. "Awaken" vs "The Awake")
* ✅ Mapping cache (`chrome.storage.local`, key `mdlMap`) — from the second time onward, the search is skipped and the extension goes directly to the correct page
* ✅ Popup displays mapped titles and allows you to remove them (to correct a wrong selection)

### How Matching Currently Works

1. First episode of a new title → opens the MDL search in a visible tab. You click the correct result, the extension detects the navigation and saves the mapping.
2. Subsequent episodes of the same title → goes directly to the correct page, using a hidden tab without performing another search.
3. Selected the wrong title? Open the extension popup, find the entry under **"Mapped Titles"**, and click **"Remove"** — the next sync will ask you to choose again.

## Currently Supported Sites

* clubdodorama.com
* viki.com
* wetv.vip
* kisskh.co
* iq.com (iQIYI)
* 123flmsfree.com, ver.123pelicula.com, flixlat.com, play.cuevana19.com
  (all use the same parser, `content/detail-drama-template.js`, because they share the same URL structure)

## How to Add a New Streaming Site

Each site requires 2 things:

1. A file at `content/<site-name>.js` containing a `SITE_PARSER` object implementing `getSeasonEpisode()` (returning `{ season, episode, slug }`) and `getTitle()` — use `content/viki.js` or `content/clubdodorama.js` as a template. At the end of the file, call `window.MDLSyncCommon.init(SITE_PARSER)`.
2. An entry in `content_scripts` in `manifest.json` pointing to the domain, **always loading `content/common.js` before the site-specific file**:

```json
{
  "matches": ["https://othersite.com/some/pattern/*"],
  "js": ["content/common.js", "content/othersite.js"],
  "run_at": "document_idle"
}
```

Also add the domain to `host_permissions`.

Nothing else needs to be changed — the badge, background communication, mapping cache, and MDL sync logic are all shared through `common.js` and `background.js`.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🇧🇷 Português

# MDL Sync (protótipo) — v0.1.1

## Novidade desta versão — Auto-sync por % assistido

Se um título **já tem mapeamento salvo** (você já resolveu manualmente qual
é a entrada certa no MDL pelo menos uma vez), a extensão passa a escutar o
`<video>` da página e sincroniza sozinha automaticamente ao passar de 80%
do episódio — sem precisar clicar no botão "Marcar no MDL".

- Títulos **novos** (sem mapeamento ainda) continuam exigindo o clique
  manual na primeira vez — é assim que o mapeamento é criado.
- O badge mostra "🔄 auto 80%" quando o auto-sync está ativo pro episódio atual.
- **Indicador permanente de "já sincronizado"**: assim que um episódio é
  sincronizado (manual ou automaticamente), isso fica salvo. Da próxima vez
  que essa página carregar — mesmo depois de sair da tela cheia, recarregar,
  ou reabrir o navegador — o botão já aparece como "Já sincronizado ✓" em
  vez do padrão "Marcar no MDL". Isso é importante pra quem não sabe que o
  auto-sync existe (ex: amigos usando a extensão) não ficar em dúvida e
  clicar à toa achando que nada foi feito.
- **Notificação nativa do sistema**: como o badge fica escondido quando o
  vídeo está em tela cheia (o navegador só renderiza o elemento em
  fullscreen, não o resto da página), o auto-sync também dispara uma
  notificação do navegador/SO ao concluir — essa aparece independente de
  fullscreen ou da aba estar em segundo plano.
- Funciona melhor em sites que usam a tag `<video>` HTML5 nativa. Sites que
  escondem o vídeo dentro de um `<iframe>` de terceiros podem não funcionar
  (limitação de cross-origin do navegador) — nesses casos, o botão manual
  continua sempre disponível como alternativa.

## Como instalar (modo desenvolvedor)

1. Abra `chrome://extensions` (ou `edge://extensions`).
2. Ative o "Modo do desenvolvedor" no canto superior direito.
3. Clique em "Carregar sem compactação" e selecione esta pasta.
4. Abra uma página de episódio no clubdodorama, ex:
   https://clubdodorama.com/episodios/awaken-1x10/
5. Deve aparecer um badge no canto inferior direito com o título/episódio detectado.

## Status atual

- ✅ Detecção de título + temporada + episódio no clubdodorama.com
- ✅ Badge de UI com botão "Marcar no MDL"
- ✅ Marcação do episódio via dialog "Add to List" (clica → preenche input → Submit)
- ✅ Matching manual na primeira vez (você escolhe o resultado certo na busca,
  já que títulos podem divergir entre sites — ex: "Awaken" vs "The Awake")
- ✅ Cache do mapeamento (`chrome.storage.local`, chave `mdlMap`) — da segunda
  vez em diante pula a busca e vai direto pra página certa
- ✅ Popup mostra os títulos mapeados e permite remover (corrigir escolha errada)

### Como funciona o matching agora

1. Primeiro episódio de um título novo → abre a busca do MDL numa aba visível,
   você clica no resultado certo, a extensão detecta a navegação e salva o
   mapeamento.
2. Próximos episódios do mesmo título → vai direto, sem busca, aba oculta.
3. Errou o título? Abra o popup da extensão, ache a entrada em "Títulos
   mapeados" e clique "remover" — a próxima sincronização pede pra escolher de novo.

## Sites suportados atualmente

- clubdodorama.com
- viki.com
- wetv.vip
- kisskh.co
- iq.com (iQIYI)
- 123flmsfree.com, ver.123pelicula.com, flixlat.com, play.cuevana19.com
  (todos usam o mesmo parser, `content/detail-drama-template.js`, por
  compartilharem a mesma estrutura de URL)

## Como adicionar um novo site de streaming

Cada site precisa de 2 coisas:

1. Um arquivo em `content/<nome-do-site>.js` com um objeto `SITE_PARSER`
   implementando `getSeasonEpisode()` (retornando `{ season, episode, slug }`)
   e `getTitle()` — use `content/viki.js` ou `content/clubdodorama.js` como
   modelo. No final do arquivo, chame `window.MDLSyncCommon.init(SITE_PARSER)`.
2. Uma entrada em `content_scripts` no `manifest.json` apontando pro domínio,
   **sempre carregando `content/common.js` antes** do arquivo do site:

```json
{
  "matches": ["https://outrosite.com/algum/padrao/*"],
  "js": ["content/common.js", "content/outrosite.js"],
  "run_at": "document_idle"
}
```

E adicione o domínio em `host_permissions` também.

Nada mais precisa mudar — o badge, o envio pro background, o cache de
mapeamento e a lógica de sync no MDL são todos compartilhados via `common.js`
e `background.js`.
