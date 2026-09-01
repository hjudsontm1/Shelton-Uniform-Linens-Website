# About TV autoplay review

## Requested sequence

1. Show the archive introduction before selecting a photograph.
2. Select the first visible photograph after a short introduction.
3. Continue through the visible photographs every 15 seconds.
4. Preserve manual tile and TV-dial controls.

## Implemented timing

- Introduction duration: 4.5 seconds.
- Story interval: 15 seconds.
- A manual photograph or dial selection restarts the 15-second interval from that choice.
- Returning to a hidden browser tab restarts the appropriate intro or story timer instead of advancing while the page is unseen.
- Reduced-motion users receive the same sequence without the tuning flicker.
- Automatic changes use `aria-live="off"`; user-triggered changes use `aria-live="polite"`.

## Browser verification

- Initial state at 0.25 seconds: instruction screen, no active photo.
- First state at approximately 4.8 seconds: White Star Laundry, photo index 0.
- Second state at approximately 20 seconds: Unit Laundry, photo index 1.
- Manual selection: Sterling Cleaners lobby, photo index 10.
- Fifteen seconds after manual selection: Shelton Cleaners today, photo index 11.
- Mobile TV remained at `scrollY: 0` throughout the sequence.
- Compact verification at 704px preserved four photographs per row and the larger compact TV proportions.
- Compact used the same 4.5-second introduction and 15-second story interval.
- Selecting an off-screen compact photograph returned the viewport to the TV before presenting the story.

## Automated verification

- JavaScript syntax checks pass for source and distribution copies.
- Source and distribution copies match.
- Launch-readiness suite passes all 11 tests.

## Release state

Local implementation only. No production publish was performed.
