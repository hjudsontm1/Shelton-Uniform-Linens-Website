# Design QA: About towel timeline realism and copy

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
