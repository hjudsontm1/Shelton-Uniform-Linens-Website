# Shelton Who We Serve Accordion Prototype — Design QA

## Comparison Setup

- Source visual truth:
  - `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_8tiL8x/Screenshot 2026-08-24 at 3.14.26 PM.png`
  - `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_vygZb9/Screenshot 2026-08-24 at 3.20.02 PM.png`
  - `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_prntxH/Screenshot 2026-08-24 at 4.44.44 PM.png`
  - The August 24 browser annotations requiring removal of the intro and repeated panel eyebrow, heavier rounded ownership-row borders, and an independent Hotels / Short-Term Rentals split.
- Browser-rendered implementation: `prototype-six-panel-desktop-1440x1024.png`.
- Responsive evidence: `prototype-six-panel-tablet-768x1024.png`, `prototype-six-panel-mobile-390x844.png`, and `prototype-six-panel-mobile-programs-390x844.png`.
- Alternate active-state evidence: `prototype-six-panel-rentals-1440x1024.png`.
- Combined source/implementation evidence: `qa-comparison-reference-vs-six-panel.png`.
- Hybrid-border focused evidence: `qa-comparison-hybrid-border.png`, `prototype-hybrid-border-final-847x720.png`, and `prototype-hybrid-border-mobile-final-390x844.png`.
- Desktop CSS viewport: 1440 × 1024 at device pixel ratio 1.
- Desktop screenshot pixels: 1440 × 1024.
- Primary source pixels: 1609 × 708. Implementation accordion crop: 1320 × 583. The source and implementation retain the same approximately 2.27:1 gallery ratio; no density normalization was required beyond responsive scaling.
- Ownership-row source pixels: 2592 × 444. Implementation ownership section is 1320 pixels wide and responsively scaled for comparison.
- Compared state: Hotels & Boutique Stays expanded; the other five industry families collapsed; ownership-model rows idle.

## Full-View Comparison Evidence

`qa-comparison-reference-vs-six-panel.png` places the selected source direction and the updated implementation in one comparison image. The implementation preserves the dark photographic gallery, dominant expanded panel, narrow vertical rails, gold dividers, restrained outer radius, bottom-left copy block, and compact ownership rows. The six-panel taxonomy, missing introductory copy, missing repeated eyebrow, and two-pixel rounded program borders are intentional changes from the annotated feedback.

## Focused Region Evidence

- Accordion: the combined comparison keeps panel proportions, typography, imagery, dividers, vertical labels, numbers, and CTA placement readable in the same frame.
- Short-Term Rentals: `prototype-six-panel-rentals-1440x1024.png` confirms the new market has distinct imagery, copy, title wrapping, and a direct `#short-term-rentals` CTA.
- Ownership rows: the desktop comparison and `prototype-six-panel-mobile-programs-390x844.png` show the two-pixel gold borders, eight-pixel radii, copy hierarchy, circular arrow actions, and mobile wrapping clearly. No additional crop was needed.
- Hybrid prompt: `qa-comparison-hybrid-border.png` places the 1032 × 116 source crop and a density-normalized implementation crop in one focused comparison. The implementation keeps the existing compact type and placement while adopting the same two-pixel muted-gold outline and eight-pixel corners as the two ownership rows.

## Required Fidelity Surfaces

- Fonts and typography: passed. The approved local Cormorant Garamond and Inter variable-font files remain in use. The longer hotel and rental names wrap intentionally without clipping at desktop, tablet, or phone widths.
- Spacing and layout rhythm: passed. The six-panel desktop gallery retains the source ratio; tablet rails remain readable; the phone layout stacks into one active panel and five compact rows. No horizontal overflow was found at 1440, 768, or 390 CSS pixels.
- Colors and visual tokens: passed. Deep Navy `#081321`, Warm Cream `#FAF6EE`, and Muted Gold `#B8965A` remain consistent. Ownership rows now use the requested stronger gold outline while hover and focus states remain visible.
- Image quality and asset fidelity: passed for the verified six-panel version. The later Food Service addition uses a dedicated generated editorial photograph with no text, logo, or invented brand marks; its in-browser crop is pending verification.
- Copy and content: passed. The taxonomy now distinguishes Hotels & Boutique Stays from Short-Term Rentals, and the other four market families remain unchanged. The intro and all repeated “Who We Serve” eyebrows are absent as requested.
- Icons: passed. Arrow actions use the Phosphor icon package with consistent weight and alignment.
- Behavior and accessibility: passed. Exactly one panel expands at a time; click, tap, arrow-key, Home, and End navigation work; focus is visible; controls expose expanded state; reduced-motion CSS is present; mobile rows retain practical tap targets.

## Comparison History

### Earlier Prototype Pass

- [P2] Ownership rows were materially taller than the supplied reference.
  - Fix: reduced row height, padding, type scale, arrow size, gaps, and hybrid-link height.
- [P2] Gold supporting copy crossed bright textile areas in the mobile active panel with insufficient visual separation.
  - Fix: deepened the active image treatment and mobile scrim while preserving photographic detail.

### Six-Panel Annotation Pass

