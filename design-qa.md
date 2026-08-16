# Design QA: About towel timeline

## Final result

passed

## Source of truth

- Desktop approved mockup: `artifacts/about-towel-timeline-reference-desktop.png`
- Compact approved mockup: `artifacts/about-towel-timeline-reference-compact.png`
- Verbal overrides applied after the mockups:
  - Nine chapters total
  - No chapter fraction
  - Last three chapters are c. 2019, c. 2023, and c. 2026
  - Desktop stack and story towel align at the top and bottom
  - Compact stack remains one constant width, including the open chapter
  - Mobile at 620px and below remains unchanged

## Implementation evidence

- Desktop implementation: `artifacts/about-towel-timeline-implementation-desktop-full.png`
- Compact implementation: `artifacts/about-towel-timeline-implementation-compact-full.png`
- Desktop side-by-side comparison: `artifacts/about-towel-timeline-combined-qa-viewport.png`
- Compact side-by-side comparison: `artifacts/about-towel-timeline-combined-qa-compact.png`

## Comparison setup

| State | Reference | Implementation | Normalized comparison |
| --- | --- | --- | --- |
| Desktop, c. 1955 open | 1487 × 1058 px | 1487 × 1060 px | Reference padded by 2 px to 1487 × 1060 px |
| Compact, c. 1955 open | 998 × 1576 px | 760 × 1341 px | Reference resized to 760 px wide and padded to 760 × 1341 px |

Browser pixel density was 1 CSS pixel per captured pixel. The page was positioned at `#about-history`, and both comparisons used the same c. 1955 open state.

## Findings

### Visual fidelity

- Desktop hierarchy, centered title, two-column composition, towel texture, folded edges, hem detail, contact shadows, active gold seam, photo treatment, and story copy placement match the approved direction.
- The desktop stack and story towel now share the same top and bottom visual boundaries.
- The ninth towel and revised last three chapters are intentional approved changes from the earlier desktop mockup.
- Compact preserves the approved single-stack interaction and constant width. The open chapter expands vertically inside the stack without tapering or trailing out.
- No chapter fraction is present in desktop or compact.

### Responsive behavior

- 620px: legacy mobile timeline visible, new towel timeline hidden, no horizontal overflow.
- 621px: compact towel timeline visible, mobile timeline hidden, no horizontal overflow.
- 860px: compact layout remains intact, no horizontal overflow.
- 861px: desktop two-column layout activates cleanly, no horizontal overflow.
- 1487px: full desktop composition remains aligned and centered.

### Interaction and accessibility

- Exactly one chapter remains open at a time.
- Click activation updates the open chapter and ARIA state.
- Arrow key navigation changes the active chapter and moves focus.
- Home and End key support is included.
- Reduced-motion styling removes the transition for users who request it.
- No browser warnings or errors were reported during the final pass.

## Iteration history

1. Replaced the earlier flat approximation with reusable raster towel surfaces taken from the approved visual direction.
2. Added the ninth chapter and removed the obsolete chapter fraction.
3. Rebuilt the desktop proportions so both columns align at the top and bottom.
4. Rebuilt compact as a constant-width stack with the open chapter unfolding inside itself.
5. Tightened the transparent story-towel crop so the physical towel, not its transparent canvas, determines alignment.
6. Verified boundaries, interaction, keyboard behavior, reduced motion, console output, and mobile preservation.

## Severity summary

- P0: none
- P1: none
- P2: none

The temporary default remains c. 1955 until a different launch default is selected.
