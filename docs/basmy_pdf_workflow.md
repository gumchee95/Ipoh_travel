# BAS.MY PDF Workflow

The project may store a public bus map PDF at:

```text
data/pdf/map-basmyipoh.pdf
```

## Rules

- Do not pretend PDF-derived stops are exact GPS data.
- Mark inferred stops as `map_inferred`.
- Mark uncertain stops as `needs_verification`.
- Keep the source pointer in `source_pdf`.
- Add page or note references when available.

## Scripts

```bash
npm run analyze:basmy
```

Creates or refreshes an inferred stop template when the PDF exists.

```bash
node scripts/geocode-inferred-stops.js
```

Prints the manual geocoding workflow. It does not call external APIs.

## Verification

After manual checking, update `bus_stops.csv` with better coordinates and confidence notes.
