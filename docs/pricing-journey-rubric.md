# Adaptive Pricing Journey Rubric

Scores use the required 1-5 scale and are supported by checkpoint artifacts and test notes.

## Checkpoint 0 - Baseline And Architecture

| Category | Score | Evidence |
| --- | ---: | --- |
| Correct repository and base recorded | 5 | `pricing-journey-progress.md`; branch `feature/adaptive-pricing-journey`; base `04b7193...` |
| Isolated workspace | 5 | Dedicated sibling worktree; dirty `main` worktree unchanged |
| Live Pricing preservation | 5 | `pricing.html` copied verbatim; `git diff --no-index` returned no difference; no journey code references it |
| Private preview isolation | 5 | `noindex, nofollow, noarchive`; absent from nav, robots, and sitemap search |
| State and branch architecture | 5 | `pricing-journey-architecture.md` defines canonical operations, state, dependencies, and file boundaries |
| Asset and vector architecture | 5 | Reusable inline SVG system and operation scene boundaries documented |
| Responsive and accessibility architecture | 5 | Explicit desktop/mobile, focus, reduced-motion, semantic, zoom, and keyboard plan |
| Test and resume durability | 5 | Repeatable commands, screenshot artifacts, exact next actions, and business blockers recorded |

Checkpoint 0 gate: **Pass**. The static project and frozen live Pricing page load, the private preview resolves all three query states, Node syntax checks pass, horizontal overflow is zero at 1440x900, and browser diagnostics contain no errors.

## Checkpoint 1 - Landing Concepts

| Category | Score | Evidence |
| --- | ---: | --- |
| Three-second clarity | 5 | All concepts state the program-building purpose and expose one Begin action in the first viewport |
| Single obvious action | 5 | Each concept has one native Begin button; the private concept switcher is secondary and development-only |
| Concepts meaningfully distinct | 5 | Sculptural textile disc, suspended physical label, and typographic threshold use separate visual and interaction metaphors |
| No soap/emoji appearance | 5 | Selected Label concept uses restrained fabric-ticket construction; alternates remain editorial and custom-built |
| Accessibility | 5 | Native controls, semantic headings, focus transfer, live announcement, roving radio keyboard pattern, and forced reduced-motion state |
| Performance | 5 | CSS-only concept objects, no raster landing assets, no dependencies, and no console errors |
| Mobile feasibility | 5 | 390x844 and 430x932 captures fit without horizontal overflow; dedicated mobile compositions retain readable action targets |
| Transition into Operation | 5 | All Begin controls enter the shared Operation chapter; mobile transition opens at scroll position 0 with the heading visible |
| 1366x768 fit | 5 | Selected concept and Operation captures fit without clipping or horizontal overflow |

Checkpoint 1 gate: **Pass**. Concept B, Suspended Program Label, is selected and now loads by default. Concepts A and C remain privately reviewable by query parameter. See `pricing-journey-concepts.md` and `docs/pricing-journey-artifacts/checkpoint-1/`.

## Checkpoint 2 - Landing And Operation

| Category | Score | Evidence |
| --- | ---: | --- |
| Landing clarity | 5 | Selected suspended-label concept remains the default; alternates remain private query states |
| Operation clarity | 5 | Ten distinct choices, visible selected state, concise adaptation explanation, and `Wholesale Dry Cleaning` wording |
| Continuous-page feeling | 5 | Operation condenses in document flow and Goods opens beneath it; normal browser scrolling remains enabled |
| Completed-step condensation | 5 | Operation and Goods become compact summaries with answer, context, and inline Edit action |
| Scroll behavior | 5 | Exact fixed-header/progress-rail offset keeps newly opened headings visible; no snap trapping or hidden heading |
| No static dashboard feeling | 5 | The compact review control appears only after an answer and renders answered fields only |
| 1366x768 fit | 5 | Operation, Goods, and foundation states fit without horizontal overflow or clipped active headings |
| Keyboard accessibility | 5 | Native Begin/Continue/Edit controls, radio-group semantics, roving focus, arrow/Home/End selection, and live announcements |
| Performance | 5 | Configuration-driven DOM, no dependencies or new raster assets, session persistence, and no console errors |

