# Pricing Journey Accessibility Report

## Scope

The private journey was tested from `Begin` through local payload-ready handoff with mouse, keyboard, reduced motion, mobile touch geometry, validation failures, session restoration, and a 200% reflow equivalent.

## Automated Evidence

Primary suite: `tests/pricing-journey-cp6.e2e.cjs`

- Keyboard-only completion: passed.
- Focus moved to each newly revealed chapter heading: passed.
- Duplicate IDs: `0`.
- Unlabeled inputs: `0`.
- Invalid ARIA states: `0`.
- Unnamed buttons: `0`.
- Audited mobile actions below 44x44 CSS pixels: `0`.
- 640x400 200% reflow equivalent document overflow: `0`.
- Reduced-motion completion: passed.
- Error recovery for Location and contact handoff: passed.
- Session restore and Start Over: passed.

Metrics are stored in `docs/pricing-journey-artifacts/checkpoint-6/cp6-metrics.json`.

## Semantic Model

- Native buttons drive Begin, Continue, Edit, steppers, and actions.
- Operation and ownership expose radio semantics; Goods and finish choices expose checkbox semantics and visible selected states.
- Scale uses labeled inputs/selects with units, help text, and explicit error state.
- Preferred contact method is a labeled radio fieldset, not a custom dropdown.
- Dynamic updates use polite status regions; validation errors use alert regions.
- Decorative SVG scenes are hidden from assistive technology because equivalent names and states live in semantic HTML controls.
- Selection is communicated through text, check/radio state, position, and contrast rather than color alone.

## Focus And Motion

- Revealed chapter headings receive programmatic focus only after a user action.
- Fixed-header offsets keep the focused heading visible.
- Inline `Edit` returns to the original control group while preserving compatible answers.
- `prefers-reduced-motion` and the private `?motion=reduce` override remove smooth-scroll dependence and collapse transition durations.
- No information is hover-only.

## Responsive Accessibility

- Tested at 1440x900, 1366x768, 1280x800, 768x1024, 390x844, and 430x932.
- Mobile uses a dedicated one-column composition, full-width primary actions, and horizontally scrollable editorial rails rather than shrinking controls below usable size.
- No tested viewport has horizontal document overflow.

## Remaining Human Review

Before public release, run a final assistive-technology pass with VoiceOver/Safari and NVDA/Chrome using the production endpoint and approved public copy. This is a release-validation task, not a known private-preview defect.
