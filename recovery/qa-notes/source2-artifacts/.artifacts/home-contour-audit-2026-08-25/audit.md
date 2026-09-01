# Home Industry Explorer — Design Audit

Audit date: August 25, 2026

Prototype reviewed: `home-industry-explorer-experiment.html?contour=final-v2#build-program`

## Executive verdict

Keep this direction. The lifted top-left corner makes the industry explorer feel as though it grows directly out of the photographed fabric fold. That solves the transition problem far better than a separate rectangular module would. The result is distinctive, premium, and still understandable as an interactive business-category selector.

The composition is already strong enough to preserve. The only two changes worth treating as near-term fixes are the stacked-layout runway at the 760px breakpoint and the inset keyboard-focus outline. Everything else below is optional polish.

## What is working

1. **Fold-to-explorer transition — healthy.** The gold contour tracks the fabric hem convincingly at rail-layout sizes, and the navy channel between the fabric and frame is narrow enough to feel connected without looking accidentally fused.
2. **Information hierarchy — healthy.** The page moves directly into the business categories without another explanatory heading. The selected panel, collapsed labels, audience line, short description, and specific Explore link create a clear hierarchy without adding instructions.
3. **Category differentiation — healthy.** Hotels, Short-Term Rentals, Wellness, Events, Food Service, and Workforce feel meaningfully distinct. Wellness and Workforce are the strongest image/copy pairings. Food Service is the least category-specific photograph, but it still fits the system.
4. **Interaction behavior — healthy.** During a category change, outgoing copy clears before the panel compresses and incoming copy waits until the new panel has opened. This avoids the compressed-text problem from the prior iteration. The current motion reads as calm and intentional.
5. **Service-model handoff — healthy.** Customer-Owned Goods, Rental Program, and the hybrid option are visually subordinate to the explorer but remain easy to scan. The vertical space before the history section is generous enough to close the module cleanly.
6. **Mobile structure — healthy.** The flat stacked accordion is the right transformation below the rail layout. It does not try to force the diagonal geometry into a width where it would become cramped. Tap targets are large, titles remain legible, and the long Hotels title wraps intentionally.
7. **Semantics — healthy with one verification note.** The explorer exposes a named region, a named category group, six clearly labelled buttons, one expanded state, and a labelled detail region. The service choices are links. The DOM snapshot includes private-use icon glyphs even though the icons appear to be marked decorative in the HTML; verify once with VoiceOver or NVDA before production, but treat this as a test item rather than a confirmed defect.

## Recommended refinements

### Priority 1 — add runway at the 760px stacked-layout edge

At 390px, the flat stack has a healthy navy buffer below the fabric. At 761px, the diagonal rail layout also has a healthy buffer. At exactly 760px, however, the visible cream fabric edge appears to meet the flat accordion frame. This makes the fold-to-frame transition feel pinched and creates a noticeable one-pixel breakpoint change from 760px to 761px.

Recommendation: add roughly 18–24px of extra top runway near the upper end of the 621–760px range, tapering in from the existing mobile value rather than adding a fixed amount to all phones. Preserve the 390px spacing and the 761px diagonal geometry.

### Priority 1 — refine the keyboard-focus outline

The 2px cream focus outline is highly visible, which is good. Its current `outline-offset: -7px` places it well inside the gold panel dividers. In the audit captures, the active panel therefore appears to have an accidental second cream border along its sides and bottom.

Recommendation: keep the 2px accessible focus indicator, but move it nearer to the panel boundary with an offset around -2px or -3px, or use an equivalent inset treatment that hugs the edge. Do not remove or weaken focus visibility.

### Priority 2 — soften the faceted corners

The contour is built from a polygon, so the top-left, top-right, and lower corners are subtly chamfered rather than truly curved. This looks intentional at a glance, but it is slightly harder and more architectural than the rounded service cards below it.

Recommendation: if the goal is to retain the softer identity of the prior rounded box, smooth the mask/path or add enough intermediate points to make the turns read as curves. Preserve the current slope, frame extents, and gold line weight.

### Priority 2 — clean up two lines of copy and punctuation

- Hotels currently says, “Linens and towels cleaned and pressed to the highest standard and care.” A more natural version is: “Linens and towels cleaned and pressed with the highest standard of care.”
- Short-Term Rentals currently says, “Bringing hotel level pricing and quality to the short term rental market.” Standard hyphenation is: “Bringing hotel-level pricing and quality to the short-term rental market.”
- Standardize terminal punctuation across all six descriptions. Some currently have periods and some do not.

### Priority 3 — optional tablet-only service-row reduction

The Customer-Owned Goods and Rental Program rows are appropriately compact at desktop widths and balanced at 390px, where the descriptions need two lines. At 760px, both rows retain roughly the same 96–100px height even though their content fits more easily, leaving more vertical air than necessary.

Recommendation: only if the full-page rhythm still feels long after the runway fix, reduce these two rows to approximately 84–88px in the 621–760px range. Do not shrink the desktop rows or the phone rows. The hybrid pill is already proportioned well.

## What should not change

- Do not flatten the contour or reduce the top-left lift; the lift is the feature that makes this iteration special.
- Do not add an intro eyebrow, heading, or instructional sentence above the categories. The interaction is already discoverable and the simplicity is part of its value.
- Do not narrow the selected panel; the open state has enough room for the longest title and descriptions.
- Do not make the image overlays substantially darker. Text remains legible while the photography still carries the design.
- Do not reduce the desktop service-row height further.
- Do not accelerate the transition aggressively. The present timing supports the premium tone and fixes the earlier text-compression issue.
- Do not force the diagonal rail layout onto phone widths.

## Accessibility and production checks

- Keyboard navigation structure is strong; refine the visual outline rather than removing it.
- The gold audience line sits on photographs with different luminance. It is visually readable in the audited states, but a production contrast check should sample each category image rather than relying on a single color calculation.
- Verify the icon-font arrows with VoiceOver or NVDA because the browser's semantic snapshot exposed private-use glyph characters despite decorative icon markup.
- Retest `prefers-reduced-motion` once the final CSS is merged. The prototype contains a reduced-motion rule, but this audit concentrated on the default visual interaction.
- Verify real touch interaction at 760–768px after the runway adjustment, because that breakpoint is the only place where the visual handoff currently changes abruptly.

## Evidence captured

- `01-fold-handoff.jpg` — desktop fold and contour handoff
- `02-details-models-transition.jpg` — active panel into service-model rows
- `03-short-term-rentals.jpg` — longest single-line category title and focus state
- `04-food-service.jpg` — Food Service crop and content placement
- `05-wellness-settled.jpg` — Wellness crop and settled content
- `06-workforce-right-edge.jpg` — right-edge active state
- `07-mobile-390-and-stack-760.jpg` — mobile and stacked-layout edge comparison
- `08-rail-start-761.jpg` — first rail-layout pixel
- `09-compact-rail-860.jpg` and `10-desktop-rail-861.jpg` — rail scaling handoff
- `11-mobile-model-rows.jpg` and `12-model-rows-390-and-760.jpg` — service-model density
- `13-models-to-history.jpg` — module closing rhythm into the history section

No implementation files were changed during this audit.
