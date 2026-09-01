# Design QA

## 2026-08-20 - Pricing selected-answer contrast invariant

### Source visual truth

- User-supplied public-site crop: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_pq3MYu/Screenshot 2026-08-20 at 7.56.22 AM.png` (998 × 296 px).
- Visual defect: the selected `We already own the goods` card correctly changes to Shelton navy, but its explanatory sentence remains a dark navy/gray and becomes unreadable.
- Scope inferred from the report: the same selected-state rule must protect every estimator answer card, not only the ownership example.

### Implementation evidence

- Updated local route: `http://127.0.0.1:8045/pricing.html?qa=selected-contrast-v5`.
- Browser-rendered compact implementation: `/private/tmp/shelton-pricing-selected-contrast-v5-620x900.png` (620 × 900 CSS-pixel viewport).
- Normalized source-and-implementation comparison: `/private/tmp/shelton-pricing-selected-contrast-comparison-v5.png` (2096 × 374 px). The reported crop and the matching selected local card are placed in one visual comparison input.
- State: Hotel / Boutique Stay with sheets and towels selected, customer-owned inventory selected, recommended cadence selected, and standard access selected.

### Findings and fixes

- [P1] Phone helper-color rules could recolor selected-card explanations after the parent card turned navy. A final component-level selected-state invariant now runs after every breakpoint rule.
- [P1] Selected titles and explanations were not governed by one shared contract across choice clouds, choice lists, segmented choices, volume cards, ownership cards, editorial access cards, and the recommendation control. All selected navy cards now explicitly inherit Shelton ivory for primary copy and use a 74% ivory treatment for helper copy.
- [P2] The operation picker used its own selected-button structure. Its selected title and helper text now follow the same contrast rule.
- [P2] The pricing CSS query string is advanced to `20260820-selected-contrast-v5` so a later publish cannot continue serving the stale selected-state bundle from cache.
- Fonts, typography, card geometry, gold focus/selection outline, navy fill, and existing estimator copy are unchanged.
- No brand asset, icon, photograph, or estimator calculation was changed in this scope.

### Responsive verification

- Real selected controls were measured at 320, 390, 620, 621, 760, 900, 1200, and 1440 CSS px.
- Five selected answer surfaces were present in the verified journey at each width. No measured selected title or helper line fell below a 4.5:1 contrast ratio; the minimum measured ratio was 7.90:1 against the selected navy background.
- The normalized comparison visibly shows the ownership explanation restored from nearly invisible dark copy to readable ivory copy.
- Browser console warnings and errors checked: none.
- Automated verification: all 18 canonical estimator regression groups pass, including a new assertion that the selected-state invariant follows phone helper-color overrides and covers the ownership, choice, and operation-picker structures.

### Comparison history

1. The supplied public screenshot showed a selected navy card with an unreadable dark explanation.
2. The current local estimator was checked to separate stale-production behavior from current-code behavior.
3. A final cross-component invariant was added after every responsive override, and the pricing stylesheet cache key was advanced.
4. The source and corrected implementation were normalized into one comparison image; the selected explanation is now clearly readable without altering the approved card design.
5. No actionable P0, P1, or P2 finding remains in this selected-state contrast scope.

final result: passed

## Homepage compact industry stage duplicate — August 25, 2026

### Scope and visual truth

- Approved desktop source: `.artifacts/compact-stage-source-761.png`.
- Previous compact source: `.artifacts/compact-stage-source-390.png`.
- The requested compact behavior is a stationary, fold-following feature stage with six attached industry rails. Selecting a rail swaps the image and content inside the stage without reordering categories, extending the page, or moving the program-model cards below.
- Working duplicate: `http://127.0.0.1:4174/home-industry-explorer-compact-stage.html?compact-stage=final-v2#build-program`.
- Visual comparisons: `.artifacts/compact-stage-design-qa-comparison.png` and `.artifacts/compact-stage-state-comparison.png`, captured at device-pixel ratio 1.

### Findings and fixes

- **P2 — Fixed:** the former compact stack gave only the first category the fold contour and required substantial travel to reach later categories. The duplicate now uses one fixed stage plus an attached six-choice dock.
- **P2 — Fixed:** category changes formerly compressed and reflowed text. The compact stage, copy region, dock, and following content now retain stable dimensions across all six categories.
- **P2 — Fixed:** the 760/761 breakpoint formerly changed the silhouette abruptly. The compact contour scales continuously and reaches `674.875px` at 760px, compared with the untouched desktop shell at `675.266px` at 761px.
- **P2 — Fixed:** the white focus treatment resembled an accidental second border. Compact keyboard focus now uses a quiet internal gold cue with no white halo.
- No remaining P0, P1, or P2 visual defects were found in the scoped duplicate.

### Required surface checks

- Fonts, gold/navy palette, border weight, corner language, imagery, copy, CTA styling, and program-model cards match the approved Shelton source treatment.
- Existing source images are reused; no brand marks or lockups were redrawn or transformed.
- At 320px, the smallest dock control is approximately `47.66 × 115px`, with no horizontal overflow.
- At 390px, Hotels and the longest compact states retain at least `21.6px` between the CTA and dock. At 759–760px, that clearance is approximately `26.6px`.
- At 320, 360, 390, 430, 560, 620, 621, 759, and 760px, selecting any category changes shell height, dock position, program-model position, and total section height by no more than 1px.
- Real pointer selection at 390px produced no scroll movement when the component was framed in view. Rapid `02 → 05 → 03` selection settled on Wellness only, with no stale panel reveal.
- Arrow keys, Home, and End keep compact focus, selected state, and visible panel synchronized. One panel is active and exposed at a time; the category order remains `01–06`.
- CTA routes were verified for Hotels, Short-Term Rentals, Wellness, Events, Food Service, and Workforce.
- Console inspection returned no errors or warnings.

### Locked 761+ regression gate

- The approved 761+ HTML/CSS/JS source files remain unchanged.
- At 761px, the duplicate and source shell geometry is exact: `715.344 × 675.266px`; the panel widths and following-card positions also match.
- At 1087px, the duplicate and source shell geometry is exact: `1039 × 746.383px`; settled screenshots are visually equivalent.
- Breakpoint semantics restore the original desktop trigger/region model at 761px and return to the compact tab/panel model at 760px.

### Residual P3 checks

- A future production integration should include a final assistive-technology pass in the full homepage build. Browser-level semantics, keyboard control, reduced-motion timing, and 200% zoom breakpoint behavior are already accounted for in this duplicate.
- The work is local, isolated from the approved source, and unpublished.

final result: passed

## Homepage contour detail refinements — August 25, 2026

### Source visual truth

- Preserved desktop state: `.artifacts/home-contour-audit-2026-08-25/01-fold-handoff.jpg` (1087 × 720 px).
- Preserved responsive board: `.artifacts/home-contour-audit-2026-08-25/07-mobile-390-and-stack-760.jpg` (1280 × 720 px, containing real 390 px and 760 px iframe viewports).
- User direction: keep the fold-following silhouette; round the faceted contour corners; remove every white focus box in this section; retain a non-box keyboard cue; make 760 px visually continuous with the rail layout; slightly reduce Customer-Owned Goods and Rental rows in the upper stacked range; change only the Hotels description to “Linens and towels cleaned and pressed with the highest standard of care.”

### Implementation evidence

- Local duplicate: `http://127.0.0.1:4174/home-industry-explorer-experiment.html?contour=approved-v3#build-program`.
- Desktop implementation: `.artifacts/home-contour-approved-1087.jpg` (1087 × 720 px, 1087 px iframe viewport, 1× normalized browser capture).
- Responsive implementation: `.artifacts/home-contour-approved-responsive.jpg` (1280 × 720 px review board containing real 390 px and 760 px iframe viewports).
- Source/implementation comparison input: `.artifacts/home-contour-design-qa-comparison.jpg` (1280 × 960 px). The preserved and revised desktop states appear together in the first row; the preserved and revised responsive boards appear together in the second row.
- Focused responsive measurements: at 390 px the program row remains 96.80 px high with 40 px explorer top padding; at 760 px it is 87.56 px high with 70.56 px top padding; at 761 px the unchanged rail layout begins with 66.50 px padding and its desktop-density model row.
- State: Hotels active for visual comparisons; all six category states exercised for interaction verification.

### Findings and fixes

- [P2 fixed] The contour corners were visibly faceted because the shell used too few polygon samples. The outer gold shell and inset navy accordion now inherit one densely sampled responsive polygon. The top diagonal’s start/end, rise formulas, panel geometry, and bottom edge are unchanged; only the corner interpolation is softer.
- [P2 fixed] The active trigger’s `-7px` cream outline created a second white perimeter inside the gold dividers. All white focus boxes in this section are removed. Category triggers use a quiet gold keyboard-only cue: collapsed rail text turns gold and the active heading receives a restrained gold underline. Explore, service-model, and hybrid links retain their existing gold border/text/arrow focus changes without an added white outline.
- [P2 fixed] Selection and focus remain distinct. The wide photograph continues to communicate the selected category, while the gold cue identifies a different collapsed control reached by Tab before activation. Arrow navigation still activates and focuses together. Computed verification on the active trigger: `outline: none`; active-heading keyboard cue: `text-decoration: underline` with `rgb(184, 150, 90)`.
- [P2 fixed] A first 24 px tablet runway addition was visually over-open. Fold-alpha measurement showed the pre-existing 760/761 minimum gaps were already approximately 31.9/31.7 px. The final tablet taper therefore adds only 0–4 px from 621–760, producing a deliberate but small 760 px refinement without a large breakpoint discontinuity.
- [P3 fixed] Customer-Owned Goods and Rental retain their 96.80 px phone height, then taper through the 621–760 range. At 760 px their measured height falls from 100.37 px before refinement to 87.56 px after refinement; copy remains unclipped and rows can still auto-grow when wrapping requires it.
- [P3 fixed] The Hotels description now reads: “Linens and towels cleaned and pressed with the highest standard of care.” No other category text changed.

### Required fidelity surfaces

- Fonts and typography: passed. Cormorant Garamond/Inter families, weights, title scale, tracking, and wrapping are unchanged. The approved Hotels copy fits at 390, 760, and desktop widths.
- Spacing and layout rhythm: passed. The desktop frame, diagonal rise, active/collapsed proportions, model-to-history handoff, and phone layout remain intact. Only the agreed upper-stacked runway and program-row vertical padding taper changed.
- Colors and visual tokens: passed. Deep Navy `#081321`, Warm Cream `#FAF6EE`, and Muted Gold `#B8965A` remain the only visible section tokens. The removed cream focus perimeter is replaced by the existing gold system.
- Image quality and asset fidelity: passed. All six supplied photographs, crops, filters, and approved Shelton lockup remain source assets; no image was regenerated, stretched, or replaced.
- Copy and content: passed. Only the explicitly approved Hotels sentence changed.

### Interaction and responsive verification

- Rentals, Wellness, Events, Food Service, Workforce, and Hotels were activated in sequence. Every settled state had exactly one active panel, one visible details region, and no horizontal document overflow.
- ArrowRight, ArrowLeft, Home, and End keep focus/selection synchronized. The selected panel remains the dominant state cue; the keyboard-only cue does not trace the frame.
- The 390 px phone structure and 761 px+ rail geometry remain unchanged. The 760 px frame retains a navy runway instead of touching the fabric and no longer over-opens relative to 761 px.
- JavaScript was not changed. No interaction failure or page error surfaced during the six-state and keyboard pass.

### Comparison history

1. The preserved implementation established the approved slope, frame size, photography, category proportions, and responsive transformations.
2. Dense polygon samples, focus restyling, a 24 px tablet runway, copy, and row-density changes were rendered.
3. Direct fold-alpha measurement and a 760/761 visual comparison showed the 24 px runway overcorrected by approximately 24 px.
4. The tablet addition was reduced to a 0–4 px taper; the final 390/760 board restores continuity while keeping the requested slight increase.
5. Program rows were measured after rendering; tapering vertical padding—not only `min-height`—was required to reduce the naturally wrapped 760 px rows to 87.56 px.
6. The final combined comparison shows the softened contour, preserved composition, restrained runway, and unchanged phone design. No actionable P0/P1/P2 finding remains.

### Residual test gaps

- A real VoiceOver/NVDA pass remains advisable before production integration. DOM roles, `aria-expanded`, `aria-controls`, and visible keyboard state are present, but this local refinement did not include an external assistive-technology session.
- The duplicate remains local and has not been published or merged into the preserved homepage preview.

final result: passed

## Homepage fold-following industry frame sandbox — August 25, 2026

### Source visual truth

- User contour sketch: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_LlU32z/Screenshot 2026-08-25 at 12.54.02 PM.png` (1864 × 598 pixels).
- Stable QA copy: `.artifacts/home-contour-user-sketch.png` (1864 × 598 pixels).
- Intent: lift the accordion's top-left corner into the navy, descend toward the existing top-right endpoint in parallel with the tailored-fabric hem, and clip every photograph and divider to the same outer envelope without changing the section's approved identity or lower-page flow.
- The white line in the source is a conceptual annotation, not a production color or asset. The implementation intentionally translates it into the existing Shelton gold frame treatment.

### Browser-rendered implementation evidence

- Working local sandbox: `http://127.0.0.1:4174/home-industry-explorer-experiment.html?contour=final-v2#build-program`.
- Final desktop capture: `.artifacts/home-contour-sandbox-1280-final.jpg` (1280 × 720 pixels from a 1280 × 720 CSS viewport; browser DPR 2; browser capture normalized to 1× pixels).
- Source-and-implementation comparison input: `.artifacts/home-contour-comparison.jpg` (1280 × 720 pixels). Both artifacts are visible together; the different source crop is retained and treated as a conceptual geometry reference rather than a pixel-identical full-page target.
- Responsive evidence: `.artifacts/home-contour-responsive-390-760.jpg`, `.artifacts/home-contour-responsive-761.jpg`, `.artifacts/home-contour-responsive-860.jpg`, and `.artifacts/home-contour-responsive-861.jpg` (each a 1280 × 720 review-board capture containing a real iframe viewport at the labeled CSS width).
- State: Hotels & Boutique Stays active, tailored-fabric handoff visible, ownership-model rows immediately below the frame.

### Findings and comparison history

- [P2 fixed] The first rendered contour used a 225 px rise at 1280 px, leaving the navy channel roughly 15 px wider at the left than at the right. Pre-fix evidence: `.artifacts/home-contour-sandbox-1280-pre-tune.jpg`.
  - Fix: use fold-aware compact and desktop rise formulas, with a 240 px desktop cap and a deliberate 148 px to 158 px change across the fold asset's 860/861 scale transition.
  - Post-fix evidence: the final desktop capture and combined comparison show the gold boundary following the hem with a visually consistent navy channel.
