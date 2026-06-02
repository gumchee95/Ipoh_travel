# Contribution Guide

This project is manually reviewed.

## What To Submit

- New place suggestion.
- Correction to name, area, category or map link.
- Better route reason.
- Bus stop verification update.
- Closing or status update.

## What Not To Submit

- Private notes.
- Credentials or API keys.
- Paid ranking requests.
- Unverified claims presented as official facts.

## Review Flow

1. Prepare a draft on `contribute.html`.
2. Review the suggested data manually.
3. Add accepted edits to CSV.
4. Run `npm run validate:data`.
5. Run `npm run build:data`.
6. Commit CSV and JSON together.

## Sponsor Rule

Sponsor records are disclosure-only. They must not affect route recommendation scores.
