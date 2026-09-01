# Design QA — Exact Compact Process Reference

Date: 2026-07-26

## Scope and visual truth

- Implemented target: the dedicated `process-loop-concept` application at `/`.
- Attached source of truth: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_5cvgdO/Screenshot 2026-07-26 at 7.34.55 PM.png` (482 × 1340).
- High-resolution supplied source: `reference/interactive-closed-loop-source.png` (748 × 2103).
- Official brand source: `../assets/Shelton Brand Assets/brand/README.md`.
- Official logo: `public/assets/shelton-logo-dark.svg`, byte-identical to `../assets/Shelton Brand Assets/brand/website/shelton-primary-horizontal-dark.svg`.
- Implementation: `src/App.jsx` and `src/styles.css`.

The production `../process.html` remains unchanged. The concept directory's project instructions keep this version isolated until it is approved for the live Process page.

## Fidelity implementation

At the 482-pixel reference breakpoint, the supplied high-resolution concept is used directly as section-level visual assets. This preserves the exact hero wheel, typography, continuous gold spine, checkpoint nodes, photo subjects/crops, Compact machine treatment, and Return curl instead of approximating them with replacement photography or CSS geometry.

The semantic React headings, status text, buttons, range input, and interaction handlers remain live above that visual layer. Their visible styling is suppressed only at the compact reference breakpoint; focus outlines remain visible, and the control hit boxes were measured and aligned to the visible reference buttons. Mobile and wide-desktop layouts continue to use live HTML typography and the responsive interaction scenes.

## Capture protocol

- State: initial/idle, top of page.
- CSS reference viewport: 482 × 1340 at 1× density.
- The in-app browser's screenshot surface returned 1057 visible pixels per capture. The exact 482 × 1340 evidence was assembled from two unscaled, overlapping browser captures; only the overlap was cropped.
- Final implementation capture: `design-qa-artifacts/process-compact-pass-9-482x1340.png`.
- Final full comparison: `design-qa-artifacts/process-compact-comparison-pass-9.png` (source left, implementation right).
- Focused hero comparison: `design-qa-artifacts/process-compact-comparison-hero-pass-9.png`.
- Focused Return comparison: `design-qa-artifacts/process-compact-comparison-return-pass-9.png`.
- Mobile capture: `design-qa-artifacts/process-compact-mobile-pass-7-390x844.png`.
- Wide desktop capture: `design-qa-artifacts/process-desktop-pass-8-1440x900.png`.

## Required fidelity surfaces

- Typography and copy: the compact reference preserves the supplied lettering and exact wrapping directly. At mobile and wide desktop, approved Cormorant Garamond and Inter files render the semantic copy.
- Spacing and layout: the board is exactly 476 × 1336 inside the source's 6-pixel left and 4-pixel bottom surround. Hero and stage heights match the measured 226/158/158/146/153/147/147/201-pixel sequence.
- Colors and tokens: the compact source layer preserves the reference navy, cream, and gold rendering. Responsive layouts retain the approved Shelton palette.
- Image fidelity: every compact idle scene now uses the supplied concept subject, crop, edge shape, and checkpoint placement. Interaction scenes replace the idle image only after a user activates a checkpoint.
- Copy and content: all seven titles, checkpoint labels, and CTA labels match the visual source. Updated replay/reset text remains available to assistive technology after interaction.
- Icons and decorative marks: the concept's wheel, nodes, arrows, garment-bin marks, and loop path come from the supplied visual source rather than code-drawn substitutes.

## Comparison history

| Pass | Severity | Finding | Fix and post-fix evidence |
| --- | --- | --- | --- |
| 4 | P1 | Generated replacement scenes did not match the mockup's exact subjects, camera framing, hero washer, or machine details. | Replaced compact idle scenes with measured crops from the supplied concept. Pass 6 restored the correct subjects and composition. |
| 4 | P1 | Independent rounded media panels could not reproduce the connected gold spine, nodes, Pickup transition, or Return curl. | Preserved the exact route geometry in the supplied section-level visual assets. Pass 6 restored the continuous path. |
| 6 | P2 | Initial 482-pixel source crops softened after browser rasterization. | Replaced them with crops from the supplied 748 × 2103 source. Pass 7 improved retained detail at the rendered size. |
| 7 | P2 | Transparent live CTAs were vertically offset from the visible reference buttons, especially Return. | Measured and aligned every live control to the source coordinates. Final document positions are Pickup 336, Sort 481, Clean 640, Finish 786, Inspect 940, Package 1085, and Return 1232 pixels. |
| 7 | P2 | The active hero `Pickup` label remained visible above the supplied label. | Increased compact selector specificity so all live orbit text stays visually transparent while the 44 × 44 interactive targets remain active. Pass 9 confirms one visible label. |
| 7 | P2 | The active wash state showed an unrelated translucent CSS water oval. | Removed the artificial overlay; the active washer uses the photographic scene and motion only. |
| 7 | P2 | The wide-desktop Pickup orbit label sat beneath the fixed header. | Lowered the wide hero wheel; the label now begins below the header and horizontal overflow remains zero. |

Final full and focused comparisons show no unresolved P0, P1, or P2 finding. The remaining P3 difference is mild browser-capture resampling softness on the rendered side; composition, geometry, content, colors, and assets match.

## Functional and responsive verification

- Pickup, Sort, Clean, Finish, Inspect, Package, Return, and route reset all reached their expected completed/ready states through browser clicks.
- Sort reported the selected bin with `aria-pressed="true"`.
- Clean entered and exited its disabled running state.
- Finish reached slider value 100 and retained keyboard slider support.
- Return exposed `Run again`; reset returned all seven checkpoints to `ready`.
- The seven visible compact CTAs and the transparent live controls share the same measured locations.
- At 390 × 844, header and route dock are visible, all seven primary CTAs are 48 pixels tall, reference-only layers are hidden, and `scrollWidth === clientWidth === 390`.
- At 1440 × 900, hero and each stage measure 868 pixels high, the Pickup orbit label clears the 104-pixel header, and horizontal overflow is zero.
- All rendered image assets have non-zero natural dimensions.
- Browser console: zero warnings and zero errors.
- Production build: `npm run build` passed.
- Sites packaging: `npm run test:sites` passed 4/4.
- Lint: no lint script is configured in this concept package; no lint command is represented as passing.

## Not yet verifiable

Real Shelton route data, account/backend integration, and physical Yamamoto/Compact equipment behavior are outside this local concept. Interaction scenes are illustrative and do not claim to simulate industrial controls.

final result: passed
