# About mobile archive review

## Scope

- Match the compact archive TV's edge-to-edge treatment on mobile.
- Show four archive photos across at every mobile width.
- Add a third row: two horizontally scrollable archive rows above one fixed row of four people.
- When a photo is selected while the TV is not fully visible, return the viewport to the TV.

## Implementation

- Mobile TV now spans the full viewport without the extra dark outer band.
- Archive tiles use a four-column mobile unit at all widths through 620px.
- Historical images fill two horizontal rows and retain scroll snapping.
- Amanda Waskin, Jordan Hudson, Vaile Shelton, and Nelson Torres remain fixed in the third row while the archive rows scroll.
- Photo selection checks TV visibility and scrolls the TV into view only when needed; reduced-motion preferences are respected.

## Verification

- 390 x 844: four-across layout, fixed people row, two independently scrolling archive rows, and edge-to-edge TV verified.
- 320 x 700: four-across layout and all four people remain within the viewport.
- Tap behavior: selecting a historical image from below the TV returns the page to `scrollY: 0` and activates the selected story.
- 704 x 814 compact comparison: layout geometry remains unchanged.
- Automated launch-readiness suite: 11 tests passed.

## Captures

- `01-live-compact-704.png` — public compact reference.
- `02-live-mobile-390-before.png` — public mobile before.
- `03-local-mobile-390-after.png` — local mobile after.
- `04-local-mobile-390-scrolled.png` — scrolled archive rows with fixed people row.
- `05-local-mobile-390-after-tap.png` — selected story after automatic return to TV.
- `06-local-mobile-320.png` — smallest checked phone width.
- `07-local-compact-704-after.png` — compact regression check.

## Release state

Local implementation only. No publish or production deployment was performed in this pass.
