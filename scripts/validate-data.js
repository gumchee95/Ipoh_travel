const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvDir = path.join(root, "data", "csv");
const errors = [];

const allowedCategories = new Set([
  "heritage",
  "attraction",
  "food",
  "cafe",
  "temple",
  "nature",
  "night_market",
  "shopping",
  "museum",
  "transport",
  "park",
  "street",
  "local_market"
]);
const allowedTimes = new Set(["morning", "noon", "afternoon", "evening", "night"]);
const allowedPlaceStatus = new Set(["active", "temporarily_closed", "closed", "unknown"]);
const allowedBusVerification = new Set([
  "official_verified",
  "map_inferred",
  "needs_verification",
  "community_suggested",
  "deprecated"
]);

const places = readCsv("places");
const busStops = readCsv("bus_stops");
const busRoutes = readCsv("bus_routes");
const routeStopLinks = readCsv("route_stop_links");
const manualRoutes = readCsv("manual_routes");

checkUnique(places, "id", "places.csv");
checkUnique(busStops, "stop_id", "bus_stops.csv");
checkUnique(busRoutes, "route_id", "bus_routes.csv");

for (const place of places) {
  if (!allowedCategories.has(place.category)) add(`places.csv ${place.id}: invalid category ${place.category}`);
  if (!allowedPlaceStatus.has(place.status)) add(`places.csv ${place.id}: invalid status ${place.status}`);
  for (const time of splitList(place.best_time)) {
    if (!allowedTimes.has(time)) add(`places.csv ${place.id}: invalid best_time ${time}`);
  }
  if ((!place.lat || !place.lng) && place.verification_status !== "needs_verification") {
    add(`places.csv ${place.id}: lat/lng missing but verification_status is not needs_verification`);
  }
}

for (const stop of busStops) {
  if (!allowedBusVerification.has(stop.verification_status)) {
    add(`bus_stops.csv ${stop.stop_id}: invalid verification_status ${stop.verification_status}`);
  }
  if ((!stop.lat || !stop.lng) && stop.verification_status !== "needs_verification") {
    add(`bus_stops.csv ${stop.stop_id}: lat/lng missing but verification_status is not needs_verification`);
  }
}

const placeIds = new Set(places.map((place) => place.id));
const routeIds = new Set(busRoutes.map((route) => route.route_id));
const stopIds = new Set(busStops.map((stop) => stop.stop_id));

for (const route of manualRoutes) {
  if (route.from_id && !placeIds.has(route.from_id)) add(`manual_routes.csv ${route.route_id}: missing from_id ${route.from_id}`);
  if (route.to_id && !placeIds.has(route.to_id)) add(`manual_routes.csv ${route.route_id}: missing to_id ${route.to_id}`);
}

for (const link of routeStopLinks) {
  if (link.route_id && !routeIds.has(link.route_id)) add(`route_stop_links.csv: missing route_id ${link.route_id}`);
  if (link.stop_id && !stopIds.has(link.stop_id)) add(`route_stop_links.csv: missing stop_id ${link.stop_id}`);
}

if (errors.length) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Data validation passed.");

function readCsv(name) {
  const file = path.join(csvDir, `${name}.csv`);
  if (!fs.existsSync(file)) return [];
  return parseCsv(fs.readFileSync(file, "utf8"));
}

function checkUnique(rows, field, label) {
  const seen = new Set();
  for (const row of rows) {
    if (!row[field]) add(`${label}: missing ${field}`);
    if (seen.has(row[field])) add(`${label}: duplicate ${field} ${row[field]}`);
    seen.add(row[field]);
  }
}

function splitList(value) {
  return value ? value.split("|").map((item) => item.trim()).filter(Boolean) : [];
}

function add(message) {
  errors.push(message);
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
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  const headers = (rows.shift() || []).map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "") : header
  );
  return rows.map((values) =>
    headers.reduce((record, header, index) => {
      record[header.trim()] = (values[index] || "").trim();
      return record;
    }, {})
  );
}
