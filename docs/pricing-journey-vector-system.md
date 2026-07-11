# Pricing Journey Vector System

## Implementation

- Source: `assets/js/pricing-journey-vectors.js`
- Rendering boundary: `SheltonPricingJourneyVectors.renderScene(container, options)`
- Format: custom inline SVG generated from trusted canonical configuration
- External dependencies: none
- Raster assets: none

## Visual Grammar

- Shared 900x330 scene coordinate system
- Cream, warm gray, charcoal, and muted-gold palette
- Consistent non-scaling strokes, seams, folds, baselines, and caption treatment
- Restrained fabric gradients and one static drop shadow
- No faces, emoji styling, stock icon pack, neon treatment, or mismatched illustration families

## Reusable Physical Primitives

- Folded linen, towel, and napkin stacks
- Robe
- Chef coat and casino coat
- Uniform shirt and workwear shirt
- Jacket, suit, dress, and choir robe
- Apron
- Draped tablecloth
- Rolled runner and specialty textile
- Skirting
- Chair cover
- Face cradle cover

Every configured good maps to one of these primitives. Operation-specific backdrops add useful commercial context such as a linen cart, central turnover staging, treatment-room flow, towel rack, event deadline rail, kitchen/dining line, department markers, garment rail, or wholesale conveyor.

## Selection States

- Available: all compatible goods render at balanced contrast before selection.
- Selected: object rises slightly, receives the brighter fabric treatment, and gains a gold baseline/caption.
- Receded: compatible but unselected objects remain visible at low opacity without disappearing.
- Selected-only: later assembled scenes contain selected IDs only and recalculate the composition for one to six objects.

Selection is never communicated by color alone. The semantic Goods buttons retain `role="checkbox"`, `aria-checked`, visible selected copy, focus outline, and the same item labels.

## Responsive And Motion Behavior

- Desktop and laptop use a stable scene height so selection controls remain visible at 1366x768.
- Tablet places the scene in normal document flow above education and Goods controls.
- Mobile keeps the scene clipped inside its container, removes micro captions that would be unreadable, and relies on the labeled controls below.
- Only opacity and transform transition on selection; paths, filters, and backdrops do not animate.
- Reduced motion shortens all selection transitions to 1ms through the journey-wide motion policy.

## Performance Boundary

Each active Goods scene contains one SVG, one defs block, one operation backdrop, and no more than six object groups. The inactive Goods SVG is removed before the assembled foundation SVG is created, avoiding duplicate definition collisions and unnecessary rendering work.

