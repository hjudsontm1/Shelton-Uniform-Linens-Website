# Home Industry Explorer — Production Integration QA

## Current latest QA gate — Production homepage industry explorer integration

- Date: August 25, 2026
- Scope: surgical replacement of the legacy Home `#build-program` section in an isolated clone of the latest saved Sites source, version 24.
- Publish state: published to the public Shelton site as Sites version 25 after the production smoke test passed; version 24 remains the rollback point.
- Approved visual reference: [.artifacts/home-industry-approved-reference-395.png](.artifacts/home-industry-approved-reference-395.png)
- Production candidate capture: [.artifacts/home-industry-production-candidate-395.png](.artifacts/home-industry-production-candidate-395.png)
- Side-by-side comparison input: [.artifacts/home-industry-production-design-qa-395.png](.artifacts/home-industry-production-design-qa-395.png)
- Additional implementation captures: [.artifacts/home-industry-production-320-food-service.png](.artifacts/home-industry-production-320-food-service.png), [.artifacts/home-industry-production-final-760.png](.artifacts/home-industry-production-final-760.png), [.artifacts/home-industry-production-final-761.png](.artifacts/home-industry-production-final-761.png), and [.artifacts/home-industry-production-final-1440.png](.artifacts/home-industry-production-final-1440.png).

### Comparison pass

- The reference and implementation were captured in the same Hotels state at 395 × 720 CSS pixels and device pixel ratio 1, then inspected together in one side-by-side image.
- Contour geometry, gold frame, crop, heading scale, audience line, description, CTA placement, compact selector height, dividers, and vertical rhythm match the approved prototype. The only intentional raster difference is WebP encoding for the production images.
- Responsive visual and geometry checks covered 320, 360, 390, 560, 620, 621, 759, 760, 761, 860, 861, 1087, and 1440 CSS-pixel widths. No horizontal overflow, clipped copy, panel/model overlap, or breakpoint leakage was found.
- The locked 761+ shell, active/inactive panel widths, service-model heights, fold runway, and border treatment remained unchanged from the approved desktop implementation.

### Interaction and accessibility pass

- All six industry choices maintain one active panel, one selected compact tab, one expanded desktop control, and one visible details region.
- Pointer selection is scroll-stable and does not move or resize the shell, service-model rows, hybrid CTA, or surrounding page.
- Rapid `02 → 05 → 03` selection resolves only to Wellness with no stale panel reveal.
- Compact Arrow keys, Home, and End update the selected tab and retain focus. Desktop keyboard activation uses `focus({ preventScroll: true })`, eliminating the prior page jump.
- Compact DOM order is now category tablist → active panel CTA → Customer-Owned Goods → Rental → hybrid, matching the visual and reading order.
- Compact targets remain at least 47.66 × 115 CSS pixels at 320px. The user-approved quiet, internal gold focus treatment remains free of the rejected white outline.
- Reduced-motion behavior, mobile menu open/close, story-carousel next control, CTA destinations, reciprocal ARIA links, analytics identifiers, and browser-console output were checked. No browser warnings or errors were present.

### Performance and regression pass

- The six unique explorer images were converted to component-specific WebP files without changing their dimensions or crops. Their combined payload is approximately 608 KB, down from approximately 3.28 MB; the unused 1.71 MB Food Service PNG was removed from the candidate.
- All twelve stage/dock image elements reuse those six URLs and retain lazy decoding/loading attributes.
- Focused explorer contract: 7/7 passed.
- Pricing estimator regression groups: 29/29 passed.
- Site hardening checks: 13/13 passed.
- Worker/API/analytics checks: 8/8 passed.
- JavaScript syntax and `git diff --check`: passed.
- The candidate preserves the current analytics, navigation, forms, Pricing, Home proof, story carousel, shared scripts, and all content outside the replaced Home section byte-for-byte.
- The source branch was verified at saved Sites version 24 immediately before the fast-forward release. The published version points to the exact validated candidate commit, and saved version 24 remains available as the rollback artifact.

## Final corner refinement — smooth frame continuity

- Source defect captures: `.artifacts` comparison inputs from the user at 847 × 720 CSS pixels showed visibly faceted lower corners and small joins where the curved border met the horizontal edge.
- Implementation evidence: [.artifacts/home-industry-smooth-corners-847.png](.artifacts/home-industry-smooth-corners-847.png), [.artifacts/home-industry-smooth-corner-left-847.png](.artifacts/home-industry-smooth-corner-left-847.png), and [.artifacts/home-industry-smooth-corner-right-847.png](.artifacts/home-industry-smooth-corner-right-847.png).
- Combined before/after comparison: [.artifacts/home-industry-corner-fix-design-qa.png](.artifacts/home-industry-corner-fix-design-qa.png).
- The polygon approximation was removed from the lower corners and replaced with true nested CSS radii on the outer shell and inner accordion. The contour, top edge, panel widths, interaction, and 761+ approved geometry were otherwise left unchanged.
- Fresh visual checks at 320, 760, 761, 847, and 1440 CSS-pixel widths confirmed smooth, symmetric corners, correctly nested inner/outer radii, no horizontal overflow, no selection-driven layout movement, and no console warnings or errors.

final result: passed
