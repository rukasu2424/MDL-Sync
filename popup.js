function renderLastDetected(lastDetected) {
  const el = document.getElementById("lastDetected");
  if (!lastDetected) return;
  el.className = "item";
  el.textContent = `${lastDetected.title} — T${lastDetected.season}E${lastDetected.episode} (${lastDetected.site})`;
}

function renderMappings(mdlMap) {
  const container = document.getElementById("mappings");
  const entries = Object.entries(mdlMap || {});

  if (entries.length === 0) {
    container.className = "empty";
    container.textContent = "Nenhum título mapeado ainda.";
    return;
  }

  container.className = "";
  container.innerHTML = "";

  for (const [key, url] of entries) {
    const row = document.createElement("div");
    row.className = "map-row";

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = key;
    link.title = url;
    row.appendChild(link);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "remover";
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