- Fonts and typography: passed. Cormorant Garamond and Inter, weights, tracking, wrapping, and bottom-anchored copy are unchanged from the approved integration. A separate half-rise variable keeps collapsed rail labels at their prior visual Y position.
- Spacing and layout rhythm: passed. At 1280 px the shell rises 240 px while its right endpoint, bottom edge, model rows, section bounds, and footer retain their exact baseline document positions. Measured page-position deltas for the section top/bottom, model-row top/bottom, and footer top are all 0 px.
- Colors and visual tokens: passed. The component retains Deep Navy `#081321`, Warm Cream `#FAF6EE`, and Muted Gold `#B8965A`; no new seam, gradient, or border color was introduced.
- Image quality and asset fidelity: passed. The six existing editorial photographs, their focal positions, filters, and approved Shelton lockup remain source assets. The taller frame reveals more of those photographs and clips them with the frame; no image was stretched, regenerated, or replaced by code art.
- Copy and content: passed. All six approved business-family headings, audience lines, descriptions, and CTAs are unchanged. The Customer-Owned Goods, Rental Program, and hybrid copy are unchanged.
- Responsive structure: passed. At 390 and 760 CSS px the component retains the approved flat stacked layout with no horizontal overflow. At 761, 860, and 861 CSS px the rail layout uses the responsive contour; active details stay inside the panel and exactly one details region remains visible.
- Interaction behavior: passed. Click activation, rapid Events → Food Service → Workforce switching, Arrow navigation, Home, and End all leave exactly one active panel, one `aria-expanded="true"` trigger, and one visible details region. Focus moves to the expected trigger.
- Browser console: passed on the final sandbox route; no warnings or errors were recorded. JavaScript syntax, HTML parsing, and CSS brace checks pass.
- Baseline preservation: passed. The approved preview HTML/CSS/JS SHA-256 hashes remain `3654904...`, `db42e27...`, and `ce2ab5a...`; only the independent experiment files contain the contour treatment.

### Residual polish

- [P3] The responsive polygon approximates the upper corner curves with short facets. They read as softly beveled at normal scale and are consistent with the restrained gold frame; a future production integration could use a path-based mask if perfectly continuous curvature becomes important.

### Severity summary

- P0: none
- P1: none
- P2: none remaining

## Latest QA gate

The active gate is **Homepage fold-following industry frame sandbox**. Source comparison, desktop and breakpoint captures, baseline footprint measurements, interaction regression, and final-route console checks pass. The work remains isolated in the experiment and has not been published.

final result: passed

## Homepage fold-to-explorer continuity refinement — August 25, 2026

### Source of truth

- The approved full-home integration preview and its existing photographed fold treatment.
- User direction: verify the fold-to-navy handoff at all sizes and refine only spacing that changes abruptly.

### Implementation evidence

- Static geometry checks at 320, 375, 390, 480, 520, 620, 621, 700, 760, 761, 860, 861, 980, 1095, 1199, 1200, 1440, and 1920 px.
- Boundary checks at 620/621, 760/761, 860/861, and 1199/1200 px.
- The local preview HTML and CSS both return HTTP 200 and the served HTML references the `fold-continuity-v3` stylesheet.
- CSS structure, JavaScript syntax, and `git diff --check` pass for the two preview files.

### Findings

- The fold asset, page base, and explorer handoff all resolve to the same Shelton deep navy, so no light or transparent page gap can be exposed.
- The 861 px breakpoint previously introduced an abrupt compact-to-desktop fold overlap change. A preview-only 861–1199 px interpolation now meets the existing values within 0.2 px at both boundaries.
- The 621–760 px stacked range previously shifted the accordion runway by 18–24 px at its boundaries. Its preview-only top padding now keeps the fold-relative shift to 0.4 px at 620/621 and 3.2 px at 760/761.
- Phone and approved large-desktop endpoints remain unchanged.

### Verification blocker

- A fresh rendered screenshot could not be captured in this run because the in-app browser security policy rejected access to the already-open local preview. The current implementation therefore still requires owner visual inspection in the open local page before this refinement can be marked visually passed.

### Severity summary

- P0: none known
- P1: none known
- P2: none known

## Latest QA gate

The active gate is **Homepage fold-to-explorer continuity refinement**. Static geometry and served-file checks pass; fresh rendered comparison is blocked by the in-app browser security policy. The work remains local and has not been published.

final result: blocked

## 2026-08-20 - About full-desktop story typography

### Source visual truth

- User-provided full-desktop story crop: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_ASiNeA/Screenshot 2026-08-20 at 7.54.55 PM.png` (858 × 982 px).
- Selected target: preserve the existing desktop towel-and-photo composition while carrying the approved compact/mobile paragraph scale and rhythm into the 861 px-and-up layout.
- Reference state: expanded `Unit Laundry Takes Root in Tucson` story.

### Implementation evidence

- Local route: `http://127.0.0.1:8045/about.html`.
- Browser-rendered implementation: `/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2/.artifacts/about-desktop-story-type-v1.png` (1087 × 727 px; 1087 × 727 CSS viewport).
- Focused source/implementation comparison: `/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2/.artifacts/about-desktop-story-type-comparison-v1.jpg` (1736 × 1032 px). The source is a user-created content crop rather than a full viewport, so the comparison normalizes the affected expanded-story region and does not treat surrounding crop differences as design drift.
- Additional responsive measurements: 1440 × 1000 desktop, 800 × 1000 compact, and 390 × 844 mobile.

### Findings and fixes

- [P2 fixed] The desktop paragraph scale could fall to 14.35 px at the current 1087 px desktop viewport, creating a noticeably different editorial rhythm from compact and mobile. The desktop formula now holds a 16.64 px paragraph at 1087 px and 18 px at 1440 px, with a 1.42 line-height.
- Compact remains 20 px / 28 px at 800 px. Mobile remains 16.96 px / 24.08 px at 390 px. Neither approved responsive treatment changed.
- The dynamic fit remains natural in the tested desktop story: the paragraph stays safely above the towel band without forced shrinking, clipping, or overflow.
- Fonts and typography: Cormorant Garamond, weight, tracking, title fitting, and navy color are unchanged; only the desktop paragraph scale and leading were aligned.
- Spacing and layout rhythm: image size, frame, title rule, column widths, and towel geometry are unchanged. The paragraph retains its existing gap beneath the photograph.
- Colors and visual tokens: the Shelton navy, cream, gold, and terry texture treatments are unchanged.
- Image quality and asset fidelity: the original historical photograph, crop, paper frame, and towel assets are unchanged.
- Copy and content: no timeline wording changed.

### Verification

- Clicking the `Unit Laundry Takes Root in Tucson` towel activates the correct story and reruns the one-line title and paragraph-fit logic.
- Browser console warnings and errors checked: none.
- `node --test tests/launch-readiness.test.cjs`: 11/11 passed.
- `git diff --check`: passed.

### Comparison history

1. Measured the prior full-desktop story paragraph at 14.35 px / 20.09 px at the current 1087 px viewport.
2. Applied the compact/mobile-style minimum scale and 1.42 leading only to the desktop story paragraph.
3. Captured the same 1930s story after the change and verified natural fitting at desktop, compact, and mobile breakpoints.
4. No actionable P0, P1, or P2 finding remains in this typography scope.

final result: passed

## Latest QA gate

The active gate is **Pricing range-dock persistence v15**. The quick planning range now remains visible through the service-location step and yields only when the actual planning-range readout has meaningfully entered view. Desktop, compact, and mobile checks pass. The work has not been committed, pushed, or published.

### Source of truth

- User-provided motion reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_ubfnki/Screen Recording 2026-08-20 at 7.00.42 PM.mov`.
- Reference contact sheet: `/private/tmp/shelton-range-dock-reference-contact-v15.jpg`.
- User direction: the estimated range in the lower-right disappears too quickly while moving from the location step toward the planning result.

### Implementation evidence

- Desktop, dock persisting through the location step: `/private/tmp/shelton-range-dock-v15-desktop-persist.jpg`.
- Desktop, range visible and dock suppressed: `/private/tmp/shelton-range-dock-v15-desktop-after.jpg`.
- Compact before / after: `/private/tmp/shelton-range-dock-v15-compact-before.jpg`, `/private/tmp/shelton-range-dock-v15-compact-after.jpg`.
- Mobile before / after: `/private/tmp/shelton-range-dock-v15-mobile-before.jpg`, `/private/tmp/shelton-range-dock-v15-mobile-after.jpg`.
- Reference / implementation comparison: `/private/tmp/shelton-range-dock-reference-implementation-v15.jpg`.

### Findings

- The old observer suppressed the dock as soon as the outer planning section intersected an expanded viewport boundary, which removed it well before the range itself was readable.
- The observer now watches the actual range readout, requires 8% meaningful visibility, and uses a 72 px lower safe zone so the dock persists through the final estimator step without duplicating the visible range.
- At 1440 × 900, 842 × 900, and 390 × 844, the dock remains present before the range readout appears and is suppressed after the readout enters view.
- All 20 canonical `dist/client` estimator regression groups and all 13 site-hardening tests passed. `git diff --check` passed.

### Severity summary

- P0: none
- P1: none
- P2: none

final result: passed

## Pricing ownership divider v14

### Source of truth

- User-provided ownership-row reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_9uFyBK/Screenshot 2026-08-20 at 6.59.34 PM.png` (1252 × 282).
- User direction: restore the missing internal boundary in the three-choice ownership box.

### Implementation evidence

- Compact ownership section: `/private/tmp/shelton-pricing-ownership-divider-compact-v14.jpg` (1046 × 954).
- Mobile ownership section: `/private/tmp/shelton-pricing-ownership-divider-mobile-v14.jpg` (390 × 844).
- Focused ownership row: `/private/tmp/shelton-pricing-ownership-row-v14.png` (666 × 135).
- Reference / implementation comparison: `/private/tmp/shelton-pricing-ownership-divider-comparison-v14.jpg` (1820 × 260).

### Findings

- The stale two-column rule that removed the second ownership cell's right edge is explicitly overridden in the authoritative three-column layout.
- Compact widths now show two complete internal vertical dividers; computed borders are 1 px, 1 px, and 0 px across the three cells.
- Phone widths retain the intended stacked treatment with 1 px horizontal dividers after the first and second choices.
- Compact and mobile captures show no horizontal overflow or clipping.
- All canonical estimator and site-hardening regression checks pass. `git diff --check` passes.

### Severity summary

- P0: none
- P1: none
- P2: none

## Latest QA gate

The active gate is **Pricing ownership divider v14**. Compact and mobile comparison checks are complete; the missing boundary is restored; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Latest QA gate

The active gate is **Pricing range-dock persistence v15**. The lower-right range remains available through the service-location step and is suppressed only when the actual planning-range readout enters view. Desktop, compact, and mobile comparison checks are complete; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Latest QA gate

The active gate is **Pricing planning-summary centering v16**. The requested text is centered globally, the visual comparison is complete, and all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Current latest QA gate — Homepage contour detail refinements

The softened corners, non-white keyboard treatment, restrained 760 px runway, Hotels copy update, and upper-stacked service-row reduction are recorded in **Homepage contour detail refinements — August 25, 2026** above. The comparison and interaction checks pass. The work remains isolated in the experiment and has not been published.

final result: passed

## Current latest QA gate — Homepage compact industry stage duplicate

The stationary compact feature stage, attached six-choice image dock, stable category transitions, compact keyboard model, and exact 761 px+ parity are recorded in **Homepage compact industry stage duplicate — August 25, 2026** above. The responsive, interaction, visual-comparison, and regression checks pass. The work remains an isolated local duplicate and has not been published.

final result: passed

## Current latest QA gate — Homepage compact industry stage duplicate

The stationary compact feature stage, attached six-choice image dock, stable category transitions, compact keyboard model, and exact 761 px+ parity are recorded in **Homepage compact industry stage duplicate — August 25, 2026** above. The responsive, interaction, visual-comparison, and regression checks pass. The work remains an isolated local duplicate and has not been published.

final result: passed

## Homepage fold-to-explorer visual runway v5 — August 25, 2026

### Source visual truth

- Crowded transition evidence: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_cwR5xz/Screenshot 2026-08-25 at 12.25.06 PM.png` (470 × 316 pixels).
- Closer spacing reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_oEcyVY/Screenshot 2026-08-25 at 12.26.29 PM.png` (282 × 266 pixels at 2× density; normalized CSS region 141 × 133).
- User direction: keep a consistently visible navy runway between the lowest fabric edge and the accordion, slightly larger than the second screenshot.

### Browser-rendered implementation evidence

- Compact-rail implementation: `.artifacts/home-fold-runway-852-v5.jpg` (852 × 720 pixels from an 852 × 720 CSS viewport; browser DPR 2, capture normalized to 1× pixels).
- Desktop implementation: `.artifacts/home-fold-runway-1280-v5.jpg` (1280 × 720 pixels from a 1280 × 720 CSS viewport; browser DPR 2, capture normalized to 1× pixels).
- Density-normalized focused comparison: `.artifacts/home-fold-runway-comparison-v5.jpg` (1280 × 720 pixels). The 2× user reference is compared with a 2× presentation of the matching 1× implementation crop, so the visible runway is judged at equal CSS scale.
- State: Hotels & Boutique Stays active at `home-industry-explorer-preview.html#build-program` with the fold and accordion transition in view.

### Findings and comparison history

- [P2 fixed] The earlier spacing was tied to the fold element's invisible box boundary. Because the actual cream hem ends at a different vertical position as `object-fit`, crop, and fold transforms change, the accordion could nearly touch or overlap the visible fabric edge at wider viewports.
- The preview now applies a small responsive runway correction based on the visible hem geometry. The normalized focused comparison shows the corrected gap slightly exceeding the user's closer second reference without turning into a detached empty band.
- Rendered checks at 852 and 1280 CSS pixels show approximately 30 px of navy between the lowest visible cloth edge and the gold accordion border. Static edge-geometry checks cover 320 through 1920 px and the 620/621, 760/761, 860/861, and 1199/1200 transitions.
- Fonts and typography: unchanged; the existing Cormorant Garamond and Inter hierarchy remains intact.
- Spacing and layout rhythm: passed; the navy runway is deliberate and consistent, while the accordion dimensions, radius, and internal composition remain unchanged.
- Colors and visual tokens: passed; the runway uses the existing Deep Navy `#081321`, with no new seam or color band.
- Image quality and asset fidelity: passed; the approved fold and industry photographs, crop treatment, sharpness, and transforms remain unchanged.
- Copy and content: unchanged.
- Interaction regression: Wellness activated with exactly one visible details panel, then Hotels was restored with exactly one visible details panel. Browser console logs are empty.

### Severity summary

- P0: none
- P1: none
- P2: none

## Latest QA gate

The active gate is **Homepage fold-to-explorer visual runway v5**. The density-normalized comparison, compact and desktop rendered checks, responsive geometry audit, interaction regression, and console check pass. The work remains local and has not been published.

final result: passed

## Latest QA gate

The active gate is **Homepage Who We Serve integration preview**. Desktop and mobile visual comparisons, all six active states, keyboard behavior, rapid switching, asset loading, and console checks passed. The work remains local and has not been published.

final result: passed

## Homepage Who We Serve integration preview — August 25, 2026

### Source visual truth

