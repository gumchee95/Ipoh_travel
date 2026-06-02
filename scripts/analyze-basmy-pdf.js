const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pdfPath = path.join(root, "data", "pdf", "map-basmyipoh.pdf");
const inferredCsv = path.join(root, "data", "csv", "bus_stops_inferred.csv");
const headers = [
  "stop_name_en",
  "stop_name_zh",
  "route_id",
  "nearby_landmark",
  "inferred_area",
  "confidence",
  "verification_status",
  "source_pdf",
  "source_page",
  "notes"
];

if (!fs.existsSync(pdfPath)) {
  console.log("No BAS.MY PDF found. Creating manual template only.");
} else {
  console.log("BAS.MY PDF found. Automatic PDF extraction is not enabled in this no-dependency script.");
  console.log("If the PDF is image-based, use OCR/manual review and fill the inferred CSV template.");
}

if (!fs.existsSync(inferredCsv)) {
  fs.writeFileSync(
    inferredCsv,
    `${headers.join(",")}\n"Example inferred stop","","check_official","Nearby landmark","Ipoh","low","needs_verification","map-basmyipoh.pdf","1","Template row. Do not mark as verified until confirmed."\n`,
    "utf8"
  );
}

console.log(`Template ready: ${path.relative(root, inferredCsv)}`);
