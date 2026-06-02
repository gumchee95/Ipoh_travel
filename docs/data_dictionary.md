# Data Dictionary

## `data/csv/places.csv`

Core place database. Important fields:

- `id`: stable unique place ID.
- `branch_group`: shared group for related branches.
- `branch_no`: branch number inside group.
- `name_en`, `name_zh`: bilingual display names.
- `category`, `subcategory`: route and filter grouping.
- `lat`, `lng`: approximate map coordinates.
- `area`: traveller-friendly area label.
- `best_time`: pipe-separated values like `morning|afternoon`.
- `tags`: pipe-separated route tags.
- `price_level`: `$`, `$$`, or `$$$`.
- `recommended_duration_min`: suggested stay length.
- `why_visit_en`, `why_visit_zh`: practical recommendation reason.
- `status`: `active`, `temporarily_closed`, `closed`, or `unknown`.
- `verification_status`: source confidence.
- `is_food`, `is_temple`, `is_transport_related`: boolean flags.

## `data/csv/bus_stops.csv`

Nearby BAS.MY / Pink Bus stop references.

- `stop_id`: stable unique stop ID.
- `routes`: pipe-separated route references.
- `source_type`: where the stop came from.
- `source_pdf`: PDF pointer when inferred from PDF.
- `confidence`: `low`, `medium`, or `high`.
- `verification_status`: use `map_inferred` or `needs_verification` unless officially checked.

## `data/csv/manual_routes.csv`

Human-authored point-to-point route links.

- `from_id`, `to_id`: place IDs from `places.csv`.
- `transport_mode`: walk, ride-hailing, bus, mixed, etc.
- `distance_note_en`, `distance_note_zh`: traveller-friendly distance note.
- `time_slot`: pipe-separated suitable times.
- `priority`: route hint used by recommendation logic.
- `reason_en`, `reason_zh`: why this route link is useful.

## `data/csv/sponsors.csv`

Disclosure-only sponsor data. The frontend does not use sponsors for route scoring.
