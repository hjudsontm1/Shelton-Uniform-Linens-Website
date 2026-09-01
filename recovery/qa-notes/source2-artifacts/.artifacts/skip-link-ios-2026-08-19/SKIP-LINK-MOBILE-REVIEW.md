# Mobile skip-link review

## Scope

About-page mobile Safari state reported by the user, where the “Skip to content” accessibility link remained over the towel timeline.

## Finding

The shared skip-link rule revealed the link for every `:focus` state. Mobile Safari can assign focus during an ordinary touch interaction, allowing the fixed link to remain visible over the page. The previous percentage-only hidden transform also depended on the rendered text height.

## Correction

- Preserved the skip link in the document and accessibility tree.
- Preserved its visible keyboard-focus state.
- Added a `:focus:not(:focus-visible)` fallback that keeps touch-origin focus hidden.
- Changed the hidden transform to clear the link’s full rendered height plus a fixed safety offset.
- Updated the About page stylesheet cache key so the correction is fetched instead of an older cached rule.

## Verification

- At 390 x 844, the link remains semantically present while its normal rendered box ends 16px above the viewport.
- The reported State Street towel state was reopened and captured without the overlay.
- Source and distribution copies match.
- The launch-readiness suite passes all 11 tests.

## Evidence limits

The local in-app browser verifies the responsive layout and computed focus rules. The user’s supplied screenshot is the evidence for the original iPhone Safari-specific focus behavior; final confirmation on physical Safari should follow after publishing.

## Release state

Local implementation only. No production publish was performed.