- Primary accordion direction: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_8tiL8x/Screenshot 2026-08-24 at 3.14.26 PM.png` (1614 × 708 pixels).
- Service-model row treatment: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_vygZb9/Screenshot 2026-08-24 at 3.20.02 PM.png` (2592 × 444 pixels).
- Subsequent approved product decisions intentionally replace the source screenshot's combined Hospitality category with independent Hotels & Boutique Stays and Short-Term Rentals panels; add Food Service; remove Partners; remove the introductory and repeated “Who We Serve” copy; and retain the lighter borders, rounded hybrid prompt, and delayed-copy transition from the final standalone prototype.

### Browser-rendered implementation evidence

- Full homepage local preview: `http://127.0.0.1:4174/home-industry-explorer-preview.html`.
- Hotels state and homepage handoff: `prototypes/who-we-serve-accordion/qa-homepage-integration-desktop.png` (1440 × 1024 pixels from a 1440 × 1024 CSS viewport; capture normalized to 1:1 pixels).
- Short-Term Rentals active state: `prototypes/who-we-serve-accordion/qa-homepage-integration-rentals.png` (1440 × 1024 pixels from the same viewport).
- Responsive Workforce state and service-model group: `prototypes/who-we-serve-accordion/qa-homepage-integration-mobile.png` (390 × 844 pixels from a 390 × 844 CSS viewport; capture normalized to 1:1 pixels).
- Combined source / implementation comparison: `prototypes/who-we-serve-accordion/qa-homepage-integration-comparison.png` (1660 × 650 pixels). The primary row normalizes the source and rendered accordion to 800 × 351 pixels. The focused service-model row normalizes both treatments to 800 × 137 pixels.

### Compared state and full-view evidence

- Primary comparison state: Hotels & Boutique Stays active with the other five market families collapsed, directly below the existing tailored-fabric fold and directly above the existing Shelton history section.
- The rendered full-home screenshot confirms that the new section replaces only the legacy builder in the preview copy. The hero, proof comparison, tailored-fabric transition, history carousel, closing CTA, and footer retain their existing order and styling.
- The folded-hem handoff meets the accordion at the same navy transition surface used by the prior builder; there is no new heading, explanatory paragraph, or hard color break between the proof section and the explorer.

### Focused-region evidence

- The upper row of `qa-homepage-integration-comparison.png` compares the approved editorial-photo accordion, dominant active panel, gold dividers, vertical rails, typography, image darkness, and outer radius in one input.
- The lower row compares the Customer-Owned Goods, Rental Program, and rounded hybrid prompt treatment at readable scale. No additional focused crop is required for the arrow controls because the desktop and mobile implementation screenshots keep all nine Phosphor arrows readable.

### Findings

- Fonts and typography: passed. Cormorant Garamond and Inter are inherited from the homepage's approved font loading. Long hotel and rental headings wrap intentionally; all six headings, descriptions, and CTAs remain inside the active panel at 1440 and 390 CSS pixels.
- Spacing and layout rhythm: passed. The accordion retains the approved 1320 × 583 desktop frame, dominant 61% active panel, restrained one-pixel gold shell/dividers, and current compact ownership rows. The model group is visually subordinate to the explorer and does not create a hard break before the story section.
- Colors and visual tokens: passed. Deep Navy `#081321`, Warm Cream `#FAF6EE`, and Muted Gold `#B8965A` map directly to the brand source. The cloth-to-navy gradient and existing homepage atmosphere remain continuous.
- Image quality and asset fidelity: passed. All six editorial photographs loaded at full natural dimensions with no broken assets. Food Service uses its dedicated approved generated photograph; no visible asset, icon, logo, or mark was approximated with CSS or inline SVG.
- Copy and content: passed. All six approved market descriptions and CTA labels render exactly. The source screenshot's older four-family taxonomy is intentionally superseded by the user's later six-family content decisions.
- Icons and controls: passed. Nine arrow controls use the existing Phosphor web icon family. Focus states, native buttons, link semantics, unique control/region IDs, and `aria-expanded` updates remain intact.
- Behavior and responsiveness: passed. Every family was clicked at 1440 and 390 CSS pixels. All active detail, heading, description, and CTA bounds remained inside their panel, and neither viewport showed horizontal overflow. Arrow-key and Home/End navigation moved both active state and focus correctly.
- Motion regression: passed. Immediately after a category change, zero detail blocks remain visible; after the guarded 430 ms delay, exactly the current category's detail block appears. A rapid Wellness → Events switch revealed only Events, so the earlier squeezed outgoing-copy defect does not recur in the homepage integration.
- Browser console and assets: passed. No errors or warnings were recorded; all six panel images reported nonzero natural dimensions; JavaScript syntax and `git diff --check` passed for the preview files.

### Comparison history

- Earlier standalone motion pass [P1]: outgoing copy remained paintable while its panel collapsed and squeezed into a vertical stack.
  - Fix retained here: hide all outgoing detail regions before flex classes change; reveal only the current incoming details after 430 ms with an activation version guard; skip the delay for reduced-motion users.
  - Post-fix evidence: immediate and delayed DOM-state checks in the browser, the Rentals active screenshot, and the rapid Wellness → Events test described above.
- Full-homepage integration pass: no actionable P0, P1, or P2 design differences were found. The open sizing choice for the ownership-model group is an owner preference to evaluate in this contextual preview, not a fidelity or usability defect.

### Severity summary

- P0: none
- P1: none
- P2: none

### Follow-up polish

- [P3] After owner review, decide whether the Customer-Owned Goods, Rental Program, and hybrid prompt should reduce slightly as one coordinated group. Their current scale is intentionally unchanged in this first in-context pass.
- Customer-Owned Goods and Rental Program destination pages remain the next queued build. Until those routes exist, both preview rows use the working `pricing.html#factor-ownership` destination rather than dead placeholder links.

## Latest QA gate

The active gate is **Homepage Who We Serve integration preview**. Desktop and mobile visual comparisons, all six active states, keyboard behavior, rapid switching, asset loading, and console checks passed. The work remains local and has not been published.

final result: passed

## Pricing planning-summary centering v16

### Source evidence

- User reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_xy8Exn/Screenshot 2026-08-20 at 7.02.26 PM.png`.
- User direction: center the “What still matters” message and the “Program overview” heading/copy at every responsive size.

### Implementation evidence

- Local implementation: `/private/tmp/shelton-pricing-centered-summary-v16-desktop.jpg`.
- Reference / implementation comparison: `/private/tmp/shelton-pricing-centered-summary-comparison-v16.jpg`.

### Findings

- Both summary text groups now share a centered editorial axis at every viewport; the detailed rhythm and finish cards retain their existing reading alignment.
- Supporting copy uses balanced wrapping and centered max-width constraints, without changing the surrounding range, divider, or card geometry.
- The current compact rendering shows no clipping, collision, or horizontal overflow.
- All 20 canonical estimator regression groups and all 13 site-hardening tests pass. `git diff --check` passes.

### Severity summary

- P0: none
- P1: none
- P2: none

## Latest QA gate

The active gate is **Pricing planning-summary centering v16**. The requested text is centered globally, the visual comparison is complete, and all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Latest QA gate

The active gate is **Pricing range-dock persistence v15**. The lower-right range remains available through the service-location step and is suppressed only when the actual planning-range readout enters view. Desktop, compact, and mobile comparison checks are complete; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## 2026-08-20 - Estimator decision-trail reconciliation

### Source visual truth

- Tall ownership reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_ARrt7G/Screenshot 2026-08-20 at 12.36.58 PM.png` (1054 × 986 px).
- Supporting goods-density reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_L3YXXx/Screenshot 2026-08-20 at 12.35.46 PM.png` (1110 × 1136 px).
- Conversation decisions: Typical goods are the default; Customize goods starts blank; ownership is Own / Shelton supplies / Not sure with explanations on demand; the standalone Finish & Return chapter is removed; its derived rhythm, finish, and return information sits beneath the price; site access moves to optional precise-quote questions.

### Implementation evidence

- Local route: `http://127.0.0.1:8045/pricing.html?qa=estimator-reconcile-v11`.
- Desktop ownership capture: `/private/tmp/estimator-reconcile-desktop-ownership.png` (1440 × 1000 px; 1440 × 1000 CSS viewport, density 1).
- Normalized source / implementation comparison: `/private/tmp/estimator-ownership-comparison.png` (1464 × 720 px). Both panels are contained at 720 px wide on a navy divider canvas; the blank bands around the implementation are normalization padding, not page content.
- State: Hotel / Boutique Stay, Typical program (Sheets + Towels), customer-owned goods, 100 rooms, early central-San-Diego planning range.
- Full-view evidence: the desktop estimator renders the ownership chapter as three compact equal-width choices and keeps the live planning-range dock visible.
- Focused evidence: the combined comparison makes the removed Hybrid row, condensed card height, selected-state contrast, and collapsed ownership explanations readable without a second crop.

### Findings and comparison history

1. [P1 fixed] Ownership still used four tall explanatory rows and retained the rejected Hybrid path. It now uses three compact choices, with the explanations moved into a native disclosure.
2. [P1 fixed] Finish & Return remained a standalone numbered chapter. That chapter and anchor are removed; the route chapter is renumbered to 04, while derived cadence, item finish, and return format now live with the revealed range.
3. [P1 fixed] Site access remained in the basic route step. The basic route step now asks only for ZIP; access is inside the optional precise-quote disclosure.
4. [P1 fixed] A stale saved preview could leave the goods selector in Custom. The estimator state version advanced; a newly selected operation starts on its explicit Typical program, while Customize goods clears all selections.
5. [P2 fixed] Inherited chapter padding left the consolidated range and optional disclosure unnecessarily tall. Final overrides reduce ownership, program-overview, and precision-panel block padding without changing the Shelton grid, type, palette, or targets.

### Required fidelity surfaces

- Fonts and typography: existing Shelton serif/sans pair, weights, casing, and hierarchy are retained; no new font or substitute was introduced.
- Spacing and layout rhythm: ownership choices shrink to one compact row at desktop; the new program overview is two columns above 900 px and one column below; optional detail no longer inherits full-chapter padding.
- Colors and visual tokens: all surfaces use the existing navy, cream, gold, and line tokens; the selected ownership option retains cream copy on navy.
- Image quality and assets: no image, logo, or brand asset changed. The return recommendation is text-led and no longer uses icon tiles that resemble buttons.
- Copy and content: the factor rail now states four actual decisions, ownership explanations remain available on demand, and the optional disclosure clearly says the broad range is already usable.
- Behavior and accessibility: the early range appears after the first meaningful sizing answer, the ownership explanation uses native `details`/`summary`, the precision questions use labeled selects with skip states, and the old false-affordance return icons are absent.

### Verification

- 19 canonical estimator regression groups passed.
- 13 site-hardening regression tests passed.
- Pricing learning/config syntax checks and `git diff --check` passed.
- Browser DOM verification confirmed the four-step rail, three ownership radios, Typical Hotel goods, Custom blank behavior, early `$4,015–$6,915` range, consolidated service overview, and Site access inside the expanded optional disclosure.
- Console error verification and final compact/mobile screenshots could not be completed because the in-app browser denied further localhost access during the responsive pass. This is the remaining QA blocker; no alternate browser or raw automation workaround was used.

final result: blocked

## Pricing compact hierarchy, ownership guide, and Finish & Return v12

### Source of truth

- User-provided compact sizing reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Dfu4OW/Screenshot 2026-08-20 at 5.49.02 PM.png` (1046 × 946 px).
- User direction: center short labels and choices where appropriate on compact/mobile; remove the dead space and stray gray divider; make the ownership comparison substantially more useful, especially for Shelton-supplied programs; and present Finish & Return with icons that remain clearly informational.
- Canonical implementation: `dist/client/pricing.html`, `dist/client/assets/css/pricing-spine-concept.css`, and `dist/client/assets/js/pricing-learning.js`.

### Implementation evidence

- Compact sizing state, 1046 × 954 CSS-pixel viewport: `/private/tmp/shelton-pricing-compact-v12.png`.
- Focused compact sizing component: `/private/tmp/shelton-pricing-compact-focused-v12.png` (732 × 420 px).
- Source and implementation in one normalized comparison input: `/private/tmp/shelton-pricing-comparison-v12.jpg` (2112 × 954 px; reference at left, current implementation at right).
- Compact ownership disclosure, 1046 × 954: `/private/tmp/shelton-pricing-ownership-compact-v12.jpg`.
- Mobile ownership disclosure, 390 × 844: `/private/tmp/shelton-pricing-ownership-mobile-v12.jpg`.
- Desktop Program Overview / Finish & Return, 1440 × 900: `/private/tmp/shelton-pricing-finish-desktop-v12.jpg`.
- Preview route: `http://127.0.0.1:8045/pricing.html?qa=estimator-reconcile-v12#factor-ownership`.

### Findings

- The compact sizing answer no longer reserves a fixed-height question stage. The answer cards, navigation, and range status now form one compact vertical group; the large blank area reported in the source is removed.
- Short answer labels, question headings, and status copy are centered on compact/mobile where that improves balance. Long explanatory copy remains left-aligned for readability.
- The ownership disclosure now separates customer-owned, Shelton-supplied, and undecided paths. It explains responsibilities, fit, price drivers, review inputs, and the limits of the planning range. Shelton-supplied guidance receives the strongest detail and a restrained gold surface.
- The previous gray divider treatment is gone. The disclosure uses intentional spacing and the navy/gold/cream brand system.
- Finish & Return is now a derived program summary: each selected good receives a Phosphor item icon, and the return format uses a bag, cart, or package icon based on estimator state. The icons are decorative, use `aria-hidden`, retain `cursor: default`, and do not have card-like hover or selection behavior.
- No horizontal document overflow was present at 390, 1046, or 1440 px. The verified browser console contained no errors.
- `node --check` passed for the changed estimator script; all 19 canonical estimator regression groups and all 13 site-hardening tests passed; `git diff --check` passed.

### Comparison history

1. Removed the compact/mobile fixed minimum height that produced the reported dead zone.
2. Rebalanced short copy and selection text around a centered axis at compact/mobile widths.
3. Replaced the shallow ownership explainer with a real decision guide, emphasizing the Shelton-supplied program.
4. Removed the gray divider and highlighted the supplied model with a restrained brand-gold surface.
5. Rebuilt Finish & Return as noninteractive icon-led output and verified it at desktop, compact, and phone sizes.

### Severity summary

- P0: none
- P1: none
- P2: none

## Current QA gate

The pricing compact hierarchy, ownership guidance, and Finish & Return redesign are ready for owner review in the local preview. They have not been committed, pushed, or published.

final result: passed

## Pricing typical-program and compact custom-goods selector

### Source of truth

- User-provided oversized goods-card reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_L3YXXx/Screenshot 2026-08-20 at 12.35.46 PM.png`
- User direction: apply obvious goods automatically for a typical operation, but clear every selection when the customer chooses **Customize goods**; replace the tall text cards with smaller icon-led choices.

### Implementation evidence

- Desktop custom state: `/private/tmp/shelton-goods-custom-1110-v9.png`
- Compact typical state: `/private/tmp/shelton-goods-typical-900.png`
- Compact custom state: `/private/tmp/shelton-goods-custom-900.png`
- Phone custom states: `/private/tmp/shelton-goods-custom-390.png` and `/private/tmp/shelton-goods-custom-320.png`
- Local implementation: `http://127.0.0.1:8045/pricing.html?qa=starting-point-v7`

