# Adaptive Pricing Journey Architecture

## Scope And Isolation

- Production page: `pricing.html` is copied from the current real workspace and frozen.
- Private preview: `pricing-journey-preview.html` is noindex, absent from navigation, robots, and sitemap.
- Working branch: `feature/adaptive-pricing-journey`.
- The preview uses dedicated Pricing-journey CSS and JavaScript. It does not change Homepage or About copy.
- The existing quote form posts to Formspree. The preview will not call or modify that endpoint.

## Experience Model

The journey is one continuous page. Only the current chapter is immersive. Completed chapters condense into readable summaries with an `Edit` action and remain in normal document flow. Browser scrolling is never trapped or snapped.

Journey order:

1. Landing / Begin
2. Operation
3. Goods
4. Scale and operating rhythm inputs
5. Finish, return, and specialty needs
6. Inventory ownership
7. Location
8. Review
9. Recommended program and planning ranges
10. Exact-quote handoff shell

## State Architecture

`pricingJourneyState` is the single serializable source of truth:

```js
{
  version: 1,
  concept: "orb",
  activeChapter: "landing",
  completedChapters: [],
  operation: null,
  goods: [],
  scale: {},
  finish: [],
  specialtyNeeds: [],
  ownership: null,
  location: { type: null, value: "" },
  recommendation: null,
  contact: {},
  touched: {},
  developmentMode: true
}
```

State rules:

- Canonical config drives labels, choices, education, vectors, validation, and dependency cleanup.
- Selecting a new operation preserves compatible answers and removes incompatible answers with a visible status message.
- Selecting one good narrows later visuals and choices to that good.
- State persists to session storage with a versioned key.
- `Start Over` clears only the private preview state.

## Operation Branches

Canonical operations:

- `hotel`: Hotel / Boutique Stay
- `str`: STR / Property Manager
- `spa`: Spa / Wellness
- `gym`: Gym / Fitness
- `event`: Event / Venue / Convention Center
- `restaurant`: Restaurant / Food Service
- `casino`: Casino / Entertainment
- `uniform`: Uniform Account
- `wholesale`: Wholesale Dry Cleaning
- `other`: Other / Not Sure

Each branch defines:

- relevant goods
- scale inputs and units
- operating-rhythm signals
- finish/return options
- specialty prompts
- educational microcopy
- vector scene composition
- development pricing factors

## Rendering Architecture

- `pricing-journey-preview.html`: semantic shell and noindex metadata.
- `assets/css/pricing-journey.css`: isolated responsive visual system.
- `assets/js/pricing-journey-config.js`: canonical branch/content configuration.
- `assets/js/pricing-journey-vectors.js`: reusable inline SVG factories.
- `assets/js/pricing-journey.js`: state, rendering, validation, focus, and interaction.
- `assets/js/pricing-rules.dev.js`: deterministic replaceable development formulas.

No framework is introduced. Rendering uses semantic DOM APIs and event delegation.

## Landing Concepts

All concepts share copy, state, accessibility, and transition hooks while remaining visually distinct.

1. Textile Begin Orb: a suspended layered-fabric disc with one central Begin action.
2. Suspended Program Label: a physical fabric marker/label with stitched edge and pull action.
3. Typographic Portal: editorial type with one weighted physical start object crossing a threshold.

Query values: `?concept=orb`, `?concept=label`, and `?concept=portal`.

## Vector System

- Inline SVG only; no image generation or icon pack.
- Shared `viewBox`, stroke scale, muted cream/gray/gold palette, and material shading.
- Objects are composed from reusable garment, linen, cart, hanger, bag, bundle, and label primitives.
- Selected goods receive contrast and depth; unselected goods recede without disappearing.
- SVGs are decorative unless they are the actual selection control; labels remain semantic HTML.

## Motion

- Motion communicates selection, condensation, chapter reveal, and goods-to-finish transformation.
- Transform and opacity are preferred; no animated blur, particles, parallax, bounce, or scroll hijacking.
- Selection: 160-220ms. Condensation: 300-420ms. Reveal: 380-560ms.
- Reduced motion removes guided smooth scrolling and uses immediate state changes or short fades.

## Responsive Strategy

- Desktop: active chapter uses the useful viewport under the fixed header; editorial two-column scenes.
- Laptop: typography and scene widths compress without clipping at 1366x768 and 1280x800.
- Tablet: visual scene moves above controls where necessary; summaries remain horizontal when readable.
- Mobile: dedicated one-column compositions, compact program thread, minimum 44px targets, no horizontal overflow.
- The full viewport matrix runs only at Checkpoints 1, 3, 6, and 7.

## Accessibility

- Native buttons, inputs, fieldsets, legends, headings, lists, and status regions.
- Radio-like groups use native radio inputs where possible; multi-select goods use checkboxes.
- Focus moves to a newly revealed chapter heading only after user activation.
- Completed summaries remain navigable and their Edit controls reopen inline.
- Selection never relies on color alone.
- Dynamic dependency changes and recommendations are announced politely.
- Keyboard completion, 200% zoom, reduced motion, and touch targets are explicit Checkpoint 6 tests.

## Development Pricing Boundary

The UI calls:

```js
calculatePlanningRange(pricingJourneyState, pricingRules)
```

Development rules are deterministic, documented, and isolated. The result always displays `DEVELOPMENT ESTIMATE - NOT APPROVED PRICING`. The exact-quote stage produces a payload preview only and never calls the live Formspree endpoint.

## Test Plan

- Syntax: `node --check` for every journey JavaScript file.
- Markup/static smoke: localhost response and noindex/unlinked assertions.
- Interaction smoke: begin, operation selection, goods narrowing, edit, review, result, and handoff.
- State: compatible preservation, incompatible cleanup, session restore, Start Over.
- Accessibility: keyboard-only completion, focus order, status announcements, reduced motion, 200% zoom.
- Responsive: 1440x900, 1366x768, 1280x800, tablet, 390x844, 430x932.
- Performance: console errors, layout shift, oversized assets, animation property audit.

## Checkpoint Evidence

Each checkpoint records screenshots, tests, rubric scores, and defects under `docs/pricing-journey-artifacts/checkpoint-N/`. A checkpoint is committed only when the preview is runnable and its scoped smoke tests pass.
