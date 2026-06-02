(function () {
  const walkLimitKm = 0.8;
  const nearbyLimitKm = 3.2;
  const extendedLimitKm = 5;

  function buildRecommendations(selected, places, manualRoutes, filters) {
    if (!selected) return [];

    const candidates = places
      .filter((place) => place.id !== selected.id)
      .filter(isRecommendablePlace)
      .filter((place) => matchesTime(place, filters.time))
      .filter((place) => hasCoordinates(place))
      .map((place) => {
        const distanceKm = distance(selected, place);
        const manual = findManualRoute(selected.id, place.id, manualRoutes);
        return {
          place,
          manual,
          distanceKm,
          transportMode: manual ? manual.transport_mode : inferTransport(distanceKm),
          reason: manual ? manual.reason_en : autoReason(selected, place, distanceKm),
          reasonZh: manual ? manual.reason_zh : autoReasonZh(selected, place, distanceKm)
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const nearby = candidates.filter((item) => item.distanceKm <= nearbyLimitKm);
    const fallback = candidates.filter((item) => item.distanceKm <= extendedLimitKm);
    return nearby.length >= 6 ? nearby : fallback;
  }

  function nearestBusStops(selected, stops) {
    if (!selected) return [];
    return stops
      .filter(hasCoordinates)
      .map((stop) => ({ stop, distanceKm: distance(selected, stop) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  function findManualRoute(fromId, toId, routes) {
    return routes.find((route) => route.from_id === fromId && route.to_id === toId)
      || routes.find((route) => route.from_id === toId && route.to_id === fromId);
  }

  function inferTransport(distanceKm) {
    if (distanceKm <= walkLimitKm) return "walk";
    if (distanceKm <= 2.2) return "short ride / careful walk";
    return "ride-hailing / bus check";
  }

  function autoReason(selected, place, distanceKm) {
    const distanceText = formatDistance(distanceKm);
    if (distanceKm <= walkLimitKm) {
      return `${distanceText} from ${selected.name_en}; this is one of the closest next stops nearby.`;
    }
    if (distanceKm <= 2.2) {
      return `${distanceText} away; close enough for a simple next move without changing area too much.`;
    }
    return `${distanceText} away; still nearby on the map, better with ride-hailing or bus check.`;
  }

  function autoReasonZh(selected, place, distanceKm) {
    const distanceText = formatDistance(distanceKm);
    if (distanceKm <= walkLimitKm) {
      return `距离${selected.name_zh || selected.name_en}约 ${distanceText}，是附近最容易接的下一站之一。`;
    }
    if (distanceKm <= 2.2) {
      return `距离约 ${distanceText}，还在同一片区附近，移动成本不高。`;
    }
    return `距离约 ${distanceText}，地图上仍算附近，但建议电召车或先确认巴士。`;
  }

  function matchesTime(place, time) {
    return !time || time === "all" || (place.best_time || []).includes(time);
  }

  function isRecommendablePlace(place) {
    if (place.category === "transport") return false;
    const subcategory = String(place.subcategory || "");
    const sourceNote = String(place.source_note || "").toLowerCase();
    if (subcategory.includes("cluster") || subcategory === "snack_row") return false;
    if (sourceNote.includes("placeholder")) return false;
    return place.status === "active";
  }

  function overlaps(a, b) {
    const set = new Set(a || []);
    return (b || []).some((item) => set.has(item));
  }

  function hasCoordinates(item) {
    return Number.isFinite(item.lat) && Number.isFinite(item.lng);
  }

  function distance(a, b) {
    if (!hasCoordinates(a) || !hasCoordinates(b)) return 999;
    const earthKm = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const value = Math.sin(dLat / 2) ** 2
      + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return earthKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function formatDistance(km) {
    if (km >= 998) return "-";
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  function toRad(value) {
    return value * Math.PI / 180;
  }

  window.IpohRecommend = { buildRecommendations, nearestBusStops, distance };
})();
