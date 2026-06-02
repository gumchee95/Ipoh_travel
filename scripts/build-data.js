const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvDir = path.join(root, "data", "csv");
const jsonDir = path.join(root, "data", "json");

const files = [
  "places",
  "bus_stops",
  "bus_routes",
  "route_stop_links",
  "manual_routes",
  "sponsors",
  "config"
];

const arrayFields = new Set(["best_time", "tags", "routes", "time_slot", "main_areas"]);
const numberFields = new Set([
  "lat",
  "lng",
  "recommended_duration_min",
  "branch_no",
  "sequence_no",
  "priority"
]);
const booleanFields = new Set([
  "is_chain",
  "is_food",
  "is_temple",
  "is_transport_related",
  "active"
]);

fs.mkdirSync(jsonDir, { recursive: true });

for (const name of files) {
  const csvPath = path.join(csvDir, `${name}.csv`);
  const jsonPath = path.join(jsonDir, `${name}.json`);
  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(jsonPath, "[]\n", "utf8");
    continue;
  }
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8")).map(normalizeRow);
  fs.writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  console.log(`Built ${path.relative(root, jsonPath)} (${rows.length} rows)`);
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
