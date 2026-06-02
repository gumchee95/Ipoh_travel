(function () {
  const csvFiles = {
    places: "data/csv/places.csv",
    busStops: "data/csv/bus_stops.csv",
    busRoutes: "data/csv/bus_routes.csv",
    routeStopLinks: "data/csv/route_stop_links.csv",
    manualRoutes: "data/csv/manual_routes.csv",
    sponsors: "data/csv/sponsors.csv",
    config: "data/csv/config.csv"
  };

  const jsonFallbackFiles = {
    places: "data/json/places.json",
    busStops: "data/json/bus_stops.json",
    busRoutes: "data/json/bus_routes.json",
    routeStopLinks: "data/json/route_stop_links.json",
    manualRoutes: "data/json/manual_routes.json",
    sponsors: "data/json/sponsors.json",
    config: "data/json/config.json"
  };

  const arrayFields = new Set(["best_time", "tags", "routes", "time_slot", "main_areas"]);
  const numberFields = new Set(["lat", "lng", "recommended_duration_min", "branch_no", "sequence_no", "priority"]);
  const booleanFields = new Set(["is_chain", "is_food", "is_temple", "is_transport_related", "active"]);

  async function loadData() {
    const entries = await Promise.all(
      Object.entries(csvFiles).map(async ([key, url]) => [key, await fetchCsvOrFallback(key, url)])
    );
    return Object.fromEntries(entries);
  }

  async function fetchCsvOrFallback(key, url) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const text = await response.text();
      return parseCsv(text).map(normalizeRow);
    } catch (error) {
      console.warn(`Unable to load CSV ${url}; trying JSON fallback`, error);
      return fetchJson(jsonFallbackFiles[key]);
    }
  }

  async function fetchJson(url) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.warn(`Unable to load fallback ${url}`, error);
      return [];
    }
  }

  function normalizeRow(row) {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
      if (arrayFields.has(key)) {
        result[key] = value ? value.split("|").map((item) => item.trim()).filter(Boolean) : [];
      } else if (numberFields.has(key)) {
        result[key] = value === "" ? null : Number(value);
      } else if (booleanFields.has(key)) {
        result[key] = ["true", "1", "yes", "y"].includes(String(value).toLowerCase());
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  function parseCsv(text) {
    const cleanText = text.replace(/^\uFEFF/, "");
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let index = 0; index < cleanText.length; index += 1) {
      const char = cleanText[index];
      const next = cleanText[index + 1];
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
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    if (cell || row.length) {
      row.push(cell);
      rows.push(row);
    }

    const [header, ...body] = rows.filter((items) => items.some((item) => item !== ""));
    if (!header) return [];
    const cleanHeader = header.map((item, index) => (index === 0 ? item.replace(/^\uFEFF/, "") : item));
    return body.map((items) => Object.fromEntries(cleanHeader.map((key, index) => [key, items[index] || ""])));
  }

  window.IpohCsvLoader = { loadData };
})();
