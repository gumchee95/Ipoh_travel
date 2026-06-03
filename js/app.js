(function () {
  const state = {
    data: null,
    selectedId: "",
    filters: {
      search: "",
      area: "all",
      time: "all",
      category: "all",
      price: "all"
    }
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    IpohI18n.applyTranslations();
    els.languageToggle.addEventListener("click", () => {
      IpohI18n.toggleLanguage();
      render();
    });
    bindFilters();
    IpohMap.initMap("map", () => showMapProblem());

    state.data = await IpohCsvLoader.loadData();
    if (!state.data.places.length) {
      els.dataStatus.textContent = IpohI18n.t("dataProblem");
      renderEmpty();
      return;
    }
    state.selectedId = state.data.places[0].id;
    els.dataStatus.textContent = `${IpohI18n.t("dataLocal")} · ${state.data.places.length} places`;
    fillFilters();
    render();
  }

  function cacheElements() {
    [
      "languageToggle",
      "searchInput",
      "areaFilter",
      "timeFilter",
      "categoryFilter",
      "priceFilter",
      "placeList",
      "resultCount",
      "selectedCard",
      "routeGraph",
      "busStops",
      "routeSummary",
      "dataStatus",
      "mapStatus"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function bindFilters() {
    els.searchInput.addEventListener("input", () => {
      state.filters.search = els.searchInput.value.trim().toLowerCase();
      render();
    });
    ["areaFilter", "timeFilter", "categoryFilter", "priceFilter"].forEach((id) => {
      els[id].addEventListener("change", () => {
        const key = id.replace("Filter", "");
        state.filters[key] = els[id].value;
        render();
      });
    });
  }

  function fillFilters() {
    fillSelect(els.areaFilter, "all", IpohI18n.t("allAreas"), unique(state.data.places.map((place) => place.area)));
    fillSelect(els.categoryFilter, "all", IpohI18n.t("allTypes"), unique(state.data.places.map((place) => place.category)));
  }

  function fillSelect(select, allValue, allLabel, values) {
    select.innerHTML = "";
    select.append(option(allValue, allLabel));
    values.forEach((value) => select.append(option(value, labelize(value))));
  }

  function option(value, label) {
    const node = document.createElement("option");
    node.value = value;
    node.textContent = label;
    return node;
  }

  function render() {
    if (!state.data) return;
    const places = filteredPlaces();
    if (!state.data.places.some((place) => place.id === state.selectedId)) {
      state.selectedId = state.data.places[0].id;
    }
    const selected = state.data.places.find((place) => place.id === state.selectedId);
    const recommendations = IpohRecommend.buildRecommendations(selected, state.data.places, state.data.manualRoutes, state.filters);
    const stops = IpohRecommend.nearestBusStops(selected, state.data.busStops);
    const mapPlaces = places.filter(isMapPlace);

    els.resultCount.textContent = places.length;
    renderPlaces(places);
    renderRouteSummary(selected, recommendations, stops, mapPlaces);
    renderSelected(selected);
    renderGraph(selected, recommendations);
    renderBusStops(stops);
    IpohMap.render(selected, mapPlaces, stops, selectPlace, recommendations);
  }

  function selectPlace(placeId, options = {}) {
    if (!state.data.places.some((place) => place.id === placeId)) return;
    state.selectedId = placeId;
    render();
    if (options.focusMap) IpohMap.focusPlace(placeId);
  }

  function renderEmpty() {
    els.placeList.innerHTML = `<p class="empty">${IpohI18n.t("dataProblem")}</p>`;
    els.selectedCard.innerHTML = "";
    els.routeGraph.innerHTML = "";
    els.busStops.innerHTML = "";
  }

  function filteredPlaces() {
    return state.data.places.filter((place) => {
      const text = `${place.name_en} ${place.name_zh} ${place.area} ${(place.tags || []).join(" ")}`.toLowerCase();
      return (!state.filters.search || text.includes(state.filters.search))
        && (state.filters.area === "all" || place.area === state.filters.area)
        && (state.filters.time === "all" || (place.best_time || []).includes(state.filters.time))
        && (state.filters.category === "all" || place.category === state.filters.category)
        && (state.filters.price === "all" || place.price_level === state.filters.price);
    });
  }

  function isMapPlace(place) {
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) return false;
    if (place.status !== "active") return false;
    if (place.category === "transport") return false;
    const subcategory = String(place.subcategory || "");
    const sourceNote = String(place.source_note || "").toLowerCase();
    if (subcategory.includes("cluster") || subcategory === "snack_row") return false;
    if (sourceNote.includes("placeholder")) return false;
    return true;
  }

  function renderPlaces(places) {
    if (!places.length) {
      els.placeList.innerHTML = `<p class="empty">${IpohI18n.t("noResults")}</p>`;
      return;
    }
    els.placeList.innerHTML = places.map((place) => `
      <button class="place-card ${place.id === state.selectedId ? "is-active" : ""}" type="button" data-id="${escapeAttr(place.id)}">
        <span class="place-category">${labelize(place.category)}</span>
        <strong>${displayName(place)}</strong>
        <small>${escapeHtml(place.area)} · ${escapeHtml(place.price_level || "$")} · ${escapeHtml((place.best_time || []).join(", "))}</small>
      </button>
    `).join("");
    els.placeList.querySelectorAll("[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selectPlace(button.dataset.id, { focusMap: true });
      });
    });
  }

  function renderSelected(place) {
    if (!place) return;
    els.selectedCard.innerHTML = `
      <span class="route-chip">${IpohI18n.t("selected")}</span>
      <h3>${displayName(place)}</h3>
      <p>${localized(place, "description")}</p>
      <dl class="meta-grid">
        <div><dt>${IpohI18n.t("duration")}</dt><dd>${escapeHtml(place.recommended_duration_min || "-")} min</dd></div>
        <div><dt>${IpohI18n.t("bestTime")}</dt><dd>${escapeHtml((place.best_time || []).join(", "))}</dd></div>
        <div><dt>${IpohI18n.t("verification")}</dt><dd>${escapeHtml(place.verification_status || "-")}</dd></div>
      </dl>
      <a class="text-link" href="${escapeAttr(place.map_url)}" target="_blank" rel="noopener">${IpohI18n.t("viewMap")}</a>
    `;
  }

  function renderRouteSummary(selected, recommendations, stops, mapPlaces) {
    if (!selected) {
      els.routeSummary.innerHTML = "";
      return;
    }
    const visiblePlaceCount = new Set([selected.id, ...(mapPlaces || []).map((place) => place.id)]).size;
    els.routeSummary.innerHTML = `
      <div>
        <span class="summary-label">${IpohI18n.t("currentFocus")}</span>
        <strong>${displayName(selected)}</strong>
      </div>
      <div class="summary-metrics">
        <span><b>${recommendations.length}</b> ${IpohI18n.t("nextStops")}</span>
        <span><b>${stops.length}</b> ${IpohI18n.t("busRefs")}</span>
        <span><b>${visiblePlaceCount}</b> ${IpohI18n.t("mapPlaces")}</span>
      </div>
      <p>${IpohI18n.t("sortedDistance")} ${IpohI18n.t("clickSwitch")}</p>
    `;
  }

  function renderGraph(selected, recommendations) {
    if (!selected || !recommendations.length) {
      els.routeGraph.innerHTML = `<p class="empty">${IpohI18n.t("noRoutes")}</p>`;
      return;
    }
    els.routeGraph.innerHTML = `
      <div class="graph-origin">
        <span class="node-dot origin-dot"></span>
        <strong>${displayName(selected)}</strong>
      </div>
      <p class="graph-help">${IpohI18n.t("nearbyHelp")}</p>
      <div class="graph-links">
        ${recommendations.map((item, index) => graphItem(item, index)).join("")}
      </div>
    `;
    els.routeGraph.querySelectorAll("[data-route-target]").forEach((button) => {
      button.addEventListener("click", () => {
        selectPlace(button.dataset.routeTarget, { focusMap: true });
      });
    });
  }

  function graphItem(item, index) {
    const place = item.place;
    const reason = IpohI18n.getLanguage() === "zh" ? item.reasonZh : item.reason;
    return `
      <article class="graph-node" style="--i:${index}">
        <button type="button" data-route-target="${escapeAttr(place.id)}">
          <span class="node-dot"></span>
          <span>
            <strong>${displayName(place)}</strong>
            <small>${labelize(place.category)} · ${escapeHtml(place.area)}</small>
          </span>
        </button>
        <p><strong>${IpohI18n.t("whyNext")}:</strong> ${escapeHtml(reason)}</p>
        <div class="node-meta">
          <span>${IpohI18n.t("distance")}: ${formatDistance(item.distanceKm)}</span>
          <span>${IpohI18n.t("transport")}: ${escapeHtml(item.transportMode)}</span>
          <span>${IpohI18n.t("bestTime")}: ${escapeHtml((place.best_time || []).join(", "))}</span>
        </div>
      </article>
    `;
  }

  function renderBusStops(stops) {
    if (!stops.length) {
      els.busStops.innerHTML = `<p class="empty">${IpohI18n.t("noRoutes")}</p>`;
      return;
    }
    els.busStops.innerHTML = stops.map(({ stop, distanceKm }) => `
      <article class="bus-stop">
        <strong>${localizedStop(stop)}</strong>
        <span>${IpohI18n.t("nearestStop")}: ${formatDistance(distanceKm)}</span>
        <small>${escapeHtml(stop.verification_status)} · ${escapeHtml((stop.routes || []).join(", "))}</small>
      </article>
    `).join("");
  }

  function showMapProblem() {
    els.mapStatus.hidden = false;
    els.mapStatus.textContent = IpohI18n.t("mapProblem");
  }

  function displayName(place) {
    return IpohI18n.getLanguage() === "zh" && place.name_zh
      ? `${escapeHtml(place.name_zh)} / ${escapeHtml(place.name_en)}`
      : `${escapeHtml(place.name_en)} / ${escapeHtml(place.name_zh || "")}`;
  }

  function localized(place, field) {
    const key = IpohI18n.getLanguage() === "zh" ? `${field}_zh` : `${field}_en`;
    return escapeHtml(place[key] || place[`${field}_en`] || "");
  }

  function localizedStop(stop) {
    return IpohI18n.getLanguage() === "zh" && stop.name_zh
      ? `${escapeHtml(stop.name_zh)} / ${escapeHtml(stop.name_en)}`
      : `${escapeHtml(stop.name_en)} / ${escapeHtml(stop.name_zh || "")}`;
  }

  function formatDistance(km) {
    if (km >= 998) return "-";
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function labelize(value) {
    return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
