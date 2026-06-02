(function () {
  let map;
  let layers = [];
  let markerByPlaceId = new Map();

  const categoryIcons = {
    attraction: "&#10022;",
    cafe: "&#9749;",
    food: "&#127836;",
    heritage: "&#127963;",
    local_market: "&#129530;",
    museum: "&#127994;",
    nature: "&#127807;",
    night_market: "&#127769;",
    park: "&#127795;",
    shopping: "&#128717;",
    street: "&#127912;",
    temple: "&#9961;",
    transport: "&#128649;"
  };

  const categoryColors = {
    attraction: "#e07a5f",
    cafe: "#9b6a3c",
    food: "#d96735",
    heritage: "#315f72",
    local_market: "#7a8f3a",
    museum: "#6a5d9e",
    nature: "#3f8f69",
    night_market: "#6b5fb5",
    park: "#4f8a4b",
    shopping: "#c06a92",
    street: "#d89331",
    temple: "#b64b43",
    transport: "#2f6f8f"
  };

  function initMap(containerId, onProblem) {
    try {
      if (!window.L) throw new Error("Leaflet unavailable");
      map = L.map(containerId, {
        scrollWheelZoom: true,
        zoomSnap: 0.25,
        zoomDelta: 0.5
      }).setView([4.597, 101.075], 15);
      const primaryTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
      });
      const fallbackTiles = L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
      });
      primaryTiles.on("tileerror", () => {
        if (!map.hasLayer(fallbackTiles)) {
          map.removeLayer(primaryTiles);
          fallbackTiles.addTo(map);
        }
      });
      primaryTiles.addTo(map);
      return map;
    } catch (error) {
      if (onProblem) onProblem(error);
      return null;
    }
  }

  function render(selected, mapPlaces, busStops, onSelectPlace, recommendations) {
    if (!map || !selected) return;
    clear();

    const bounds = [];
    const recommendedIds = new Set((recommendations || []).map((item) => item.place.id));
    (mapPlaces || [])
      .filter((place) => place.id !== selected.id)
      .forEach((place) => {
        const isRecommended = recommendedIds.has(place.id);
        addPlaceNode(place, {
          role: isRecommended ? "recommended" : "nearby",
          label: isRecommended ? "Recommended nearby" : "Map place",
          icon: iconForCategory(place.category),
          size: isRecommended ? 34 : 28,
          color: colorForCategory(place.category),
          category: place.category,
          onSelect: onSelectPlace
        }, bounds);
      });

    (busStops || []).forEach(({ stop, distanceKm }) => {
      addBusNode(stop, distanceKm, bounds);
    });

    addPlaceNode(selected, {
      role: "selected",
      label: "Selected place",
      icon: "&#8982;",
      size: 38,
      color: "#1f2a37",
      category: selected.category,
      onSelect: onSelectPlace
    }, bounds);

    // Keep the traveller's current zoom and map position when switching places.
  }

  function addPlaceNode(place, options, bounds) {
    if (!hasCoordinates(place)) return;
    const marker = L.marker([place.lat, place.lng], {
      icon: mapIcon(options),
      title: place.name_en
    }).addTo(map);

    marker.bindPopup(`
      <strong>${escapeHtml(place.name_en)}</strong><br>
      ${escapeHtml(place.name_zh || "")}<br>
      <small>${escapeHtml(options.label)} / ${escapeHtml(place.category || "")}</small><br>
      <small>Click icon to switch route focus</small>
    `);

    marker.on("click", () => {
      if (options.onSelect) options.onSelect(place.id, { focusMap: true });
    });

    layers.push(marker);
    markerByPlaceId.set(place.id, marker);
    bounds.push([place.lat, place.lng]);
  }

  function addBusNode(stop, distanceKm, bounds) {
    if (!hasCoordinates(stop)) return;
    const marker = L.marker([stop.lat, stop.lng], {
      icon: mapIcon({
        role: "bus",
        label: "Bus",
        icon: "&#128652;",
        size: 30,
        color: "#256d85",
        category: "bus"
      }),
      title: stop.name_en
    }).addTo(map);

    marker.bindPopup(`
      <strong>${escapeHtml(stop.name_en)}</strong><br>
      ${escapeHtml(stop.name_zh || "")}<br>
      <small>${formatDistance(distanceKm)} / ${escapeHtml(stop.verification_status || "")}</small>
    `);

    layers.push(marker);
    bounds.push([stop.lat, stop.lng]);
  }

  function mapIcon({ role, size, color, icon, category }) {
    const html = `
      <span class="map-icon map-icon-${escapeHtml(role)} map-icon-${escapeHtml(category || "place")}" style="--icon-size:${size}px;--icon-color:${escapeHtml(color)}">
        <span>${icon || "&#10022;"}</span>
      </span>
    `;
    return L.divIcon({
      className: "map-icon-shell",
      html,
      iconSize: [size + 8, size + 8],
      iconAnchor: [(size + 8) / 2, (size + 8) / 2]
    });
  }

  function iconForCategory(category) {
    return categoryIcons[category] || "&#10022;";
  }

  function colorForCategory(category) {
    return categoryColors[category] || "#e36f3d";
  }

  function clear() {
    layers.forEach((layer) => layer.remove());
    layers = [];
    markerByPlaceId = new Map();
  }

  function focusPlace(placeId) {
    if (!map || !markerByPlaceId.has(placeId)) return;
    const marker = markerByPlaceId.get(placeId);
    map.panTo(marker.getLatLng(), { animate: true });
    marker.openPopup();
  }

  function hasCoordinates(item) {
    return Number.isFinite(item.lat) && Number.isFinite(item.lng);
  }

  function formatDistance(km) {
    if (km >= 998) return "-";
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  window.IpohMap = { initMap, render, focusPlace };
})();
