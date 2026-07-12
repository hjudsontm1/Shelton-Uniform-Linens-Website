# Shelton Pricing Vector System

## Purpose

The Pricing and Estimate experience uses a single custom vector language to make the customer’s selected operation and physical goods visible throughout the journey. The system is illustrative support, not decoration: it shows what is being processed, how it returns, and which commercial setting the recommendation is being built around.

## Source and boundary

- Renderer: `assets/js/pricing-journey-vectors.js`
- Public API: `SheltonPricingJourneyVectors.renderScene(container, options)`
- Format: trusted inline SVG assembled from canonical local configuration
- External icon or illustration dependencies: none
- Raster imagery: none
- Stable scene coordinate system: `900 × 330`

Each active scene owns one SVG and one local definitions block. No more than six goods are rendered at once. Inactive chapter scenes are removed, limiting paint and avoiding duplicate active filter work.

## Visual language

- Deep navy architectural field
- Parchment and warm-gray textiles
- Muted brass seams, baselines, labels, and service-return structures
- Non-scaling strokes for stable line weight
- Restrained fabric gradients and one static object shadow
- Fine background grid and commercial operation linework
- No stock icons, photographic placeholders, emoji styling, neon color, or mixed illustration families

The linework is intentionally quieter than the physical goods. Goods remain the primary object; the operation backdrop supplies context without becoming a separate illustration panel.

## Operation backdrops

Every configured operation has a specific scene contract:

| Operation ID | Scene context |
| --- | --- |
| `hotel` | Linen-cart return |
| `str` | Central turnover staging |
| `spa` | Treatment-room flow |
| `gym` | Peak-use towel rack |
| `events` | Presentation, color, and deadline rail |
| `restaurant` | Kitchen and dining-room line |
| `casino` | Department, shift, and banquet-volume markers |
| `uniforms` | Organized garment rail |
| `wholesale` | Batch capacity, pressing, and turnaround line |
| `other` | Goods-led neutral structure |

The operation IDs must match `pricing-journey-config.js` exactly. Event and Uniform use the plural IDs `events` and `uniforms`.

## Goods primitives

The renderer reuses a consistent set of physical primitives:

- Folded sheets, duvet covers, blankets, table linens, and banquet linens
- Towel, hand-towel, bath-mat, and bar-towel stacks
- Napkin stack
- Robe and choir robe
- Chef coat and casino uniform coat
- Uniform shirt, dress shirt, and workwear shirt
- Jacket, suit, dress, and specialty garment
- Apron
- Draped tablecloth
- Rolled runner and specialty event textile
- Skirting
- Chair cover
- Face-cradle cover

Every configured good resolves to one of these primitives. The fallback remains a folded textile so an unknown future good cannot break rendering, but configured goods should always be mapped intentionally.

## Composition rules

- One selected good receives a larger centered presentation so the scene does not feel vacant.
- Two goods use a balanced paired composition.
- Three to six goods step down progressively while preserving readable silhouettes.
- Captions and baselines stay aligned to each object.
- Later chapters use selected-only composition, so the visual program becomes more specific as the customer progresses.

## State system

Available goods render at balanced contrast. Selected goods rise, brighten, and receive brass caption and baseline treatment. Compatible but unselected goods recede through opacity and scale. Selection is never communicated by color alone: the associated semantic controls expose checked state, visible selected language, and keyboard focus.

Finish and return selections add approved structural overlays:

- Pressed finish lines
- Hanging rail
- Poly protection
- Bundling straps
- Bagged return
- Linen-cart return
- Identifying tag
- Folded-ready signal

## Responsive behavior

- Desktop and laptop scenes use stable bounded heights so the related question and action remain in the useful viewport.
- Tablet scenes remain in normal chapter flow above controls.
- Mobile preserves the focal object and meaningful operation/return geometry while removing micro-captions that cannot remain legible.
- Scene SVGs always use their viewBox and never resize the layout when goods change.

## Motion and accessibility

- Selection transitions use only transform and opacity.
- Backdrops and SVG paths do not continuously animate.
- `prefers-reduced-motion` reduces transitions to effectively immediate changes.
- Scenes are presentational and hidden from assistive technology; the labeled controls carry the equivalent names and states.
- Text contrast and line contrast are tuned independently so labels remain readable without competing with the goods.

## Production QA checklist

- Confirm every operation ID renders its own backdrop.
- Confirm every configured good renders a non-empty primitive.
- Confirm one through six selected goods stay inside the `900 × 330` viewBox.
- Confirm selected, available, and receded treatments remain distinguishable without relying on hue alone.
- Confirm return overlays do not obscure the selected goods or captions.
- Confirm desktop, tablet, and mobile scene containers remain nonblank and do not shift chapter layout.
- Confirm reduced-motion mode removes meaningful animation delay.
