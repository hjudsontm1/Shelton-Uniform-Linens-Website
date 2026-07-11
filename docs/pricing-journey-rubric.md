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

Not started.

## Checkpoint 4 - Program Inputs

Not started.

## Checkpoint 5 - Review, Result, And Handoff

Not started.

## Checkpoint 6 - Responsive, Accessibility, And Performance

Not started.

## Checkpoint 7 - Final Review

Not started.
