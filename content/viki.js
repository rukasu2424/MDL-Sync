// ============================================================
// PARSER: viki.com
// ============================================================

const SITE_PARSER = {
  siteName: "viki",

  // Viki não usa temporada na URL, então assumimos sempre 1.
  // Ex: https://www.viki.com/videos/1185199v-serendipity-episode-1
  //     -> { season: 1, episode: 1, slug: "serendipity" }
  getSeasonEpisode() {
    const path = window.location.pathname.replace(/\/$/, "");
    const match = path.match(/^\/videos\/(\d+v)-(.+)-episode-(\d+)$/);
    if (!match) return null;
    const [, , slugRaw, episode] = match;
    return { season: 1, episode: parseInt(episode, 10), slug: slugRaw };
  },

  // Extrai o nome do drama a partir do <title> da aba.
  // Ex: "Serendipity - Episode 1 | Rakuten Viki" -> "Serendipity"
  getTitle() {
    const raw = document.title;
    const beforeDash = raw.split(" - Episode")[0].trim();
    return beforeDash || null;
  }
};

window.MDLSyncCommon.init(SITE_PARSER);
