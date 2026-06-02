# Bus Stop Verification

Bus stop references must be clear about confidence.

## Status Values

- `official_verified`: checked against official source.
- `map_inferred`: inferred from map or PDF context.
- `needs_verification`: not reliable enough yet.
- `community_suggested`: suggested by contributor.
- `deprecated`: should no longer be recommended.

## Minimum Verification Notes

Each stop should include:

- Nearby landmark.
- Source type.
- Source URL or PDF pointer.
- Confidence level.
- Last checked date.
- Human-readable note.

## Traveller Display

The UI should show verification status beside bus references so users know whether the stop is confirmed or only a planning hint.