- Applied the four scoped browser annotations without changing the approved gallery interaction or queued destination pages.
- Added a dedicated Short-Term Rentals panel and renumbered the remaining market rails 03–06.
- Post-change evidence: `prototype-six-panel-desktop-1440x1024.png`, `prototype-six-panel-rentals-1440x1024.png`, `prototype-six-panel-tablet-768x1024.png`, `prototype-six-panel-mobile-390x844.png`, `prototype-six-panel-mobile-programs-390x844.png`, and `qa-comparison-reference-vs-six-panel.png`.
- No actionable P0, P1, or P2 design differences remain.

### Hybrid Border Pass

- Applied the ownership-row border treatment to the hybrid-program prompt without changing its copy, link, size, or centered placement.
- Desktop evidence: `prototype-hybrid-border-final-847x720.png`, captured at an 847 × 720 CSS viewport and device pixel ratio 1.
- Mobile evidence: `prototype-hybrid-border-mobile-final-390x844.png`, captured at a 390 × 844 CSS viewport and device pixel ratio 1.
- Focused comparison: `qa-comparison-hybrid-border.png`.
- No actionable P0, P1, or P2 design differences remain.

### Partners Copy Pass

- Replaced the Partners audience line with “Wholesale dry cleaners and specialty accounts” exactly as annotated.
- Evidence: `prototype-partners-copy-final-847x720.png`, captured at an 847 × 720 CSS viewport and device pixel ratio 1.
- The revised line fits on one line inside the active panel with no horizontal overflow; no surrounding layout or interaction changed.
- No actionable P0, P1, or P2 design differences remain.

### Seven-Panel Food Service Pass

- Added Food Service as an independent panel between Events and Workforce with the approved supporting line, description, dedicated image, and direct `#restaurants` CTA.
- Renumbered Workforce and Partners to 06 and 07, and adjusted desktop flex proportions to preserve the dominant expanded-panel composition across seven families.
- Source implementation is complete, but the browser/build verification pass is blocked because macOS has offloaded the prototype's existing local font and image files. Both Vite and a direct JSX bundle check stalled while waiting for those files to hydrate.
- The newly generated Food Service image is present and readable at `public/assets/images/industry-food-service.png`; no existing assets were replaced.

### Final Six-Panel Content Pass

- Removed Partners because it represents too little of the business to warrant a homepage panel.
- Workforce remains panel 06 and now uses the approved description: “Uniforms professionally cleaned and pressed to match the standards you provide.”
- Restored the previously verified six-panel desktop proportions while retaining Food Service as its own market.
- Saved the complete prototype locally only; it has not been published, deployed, or integrated into the production homepage.

### Motion Recording Pass

- Source visual truth: `/var/folders/6w/c0ys3j4904l0y3wqgqsbqn_r0000gn/T/TemporaryItems/NSIRD_screencaptureui_kT777Z/Screen Recording 2026-08-25 at 11.25.33 AM.mov`.
- Extracted evidence: `/private/tmp/shelton-recording-frames/frame-08-001.90s.png` through `/private/tmp/shelton-recording-frames/frame-12-002.85s.png`; each full recording frame is 1200 × 749 pixels. The browser content occupies a split-screen region, so an exact CSS viewport cannot be inferred reliably from the recording alone.
- Compared state: Wellness collapsing while Events expands.
- [P1] The outgoing Wellness details remained paintable during the flex transition, wrapping into a one-word-wide vertical stack and overlapping its rail label before disappearing.
- Fix: inactive details are now removed from layout immediately with `hidden`; image and rail widths animate alone; the incoming details are revealed after 430 ms using a guarded activation token so rapid category changes cannot reveal stale copy.
- Static interaction script syntax passed, and the updated local preview returns HTTP 200. A post-fix browser recording is still required before this motion pass can be marked visually verified.

## Previous Browser Verification (Six-Panel Version)

- Clicked and verified Hotels & Boutique Stays, Short-Term Rentals, Wellness, Events, Workforce, and Partners expanded states.
- Confirmed all six expanded CTA destinations: `#hotels`, `#short-term-rentals`, `#gyms`, `#events`, `#uniforms`, and `#wholesale` on the production Who We Serve page.
- Confirmed each selected trigger reports `aria-expanded="true"` and each active heading remains inside its panel.
- Confirmed ArrowRight and End navigation move both the active state and keyboard focus.
- Confirmed 1440px desktop, 768px tablet, and 390px mobile layouts without horizontal overflow.
- Confirmed ownership rows render with two-pixel borders and eight-pixel corner radii at desktop and mobile widths.
- Confirmed the hybrid prompt now renders with the same two-pixel border and eight-pixel corner radius at 847px and 390px widths, with no horizontal overflow.
- Confirmed the Partners supporting line matches the requested wording and remains inside its panel at the active browser width.
- Confirmed the two queued program-page destinations remain `/customer-owned-goods.html` and `/rental-program.html`.
- Browser console checked: no errors or warnings.
- Production build and Sites packaging tests passed.

## Follow-Up Polish

- [P3] The final six-panel set restores the previously verified rail proportions, but the new Food Service panel and imagery still require browser verification once the local assets are available again.
- The Customer-Owned Goods and Rental Program destination pages remain queued and are not part of this prototype's completion gate.

final result: blocked
