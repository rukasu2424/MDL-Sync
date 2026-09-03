# MDL Sync (experimental) — v0.1.2

**[English](#english) | [Português](#português-brasil)**

---

## English

A browser extension that automatically tracks your episode progress on **MyDramaList** while you watch dramas on supported streaming sites.

⚠️ This is an experimental, early-stage personal project. It's not affiliated with MyDramaList or any streaming site. Expect bugs, and feel free to open an issue if you run into one.

### What it does

- Detects the drama title, season, and episode you're watching automatically.
- Shows a small floating button to sync the current episode to your MDL list with one click.
- After you manually confirm the correct title once, it remembers — from then on, it can sync automatically once you've watched ~80% of the episode, no clicking needed.
- Once an episode is synced, the button stays marked "Already synced ✓" — even after reloading the page or exiting fullscreen — so you always know at a glance whether it's done.
- On the **final episode** of a drama, the title is automatically marked as **Completed** on MDL when synced. An optional rating picker (MDL's own 1.0–10.0 scale) also appears, available at any time, independent of the sync itself.
- Native browser notifications on auto-sync completion — these show up even when the video is in fullscreen (where the on-page badge is hidden).

### Requirements

- You need to be **logged into MyDramaList** — the extension opens a hidden background tab to update your list, using your existing session.
- MyDramaList needs to be set to **English** — the extension looks for specific button/label text, and won't find them in other languages.
- Streaming sites also need to be in English for detection to work reliably.

### Installing (developer mode)

Since this isn't published on the Chrome Web Store, you'll need to load it manually:

1. Download and unzip this repository.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top-right corner).
4. Click **Load unpacked** and select the extracted folder.
5. Open an episode page on a supported site — a small badge should appear in the bottom-right corner with the detected title/episode.

### If the drama's title differs between the streaming site and MDL

This happens sometimes (different romanizations, localized titles, etc.). The first time you sync a new title, a search tab opens automatically — just click into the correct title's MDL page yourself. The extension detects that and remembers the correct match from then on, so you'll only need to do this once per title.

If you ever pick the wrong title by mistake, open the extension's popup, find the entry under "Mapped titles," and click **remove** — the next sync will ask you to choose again.

### Supported sites

- Viki
- WeTV
- iQIYI
- clubdodorama.com
- kisskh.co
- 123flmsfree.com, ver.123pelicula.com, flixlat.com, play.cuevana19.com (same template/parser, since they share the same URL structure)

### Adding support for a new streaming site

Each site needs two things:

1. A file at `content/<site-name>.js` with a `SITE_PARSER` object implementing `getSeasonEpisode()` (returning `{ season, episode, slug }`) and `getTitle()`. Use `content/viki.js` or `content/clubdodorama.js` as a template. At the end of the file, call `window.MDLSyncCommon.init(SITE_PARSER)`.
2. An entry in `content_scripts` in `manifest.json` pointing to the domain, **always loading `content/common.js` before** the site file:

```json
{
  "matches": ["https://newsite.com/some/pattern/*"],
  "js": ["content/common.js", "content/newsite.js"],
  "run_at": "document_idle"
}
```

Also add the domain to `host_permissions`.

Nothing else needs to change — the badge, messaging to the background script, title-mapping cache, and MDL sync logic are all shared via `common.js` and `background.js`.

### Changelog

**v0.1.2**
- Added optional rating system for the final episode of a drama (score 1.0–10.0, MDL's own scale).
- Final episode now automatically marks the title as "Completed" on MDL when synced, independent of whether a rating was given.
- Rating picker now appears immediately after syncing the final episode, no page reload needed.
- Entire UI translated to English (buttons, badge, notifications, popup).
- New extension icon.
- Backward-compatible with mappings saved by earlier versions.

**v0.1.1**
- Added auto-sync: once a title has been manually matched to MDL at least once, the extension automatically syncs progress after you've watched 80% of an episode (no click needed).
- Persistent "Already synced ✓" indicator on the floating button — stays marked across page reloads and after exiting fullscreen, so it's clear at a glance whether an episode was already tracked.
- Native browser notifications on auto-sync completion (visible even in fullscreen, where the on-page badge is hidden).
- Retry logic for messages to the background script, to recover from the browser's service worker going idle (common after the computer sleeps/hibernates).
- Detection retry loop for single-page-app sites (Angular/React/Vue) that render the page title asynchronously.
- URL-change watcher so sites that swap episodes without a full page reload are still detected correctly.

**v0.1.0**
- Initial release.
- Automatic detection of drama title, season, and episode on supported streaming sites.
- One-click sync button to mark episodes as watched on MyDramaList.
- Manual title-matching flow for cases where the drama's name differs between the streaming site and MDL.
- Supported sites: Viki, WeTV, iQIYI, and others.

### Contributing

Bug reports, additional site requests, and general feedback are all welcome. Please include the site name and, if possible, a screenshot of any console errors (`F12` → Console).

---

## Português (Brasil)

Uma extensão de navegador que sincroniza automaticamente seu progresso de episódios no **MyDramaList** enquanto você assiste doramas em sites de streaming suportados.

⚠️ Isso é um projeto pessoal experimental, em estágio inicial. Não tem nenhuma ligação oficial com o MyDramaList nem com nenhum site de streaming. Esperem bugs, e sintam-se à vontade pra abrir uma issue se encontrar algum.

### O que ela faz

- Detecta automaticamente o drama, a temporada e o episódio que você está assistindo.
- Mostra um botãozinho flutuante pra sincronizar o episódio atual com sua lista do MDL com um clique.
- Depois que você confirma manualmente o título certo uma vez, ela lembra — daí em diante consegue sincronizar sozinha depois que você assistir ~80% do episódio, sem precisar clicar em nada.
- Uma vez sincronizado, o botão fica marcado como "Already synced ✓" — mesmo depois de recarregar a página ou sair da tela cheia — então sempre dá pra saber de relance se já foi feito.
- No **último episódio** de um drama, o título é marcado automaticamente como **Completed** no MDL assim que sincroniza. Um seletor de nota opcional (na própria escala do MDL, de 1.0 a 10.0) também aparece, disponível a qualquer momento, independente da sincronização em si.
- Notificações nativas do navegador quando o auto-sync termina — aparecem mesmo com o vídeo em tela cheia (onde o badge da página fica escondido).

### Requisitos

- Você precisa estar **logado no MyDramaList** — a extensão abre uma aba oculta em segundo plano pra atualizar sua lista, usando sua sessão já logada.
- O MyDramaList precisa estar configurado em **inglês** — a extensão procura por textos específicos de botões/rótulos, e não vai achar em outros idiomas.
- Os sites de streaming também precisam estar em inglês pra detecção funcionar de forma confiável.

### Como instalar (modo desenvolvedor)

Como não está publicada na Chrome Web Store, você vai precisar carregar manualmente:

1. Baixe e extraia este repositório.
2. Abra `chrome://extensions` (ou `edge://extensions`).
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta extraída.
5. Abra uma página de episódio num site suportado — deve aparecer um badge no canto inferior direito com o título/episódio detectado.

### Se o nome do drama estiver diferente entre o site de streaming e o MDL

Isso acontece às vezes (romanizações diferentes, títulos localizados, etc.). Na primeira vez que você sincronizar um título novo, uma aba de busca abre automaticamente — é só você mesmo entrar na página certa do título no MDL. A extensão detecta isso e memoriza o mapeamento correto dali em diante, então só precisa fazer isso uma vez por título.

Se escolher o título errado por engano, abre o popup da extensão, acha a entrada em "Mapped titles" e clica em **remove** — a próxima sincronização pede pra escolher de novo.

### Sites suportados

- Viki
- WeTV
- iQIYI
- clubdodorama.com
- kisskh.co
- 123flmsfree.com, ver.123pelicula.com, flixlat.com, play.cuevana19.com (mesmo template/parser, já que compartilham a mesma estrutura de URL)

### Como adicionar suporte a um novo site de streaming

Cada site precisa de 2 coisas:

1. Um arquivo em `content/<nome-do-site>.js` com um objeto `SITE_PARSER` implementando `getSeasonEpisode()` (retornando `{ season, episode, slug }`) e `getTitle()`. Use `content/viki.js` ou `content/clubdodorama.js` como modelo. No final do arquivo, chame `window.MDLSyncCommon.init(SITE_PARSER)`.
2. Uma entrada em `content_scripts` no `manifest.json` apontando pro domínio, **sempre carregando `content/common.js` antes** do arquivo do site:

```json
{
  "matches": ["https://novosite.com/algum/padrao/*"],
  "js": ["content/common.js", "content/novosite.js"],
  "run_at": "document_idle"
}
```

E adicione o domínio em `host_permissions` também.

Nada mais precisa mudar — o badge, o envio de mensagens pro background, o cache de mapeamento de títulos e a lógica de sync no MDL são todos compartilhados via `common.js` e `background.js`.

### Changelog

**v0.1.2**
- Adicionado sistema de nota opcional pro último episódio de um drama (nota de 1.0 a 10.0, escala do próprio MDL).
- O último episódio agora marca o título como "Completed" no MDL automaticamente ao sincronizar, independente de ter recebido uma nota ou não.
- O seletor de nota agora aparece imediatamente depois de sincronizar o último episódio, sem precisar recarregar a página.
- Interface toda traduzida pra inglês (botões, badge, notificações, popup).
- Ícone novo da extensão.
- Compatível com mapeamentos salvos por versões anteriores.

**v0.1.1**
- Adicionado auto-sync: assim que um título já foi casado manualmente com o MDL pelo menos uma vez, a extensão sincroniza o progresso automaticamente depois que você assistir 80% de um episódio (sem precisar clicar).
- Indicador permanente de "Already synced ✓" no botão flutuante — continua marcado entre recarregamentos de página e depois de sair da tela cheia, então sempre fica claro de relance se um episódio já foi rastreado.
- Notificações nativas do navegador quando o auto-sync termina (visíveis mesmo em tela cheia, onde o badge da página fica escondido).
- Lógica de repetição pras mensagens pro background script, pra se recuperar de quando o service worker do navegador fica inativo (comum depois do computador hibernar/dormir).
- Loop de repetição na detecção pra sites de página única (Angular/React/Vue) que renderizam o título da página de forma assíncrona.
- Monitor de mudança de URL, pra sites que trocam de episódio sem recarregar a página inteira continuarem sendo detectados corretamente.

**v0.1.0**
- Lançamento inicial.
- Detecção automática de título do drama, temporada e episódio em sites de streaming suportados.
- Botão de sync com um clique pra marcar episódios como assistidos no MyDramaList.
- Fluxo de matching manual de título pros casos em que o nome do drama diverge entre o site de streaming e o MDL.
- Sites suportados: Viki, WeTV, iQIYI, e outros.

### Contribuindo

Relatos de bugs, pedidos de sites novos e feedback geral são bem-vindos. Por favor inclua o nome do site e, se possível, um print de qualquer erro no console (`F12` → Console).
