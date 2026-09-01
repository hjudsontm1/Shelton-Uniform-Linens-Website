# Pricing and Estimate Accessibility Report

## Outcome

The implemented experience meets the intended WCAG 2.2 AA interaction and presentation expectations in automated and keyboard-driven QA. Semantic controls, focus movement, errors, reduced motion, touch sizing, and responsive reflow are verified. A manual VoiceOver session remains a production signoff rather than a claimed automated result.

## Verified behavior

- Complete keyboard journey from Begin through local quote-payload preparation
- Deterministic focus on each newly revealed chapter heading
- Fixed-header-aware focus and scroll positioning
- Roving radio keyboard behavior for Operation and Ownership
- Semantic checkbox/radio state through `aria-checked`
- Named scale inputs and named stepper buttons
- `aria-describedby` and `aria-errormessage` associations for Scale, Location, and quote errors
- Invalid fields receive `aria-invalid="true"` and focus moves to the first invalid field
- Polite live announcements for chapter changes, selections, loading, failure, and local completion
- Visible focus treatment independent of hover
- No hover-only information
- Reduced-motion mode removes transition delay and smooth scrolling
- Mobile action/edit targets measure at least 44 × 44 CSS pixels in the tested review path
- 200% equivalent layout check passes without horizontal page overflow
- Skip link and named main journey region remain available

Automated semantic audit result:

- Duplicate IDs: 0
- Unlabeled inputs: 0
- Unnamed buttons: 0
- Unexpected invalid states at rest: 0

## Contrast evidence

Representative token pairs exceed AA requirements:

| Foreground | Background | Ratio |
| --- | --- | ---: |
| Parchment `#f3ecdd` | Navy `#07131f` | 15.91:1 |
| Secondary gray `#a8b1b8` | Navy `#07131f` | 8.60:1 |
| Brass `#b89452` | Navy `#07131f` | 6.59:1 |
| Dark dossier ink `#13202a` | Parchment `#e8dcc2` | 12.19:1 |
| Navy action text `#07131f` | Bright brass `#d6b878` | 9.79:1 |

## Responsive accessibility

The required viewport matrix passes without horizontal document overflow, hidden primary actions, or result-heading collisions. Mobile uses single-column ownership and review structures, a full-width dossier, full-width primary actions, and a one-choice-at-a-time Operation rail.

## Manual release signoff

Before a public release, complete one VoiceOver + Safari journey using the final production URL. Confirm chapter announcements, radio/checkbox state, validation descriptions, and local-to-live quote status language after the real endpoint is connected.
