// ============================================================
// PARSER: clubdodorama.com
// ============================================================
// Cada site novo precisa de UM objeto assim, com essas 2 funções.
// ============================================================

const SITE_PARSER = {
  siteName: "clubdodorama",

  // Extrai temporada, episódio e um "slug" estável (sem o -SxE) pra usar
  // como chave de cache do mapeamento com o MDL.
  // Ex: https://clubdodorama.com/episodios/awaken-1x10/
  //     -> { season: 1, episode: 10, slug: "awaken" }
  getSeasonEpisode() {
    const path = window.location.pathname.replace(/\/$/, "");
    const match = path.match(/-(\d+)x(\d+)$/);
    if (!match) return null;
    const slug = path.split("/").pop().replace(/-\d+x\d+$/, "");
    return { season: parseInt(match[1], 10), episode: parseInt(match[2], 10), slug };
  },

  // Extrai o nome "bonito" do título a partir do <title> da aba.
  // Ex: "Awaken: 1×10 - clubdodorama" -> "Awaken"
  getTitle() {
    const raw = document.title;
    const beforeColon = raw.split(":")[0].trim();
    return beforeColon || null;
  }
};

window.MDLSyncCommon.init(SITE_PARSER);
