# Deployment

## GitHub Pages

1. Run `npm run prepare`.
2. Commit the generated CSV and JSON files.
3. Push to GitHub.
4. In repository settings, enable GitHub Pages from the target branch root.

## Netlify

1. Connect the repository.
2. Use repository root as publish directory.
3. No build command is required if JSON is already committed.
4. Optional build command: `npm run prepare`.

## Local Testing

Avoid direct `file://` testing for data loading. Use:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.