### Normalization and state

- Source image: 1110 × 1136 pixels, tightly cropped around the previous Hotel goods selector.
- Primary implementation capture: 1110 × 1136 pixels from an 1110 × 1136 CSS-pixel in-app-browser viewport at device scale 1.
- Comparison state: Hotel / Boutique Stay, custom-goods mode, no goods selected.
- The source crop does not include the surrounding estimator page, so the comparison judged the goods-card density, typography, borders, and selection structure rather than unrelated page chrome.
- The source and implementation were opened together in one combined comparison input. The focused goods-selector region was large enough for label, icon, spacing, and border inspection; no additional crop was needed.

### Comparison history

1. Source finding: six goods appeared as tall text-heavy cards in a single column, causing the selector to consume almost an entire screen.
2. First implementation: replaced the cards with a three-column icon grid, but inherited section padding left excessive blank space above and below the selector.
3. Fix: removed the inherited custom-panel padding while preserving 44-pixel-or-larger targets and the existing Shelton typography, cream, navy, and gold tokens.
4. Post-fix evidence: the custom panel measures 209 pixels high at 1110 CSS pixels, the 390- and 320-pixel views use a two-column grid, and document width equals viewport width at all checked widths.

### Required fidelity surfaces

- Fonts and typography: existing Cormorant Garamond display type and Inter interface labels are preserved; compact labels remain legible at 320 pixels and wrap only where needed.
- Spacing and layout rhythm: the selector changes from one tall card per row to three columns on desktop/compact and two columns on phone; inherited 112-pixel block padding was removed.
- Colors and tokens: the implementation uses the approved deep navy, cream, and gold variables; checked cards use navy with cream copy and gold icons/checks.
- Image and asset fidelity: no imagery or logo was replaced. Goods use the existing Phosphor icon library rather than handcrafted SVG, CSS drawing, emoji, or text-symbol substitutes.
- Copy and content: the typical state clearly says the common goods are ready; custom mode explicitly says nothing is preselected.

### Interaction and responsive findings

- Hotel initially shows a compact typical program containing only Sheets and Towels.
- **Customize goods** clears every preset good before revealing the icon grid.
- Selecting Towels produces a readable navy selected state with a visible check; **Use typical program** restores the Hotel preset.
- The custom grid contains six visible, individually labeled checkboxes and no horizontal overflow at 1110, 900, 390, or 320 pixels.
- The 320-pixel cards measure 88 × 54 CSS pixels, exceeding the 44-pixel minimum target height.
- The in-app browser console reported no warnings or errors.
- JavaScript syntax checks, `git diff --check`, and all 19 canonical `dist/client` estimator regression groups passed.

### Severity summary

- P0: none
- P1: none
- P2: none
- P3: none in this scoped goods-selection pass

## Current QA gate

The pricing typical-program and custom-goods interaction is ready for owner review in the local preview. It has not been committed, pushed, or published.

final result: passed

## 2026-08-17 - About story header and adaptive paragraph fit

### Source visual truth

- User-supplied desktop crop: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Rwh9gu/Screenshot 2026-08-17 at 6.29.37 PM.png` (1086 × 396 px at the captured 2× density).
- Visual target: at this desktop size, keep the story title and date together above the gold rule, preserve the title on one line by reducing its size only when necessary, and apply the same fit-to-available-space behavior to paragraph copy so no text can enter the lower woven band.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/about.html?qa=header-copy-fit-v21#about-history`.
- Browser-rendered desktop implementation: `/private/tmp/shelton-about-header-copy-fit-v21-1086.png` (1086 × 900 px from a 1086 × 900 CSS-pixel viewport).
- Browser-rendered wide desktop implementation: `/private/tmp/shelton-about-header-copy-fit-v21-1280.png` (1280 × 900 px from a 1280 × 900 CSS-pixel viewport).
- Browser-rendered compact implementation: `/private/tmp/shelton-about-header-copy-fit-v21-847.png` (847 × 1000 px from an 847 × 1000 CSS-pixel viewport).
- Browser-rendered phone implementation: `/private/tmp/shelton-about-header-copy-fit-v21-320-focused.png` (320 × 900 px from a 320 × 900 CSS-pixel viewport).
- Combined reference-and-implementation comparison: `/private/tmp/shelton-about-header-copy-fit-v21-comparison.png` (2196 × 450 px). The implementation is cropped and normalized to the source crop's 2× scale so the desktop header order can be judged in one image.
- State: About history with `The Family Reaches San Diego` expanded, matching the supplied screenshot's story.

### Findings and fixes

- [P2] The desktop grid placed the title in a third row below the gold rule. The title now occupies the first grid row with the date, and the gold rule is the second row beneath both.
- [P2] The header did not reserve the date width before measuring a long one-line title. The title column now uses `minmax(0, 1fr)` with an explicit responsive gap; the existing one-line fitter measures that real column and scales the title only when required.
- [P2] Paragraph size relied only on viewport clamping and had no final content-aware cutoff check. An adaptive multiline fitter now measures the active paragraph against the towel's band start on every open, resize, and font-ready event. It preserves the natural responsive size when the copy fits and binary-searches down only if the copy would breach the safe zone.
- Fonts and typography: Cormorant Garamond remains the story title face and Inter remains the paragraph face. The supplied 1950s title renders on one line at every checked width.
- Spacing and layout rhythm: moving the title into the first row shortens the header, so the photograph is drawn slightly closer to the rule. The photo, paragraph, and lower band retain a generous visual separation.
- Colors and visual tokens: the approved Shelton navy and gold tokens remain unchanged.
- Image quality and asset fidelity: the existing towel surface and historical photographs are unchanged. No brand or image asset was regenerated.
- Copy and content: all story dates, titles, paragraphs, alt text, and photograph assignments are unchanged.
- Interaction and accessibility: all nine stories were activated through their real buttons. `aria-expanded` and `aria-hidden` state management remains intact.

### Responsive verification

- All nine story states were checked at 320, 390, 620, 621, 760, 847, 861, 900, 1086, 1100, 1101, 1200, and 1280 CSS px, for 117 measured states.
- Every title produced exactly one rendered text rect. At desktop widths, the smallest title-to-date separation was 10.40 CSS px, and every title and date remained above the gold rule.
- The smallest measured paragraph-to-band clearance was 20.15 CSS px. The adaptive paragraph fitter kept the natural responsive size in all 117 states because the revised header freed enough space; its reduction path remains available for future longer copy.
- No checked width introduced horizontal document overflow.
- Browser console warnings and errors checked: none.
- Automated verification: all 23 repository tests pass; JavaScript syntax, source/`dist/client` HTML/CSS/JavaScript parity, and `git diff --check` pass.

### Comparison history

1. The supplied crop showed the date above the rule while the title began below it.
2. The desktop header was restructured so title and date share one fitted row above the rule.
3. The paragraph received a content-aware fit check tied to the visible band cutoff rather than copy length alone.
4. The combined source-and-implementation comparison confirms the requested title placement, while the 117-state matrix confirms one-line titles, safe paragraph clearance, and zero horizontal overflow.

final result: passed

## 2026-08-17 - About timeline photo color and paragraph band cutoff

### Source visual truth

