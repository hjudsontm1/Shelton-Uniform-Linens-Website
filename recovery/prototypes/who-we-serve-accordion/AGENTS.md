# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Approved prototype direction

- Treat the user's August 24, 2026 accordion screenshot as the layout and interaction source of truth.
- Keep the prototype independent from the production homepage until the standalone component is approved.
- Use six editorial families: Hotels & Boutique Stays, Short-Term Rentals, Wellness, Events, Food Service, and Workforce. Keep hotels and short-term rentals independent because each is a major Shelton market. Do not include Partners because it represents too little of Shelton's business to warrant a homepage panel.
- Keep the accordion visually self-contained: no introductory heading above it and no repeated “Who We Serve” eyebrow inside expanded panels.
- Each expanded CTA must deep-link to the first relevant program in the production Who We Serve page.
- Place the Customer-Owned Goods / Rental Program choice directly beneath the accordion.
- Use the same slightly rounded, two-pixel gold border on both program-choice rows and the hybrid-program prompt so the entire service-model group feels connected to the accordion shell.
- Use “Hotels, resorts & boutique properties” as the Hotels supporting line and “Linens and towels cleaned and pressed to the highest standard and care” as its description.
- Use “Bringing hotel level pricing and quality to the short term rental market.” as the Short-Term Rentals description.
- Use “Towels, robes, and treatment linens returned pressed, spotless, and ready for daily demand” as the Wellness description.
- Use “Event companies, venues, and wineries” as the Events supporting line and “Professionally cleaned and pressed linens returned ready for big events” as its description.
- Treat Food Service as an independent market. Use “Restaurants, caterers, and food service operations” as its supporting line, “Chef wear, dining linens, and kitchen textiles professionally cleaned, pressed, and ready for service.” as its description, and link its CTA to the Restaurants section. Use the dedicated Food Service photograph rather than reusing the Events image.
- Use “Uniforms professionally cleaned and pressed to match the standards you provide.” as the Workforce description.
- Keep the prototype local and independent. Do not publish, deploy, or integrate it into the production homepage until the user has reviewed and approved it.
- Keep the Customer-Owned Goods and Rental Program rows compact, with slightly finer borders and restrained arrow controls.
- Render the hybrid “Need both?” prompt as a rounded pill, matching the earlier approved treatment.
- During accordion changes, remove outgoing copy from layout immediately, let the image and rails transition alone, and reveal incoming copy only after the new panel has room for its final line lengths. Copy must never squeeze into the collapsing rail.
- Full Customer-Owned Goods and Rental Program pages are the immediate queued follow-up after this prototype is approved.
