(function () {
  const state = {
    places: [],
    routes: [],
    activePlaceId: "",
    filters: {
      query: "",
      area: "all",
      time: "all",
      cost: "all",
      type: "all"
    }
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    bindEvents();
    const data = await loadGuideData();
    state.places = data.places;
    state.routes = data.routes;
    state.activePlaceId = state.places[0]?.id || "";
    populateFilters();
    renderPresetRoutes();
    renderActiveFilters();
    renderPlaces();
    renderGraph();
  }

  function cacheElements() {
    els.searchInput = document.querySelector("#searchInput");
    els.areaFilter = document.querySelector("#areaFilter");
    els.timeFilter = document.querySelector("#timeFilter");
    els.costFilter = document.querySelector("#costFilter");
    els.typeFilter = document.querySelector("#typeFilter");
    els.resetFilters = document.querySelector("#resetFilters");
    els.placesGrid = document.querySelector("#placesGrid");
    els.placesListPanel = document.querySelector("#placesListPanel");
    els.presetRoutes = document.querySelector("#presetRoutes");
    els.resultCount = document.querySelector("#resultCount");
    els.emptyState = document.querySelector("#emptyState");
    els.activePlaceTitle = document.querySelector("#activePlaceTitle");
    els.activePlaceDesc = document.querySelector("#activePlaceDesc");
    els.activeMeta = document.querySelector("#activeMeta");
    els.routePanel = document.querySelector("#graph");
    els.nodeGraph = document.querySelector("#nodeGraph");
    els.heroActiveName = document.querySelector("#heroActiveName");
    els.dataStatus = document.querySelector("#dataStatus");
    els.activeFilters = document.querySelector("#activeFilters");
    els.activeMapLink = document.querySelector("#activeMapLink");
    els.backToList = document.querySelector("#backToList");
    els.routeModal = document.querySelector("#routeModal");
    els.modalTitle = document.querySelector("#modalTitle");
    els.modalSummary = document.querySelector("#modalSummary");
    els.modalTags = document.querySelector("#modalTags");
    els.modalStops = document.querySelector("#modalStops");
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", (event) => {
      state.filters.query = event.target.value.trim().toLowerCase();
      renderPlaces();
      renderActiveFilters();
    });

    [
      [els.areaFilter, "area"],
      [els.timeFilter, "time"],
      [els.costFilter, "cost"],
      [els.typeFilter, "type"]
    ].forEach(([select, key]) => {
      select.addEventListener("change", (event) => {
        state.filters[key] = event.target.value;
        renderPlaces();
        renderActiveFilters();
      });
    });

    els.resetFilters.addEventListener("click", () => {
      state.filters = { query: "", area: "all", time: "all", cost: "all", type: "all" };
      els.searchInput.value = "";
      els.areaFilter.value = "all";
      els.timeFilter.value = "all";
      els.costFilter.value = "all";
      els.typeFilter.value = "all";
      renderPlaces();
      renderActiveFilters();
    });

    els.backToList.addEventListener("click", showListMode);

    document.querySelectorAll("[data-close-modal]").forEach((node) => {
      node.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  async function loadGuideData() {
    const localData = {
      places: normalizePlaces(window.placesDb || []),
      routes: normalizeRoutes(window.routesConfig || [])
    };
    const config = window.dataSourceConfig || {};
    const urls = config.googleSheetCsvUrls || {};
    const hasSheetUrls = Boolean(urls.places && urls.connections && urls.routes);
    const hasSingleUrl = Boolean(config.googleSheetCsvUrl);

    if (!hasSheetUrls && !hasSingleUrl) {
      setDataStatus("Using local guide data", "local");
      return localData;
    }

    try {
      const sheetData = hasSheetUrls
        ? await loadMultiSheetCsv(urls)
        : await loadSingleSheetJson(config.googleSheetCsvUrl);
      setDataStatus("Using published Google Sheet data", "sheet");
      return sheetData;
    } catch (error) {
      console.warn("Sheet loading failed. Falling back to local guide data.", error);
      if (config.fallbackToLocal !== false) {
        setDataStatus("Sheet unavailable, using local fallback", "fallback");
        return localData;
      }
      setDataStatus("Sheet unavailable", "fallback");
      return { places: [], routes: [] };
    }
  }

  async function loadMultiSheetCsv(urls) {
    const [placesCsv, connectionsCsv, routesCsv] = await Promise.all([
      fetchCsv(urls.places),
      fetchCsv(urls.connections),
      fetchCsv(urls.routes)
    ]);
    return buildDataFromCsvRows(placesCsv, connectionsCsv, routesCsv);
  }

  async function loadSingleSheetJson(url) {
    const rows = await fetchCsv(url);
    const places = normalizePlaces(rows.map(rowToPlace));
    return { places, routes: normalizeRoutes(window.routesConfig || []) };
  }

  async function fetchCsv(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`CSV request failed: ${response.status}`);
    }
    return parseCsv(await response.text());
  }

  function buildDataFromCsvRows(placeRows, connectionRows, routeRows) {
    const connectionMap = connectionRows.reduce((map, row) => {
      if (!row.fromId || !row.id) return map;
      if (!map[row.fromId]) map[row.fromId] = [];
      map[row.fromId].push({
        id: row.id,
        relation: row.relation || "Nearby route",
        reason: row.reason || "Recommended nearby stop.",
        distanceNote: row.distanceNote || "Distance varies.",
        transportMode: row.transportMode || "Walk, drive, or e-hailing"
      });
      return map;
    }, {});

    const places = placeRows.map((row) => ({
      ...rowToPlace(row),
      connections: connectionMap[row.id] || []
    }));

    const routes = routeRows.map((row) => ({
      id: row.id,
      title: row.title,
      titleZh: row.titleZh,
      summary: row.summary,
      placeIds: splitList(row.placeIds),
      bestFor: row.bestFor,
      costType: row.costType,
      timeSlot: row.timeSlot
    }));

    return {
      places: normalizePlaces(places),
      routes: normalizeRoutes(routes)
    };
  }

  function rowToPlace(row) {
    return {
      id: row.id,
      type: row.type,
      area: row.area,
      category: row.category,
      tags: splitList(row.tags),
      timeSlots: splitList(row.timeSlots),
      primaryTimeSlot: row.primaryTimeSlot,
      name: row.name,
      nameEn: row.nameEn,
      duration: row.duration,
      desc: row.desc,
      mapUrl: row.mapUrl,
      imgEmoji: row.imgEmoji,
      costType: row.costType,
      costLabel: row.costLabel,
      estimatedCost: row.estimatedCost,
      parking: row.parking,
      weatherNote: row.weatherNote,
      walkability: row.walkability,
      lastVerified: row.lastVerified,
      connections: []
    };
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);

    const headers = rows.shift()?.map((header) => header.trim()) || [];
    return rows.map((values) =>
      headers.reduce((record, header, index) => {
        record[header] = (values[index] || "").trim();
        return record;
      }, {})
    );
  }

  function splitList(value) {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split(/[|,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function normalizePlaces(places) {
    return places
      .filter((place) => place && place.id)
      .map((place) => ({
        ...place,
        tags: splitList(place.tags),
        timeSlots: splitList(place.timeSlots),
        connections: Array.isArray(place.connections) ? place.connections : []
      }));
  }

  function normalizeRoutes(routes) {
    return routes
      .filter((route) => route && route.id)
      .map((route) => ({
        ...route,
        placeIds: splitList(route.placeIds)
      }));
  }

  function populateFilters() {
    fillSelect(els.areaFilter, unique(state.places.map((place) => place.area)));
    fillSelect(els.timeFilter, unique(state.places.flatMap((place) => place.timeSlots)));
    fillSelect(els.costFilter, unique(state.places.map((place) => place.costType)));
    fillSelect(els.typeFilter, unique(state.places.map((place) => place.type)));
  }

  function fillSelect(select, values) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = titleCase(value);
      select.appendChild(option);
    });
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))].sort();
  }

  function renderPresetRoutes() {
    els.presetRoutes.innerHTML = "";
    state.routes.forEach((route) => {
      const button = document.createElement("button");
      button.className = "preset-card";
      button.type = "button";
      button.innerHTML = `
        <p class="eyebrow">${escapeHtml(route.titleZh || "Route")}</p>
        <h3>${escapeHtml(route.title)}</h3>
        <p>${escapeHtml(route.summary)}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(route.bestFor || "Flexible")}</span>
          <span class="tag">${escapeHtml(titleCase(route.costType || "mixed"))}</span>
          <span class="tag">${escapeHtml(titleCase(route.timeSlot || "anytime"))}</span>
        </div>
      `;
      button.addEventListener("click", () => openRouteModal(route.id));
      els.presetRoutes.appendChild(button);
    });
  }

  function renderPlaces() {
    const filtered = getFilteredPlaces();
    if (filtered.length && !filtered.some((place) => place.id === state.activePlaceId)) {
      state.activePlaceId = filtered[0].id;
    }
    els.placesGrid.innerHTML = "";
    els.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "place" : "places"}`;
    els.emptyState.hidden = filtered.length > 0;

    filtered.forEach((place) => {
      const card = document.createElement("article");
      card.className = `place-card ${place.id === state.activePlaceId ? "active" : ""}`;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Show route graph for ${place.name}`);
      card.innerHTML = `
        <div class="place-card-top">
          <div class="emoji-tile" aria-hidden="true">${escapeHtml(place.imgEmoji)}</div>
          <div class="place-name">
            <h3>${escapeHtml(place.name)}</h3>
            <small>${escapeHtml(place.nameEn)} Â· ${escapeHtml(place.area)}</small>
          </div>
        </div>
        <p>${escapeHtml(place.desc)}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(titleCase(place.type))}</span>
          <span class="tag">${escapeHtml(place.duration)}</span>
          <span class="tag">${escapeHtml(place.costLabel)}</span>
        </div>
      `;
      card.addEventListener("click", () => selectPlace(place.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPlace(place.id);
        }
      });
      els.placesGrid.appendChild(card);
    });
  }

  function renderActiveFilters() {
    const list = [];
    if (state.filters.query) list.push(`Search: ${state.filters.query}`);
    if (state.filters.area !== "all") list.push(`Area: ${titleCase(state.filters.area)}`);
    if (state.filters.time !== "all") list.push(`Time: ${titleCase(state.filters.time)}`);
    if (state.filters.cost !== "all") list.push(`Cost: ${titleCase(state.filters.cost)}`);
    if (state.filters.type !== "all") list.push(`Type: ${titleCase(state.filters.type)}`);

    els.activeFilters.innerHTML = list.length
      ? list.map((item) => `<span class="filter-pill">${escapeHtml(item)}</span>`).join("")
      : '<span class="filter-pill">No active filters</span>';
  }

  function getFilteredPlaces() {
    return state.places.filter((place) => {
      const queryText = [
        place.name,
        place.nameEn,
        place.area,
        place.category,
        place.type,
        place.desc,
        ...place.tags
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !state.filters.query || queryText.includes(state.filters.query);
      const matchesArea = state.filters.area === "all" || place.area === state.filters.area;
      const matchesTime = state.filters.time === "all" || place.timeSlots.includes(state.filters.time);
      const matchesCost = state.filters.cost === "all" || place.costType === state.filters.cost;
      const matchesType = state.filters.type === "all" || place.type === state.filters.type;

      return matchesQuery && matchesArea && matchesTime && matchesCost && matchesType;
    });
  }

  function selectPlace(id) {
    state.activePlaceId = id;
    renderPlaces();
    renderGraph();
    showRouteMode();
  }

  function showRouteMode() {
    els.placesListPanel.hidden = true;
    els.routePanel.hidden = false;
    document.querySelector("#graph").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showListMode() {
    els.routePanel.hidden = true;
    els.placesListPanel.hidden = false;
    document.querySelector("#places").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderGraph() {
    const active = findPlace(state.activePlaceId);
    if (!active) {
      els.activePlaceTitle.textContent = "No active place";
      els.activePlaceDesc.textContent = "Select a place card to view connected recommendations.";
      els.activeMeta.innerHTML = "";
      els.nodeGraph.innerHTML = '<p class="muted">No route nodes to show.</p>';
      if (els.activeMapLink) els.activeMapLink.setAttribute("href", "#");
      return;
    }

    els.heroActiveName.textContent = active.name;
    els.activePlaceTitle.textContent = active.name;
    els.activePlaceDesc.textContent = active.desc;
    if (els.activeMapLink) els.activeMapLink.setAttribute("href", active.mapUrl || "#");
    els.activeMeta.innerHTML = `
      <span class="meta-pill">${escapeHtml(active.area)}</span>
      <span class="meta-pill">${escapeHtml(titleCase(active.primaryTimeSlot))}</span>
      <span class="meta-pill">${escapeHtml(active.costLabel)}</span>
      <span class="meta-pill">${escapeHtml(active.duration)}</span>
    `;

    const connections = active.connections
      .map((connection) => ({
        ...connection,
        place: findPlace(connection.id)
      }))
      .filter((connection) => connection.place);

    els.nodeGraph.innerHTML = connections.length
      ? renderRouteMap(active, connections)
      : '<p class="muted">No connected route nodes yet.</p>';

    bindGraphEvents();
  }

  function renderRouteMap(active, connections) {
    const nodes = connections.map((connection, index) => ({
      ...connection,
      step: index + 1,
      position: getNodePosition(index, connections.length)
    }));

    const lines = nodes
      .map(
        (node) => `
          <line
            class="graph-line"
            x1="50"
            y1="50"
            x2="${node.position.x}"
            y2="${node.position.y}"
          />
        `
      )
      .join("");

    const nodeButtons = nodes
      .map(
        (node) => `
          <button
            class="graph-node ${node.step === 1 ? "active" : ""}"
            type="button"
            style="--x:${node.position.x}%; --y:${node.position.y}%;"
            data-graph-node="${node.step}"
            aria-label="View route to ${escapeAttribute(node.place.name)}"
          >
            <span>${escapeHtml(node.place.imgEmoji)}</span>
            <strong>${escapeHtml(node.place.name)}</strong>
            <small>${escapeHtml(node.distanceNote)}</small>
          </button>
        `
      )
      .join("");

    return `
      <div class="route-map-shell">
        <div class="route-map" aria-label="Connected Ipoh route graph">
          <svg class="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            ${lines}
          </svg>
          <div class="graph-start">
            <span>${escapeHtml(active.imgEmoji)}</span>
            <strong>${escapeHtml(active.name)}</strong>
            <small>Start point</small>
          </div>
          ${nodeButtons}
        </div>
        <aside class="route-detail-panel" id="routeDetailPanel">
          ${renderConnectionDetail(nodes[0])}
        </aside>
      </div>
    `;
  }

  function getNodePosition(index, total) {
    const angle = -90 + (360 / total) * index;
    const radians = (angle * Math.PI) / 180;
    const x = 50 + Math.cos(radians) * 36;
    const y = 50 + Math.sin(radians) * 34;
    return {
      x: Math.max(12, Math.min(88, Math.round(x))),
      y: Math.max(14, Math.min(86, Math.round(y)))
    };
  }

  function bindGraphEvents() {
    const buttons = els.nodeGraph.querySelectorAll("[data-graph-node]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
        updateGraphDetail(Number(button.dataset.graphNode));
      });
    });

    bindRouteNextButtons();
  }

  function bindRouteNextButtons() {
    els.nodeGraph.querySelectorAll("[data-route-next]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activePlaceId = button.dataset.routeNext;
        renderPlaces();
        renderGraph();
      });
    });
  }

  function updateGraphDetail(step) {
    const active = findPlace(state.activePlaceId);
    if (!active) return;
    const connection = active.connections
      .map((item, index) => ({
        ...item,
        step: index + 1,
        place: findPlace(item.id)
      }))
      .find((item) => item.step === step && item.place);
    const panel = document.querySelector("#routeDetailPanel");
    if (connection && panel) {
      panel.innerHTML = renderConnectionDetail(connection);
      bindRouteNextButtons();
    }
  }

  function renderConnectionDetail(connection) {
    const place = connection.place;
    return `
      <article class="route-detail-card">
        <div class="connection-head">
          <span aria-hidden="true">${escapeHtml(place.imgEmoji)}</span>
          <div>
            <h3>Next: ${escapeHtml(place.name)}</h3>
            <small>${escapeHtml(connection.relation)}</small>
          </div>
        </div>
        <p>${escapeHtml(connection.reason)}</p>
        <div class="connection-facts">
          <div class="fact"><strong>Distance</strong>${escapeHtml(connection.distanceNote)}</div>
          <div class="fact"><strong>Transport</strong>${escapeHtml(connection.transportMode)}</div>
          <div class="fact"><strong>Cost</strong>${escapeHtml(place.costLabel)} | ${escapeHtml(place.estimatedCost)}</div>
          <div class="fact"><strong>Best time</strong>${escapeHtml(titleCase(place.primaryTimeSlot))} | ${escapeHtml(place.duration)}</div>
        </div>
        <div class="connection-actions">
          <button class="button button-primary" type="button" data-route-next="${escapeAttribute(place.id)}">Use as start</button>
          <a class="map-link" href="${escapeAttribute(place.mapUrl)}" target="_blank" rel="noopener noreferrer">
            Open Google Maps
          </a>
        </div>
      </article>
    `;
  }
  function openRouteModal(routeId) {
    const route = state.routes.find((item) => item.id === routeId);
    if (!route) return;
    const stops = route.placeIds.map(findPlace).filter(Boolean);

    els.modalTitle.textContent = `${route.title} / ${route.titleZh}`;
    els.modalSummary.textContent = route.summary;
    els.modalTags.innerHTML = `
      <span class="tag">${escapeHtml(route.bestFor || "Flexible")}</span>
      <span class="tag">${escapeHtml(titleCase(route.costType || "mixed"))}</span>
      <span class="tag">${escapeHtml(titleCase(route.timeSlot || "anytime"))}</span>
    `;
    els.modalStops.innerHTML = stops
      .map(
        (place, index) => `
          <li>
            <strong>${index + 1}. ${escapeHtml(place.imgEmoji)} ${escapeHtml(place.name)}</strong>
            <span>${escapeHtml(place.area)} Â· ${escapeHtml(place.duration)} Â· ${escapeHtml(place.costLabel)}</span>
            <p>${escapeHtml(place.desc)}</p>
            <button class="button button-primary" type="button" data-modal-start="${escapeAttribute(place.id)}">View route flow</button>
          </li>
        `
      )
      .join("");
    els.modalStops.querySelectorAll("[data-modal-start]").forEach((button) => {
      button.addEventListener("click", () => {
        closeModal();
        selectPlace(button.dataset.modalStart);
      });
    });
    els.routeModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (els.routeModal.hidden) return;
    els.routeModal.hidden = true;
    document.body.style.overflow = "";
  }

  function findPlace(id) {
    return state.places.find((place) => place.id === id);
  }

  function setDataStatus(message, type) {
    els.dataStatus.textContent = message;
    els.dataStatus.dataset.source = type;
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();

