# Ipoh Route Card Guide / 怡保顺路游

A complete static, card-based Ipoh travel route database. It is not a blog and not a wiki: users choose a place card, then see connected nearby places with route reasoning, distance notes, transport mode, cost context, time suitability, and Google Maps links.

## Files

- `index.html` - page structure
- `style.css` - mobile-first visual system
- `places.js` - bundled local database and optional Sheet config
- `script.js` - filtering, route graph, modal, and CSV loading
- `README.md` - setup and data notes

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server.

No build step is required.

## Data Source

The site ships with local data in `places.js`:

```js
const dataSourceConfig = {
  mode: "local-first",
  googleSheetCsvUrl: "",
  googleSheetCsvUrls: {
    places: "",
    connections: "",
    routes: ""
  },
  fallbackToLocal: true
};
```

By default, the website uses `placesDb` and `routesConfig`.

## Optional Google Sheet CSV

For easier editing, publish public Google Sheet tabs as CSV and paste the URLs into:

- `dataSourceConfig.googleSheetCsvUrls.places`
- `dataSourceConfig.googleSheetCsvUrls.connections`
- `dataSourceConfig.googleSheetCsvUrls.routes`

Keep `fallbackToLocal: true` so the site remains usable if the Sheet is unavailable.

Only publish non-sensitive travel-guide content. Published Google Sheets can be visible on the web.

## Sheet Columns

### `places`

`id,type,area,category,tags,timeSlots,primaryTimeSlot,name,nameEn,duration,desc,mapUrl,imgEmoji,costType,costLabel,estimatedCost,parking,weatherNote,walkability,lastVerified`

Use `|` or commas to separate list fields. If using commas inside CSV, keep the cell quoted.

```csv
tags
coffee|breakfast|kopitiam
"coffee,breakfast,kopitiam"
```

### `connections`

`fromId,id,relation,reason,distanceNote,transportMode`

### `routes`

`id,title,titleZh,summary,placeIds,bestFor,costType,timeSlot`

Use `|` or quoted comma-separated values for `placeIds`.

## Deploy

### GitHub Pages

Push the project root to a repository and enable GitHub Pages for the branch containing `index.html`.

### Netlify

Drag and drop the folder into Netlify, or connect the repository. No build command is needed.

## Disclaimer

Route notes, costs, opening context, and distances are planning estimates only. Check current conditions, business hours, weather, and transport availability before travel. Google Maps links open externally and do not use a Maps API.
