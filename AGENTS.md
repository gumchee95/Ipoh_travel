# MOSA Token Shield

When querying architecture, relationships, or tracing logic:

1. Read `graphify-out/GRAPH_REPORT.md` first.
2. Use God Nodes as the search boundary.
3. Prefer `00_System`, `01_Work`, and `02_Output` pointer files.
4. Do not start with broad full-text scans when graph context exists.
5. Use `02_Output/routing_index_light.json` before full registry reports.

When starting a new project:

1. Follow `00_System/MOSA_PROJECT_STARTUP_PROTOCOL.md` when present.
2. Create the required MOSA workspace files first.
3. Generate `01_Work/task.md` from `02_Output/task_template.md` when present.
4. Record durable project decisions in `00_System/prompt_stack.md`.

## Project Notes

- This is a static Ipoh travel route guide.
- Core source files are `index.html`, `contribute.html`, `css/style.css`, and `js/*.js`.
- `data/csv/` is the route database source of truth.
- `data/json/` is generated browser data.
- The UI should remain light, simple, mobile-friendly, and graph-first.
- The graph should show connected places point-to-point, not only as cards.
- Bus stop references must show verification status.
- Sponsors must never affect recommendation ranking.
