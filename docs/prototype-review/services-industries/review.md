# Combined Services + Industries Prototype Review

## Prototype Scope

Private, noindex prototype only. The page presents all six service categories as an open editorial catalog and fully implements two inline deep dives:

- Linens & Bedding
- Event Linens & Presentation Goods

The remaining four services intentionally remain overview-only pending approval of the interaction direction.

## Required Screenshots

- `catalog-1440x900.png` - opening and visible catalog entry
- `catalog-linens-1366x768.png` - Linens direct-link state
- `catalog-event-1280x800.png` - Event Linens direct-link state
- `catalog-event-390x844.png` - mobile Event Linens state

## Defects Found During Self-Review

1. Programmatic focus initially drew a gold rectangle around the entire expanded folio, making it read like a bordered card.
2. Native internal disclosure rows did not respond consistently to Enter/Space in the test browser.
3. The first pass loaded Google Fonts through CSS `@import`, delaying stylesheet completion.

## Corrections Made

1. Replaced the folio focus rectangle with a restrained top-edge focus cue.
2. Added an explicit Enter/Space keyboard fallback to native summary controls while retaining semantic `details` elements.
3. Moved font loading to preconnected HTML links so CSS is not blocked by an import.
4. Re-rendered all four required viewport sizes after the correction pass.

## Acceptance Rubric

| Category | Score | Reasoning |
| --- | ---: | --- |
| Full breadth visible without interaction | 5 | All six titles, summaries, goods, and related industries render in the natural page flow. |
| No forced chooser/filter behavior | 5 | The visitor scrolls a complete catalog; no entry decision is required. |
| Clearly distinct from homepage | 5 | The page uses editorial service rows and inline folios rather than account-type cards or a Selected Program panel. |
| First-glance clarity | 5 | The opening names commercial laundry and immediately introduces what can be explored. |
| Unboxed editorial feeling | 5 | Service entries are divided by rules and whitespace rather than cards. |
| Continuous-page cohesion | 5 | One deep navy canvas carries the opening, overview, and expanded detail. |
| Linens & Bedding clarity | 4 | Goods, outcomes, industries, finishing, return, and account models are clear; final copy approval remains future work. |
| Event Linen depth without clutter | 5 | The complex service remains concise at first view with substantial optional detail in four restrained rows. |
| Services/industries relationship clarity | 4 | Every service shows a related-industry rail; future contextual industry anchors can deepen this later. |
| Progressive disclosure quality | 5 | Essential meaning is visible before interaction, while optional operational depth is available on demand. |
| Inline expansion quality | 4 | The folio opens directly beneath its row and keeps context visible; final production motion tuning remains possible. |
| Negative-space quality | 4 | Desktop spacing is calm and deliberate without creating large blank regions. |
| Typography and alignment precision | 4 | Shared grid edges, serif display type, compact labels, and rules align consistently at all tested widths. |
| Direct-link behavior | 5 | `#linens-bedding` and `#event-linens` open the correct folio; browser Back restores the prior state. |
| 1366x768 viewport fit | 5 | The selected row and core Linens folio content remain clearly related with no clipping or horizontal overflow. |
| No clipping or overflow | 5 | Document width matched viewport width at 1440, 1366, 1280, and 390 pixels. |
| Keyboard accessibility | 5 | Buttons, close controls, and topic disclosures work with keyboard input; focus returns to the opening control. |
| Reduced-motion behavior | 5 | The media query removes smooth scrolling and reduces animation/transition duration to an immediate state change. |
| Mobile foundation | 4 | Rows and folios stack cleanly at 390x844 with 66px topic targets and no overflow. |
| Performance/smoothness | 4 | Vanilla HTML/CSS/JS, two optimized lazy/eager images, transform/opacity motion, no scroll listeners, and no console errors. |
| Shelton-specific identity | 4 | Shelton navy, cream, muted gold, serif typography, actual laundry imagery, and service-specific language ground the prototype. |

All categories meet or exceed their required thresholds. The categories requiring a score of 5 reached 5.

## Accessibility Notes

- Semantic section and heading hierarchy
- Buttons for service expansion and closing
- Native `details`/`summary` for internal depth
- `aria-expanded` and `aria-controls` on service controls
- Programmatic focus on the opened folio and focus restoration on close
- Visible focus treatments
- 44px or larger primary controls and 66px internal topic rows
- Direct links remain meaningful without hover
- Reduced-motion support

## Performance Notes

- No framework or full-page re-rendering
- No scroll listeners, WebGL, video, or animated blur
- Only two contextual images are loaded for the two implemented folios
- Noncritical Event image uses lazy loading
- Font hosts are preconnected
- No browser console warnings or errors during verification
- No horizontal layout overflow at any required viewport

## Files Changed In This Prototype Pass

- `services-industries-preview.html`
- `assets/css/services-industries-preview.css`
- `assets/js/services-industries-preview.js`
- `docs/prototype-review/services-industries/catalog-1440x900.png`
- `docs/prototype-review/services-industries/catalog-linens-1366x768.png`
- `docs/prototype-review/services-industries/catalog-event-1280x800.png`
- `docs/prototype-review/services-industries/catalog-event-390x844.png`
- `docs/prototype-review/services-industries/review.md`

The existing `assets/js/services-industries-data.js` canonical content foundation is consumed but was not changed in this pass.

## Live-Site Confirmation

- Live `services.html` was not changed in this pass.
- Live `industries.html` was not changed in this pass.
- Live navigation and redirects were not changed.
- Homepage wording was not changed.
- About-page wording was not changed.
- Pricing, Process, footer, and quote-form wording were not changed.