Checkpoint 2 gate: **Pass**. All ten operations produce a relevant Goods handoff, completed chapters remain visible above the active chapter, Edit reopens inline, incompatible goods are removed while compatible goods are preserved, and Start Over restores the landing safely. Evidence is under `docs/pricing-journey-artifacts/checkpoint-2/`.

## Checkpoint 3 - Adaptive Goods

| Category | Score | Evidence |
| --- | ---: | --- |
| Branch relevance | 5 | Ten 1366x768 branch captures and `pricing-journey-goods-map.md` show operation-specific Goods sets and context |
| Visual adaptation beyond text swapping | 5 | Distinct physical compositions and backdrops for linen cart, staging shelves, treatment flow, towel rack, event rail, kitchen, departments, garment rail, conveyor, and mixed goods |
| Goods recognition | 5 | Custom folded goods, robe, coat, apron, garment, table, event, and treatment-room primitives remain legible at tested sizes |
| Vector consistency | 5 | Shared 900x330 coordinate system, stroke weight, fabric treatment, seams, shadows, baselines, and muted palette |
| No emoji appearance | 5 | Editorial product/garment line art with no faces, stock icon pack, or emoji geometry |
| No irrelevant goods | 5 | Automated configuration test validates every branch reference; browser audit confirms two to six relevant goods per operation |
| Educational microcopy | 5 | Each item has one concise positioning sentence and no more than three capability details; focused selection updates the panel |
| Adaptive narrowing | 5 | Selected objects focus while compatible options recede; selected-only foundation scene renders one robe with no sheets or towels |
| Accessibility | 5 | Labeled semantic buttons, checkbox state, visible Selected copy, focus outline, and redundant non-color state cues |
| Performance | 5 | One active inline SVG, maximum six object groups, no dependency/raster assets, inactive scene removal, and no animated paths/filters |

Checkpoint 3 gate: **Pass**. All operation branches, selected focus, one-item narrowing, and the required 1440, 1366, 1280, tablet, 390, and 430 viewport states are captured under `docs/pricing-journey-artifacts/checkpoint-3/`. `node tests/pricing-journey-config.test.cjs` validates configuration completeness and selected-only rendering.

## Checkpoint 4 - Program Inputs

| Category | Score | Evidence |
| --- | ---: | --- |
| Scale relevance by operation | 5 | Ten distinct schemas in `pricing-journey-config.js` and `pricing-journey-input-map.md` use branch-specific operating signals |
| No direct frequency-preference question | 5 | Static test rejects pickup/frequency/cadence field IDs; active Scale copy states cadence will be recommended |
| Finish-state transformation | 5 | Selected-only SVG scene adds pressed, hanging, poly, bundle, bag, cart, and label return overlays |
| Inventory language clarity | 5 | Four approved plain-language ownership choices with secondary model education and no default selection |
| No jargon gate | 5 | COG/Hybrid/Rental are explanatory labels, never the primary question or required prior knowledge |
| Location placement and clarity | 5 | Location follows Ownership, accepts ZIP/city only, and visibly avoids route promises |
| Scroll-up review behavior | 5 | Completed summaries remain above; inline Edit reopens the chapter at the fixed-header-safe offset |
| State consistency | 5 | Browser smoke verifies compatible finish preservation and downstream completion invalidation after Edit |
| Accessibility | 5 | Native form controls, fieldsets/legends, required validation, radio/checkbox states, focus transfer, errors, and announcements |
| Performance | 5 | Configuration-driven DOM, one active selected-only SVG per visual chapter, inactive scene removal, and no browser errors |

Checkpoint 4 gate: **Pass**. The Hotel/Robes path proves one-good narrowing, robe-only return compatibility, operation-specific Scale inputs, neutral ownership, ZIP validation, Review handoff, inline Edit, and zero mobile horizontal overflow. Evidence is under `docs/pricing-journey-artifacts/checkpoint-4/`; automated checks are `tests/pricing-journey-config.test.cjs` and `tests/pricing-journey-cp4.e2e.cjs`.

## Checkpoint 5 - Review, Result, And Handoff

Not started.

## Checkpoint 6 - Responsive, Accessibility, And Performance

Not started.

## Checkpoint 7 - Final Review

Not started.
