# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable direction for this concept

- This is a separate, basic-fidelity Process-page exploration; do not replace the current `process.html` until the direction is approved.
- Treat `reference/interactive-closed-loop-source.png` as the storyboard for layout and rhythm.
- The hero is a circular seven-checkpoint service wheel. Every checkpoint below occupies about one desktop viewport and has one clear interactive action.
- Preserve the exact route order: Pickup, Sort, Clean, Finish, Inspect, Package, Return.
- Required interaction beats: a Shelton route van arrives; items separate into two bins; a washer fills and spins; a sheet moves through an ironer; a person inspects the item; clean goods load into a cart; the route van returns.
- The July 26 compact closed-loop mock is now the visual source of truth: every checkpoint keeps copy on the left and full-bleed photography on the right, with alternating cream and navy copy fields and one continuous gentle gold boundary.
- Match the supplied 482 × 1340 reference literally at that width. At 390 × 844, switch to a stacked, full-viewport mobile chapter so titles and controls remain readable and tappable.
- Preserve completed states while scrolling. Motion must not be required to continue, and reduced-motion users receive the completed state immediately.
- Washer and ironer visuals are placeholders until verified Yamamoto and Compact equipment photography is supplied. State that clearly in the interface.
- Use only approved Shelton brand assets from `assets/Shelton Brand Assets/brand/`; never redraw the mark or generate Shelton lettering.