- User-supplied paragraph-and-band crop: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_8hBoOe/Screenshot 2026-08-17 at 6.25.24 PM.png` (1130 × 206 px, representing approximately 565 × 103 CSS px at the captured 2× density).
- Visual target: preserve each historical photograph's native color when the source contains color, render the story paragraph in Shelton navy, and keep a deliberate text-safe zone between the final line and the woven towel band.
- The source crop shows a different story paragraph from the final implementation capture. The comparison is therefore normalized to the same towel width and bottom-of-copy/band surface, while copy wording and photograph subject are treated as intentionally different states.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/about.html?qa=photo-color-band-v20#about-history`.
- Browser-rendered compact implementation: `/private/tmp/shelton-about-photo-color-band-v20-viewport-847.png` (847 × 1000 px; 847 × 1000 CSS px at devicePixelRatio 1).
- Browser-rendered phone implementation: `/private/tmp/shelton-about-photo-color-band-v20-viewport-320.png` (320 × 900 px; 320 × 900 CSS px at devicePixelRatio 1).
- Browser-rendered desktop implementation: `/private/tmp/shelton-about-photo-color-band-v20-viewport-1200.png` (1200 × 1000 px; 1200 × 1000 CSS px at devicePixelRatio 1).
- Focused implementation crop: `/private/tmp/shelton-about-photo-color-band-v20-focus.png` (565 × 103 px; the compact towel's bottom paragraph line, reserved clear space, and woven band).
- Normalized source-and-implementation comparison: `/private/tmp/shelton-about-photo-color-band-v20-comparison.png` (2260 × 246 px). The 565 × 103 CSS-pixel implementation crop is upscaled 2× to 1130 × 206 px and placed beside the equal-pixel source crop in one comparison input.
- State: About history with `Shelton Launches Its Wholesale Department` expanded to verify a native-color photograph and a relatively long paragraph. `White Star Laundry Begins`, the longest paragraph, was separately activated for clearance measurements.

### Findings and fixes

- [P2] Every photograph was forced through a grayscale-and-sepia filter, including modern source files with meaningful color. The filter is removed. The 2019 exterior, 2023 garment rail, and 2026 plant images now retain their source color; genuinely black-and-white archive files remain naturally monochrome.
- [P2] Paragraph copy used a translucent brown-gray and could visually run into the woven band at compact widths. Paragraphs now use the approved timeline navy token `#081321` and compact stories reserve a responsive 32–41.6 CSS px bottom margin before the band.
- [P2] At the 861 px desktop transition, the longest paragraph cleared the band by less than one comfortable text line. The 861–1100 px composition now slightly reduces the photo height and photo-top gap, preserving the image while raising copy into a 19.82 CSS px minimum clear zone at the tightest desktop width.
- Fonts and typography: Cormorant Garamond titles and Inter paragraph metrics remain unchanged. One-line adaptive titles remain active and the checked 861 px story title produces one rendered text rect.
- Spacing and layout rhythm: towel widths, row geometry, year band, title inset, photo frame, and surface imagery remain unchanged. Only the space allocation above the lower woven band changes.
- Colors and visual tokens: paragraph text now maps directly to the approved Shelton navy token; gold, cream, and terry-white treatments remain unchanged.
- Image quality and asset fidelity: original history files are used directly with `filter: none`. No image, logo, icon, or brand asset was regenerated, recolored, or replaced.
- Copy and content: all dates, titles, paragraph wording, alt text, and photograph assignments are unchanged.
- Interaction and accessibility: real timeline buttons were used during verification. Active controls report `aria-expanded="true"`, active panels report `aria-hidden="false"`, and no horizontal overflow was introduced.

### Responsive verification

- The longest story was measured at 320, 390, 520, 620, 621, 760, 847, 861, 1087, and 1200 CSS px.
- Compact clear space between the copy bottom and visible band start ranges from 20.15 CSS px at 320 px to 27.17 CSS px at 621 px; the tight 861 px desktop transition retains 19.82 CSS px. No checked width lets paragraph text enter the band.
- The 320, 847, and 1200 browser captures visibly retain the 2023 garment photograph's native color. The 320 px capture also confirms the historical image remains painted and is not affected by the earlier compact transparency regression.
- All checked widths use `rgb(8, 19, 33)` for paragraph copy, `filter: none` for timeline photographs, and zero horizontal document overflow.
- Browser console warnings and errors checked: none.
- Automated verification: all 23 repository tests pass; JavaScript syntax, source/`dist/client` HTML/CSS parity, and `git diff --check` pass.

### Comparison history

1. The supplied source showed paragraph copy ending immediately above the woven band and requested native color plus a navy paragraph treatment.
2. The first browser measurement confirmed the forced grayscale filter, translucent brown-gray copy, and compact overlap ranging from approximately 1 to 14 CSS px depending on width.
3. Native image color and navy copy were restored, then a responsive text-safe margin was added. A follow-up check exposed the 861 px desktop transition as the remaining tight state.
4. The tight desktop composition was refined without changing the towel asset or copy. Post-fix captures and measurements show the paragraph fully above the band at phone, compact, and desktop widths.
5. The normalized side-by-side comparison confirms the updated navy paragraph, visible gap, and hard visual cutoff before the woven band. No actionable P0, P1, or P2 finding remains in this scope.

final result: passed

## 2026-08-17 - Responsive About towel-edge crop

### Source visual truth

- User crop at the narrow state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_rW9aF6/Screenshot 2026-08-17 at 4.57.48 PM.png` (186 × 312 px).
- User crop at the middle state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_jUJoDz/Screenshot 2026-08-17 at 4.57.56 PM.png` (90 × 210 px).
- User crop at the wider state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_PbbK82/Screenshot 2026-08-17 at 4.58.03 PM.png` (132 × 200 px).
- Visual target: keep the open towel's right edge anchored to the closed towel stack at every compact width, without a baked-in gold gutter changing the apparent crop.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/about.html?qa=towel-edge-v19c-847#about-history`.
- Browser-rendered phone implementation: `/private/tmp/shelton-about-towel-edge-final-v19-320.jpg` (320 × 900 px from a 320 × 900 CSS-pixel viewport).
- Browser-rendered compact implementation: `/private/tmp/shelton-about-towel-edge-final-v19-631.jpg` (631 × 900 px from a 631 × 900 CSS-pixel viewport).
- Browser-rendered wide compact implementation: `/private/tmp/shelton-about-towel-edge-final-v19-847.jpg` (847 × 900 px from an 847 × 900 CSS-pixel viewport).
- Focused normalized comparison: `/private/tmp/shelton-about-towel-edge-comparison-v19.jpg` (380 × 1320 px). Each supplied edge is paired with a 50 × 200 px implementation edge crop and displayed at 2× for inspection.
- State: About history with a real timeline row expanded; right edge, texture, shadow, title, photograph, copy, and the following closed rows all visible.

### Findings and fixes

- [P2] The compact story asset included its own gold side gutter, so scaling the image across differently sized story panels changed the perceived right-edge crop. The story surface now owns a consistent 2% horizontal inset, and the existing compact towel image is centered at 105.85% width to crop its baked side gutter while preserving its terry texture and rounded edge.
- [P2] The first gutter-free trial used the transparent story asset at every compact size. It visually aligned the edge, but the browser stopped painting the historical photograph at 320 px. The final implementation retains the reliable opaque compact surface and performs the crop in CSS instead; photographs render normally at all tested widths.
- Fonts and typography: Cormorant Garamond and Inter treatments are unchanged. All nine towel-row titles remain on one rendered line at 320, 631, and 847 px.
- Spacing and layout rhythm: the open towel's visible right inset is now proportional to the closed stack: 5.93 px at 320, 8.84 px at 631, and 11.87 px at 847. Row heights, year bands, title insets, and vertical accordion rhythm are unchanged.
- Colors and visual tokens: the existing cream, white, navy, and gold palette is unchanged; the visible side field comes from the page background instead of the raster's baked gutter.
- Image quality and asset fidelity: the approved compact terry asset is retained, but its side gutter is cropped. Historical photographs render at their existing sharpness, grayscale treatment, and crop. No logo or brand asset was altered.
- Copy and content: all history titles, dates, photographs, and story copy are unchanged.

### Responsive verification

- The open towel edge aligns with the closed row edges at 320, 631, and 847 CSS px, with no horizontal document overflow.
- The Family and Modern Plant rows were expanded using their real buttons; title sizing, photo rendering, story copy, and the following rows remain intact.
- Browser console errors checked: none.
- Automated verification: all 23 repository tests pass; JavaScript syntax, source/`dist/client` HTML/CSS parity, and `git diff --check` pass.

### Comparison history

1. The three supplied crops showed a P2 responsive edge inconsistency caused by the compact raster's baked gold gutter.
2. A transparent-surface trial removed the gutter but introduced a P2 small-screen paint regression: historical photographs appeared blank at 320 px.
3. The transparent trial was replaced with the reliable opaque compact asset, inset 2%, and overscanned 105.85% to crop only the baked gutter.
4. Final 320, 631, and 847 px captures show rendered photographs, one-line row titles, and the open towel edge aligned with the closed stack.
5. No actionable P0, P1, or P2 finding remains in this scope.

final result: passed

## 2026-08-17 - About timeline title clearance from towel band

### Source visual truth

- User-reported tight title inset: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_QaF8y6/Screenshot 2026-08-17 at 4.48.19 PM.png` (912 × 1026 px).
- Visual target: move every towel-row title a small, consistent distance to the right so the typography no longer encroaches on the woven year band, while preserving the one-line adaptive title behavior.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/about.html?qa=title-fit-v6#about-history`.
- Browser-rendered desktop implementation: `/private/tmp/shelton-about-title-inset-desktop-page-aligned.jpg` (1200 × 1100 px from a 1200 × 1100 CSS-pixel viewport).
- Browser-rendered phone implementation: `/private/tmp/shelton-about-title-inset-320.jpg` (320 × 900 px from a 320 × 900 CSS-pixel viewport).
- Focused normalized comparison: `/private/tmp/shelton-about-title-band-clearance-comparison.jpg` (1709 × 1082 px). The 912 × 1026 source crop is beside the matching seven-row implementation crop (392 × 531 px), scaled proportionally to 757 × 1026 px; the 56 px header identifies source and updated states.
- State: About history towel-row list showing the same 1950s through 2026 titles. The focused comparison isolates the rows because the supplied source is itself a cropped component view.

### Findings and fixes

- [P2] Row titles began immediately against the year-band boundary, making the letters visually compete with the woven vertical seam. A responsive clearance inset now adds 7–12 CSS px at compact/desktop widths and 6–8 CSS px on phones.
- Fonts and typography: Cormorant Garamond, title weights, line height, tracking, and the measured one-line fitting behavior are unchanged. The fitter automatically accounts for the reduced content width.
- Spacing and layout rhythm: only the title's left inset changed. Year placement, towel dimensions, row heights, arrows, and expanded-story geometry are unchanged.
- Colors and visual tokens: the approved navy and gold treatments are unchanged.
- Image quality and asset fidelity: the existing terry towel imagery and band crop are unchanged. No image, logo, icon, or brand asset was regenerated or replaced.
- Copy and content: all dates and timeline titles are unchanged.

### Responsive verification

- At 847 CSS px, all nine row titles render on one line with a measured 6.53 px clear gap beyond the year text boundary and no document overflow.
- At 320 CSS px, all nine row titles remain one rendered line and clear the towel band's right seam; the longest title scales within the newly reduced content width.
- The focused comparison shows the updated titles beginning visibly to the right of the woven band while preserving the towel texture and hierarchy.
- Browser console errors checked: none.
- Automated verification: all 23 repository tests pass; JavaScript syntax, source/`dist/client` HTML/CSS parity, and `git diff --check` pass.

### Comparison history

1. The supplied source showed a P2 spacing issue: title glyphs sat too close to the towel band's right edge.
2. A responsive clearance was added to the title inset without changing the year column or towel asset.
3. Post-fix browser measurements confirmed a positive compact gap, and the phone capture confirmed all titles remain on one line without horizontal overflow.
4. The normalized side-by-side comparison confirms the band now reads as a separate woven column.
5. No actionable P0, P1, or P2 finding remains in this scope.

final result: passed

## 2026-08-17 - One-line adaptive About timeline titles

### Source visual truth

- User-reported wrapped-title state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_lzsM0k/Screenshot 2026-08-17 at 4.47.08 PM.png` (1262 × 752 px).
- Visual target: both the active towel-row title and the expanded story title remain on one line; longer titles reduce in size while shorter titles retain stronger display scale.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/about.html?qa=title-fit-v5#about-history`.
- Browser-rendered compact implementation: `/private/tmp/shelton-about-all-titles-one-line-631.png` (631 × 900 px; 631 × 900 CSS px at devicePixelRatio 1).
- Browser-rendered phone implementation: `/private/tmp/shelton-about-all-titles-one-line-320.png` (320 × 900 px; 320 × 900 CSS px at devicePixelRatio 1).
- Focused normalized comparison: `/private/tmp/shelton-about-title-fit-comparison.png` (2540 × 752 px). The 1262 × 752 source is beside the first 631 × 376 CSS px of the implementation, upscaled 2× to the same 1262 × 752 pixel size.
- State: About history timeline with `Unit Laundry Takes Root in Tucson` expanded; the phone capture uses the longest title, `Shelton Launches Its Wholesale Department`.

### Findings and fixes

- [P2] The expanded Tucson heading wrapped to two lines even though the active towel-row title was intended to remain a single line. Both title surfaces now use measured single-line fitting. The script measures the rendered Cormorant text width after fonts load and whenever the viewport changes, then reduces only the titles that exceed their available content width.
- [P2] Applying the rule only to the expanded heading exposed the same wrapping risk in long towel-row labels. The same fitter now runs across all nine visible row titles and the currently expanded detail title.
- Fonts and typography: Cormorant Garamond, existing weights, line heights, and letter spacing are unchanged. At 631 px, `Shelton Cleaners Opens` keeps its natural 32.81 px detail size, the 33-character Tucson title fits at 27.82 px, and the 41-character wholesale title fits at 22.46 px.
- Spacing and layout rhythm: towel widths, internal padding, title alignment, photo position, row heights, and open/closed geometry are unchanged. Font size is the only responsive adjustment.
- Colors and visual tokens: existing navy, cream, white, and gold treatments are unchanged.
- Image quality and asset fidelity: the approved terry towel surfaces and historical photographs are unchanged. No image, logo, icon, or brand asset was regenerated or replaced.
- Copy and content: all timeline title text, dates, photographs, and story copy are unchanged.
- Interaction and accessibility: the existing semantic buttons, keyboard behavior, `aria-expanded`, `aria-hidden`, and active-panel logic remain intact. The Tucson and wholesale rows were activated through their real controls during verification.

### Responsive verification

- All nine trigger titles and the longest expanded title were verified at 320 CSS px with one rendered text line, no clipping, and no horizontal document overflow.
- The longest expanded title was also verified at 390, 520, 521, 620, 621, 760, and 847 CSS px. It remains one line across every tested breakpoint.
- The compact 631 px state verifies three length tiers: 22 characters at natural size, 33 characters at a medium fitted size, and 41 characters at the smallest fitted size.
- Browser console errors checked: none.
- Automated verification: all 23 repository tests pass; JavaScript syntax, source/`dist/client` HTML/CSS/JS parity, and `git diff --check` pass.

### Comparison history

1. The supplied screenshot showed a P2 detail-title wrap: the Tucson heading occupied two lines.
2. The first implementation fitted only expanded headings; browser comparison then exposed a two-line active towel-row label at the same compact width.
3. The fitter was generalized to both title surfaces and changed from element `scrollWidth` to a rendered text-range measurement so short titles keep their full natural size.
4. The final normalized comparison shows the Tucson row label and expanded title both on one line. The 320 px capture confirms the longest title also remains contained on one line.
5. No actionable P0, P1, or P2 finding remains in this scope.

final result: passed

## 2026-08-17 - Compact homepage proof-line rhythm

### Source visual truth

- User-reported uneven state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_GVjjzj/Screenshot 2026-08-17 at 4.02.11 PM.png` (914 × 360 px).
- Visual target: the three proof labels occupy three evenly spaced rows, with each gold separator centered between adjacent labels.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/index.html?qa=proof-line-spacing-v11#home-proof`.
- Browser-rendered compact implementation: `/private/tmp/shelton-proof-spacing-457.png` (457 × 800 px; 457 × 800 CSS px at devicePixelRatio 1).
- Browser-rendered phone implementation: `/private/tmp/shelton-proof-spacing-390.png` (390 × 800 px; 390 × 800 CSS px at devicePixelRatio 1).
- Focused normalized comparison: `/private/tmp/shelton-proof-spacing-comparison.png` (1844 × 360 px). The 914 × 360 source detail is beside a 457 × 180 CSS-pixel implementation crop upscaled 2× to 914 × 360, matching the source's apparent compact-view density and vertical region.
- State: homepage proof section at compact width, static three-line benefits list visible over the continuing garment photograph.

### Findings and fixes

- [P2] The list container carried 0.75rem top and bottom padding while each stacked row carried only 0.52rem vertical padding. That made the first and last bands approximately 43.5 CSS px tall and the center band approximately 31 CSS px tall. The compact list now has zero container padding and every row has the same 0.78rem vertical padding.
- Fonts and typography: the existing Inter family, weight, size, line height, and centered alignment are unchanged. All three labels remain on one line from 320 through 520 px.
- Spacing and layout rhythm: at 457 px, row centers are now separated by 39.05 and 39.55 CSS px; the half-pixel variance comes from one-pixel separators distributed across the browser pixel grid. The prior visibly oversized outer bands are gone.
- Colors and visual tokens: the existing navy text and muted brand-gold separators are unchanged.
- Image quality and asset fidelity: the existing continuous chef-coat/travertine photograph and its crop are unchanged. No image or Shelton brand asset was redrawn or replaced.
- Copy and content: all three approved benefit labels are unchanged.
- Interaction and accessibility: the benefits remain a semantic labeled list. The compact navigation was opened and closed successfully, with `aria-expanded` changing from `false` to `true` and back to `false`.

### Responsive verification

- Browser geometry was checked at 320, 390, 457, 520, 521, 620, 621, 760, and 847 CSS px.
- At 320 through 520 px, all three stacked rows remain equal within 0.5 CSS px, keep nowrap labels, and have no horizontal document overflow.
- At 521 through 847 px, the intended three-column treatment returns cleanly with centered labels and no horizontal document overflow.
- Browser console errors checked: none.
- Automated verification: all 23 repository tests pass; source and `dist/client` homepage HTML/CSS are byte-identical; `git diff --check` passes.

### Comparison history

1. The supplied reference exposed a P2 rhythm defect: the first and last bands were visibly taller than the middle band.
2. Container padding was removed only in the stacked mobile treatment, then redistributed evenly to all three rows.
3. The normalized side-by-side comparison shows equal vertical bands in the implementation while preserving the original copy, colors, imagery, and overall list height.
4. No actionable P0, P1, or P2 finding remains in this scope.

final result: passed

## 2026-08-17 — Continuous highlighted Services coverage map

### Source visual truth

- Label-only failed state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_b1zY5x/Screenshot 2026-08-17 at 4.01.04 PM.png` (2880 × 1800 px).
- Disconnected coverage and exclusion-hole failed state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_6TGfJJ/Screenshot 2026-08-17 at 5.07.48 PM.png` (382 × 306 px).
- Final verbal target: one continuous highlighted region covering all of San Diego County, Temecula, Temecula Wine Country, and southern Orange County, with no Borrego Springs exclusion.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/services.html?qa=service-area-coverage-v3#service-route-check`.
- Browser-rendered compact implementation: `/private/tmp/shelton-service-area-highlight-continuous-847.png` (847 × 900 px; 847 × 900 CSS px at devicePixelRatio 1).
- Browser-rendered phone implementation: `/private/tmp/shelton-service-area-highlight-continuous-390.png` (390 × 844 px; 390 × 844 CSS px at devicePixelRatio 1).
- Focused browser-rendered map crop: `/private/tmp/shelton-service-area-highlight-continuous-focused.png` (371 × 314 px).
- Normalized source-and-implementation comparison: `/private/tmp/shelton-service-area-source-implementation-comparison.png` (762 × 314 px). The 382 × 306 px failed-state source was center-cropped to 371 × 314 px and placed beside the equal-size implementation crop in one comparison input.
- State: Services route-review section, initial county-wide map view, facility marker visible.

### Findings and fixes

- [P1] The initial implementation added ten custom place labels but did not visualize the service area. All custom city and exclusion labels were removed. The map now renders one translucent brand-gold coverage layer over the no-label base map.
- [P1] The first highlighted attempt used separate region polygons and a Borrego Springs hole, producing disconnected lobes and an unserved cutout. The geometry is now one polygon with one outer ring, joining San Diego County to the Temecula/Wine Country and southern Orange County extensions without internal seams or holes.
- [P2] The service-area copy and accessible map name still described a Borrego Springs exclusion after the user's direction changed. Both now state all of San Diego County, plus the northern service extensions.
- Fonts and typography: the existing Cormorant Garamond and Inter system, sizing, line height, and hierarchy are unchanged. The service-area line wraps cleanly at compact and phone widths.
- Spacing and layout rhythm: the form/map split, map crop, facility-marker scale, and section spacing are unchanged. The continuous region remains fully within the map at every tested width.
- Colors and visual tokens: the coverage uses approved muted gold `#B8965A` at 34% fill opacity with a restrained deep-navy boundary; the base map remains neutral and legible.
- Image quality and asset fidelity: the existing CARTO/Leaflet map and approved Shelton facility avatar are retained. No logo, pin artwork, or map imagery was redrawn.
- Copy and content: the visible service line now reads `All of San Diego County, plus Temecula, Temecula Wine Country, and southern Orange County.` No city labels or exclusion wording remain on the map.
- Interaction and accessibility: the Leaflet facility marker remains keyboard-focusable and clickable, stays inside the map during the zoom interaction, and retains its descriptive title. The map region has an updated accessible name describing the continuous coverage.

### Responsive verification

- Browser geometry was checked at 847, 760, 620, 430, 390, and 320 px.
- Every checked width renders exactly one service-area path, zero custom city-label markers, and no horizontal document overflow.
- The facility marker remains inside the map at every checked width.
- Facility-marker click-to-zoom was exercised successfully; the marker remained visible and contained afterward.
- Browser console errors checked: none.
- Automated verification: all 22 repository tests pass, including the focused launch-readiness suite at 11 of 11; JavaScript syntax, source/`dist/client` parity, GeoJSON structure, and `git diff --check` pass.

### Comparison history

1. The first supplied screenshot showed an unhighlighted base map populated with labels the user did not request.
2. A first correction replaced the labels with three highlighted polygons and retained a Borrego Springs hole. The user rejected the visibly separate pieces and asked to include all of San Diego County.
3. The final geometry was rebuilt as one continuous polygon with no interior hole. Copy and accessible naming were updated to include all of San Diego County.
4. The normalized focused comparison visibly shows the separate lobes, internal borders, and exclusion hole removed. The compact and phone browser captures show the continuous layer contained with the facility pin correctly stacked above it.
5. No actionable P0, P1, or P2 finding remains in this scope.

final result: passed

## 2026-08-17 — About timeline towel texture and crop refinement

### Source visual truth

- User-supplied mismatch: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_oyotGL/Screenshot 2026-08-17 at 3.48.48 PM.png` (1726 × 1136 px).
- Texture reference: the tightly looped white terry visible on the stacked timeline towels in that screenshot.
- Geometry reference for the right-hand towel: `assets/images/generated/about-timeline-story-towel-transparent-surface-v4.png`; its silhouette, rounded corners, side thickness, lower hem, edge shading, and alpha mask were treated as locked.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/about.html?qa=towel-texture-v2#about-history`.
- Browser-rendered compact implementation: `/private/tmp/shelton-about-towels-after-847-top.jpg` (847 × 727 px; 847 × 727 CSS px at devicePixelRatio 1).
- Browser-rendered phone implementation: `/private/tmp/shelton-about-towels-after-390.jpg` (390 × 844 px; 390 × 844 CSS px at devicePixelRatio 1).
- Browser-rendered final right-towel asset: `/private/tmp/shelton-about-right-towel-v5-browser.jpg` (847 × 727 px; displayed at devicePixelRatio 1).
- Full source-and-implementation comparison board: `/private/tmp/shelton-about-towel-source-implementation-comparison.png` (2597 × 1136 px). The source screenshot and both browser-rendered implementation regions are present in one comparison input.
- Focused old/new texture comparison: `/private/tmp/shelton-about-right-towel-texture-comparison.png` (2080 × 1270 px). Both towel assets are normalized to their native 1028 × 1270 px geometry before comparison.
- State: About history timeline with the default `The Family Reaches San Diego` row expanded. `White Star Laundry Begins` was also expanded and restored to verify the row interaction.

### Findings and fixes

- [P1] The right-hand open towel used an oversized embossed loop pattern that did not match the stacked towels' dense, fine terry pile. The face and lower hem were retextured with short, irregular cotton loops at the stacked towels' apparent scale. The original alpha mask was reapplied pixel-for-pixel, preserving the exact silhouette and transparent edges.
- [P2] The horizontal stacked-towel raster ended too close to its rounded side edges, making the fold/shadow detail look cropped. The existing row artwork is now placed in a wider transparent canvas with 38 px safety gutters on both sides. The visible row geometry, height, and texture are unchanged.
- Fonts and typography: the existing Cormorant Garamond and Inter typography, weights, wrapping, and hierarchy are unchanged.
- Spacing and layout rhythm: the timeline positions and row proportions are unchanged. The new transparent gutters protect the rounded row ends without altering the CSS box geometry.
- Colors and visual tokens: the approved navy, cream, gold, and white balance are unchanged. The new terry surface keeps the prior neutral studio lighting and edge shading.
- Image quality and asset fidelity: the new vertical towel uses a dense, realistic short-loop terry treatment with no oversized embossed squiggles, checkerboard residue, transparency halo, logo, or CSS-drawn substitute. The row artwork remains the existing approved raster with crop-safe transparent padding.
- Copy and content: unchanged.
- Icons and brand assets: unchanged; no Shelton mark or lockup was redrawn or modified.
- Interaction and accessibility: both tested timeline buttons update their expanded state and content correctly. Existing semantic buttons and `aria-expanded` behavior remain intact.

### Responsive verification

- Browser geometry was checked at 847, 760, 621, 620, 430, 390, and 320 px.
- At every checked width, the timeline stage and all rows remain contained, share the same left and right edges, and produce no horizontal document overflow.
- The in-app browser window available for this pass tops out at 847 CSS px, so the full 861 px-and-wider desktop composition could not be captured as a page screenshot. The changed desktop rule only replaces the image URL; the rendered replacement was browser-verified directly at full asset scale, and its dimensions and alpha mask match the previous asset exactly. This is a residual P3 capture gap, not an actionable layout mismatch.
- Browser console errors checked: none.
- Automated verification: all 22 repository tests pass; the focused launch-readiness suite passes 11 of 11; source and `dist/client` HTML, CSS, and generated assets are byte-identical; `git diff --check` passes.

### Comparison history

1. The supplied screenshot exposed a P1 texture mismatch on the open right towel and a P2 edge-crop refinement on the stacked rows.
2. The first generated towel edit matched the requested terry character but included a baked checkerboard outside the towel. It was not accepted as the implementation asset.
3. The generated towel was cropped to the useful image area, resized to the locked 1028 × 1270 geometry, and given the original towel's alpha mask pixel-for-pixel. The stacked-row asset received transparent side safety gutters.
4. The focused old/new comparison shows the large embossed loops replaced by fine terry while the original towel outline, lower hem, and shading remain aligned. The combined source/implementation comparison shows the stacked row ends fully contained and the retextured right towel at browser-rendered scale.
5. The corrected page was tested at compact and phone sizes, row interactions were exercised and restored, and no actionable P0, P1, or P2 mismatch remains in this scope.

### Follow-up polish

- [P3] Capture the full desktop timeline in a browser surface wider than 860 CSS px when that surface is available; no code change is currently indicated.

final result: passed

## 2026-08-17 — Pricing route controls centered at every responsive size

### Source visual truth

- User-reported misaligned state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_7rxUEk/Screenshot 2026-08-17 at 3.46.42 PM.png`
- The screenshot shows the route recommendation and site-access controls displaced to the right of the page centerline at the compact desktop size, with the third access choice falling outside the visible crop.

### Implementation evidence

- Updated local route: `http://127.0.0.1:4183/pricing.html#factor-route`
- Browser-rendered implementation: `/private/tmp/shelton-pricing-centering-after-872.png`
- Full normalized side-by-side comparison: `/private/tmp/shelton-pricing-centering-comparison-872.png`
- Focused controls comparison: `/private/tmp/shelton-pricing-centering-focused-comparison-872.png`
- Mobile implementation check: `/private/tmp/shelton-pricing-centering-390.jpg`
- Viewport and density: implementation captured at 872 × 1232 CSS px with `devicePixelRatio: 1`; resulting implementation image is 872 × 1232 px. The source is 872 × 1232 px, but its CSS viewport and density are not embedded. The comparison uses the equal source and implementation pixel dimensions without rescaling.
- State: Pricing, Section 05 Location & Route, recommendation pending, `Use recommendation` selected, and default `Standard or not sure` site access selected.

### Findings and fixes

- [P1] At 861–1199 px, the route row remained a two-track grid while both interactive blocks were explicitly placed in track one. The supplied 872 px state therefore centered the controls within the left track instead of the page. The compact-shell centering rule now spans both controls across `grid-column: 1 / -1` through 1199 px, preserves `width: 100%`, and centers the site-access legend.
- [P2] The three site-access choices could form an unbalanced compact grid, making the last option appear cut off or orphaned. The 761–1199 px range now keeps all three options in one equal-width row; 760 px and below retains the established single-column mobile stack.
- Fonts and typography: the existing Cormorant Garamond and Inter hierarchy, weights, line heights, and letter spacing are unchanged. The centered layout gives the labels their intended wrapping space.
- Spacing and layout rhythm: recommendation, cadence, action, site-access legend, and access choices share the exact viewport centerline. At 872 px their measured center is 436 px, and the three access cards are equal at 173.4 px wide and 116.5 px high.
- Colors and visual tokens: the approved navy, cream, gold, and neutral border tokens are unchanged.
- Image quality and asset fidelity: the approved Shelton header lockup remains the supplied brand asset; no logo, icon, image, or decorative asset was redrawn.
- Copy and content: unchanged.
- Interaction and accessibility: the native site-access radio group was switched to `Limited loading hours or access`, verified selected, and restored to `Standard or not sure`. Existing labels and keyboard-native radio behavior remain intact.

### Responsive verification

- Browser geometry was checked at 1200, 1199, 1081, 1080, 981, 980, 872, 861, 860, 761, 760, 621, 620, 430, 390, and 320 px.
- At every width, the route row, recommendation card, cadence control, site-access group, and site-access list share the viewport centerline exactly.
- No tested width has horizontal document overflow.
- The access choices remain three equal columns from 761 through 1199 px and become one full-width column at 760 px and below.
- Browser console errors checked: none.
- Automated verification: all 23 repository tests pass; source and `dist/client` pricing HTML/CSS copies are byte-identical; `git diff --check` passes.

### Comparison history

1. The source screenshot showed the compact route controls centered within the wrong grid track and the access options continuing beyond the visible page area.
2. The initial browser measurement at 872 px placed the affected controls at x = 297.7 px while the viewport center was x = 436 px.
3. The controls were expanded across both compact grid tracks, and the three-option compact row was stabilized.
4. The post-fix 872 px measurement places every affected control at x = 436 px. The normalized full-view and focused comparison boards show the former offset removed, all three access choices visible, and the complete route card contained inside the centered page shell.
5. No actionable P0, P1, or P2 mismatch remains in the repaired scope.

final result: passed

## About towel timeline realism and copy

## 2026-08-17 — Services route area and facility pin containment

### Source visual truth

- Missing service-area wording and map state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_lHa7d5/Screenshot 2026-08-17 at 3.44.54 PM.png`
- Mis-layered facility pin state: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_v9mlfM/Screenshot 2026-08-17 at 3.46.06 PM.png`
- Verbal target: all of San Diego County except Borrego Springs, plus Temecula, Temecula Wine Country, and southern Orange County.

### Evidence and state

- Source screenshots are 1864 × 1164 px and 2270 × 788 px.
- The screenshots are cropped browser views. Their CSS viewport sizes and device densities cannot be inferred reliably.
- State: Services route section, with the second screenshot showing the facility pin over the fixed navigation instead of inside the map.
- Updated local route: `http://127.0.0.1:4183/services.html`.
- A post-fix browser-rendered implementation screenshot is not available in this task, so there is no valid full-view or focused side-by-side comparison yet.

### Findings and fixes

- [P1] The facility pin was a sibling button positioned from Leaflet pixel coordinates. During resize it could leave the map and overlap the fixed navigation. The pin is now a native Leaflet marker inside the marker pane, with the approved Shelton avatar asset retained. Its position, clipping, keyboard focus, and click-to-zoom behavior are owned by the map.
- [P1] The route section did not state the actual service footprint. It now includes a dedicated branded service-area line: all of San Diego County except Borrego Springs, plus Temecula, Temecula Wine Country, and southern Orange County. The map label set and accessible map description now include the added northern service areas and the Borrego Springs exclusion.
- Fonts and typography: the existing Inter and Cormorant system is unchanged; the new line uses the established small uppercase gold label and restrained body weight.
- Spacing and layout rhythm: the new coverage line uses the existing copy width and divider rhythm, and collapses from two columns to one below 620 px.
- Colors and visual tokens: the approved navy, cream, and gold tokens are reused without introducing a new color.
- Image quality and asset fidelity: the marker continues to use `shelton-social-avatar-dark.svg` from the approved brand source. No logo was redrawn or approximated.
- Copy and content: the stated coverage matches the user's supplied area and distinguishes the Borrego Springs exclusion from the added Temecula and southern Orange County regions.

### Comparison history

1. The first source screenshot showed no precise service-area statement.
2. The second source screenshot showed the facility pin above the map, overlapping the Services navigation item.
3. The copy, map labels, bounds, accessible description, and marker implementation were corrected.
4. JavaScript syntax, 23 automated tests, source/deploy parity, and diff checks pass.
5. Post-fix visual comparison remains pending until the refreshed Services route section is captured.

### Required follow-up comparison

- Refresh `services.html`, scroll to the route section, and capture the complete copy-and-map card at the same wide state as the supplied screenshots.
- Confirm the service-area line wraps cleanly, Temecula and southern Orange County remain represented, Borrego Springs is visibly marked outside the area, and the facility pin never leaves the map while resizing.
- Compare the refreshed full card and a focused pin/map crop against the two supplied source states.

final result: blocked

## 2026-08-19 - About towel asset repair, integrated crop, typography, and concise titles

### Source visual truth

- Live missing-towel evidence: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_cQfXDn/Screenshot 2026-08-19 at 11.07.57 AM.png`.
- Earlier visible-stack reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_QaF8y6/Screenshot 2026-08-17 at 4.48.19 PM.png`.
- The user's written refinements are part of the target: remove the visible transparent gray-white crop fringe, use a more suitable paragraph face, and shorten the 1981 and 2023 titles.

### Implementation evidence

- Desktop focused capture: `/private/tmp/about-towel-implementation-v22.png`, 1238 × 672 pixels from a 1238 × 672 CSS viewport at density 1.
- Compact capture: `/private/tmp/about-towel-implementation-v22-compact-700.png`, 700 × 1100 pixels from a 700 × 1100 CSS viewport at density 1.
- Mobile capture: `/private/tmp/about-towel-implementation-v22-mobile-390.png`, 390 × 844 pixels from a 390 × 844 CSS viewport at density 1.
- State: `The Family Reaches San Diego` open by default; `Imperial Cleaners Opens` and `Wholesale Department Launches` were also opened and verified.
- Full-view evidence: desktop, compact, and mobile captures show the physical towel system restored with no horizontal overflow.
- Focused comparison evidence: the live missing-towel source and the 1238 px repaired implementation were opened together in one comparison input. The source shows floating labels on beige; the implementation shows every label integrated into a continuous white terry stack.

### Findings and comparison history

1. [P1 fixed] The deployed stylesheet referenced two production towel assets that were present locally but absent from the committed deployment source. The repaired production output now includes both referenced assets.
2. [P2 fixed] The closed towel raster's transparent side margin exposed a detached gray-white fringe. The background crop now trims that margin inside the towel composition while retaining the rounded ends, band, terry texture, and contact shadows.
3. [P2 fixed] The sans-serif story paragraph felt disconnected from the editorial history treatment. Story copy now uses Cormorant Garamond in navy with a measured body weight and responsive fit rules.
4. [P2 fixed] The 1981 and 2023 titles were unnecessarily long. Both visible responsive renderings now use `Imperial Cleaners Opens` and `Wholesale Department Launches`.
5. Post-fix checks at 1440, 1238, 700, and 390 px show no horizontal overflow, missing towel artwork, title clipping, or console errors. Keyboard-compatible button semantics and ARIA expanded states remain intact.

### Required fidelity surfaces

- Fonts and typography: approved Cormorant Garamond now carries both timeline headings and story copy; adaptive sizing keeps copy above the woven band.
- Spacing and layout rhythm: the existing desktop split composition and compact stacked composition are preserved.
- Colors and tokens: navy, cream, white, and muted gold remain unchanged.
- Image quality and asset fidelity: existing terry assets are restored at source resolution; the transparent fringe is hidden by placement rather than replaced with an invented asset.
- Copy and content: only the two owner-requested display titles changed; historical story copy and locations remain intact.

### Interaction and console checks

- Both renamed rows open correctly, set `aria-expanded="true"`, and expose their associated panels with `aria-hidden="false"`.
- No browser warnings or errors were recorded during the desktop, compact, mobile, or interaction checks.

final result: passed

## 2026-08-19 - About towel divider and spacing refinement

### Source visual truth

- User reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Xm6eY4/Screenshot 2026-08-19 at 11.49.12 AM.png`.
- Requested changes: carry the desktop gold divider between title and photograph into the compact composition, and improve the full-size vertical rhythm.

### Implementation evidence

- Full-size desktop: `/private/tmp/about-towel-spacing-v23-desktop-1440.png`, 1440 × 1100 CSS pixels.
- Compact: `/private/tmp/about-towel-spacing-v23-compact-700.png`, 700 × 1100 CSS pixels.
- Mobile: `/private/tmp/about-towel-spacing-v23-mobile-390.png`, 390 × 844 CSS pixels.
- The reference plus all three implementation captures were opened together for visual comparison.

### Findings

1. [P2 fixed] Compact and mobile open towels now show the existing one-pixel muted-gold rule between the fitted title and photograph.
2. [P2 fixed] Full-size stories use a more deliberate title-to-rule, rule-to-photo, and photo-to-copy cadence without moving copy toward the woven cutoff.
3. The 1440 px story retains more than 200 px of lower-towel safety space after the paragraph, so longer story copy remains protected from the woven band.
4. The divider was measured between the title and photograph at both 700 and 390 px; it renders in the approved gold and remains full width inside the towel content inset.
5. No horizontal document overflow was present at 1440, 700, or 390 px. Source and `dist/client` HTML and CSS copies remain byte-identical.
6. Launch-readiness tests passed 11 of 11 and `git diff --check` passed.

### Required fidelity surfaces

- Typography, towel crops, images, responsive title fitting, story copy, color palette, and interaction behavior are unchanged.
- Only the requested divider visibility and spacing rhythm changed.

final result: passed

## 2026-08-19 - About full-size towel lower-space correction

### Source visual truth

- User-provided focused issue crop: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_4vqDhQ/Screenshot 2026-08-19 at 12.10.02 PM.png`, 914 × 570 pixels.
- Intent: preserve the approved compact towel and reduce the excessive empty full-size field below the story paragraph.

### Implementation evidence

- Desktop split layout: `/private/tmp/about-towel-spacing-v25-full-1087.png`, 1087 × 1100 CSS viewport, density 1.
- Wide desktop split layout: `/private/tmp/about-towel-spacing-v25-wide-1800.png`, 1800 × 1200 CSS viewport, density 1.
- Compact regression check: `/private/tmp/about-towel-spacing-v25-compact-700.png`, 700 × 1100 CSS viewport, density 1.
- State: `Shelton Linen & Uniform Services` open. The reference crop and all implementation captures were opened in one comparison input.

### Findings and comparison history

1. [P2 fixed] The first spacing pass only affected viewports above 1100 px, while the user's full split view sat inside the 861–1100 px desktop range. The same spacing correction is now applied intentionally to that range.
2. [P2 fixed] At 1087 px, the photograph is modestly taller, the story begins with a 21.9 px photo-to-copy gap, and the paragraph now ends 64.6 px above the woven cutoff instead of leaving the large dead field shown in the source crop.
3. All nine stories were opened at 1087 px. Every paragraph retained its natural 14.35 px type size, remained at least 61.3 px above the woven cutoff, and reported the correct expanded ARIA state.
4. The 1800 px wide layout retains 86.6 px of band safety with natural 19.2 px story type. No horizontal overflow appears at 1087, 1800, or 700 px.
5. The approved compact composition, including the thin gold title divider, is unchanged at 700 px.

### Required fidelity surfaces

- Fonts and typography: unchanged; all story copy remains at its natural responsive size.
- Spacing and layout rhythm: corrected only in desktop split layouts; compact remains locked.
- Colors and tokens: unchanged navy, cream, white, and muted gold.
- Image quality: existing photographs, crops, towel surfaces, and shadows remain intact.
- Copy and content: unchanged.

### Verification

- Source and `dist/client` HTML and CSS mirrors are byte-identical.
- Launch-readiness tests passed 11 of 11 and `git diff --check` passed.

final result: passed

## Services wording and quote select polish

### Source of truth

- Services wording reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_7ItS0Q/Screenshot 2026-08-16 at 8.36.40 PM.png`
- Quote form baseline: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_5ALxDX/Screenshot 2026-08-16 at 8.37.55 PM.png`
- Rounded dropdown reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_yifynZ/Screenshot 2026-08-16 at 8.38.29 PM.png`

### Implementation evidence

- Desktop quote verification, 1440 px: `/private/tmp/shelton-quote-select-gridfix-1440.png`
- Mobile quote verification, 390 px: `/private/tmp/shelton-quote-select-gridfix-390.png`

### Findings

- The Services hero CTA now reads `Explore the services` with the rest of its design unchanged.
- All four quote selects retain native form semantics while using one rounded cream field treatment, explicit readable typography, restrained depth, and an aligned decorative caret.
- The caret remains visually correct after the native popup closes because focus changes only its color, not its direction.
- The controls were checked at 1440, 1080, 900, 760, 621, 620, 430, 390, and 320 px. Every field remains full width within its label, every placeholder fits, and no horizontal document overflow occurs.
- Long selected values use contained ellipsis only where the available mobile or compact width requires it.
- Keyboard typeahead, Tab order, focus styling, required-field validation, error association, and URL-prefill behavior remain intact.
- Source and `dist/client` copies are byte-identical. Quote configuration, syntax, and diff checks pass.

## Compact alignment and archive stability pass

### Source of truth

- Services single-line label reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_cvMJAm/Screenshot 2026-08-16 at 8.41.12 PM.png`
- Who We Serve centered stack reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Lljatt/Screenshot 2026-08-16 at 8.42.53 PM.png`
- Pricing recommendation reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_9mSggB/Screenshot 2026-08-16 at 8.45.06 PM.png`
- Pricing site-access reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_X0qFaQ/Screenshot 2026-08-16 at 8.45.12 PM.png`
- Quote closing-card reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Me1Ml0/Screenshot 2026-08-16 at 8.47.28 PM.png`
- About archive interaction reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_A83gOH/Screen Recording 2026-08-16 at 8.46.22 PM.mov`

### Implementation evidence

- Services, 760 px: `/private/tmp/shelton-compact-pass-20260817/services-760.png`
- Who We Serve, 760 px: `/private/tmp/shelton-compact-pass-20260817/industries-760.png`
- Who We Serve mobile edge check, 320 px: `/private/tmp/shelton-compact-pass-20260817/industries-320.png`
- Pricing recommendation, 760 px: `/private/tmp/shelton-compact-pass-20260817/pricing-recommendation-760.png`
- Pricing site access, 760 px: `/private/tmp/shelton-compact-pass-20260817/pricing-access-760.png`
- Quote closing card, 760 px: `/private/tmp/shelton-compact-pass-20260817/quote-760.png`
- About archive wall, 860 px: `/private/tmp/shelton-compact-pass-20260817/about-860.png`

### Findings

- Services proof labels remain on one line from 860 px through 320 px without overflow. The desktop treatment at 861 px and above remains unchanged.
- Who We Serve cards center their eyebrow, title, lead copy, and CTA only after the composition stacks at 820 px. Fact lists remain left aligned for readability.
- The 320 px Who We Serve min-content overflow is resolved without changing larger breakpoints.
- Pricing recommendation and site-access controls span the full route section and center at 860 px and below. The 861 px desktop composition remains unchanged.
- The Quote closing card centers its heading, body copy, and CTA at 860 px and below. The 861 px desktop composition remains unchanged.
- The About archive wall now uses the approved stable photo grade and paint containment at 621 through 860 px, matching the established desktop behavior. Mobile keeps its separate manual strip treatment at 620 px and below.
- Source and `dist/client` mirrors are byte-identical for every production file changed in this pass.
- No tested page introduced horizontal document overflow, clipped copy, or runtime errors.

### Breakpoint matrix

- Services: 861, 860, 821, 820, 760, 721, 720, 621, 620, 430, 390, 340, and 320 px.
- Who We Serve: 821, 820, 760, 621, 620, 390, and 320 px.
- Pricing and Quote: 861, 860, 760, 620, 390, and 320 px.
- About archive: 901, 900, 861, 860, 621, 620, 390, and 320 px.

### Severity summary

- P0: none
- P1: none
- P2: none

final result: passed

## 2026-08-17 — Homepage fold continuity and About mobile towel parity

### Source visual truth

- Homepage requirement and failed-state evidence: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_6mENlB/Screenshot 2026-08-17 at 2.44.17 PM.png`
- Homepage duplicate-motion evidence: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_4qLbwl/Screen Recording 2026-08-17 at 3.08.40 PM.mov`
- Homepage responsive-cut evidence: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_ImvKt7/Screen Recording 2026-08-17 at 3.29.15 PM.mov`
- Homepage compact breakpoint current-state reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_ozJG68/Screenshot 2026-08-17 at 3.43.07 PM.png`
- Homepage centered proof target: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_vnaksd/Screenshot 2026-08-17 at 3.43.31 PM.png`
- About mobile failed-state evidence: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_ozmHgY/Screenshot 2026-08-17 at 2.44.42 PM.png`
- About compact composition reference: the approved 621–860 px folded-row proportions and hierarchy in `assets/css/about-towel-timeline.css`; the archived instruction was to carry those compact qualities into the usable phone width, not to shrink the phone stage to 70%.

### Implementation evidence

- Updated local routes: `http://127.0.0.1:4183/index.html` and `http://127.0.0.1:4183/about.html`.
- A fresh browser-rendered implementation screenshot is not yet available. The user must refresh the existing in-app preview and capture the corrected regions.
- Target states: Home at the viewport used in the supplied fold screenshot; About at the phone viewport used in the supplied towel screenshot.
- Source screenshot pixel dimensions: Home crop 1156 × 528; About mobile 870 × 1148. CSS viewport size and density cannot be inferred reliably from the cropped images.
- Responsive failure contact sheet extracted from the supplied 12.117-second Firefox recording: `/private/tmp/shelton-home-cut-contact-sheet.jpg` (1260 × 1440). Its 13 full-screen source frames are 2880 × 1800 at display density; browser chrome and continuously changing window width prevent false CSS-viewport precision.
- Compact layout reference board: `/private/tmp/shelton-home-compact-breakpoint-reference.jpg`. It places the user-supplied side-column compact state and centered target composition together after cropping both Firefox page regions. The two source screenshots are 2880 × 1800; they intentionally show different viewport widths because the requested change is to activate the narrower composition at the wider compact breakpoint.

### Findings and fixes

- [P1] The Homepage photo container ended before the folded hem reached its lowest edge, exposing a navy gap above the physical fold. Two attempted corrections still rendered a second copy of the photograph in the transition, which created a separate crop and movement coordinate system. The transition is now inside the original `.home-opening`, so the single original photo element spans the hero, proof, and fold. The fold PNG is only an overlay; no transition pseudo-element or background renders another photo.
- [P1] The responsive recording exposed two later cuts after the desktop correction: from 621–860 px, the compact scene retained its old fixed height and ended before the fold's transparent upper field; at 620 px, the fold was deliberately removed and the page switched to a horizontal photo-to-navy edge. The compact scene height now includes the full fold span, and the same photographed fold remains active through phone widths. At 620 px and below, the fold keeps its source asset's 8:3 ratio so the asset is not cropped or stretched.
- [P1] The compact proof still held the copy in a 52%-wide right column until 620 px, even though the supplied compact screenshot shows that composition already feeling squeezed. The user selected the phone-width centered proof as the target at that earlier size. The full-frame centered overlay, 100% copy width, centered hierarchy, and taller proof crop now activate at 860 px and below; the separate 621–860 px side-column override has been removed.
- [P1] The first correction incorrectly treated compact parity as a 70%-wide phone stage. That made the phone component narrower and its towels proportionally thicker. The phone stage is restored to its usable near-full width, while folded rows now use `clamp(2.75rem, 12vw, 3.55rem)`, matching the compact row aspect at normal phone widths. Phone type and arrow sizes remain proportionally reduced so the hierarchy fits those slimmer folds.
- Fonts and typography: the approved Cormorant Garamond treatment is retained; phone scale was reduced only to preserve wrapping inside the corrected towel width.
- Spacing and layout rhythm: the mobile towel stage is centered and keeps usable phone width; its folded-row height-to-width ratio now matches compact. The Homepage program section overlaps only the lower fold exit while the photo and fold stay in the same opening container.
- Colors and visual tokens: the approved navy, cream, and gold tokens are unchanged.
- Image quality and asset fidelity: existing approved raster assets are reused; no replacement logo, icon, gradient approximation, or synthetic texture was introduced.
- Copy and content: unchanged.

### Comparison history

1. The user-supplied failed-state screenshots identified the two P1 mismatches.
2. The first correction used a separately cropped full transition background and narrowed the phone towel stage to 70%. The user rejected both results.
3. The archived instructions were retrieved and the implementation was revised to preserve the usable phone width while matching compact fold proportions.
4. A second Homepage correction still used a separately rendered extension. The user's recording showed the original and extension moving differently, proving that approach could not satisfy the one-photo requirement.
5. The duplicate Homepage rendering was removed. The transition now lives inside the original photo container and the regression check rejects any second photo background in the transition.
6. The 3:29 PM responsive recording showed the desktop treatment holding, followed by a cream wedge in compact and a hard horizontal navy cut on phone.
7. The compact photo container was extended through the fold, and the fold-removal phone rule was replaced with a ratio-preserving phone fold using the same underlying image.
8. Source/deploy copies are byte-identical, all 21 automated tests pass, and `git diff --check` passes.
9. The 3:43 PM screenshot pair selected the centered phone proof composition as the target for the wider compact breakpoint.
10. The 52%-wide compact copy override was removed and the centered composition was extended through 860 px; source/deploy copies remain byte-identical and all 21 automated tests pass.
11. Post-fix side-by-side visual comparison is pending because no fresh browser-rendered implementation capture is available in this task.

### Focused comparison

- Required after refresh: resize the Homepage continuously from desktop through compact to phone, confirming the proof centers at the first supplied screenshot's size while the photograph and fold remain continuous; also check the full closed About towel stack on phone.

final result: blocked

## Pricing mobile estimator-step overview

### Source of truth

- Mobile issue reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_8oPY9t/Screenshot 2026-08-16 at 8.54.55 PM.png`

### Scope

- 620px and below only.
- 621px and wider remain locked.

### Findings

- Steps 01 through 04 remain a balanced two-by-two grid.
- Step 05 spans the complete final row, removing the false sixth cell and making that row one continuous link target.
- Ordered-list semantics, the five-step count, DOM order, section targets, and keyboard order remain unchanged.
- Source and `dist/client` copies are byte-identical.
- Pricing configuration test passed.
- Launch-readiness tests passed, 8 of 8.
- Fresh rendered browser verification was unavailable. Static cascade and automated checks passed.

final result: passed

## 2026-08-17 — Homepage phone-frame continuity

- Replaced the phone-only bottom-anchored frame and oversized top spacer with the approved centered compact geometry at 620 px and below.
- Verified the 621 px and 620 px layouts share the same usable-region vertical center; only the intentional row-to-stacked CTA reflow remains.
- Checked 621, 620, 390, 341, 340, and 320 px portrait layouts plus a 568 × 320 short-landscape layout.
- Both hero CTAs remain visible, contained, and horizontally within the viewport at every checked size.
- The hero grows safely for short landscape content instead of clipping it.
- The shared hero/proof background remains continuous at every checked size.
- Desktop and compact rules above 620 px remain unchanged.
- Source and `dist/client` HTML and CSS copies are byte-identical.
- Launch-readiness tests pass 8/8 and `git diff --check` reports no errors.

final result: passed

## Services compact and mobile hero/detail refinement — 2026-08-17

### Source of truth

- Compact hero issue reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_4LrHkZ/Screenshot 2026-08-16 at 8.53.27 PM.png`
- Cleaning-standard alignment reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_0XBfXN/Screenshot 2026-08-16 at 8.54.16 PM.png`
- Scope guardrail: change compact and mobile only; preserve the established desktop composition at 861 px and above.

### Implementation evidence

- Compact Services hero, 860 px: `/private/tmp/services-compact-hero-860.png`
- Mobile cleaning standard, 390 px: `/private/tmp/services-mobile-standard-390.png`

### Findings

- At 860 px and below, the foreground product collage is removed without removing the approved navy linen and plant background treatment.
- The hero no longer reserves the old image column or fixed phone-height field. Its copy and “Explore the services” action are centered in a single responsive column.
- Compact and mobile top and bottom spacing remain balanced after the service rail overlap, with no empty lower field or hero-to-rail gap.
- At 861 px and above, the existing desktop hero, foreground image, and three-column cleaning-standard composition remain unchanged.
- The active cleaning-standard detail uses the centered compact composition through mobile: icon, chapter count, heading, description, and proof group share the section center.
- All four cleaning-standard tabs use the same centered panel structure. The tab selector remains a 2×2 grid on phone widths and preserves single-line labels.
- Keyboard interaction passed: Arrow keys, Home, and End preserve one selected tab, one focusable tab, and one visible matching panel.
- Widths checked: 1440, 861, 860, 621, 620, 390, 320, and 568 px short landscape.
- No horizontal document overflow was present at any checked width.
- Source and `dist/client` copies of the Services HTML and both changed CSS files are byte-identical.
- Launch-readiness tests passed 8/8, JavaScript syntax checks passed, and `git diff --check` passed.

### Iteration history

1. Extended the already-approved centered cleaning-standard layout from compact through phone widths.
2. Removed the compact/mobile foreground collage and collapsed the hero to one centered content column.
3. Removed the inherited fixed height and image-column reservation that caused the large empty field on smaller screens.
4. Preserved the desktop treatment behind a strict 861 px boundary.
5. Rechecked responsive geometry, keyboard tab behavior, overflow, cache keys, and source/deploy parity.

### Severity summary

- P0: none
- P1: none
- P2: none

final result: passed

## Who We Serve single-image hero

### Source of truth

- User-provided split-layout baseline: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_zxdnIk/Screenshot 2026-08-16 at 8.48.57 PM.png`

### Implementation evidence

- Desktop, 1440 px: `/private/tmp/who-serve-single-image-hero-1440.png`
- Compact, 820 px: `/private/tmp/who-serve-single-image-hero-820.png`
- Mobile, 390 px: `/private/tmp/who-serve-single-image-hero-390.png`
- Small mobile, 320 px: `/private/tmp/who-serve-single-image-hero-320.png`

### Findings

- The hero now uses one full-width approved laundry image at every viewport, with the existing hero content overlaid on a solid translucent navy veil.
- Desktop copy remains left aligned. The stacked compact and mobile treatment centers the copy and CTA without introducing a separate image block.
- The hero transitions from 736 px to 672 px at the established 820 px composition boundary, reducing compact and mobile page length.
- The image retains an intentional towel and pillow crop at every checked size without stretching.
- The CTA now docks the industry directory reliably at fractional scroll positions, so the fixed site header does not cover the directory.
- Widths checked: 1440, 1080, 901, 900, 861, 860, 821, 820, 621, 620, 430, 390, and 320 px.
- No horizontal document overflow, clipped hero content, or hero-to-directory seam was present at any checked width.
- Source and `dist/client` mirrors are byte-identical.

final result: passed

## Source of truth

- Approved composition mockup: `/Users/jordanhudson/.codex/generated_images/019fe30b-34d4-7441-91d0-8003caffcb12/exec-bf3bc641-0b5c-4fec-a6cb-f1f00c5a1842.png`
- Supplied real-towel reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_F6ZTKz/Screenshot 2026-08-16 at 11.19.43 AM.png`
- Supplied woven-band reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_fiaSxp/Screenshot 2026-08-16 at 11.17.32 AM.png`
- Verbal overrides: neutral date band, larger and heavier titles, stronger fold shadows, no mustard active marker, unchanged right-side story towel, and the exact August 16 copy memo.

## Implementation evidence

- Full fidelity comparison: `tmp/about-towel-design-qa-comparison.png`
- Desktop browser capture, 1440 px: `tmp/about-towel-realism-desktop-1440x1200.png`
- Compact browser capture, 768 px: `tmp/about-towel-realism-compact-768x1200-v7.png`
- Folded-row asset: `assets/images/generated/about-timeline-row-dobby-transparent-v1.png`

## Findings

### Visual fidelity

- The desktop composition keeps the approved centered title, towel stack on the left, and full story towel on the right.
- Folded rows now have transparent edges, a more realistic terry surface, a neutral woven band, and stronger contact shadows against the page background.
- Dates sit within the woven band. Titles use greater weight and occupy more of each folded towel.
- The mustard selected-tab treatment is absent. Selection is communicated by the open story panel and stronger stacking depth.
- The right-side story towel remains unchanged, as requested.

### Copy fidelity

- The homepage archive carousel, About montage, nine desktop/compact timeline entries, nine mobile timeline entries, and all four leadership profiles match the supplied revision memo.
- Nelson Torres's supplied portrait is connected to his existing montage position.
- Source and `dist/client` copies are byte-identical.

### Responsive behavior

- All nine entries were checked at 621, 768, 860, 861, 1024, and 1440 px.
- No horizontal overflow was present at any checked width.
- Longer compact stories no longer clip. The open towel surface now grows with its content while preserving the approved constant-width stack.
- The existing mobile timeline remains the active treatment at 620 px and below.

### Interaction and accessibility

- Exactly one timeline chapter remains open at a time.
- Click and keyboard activation update the active chapter and ARIA state.
- Reduced-motion styling remains available.
- The final browser console contained no warnings or errors.

## Iteration history

1. Preserved the approved desktop and compact compositions.
2. Replaced the visibly cropped folded-row artwork with one transparent, reusable towel asset.
3. Added the neutral woven date band, heavier titles, stronger shadows, and removed the mustard active marker.
4. Applied the final archive, timeline, and leadership copy across all duplicated responsive renderings.
5. Found compact-story clipping during QA and changed the open towel from a fixed aspect ratio to content-driven height.
6. Rechecked every timeline entry across compact and desktop breakpoints.

## Severity summary

- P0: none
- P1: none
- P2: none

## Homepage carousel back-face fit

### Source of truth

- Desktop issue reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_PL3dXV/Screenshot 2026-08-16 at 8.35.49 PM.png`
- Approved compact fit reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_kzEyAj/Screenshot 2026-08-16 at 8.40.24 PM.png`

### Implementation evidence

- Desktop, 1024 px: `design-audit/story-card-fit-20260816/implementation-desktop-1024.png`
- Compact, 642 px: `design-audit/story-card-fit-20260816/implementation-compact-642.png`
- Mobile, 320 px, longest first story: `design-audit/story-card-fit-20260816/implementation-mobile-320-slide1.png`
- Mobile, 320 px, longest date treatment: `design-audit/story-card-fit-20260816/implementation-mobile-320-slide3.png`

### Findings

- All five story backs were opened and measured at 1440, 1200, 1024, 981, 980, 861, 860, 768, 667, 621, 620, 430, 390, 375, 360, and 320 px.
- Every era, title, story, and flip control remains inside the circular mask at every checked width.
- No horizontal document overflow was present.
- Desktop and compact retain the existing carousel composition, imagery, and complete story copy.
- Mobile uses a slightly larger fluid circle and a dedicated back-face type scale so the longest cards remain legible without clipping.
- Source and `dist/client` HTML and CSS copies are byte-identical.

final result: passed

## Current QA gate

## Pricing progressive-detail simplification

### Source of truth

- User-provided forced storage-step reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_pJPjYf/Screenshot 2026-08-20 at 8.00.12 AM.png`
- User direction: simplicity first; expose storage, demand pattern, and supplied-inventory quality only after the first useful range; remove return imagery that resembles a control.

### Implementation evidence

- Desktop optional-detail state: `.artifacts/pricing-progressive-detail-v6.png`
- Reference / implementation comparison: `.artifacts/pricing-progressive-detail-v6-compare.png`
- Phone and compact optional-detail states: `.artifacts/pricing-progressive-detail-v6-responsive.png`

### Findings

- Storage and demand pattern remain absent from every basic estimator question sequence.
- Supplied-inventory quality no longer blocks the first range and appears only when supplied goods are selected and the optional end-stage disclosure is opened.
- One familiar sizing answer opens a broad range; adding optional detail narrows the displayed uncertainty from `$3,385–$5,835` to `$3,600–$5,620` in the verified hotel scenario.
- The return recommendation is a plain, automatically derived text summary. No icon tile or return-format control remains.
- The optional disclosure is hidden until a range exists, is keyboard-operable, and uses native labeled selects with explicit skip / not-sure choices.
- The supplied-inventory field disappears when customer-owned goods are selected; the optional-detail counter changes from three available refiners to two.
- Desktop at 1280 px, compact at 842 px, and phone at 390 px were inspected in the in-app browser. The panel remains inside the estimator shell with no clipped labels, controls, or horizontal overflow visible.
- JavaScript syntax checks and all 18 canonical `dist/client` estimator regression groups passed. `git diff --check` passed.

### Severity summary

- P0: none
- P1: none
- P2: none

## Current QA gate

The pricing progressive-detail simplification is the active verified gate. It is ready for owner review in the local preview and has not been published.

final result: passed

## Pricing starting-point alignment

### Source of truth

- User-provided alignment reference: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Rst9Wv/Screenshot 2026-08-20 at 7.59.18 AM.png`
- User direction: center the disabled “Choose a starting point” control without changing the surrounding estimator design.

### Implementation evidence

- Responsive browser capture: `.artifacts/pricing-starting-point-v7.png`
- Reference / implementation comparison: `.artifacts/pricing-starting-point-v7-compare.png`

### Findings

- When the first sizing question has no answer, its sole navigation control is horizontally centered.
- Later estimator questions keep their existing Back / Next alignment because the centering rule applies only when the Back control is hidden.
- The layout was inspected at 842 px compact and 390 px phone widths. The control remains centered with no horizontal overflow or neighboring-content shift.
- All 18 canonical `dist/client` estimator regression groups passed. `git diff --check` passed.

### Severity summary

- P0: none
- P1: none
- P2: none

## Current QA gate

The pricing starting-point alignment is the active verified gate. It is ready for owner review in the local preview and has not been published.

final result: passed

## Latest QA gate

The active gate is **Pricing responsive text centering v13**. Compact and mobile visual checks are complete; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Pricing responsive text centering v13

### Source of truth

- Empty volume prompt: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_xT31VJ/Screenshot 2026-08-20 at 6.58.32 PM.png` (1032 × 360).
- Operation and goods prompt: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Wqu8C8/Screenshot 2026-08-20 at 6.58.39 PM.png` (988 × 482).
- Quote privacy note: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_5ag41k/Screenshot 2026-08-20 at 6.58.59 PM.png` (1064 × 148).
- User direction: center these text groups at compact and mobile sizes while preserving the existing estimator hierarchy and controls.

### Implementation evidence

- Compact operation state: `/private/tmp/shelton-pricing-centering-compact-program-v13.jpg` (1046 × 954).
- Compact empty volume state: `/private/tmp/shelton-pricing-centering-compact-volume-v13.jpg` (1046 × 954).
- Compact privacy state: `/private/tmp/shelton-pricing-centering-compact-privacy-v13.jpg` (1046 × 954).
- Mobile operation state: `/private/tmp/shelton-pricing-centering-mobile-program-v13.jpg` (390 × 844).
- Mobile empty volume state: `/private/tmp/shelton-pricing-centering-mobile-volume-v13.jpg` (390 × 844).
- Mobile privacy state: `/private/tmp/shelton-pricing-centering-mobile-privacy-v13.jpg` (390 × 844).
- Three-row reference / compact implementation comparison: `/private/tmp/shelton-pricing-centering-comparison-v13.jpg` (1820 × 1800). Each row normalizes its reference and implementation into a 900 × 600 contain-fit cell, so the alignment treatment is directly readable despite different source crops.

### Findings

- The empty volume eyebrow, instruction, and status now share a centered text axis at every width through 1199 px.
- The operation label, picker text, goods legend, and helper copy are centered at compact and mobile sizes; the dropdown arrow remains pinned to the right edge and does not shift the text off-center.
- The quote privacy note is centered with balanced wrapping and keeps the privacy link visually distinct.
- The compact 1046 px and mobile 390 px captures show no horizontal overflow, clipping, or collision.
- Desktop styles above 1199 px remain unchanged.
- All 19 canonical `dist/client` estimator regression groups and all 13 site-hardening tests passed. `git diff --check` passed.

### Severity summary

- P0: none
- P1: none
- P2: none

## Latest QA gate

The active gate is **Pricing responsive text centering v13**. Compact and mobile comparison checks are complete; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Latest QA gate

The active gate is **Pricing ownership divider v14**. Compact and mobile comparison checks are complete; the missing boundary is restored; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Latest QA gate

The active gate is **Pricing range-dock persistence v15**. The lower-right range remains available through the service-location step and is suppressed only when the actual planning-range readout enters view. Desktop, compact, and mobile comparison checks are complete; all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Latest QA gate

The active gate is **Pricing planning-summary centering v16**. The requested text is centered globally, the visual comparison is complete, and all scoped regression checks pass. The work has not been committed, pushed, or published.

final result: passed

## Current latest QA gate — Homepage contour detail refinements

The softened corners, non-white keyboard treatment, restrained 760 px runway, Hotels copy update, and upper-stacked service-row reduction are recorded in **Homepage contour detail refinements — August 25, 2026** above. The comparison and interaction checks pass. The work remains isolated in the experiment and has not been published.

final result: passed
