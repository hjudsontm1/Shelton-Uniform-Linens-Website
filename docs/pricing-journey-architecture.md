# Adaptive Pricing Journey Architecture

## Scope And Isolation

- Production page: `pricing.html` is frozen and unchanged.
- Private preview: `pricing-journey-preview.html` is `noindex, nofollow, noarchive`, absent from public navigation, robots, and sitemap references.
- Working branch: `feature/adaptive-pricing-journey` in a dedicated sibling worktree.
- Journey styling, configuration, vectors, controller, rules, tests, and artifacts are isolated to Pricing-journey files.
- The preview never calls the existing live quote endpoint and makes no non-GET request.

## Experience Model

The visitor assembles a commercial laundry program in one continuous dark textile-studio canvas. The page uses normal browser scrolling and does not expose an application shell, sticky progress rail, permanent sidebar, or empty manifest.

Journey order:

1. Contained woven-service-seal landing
2. Operation
3. Goods
4. Scale and operating signals
5. Finish, return, and specialty needs
6. Inventory ownership
7. Location
8. Assembled review
9. Recommended program and development planning range
10. Exact-quote handoff shell

Completed chapters condense into 72-104px open notes with the answer and an `Edit` action. The only major contained surface is the final parchment service dossier.

## State Architecture

`pricingJourneyState` is the single serializable source of truth:

```js
{
  version: 4,
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
  contact: {
    name: "",
    business: "",
    email: "",
    phone: "",
    preferredContact: "",
    notes: ""
  },
  developmentMode: true
}
```

State rules:

- Canonical configuration drives labels, choices, education, validation, vectors, and dependency cleanup.
- Selecting a new operation preserves compatible answers and removes incompatible downstream answers with a live status message.
- Selected goods alone move into Scale, Finish, Review, and Result scenes.
- State persists to a versioned session-storage key and restores the active result/handoff safely.
- `Start Over` clears only private-preview state.

## Canonical Operation Branches

- `hotel`: Hotel / Boutique Stay
- `str`: STR / Property Manager
- `spa`: Spa / Wellness
- `gym`: Gym / Fitness
- `events`: Event / Venue / Convention Center
- `restaurant`: Restaurant / Food Service
- `casino`: Casino / Entertainment
- `uniforms`: Uniform Account
- `wholesale`: Wholesale Dry Cleaning
- `other`: Other / Not Sure

Each branch defines relevant goods, scale inputs and units, operational signals, compatible finish/return states, specialty prompts, educational copy, vector context, and development-only pricing factors.

## Rendering Boundaries

- `pricing-journey-preview.html`: semantic private shell and noindex metadata.
- `assets/css/pricing-journey.css`: isolated visual tokens, layouts, interaction states, responsive compositions, and reduced-motion policy.
- `assets/js/pricing-journey-config.js`: canonical branches and content.
- `assets/js/pricing-journey-vectors.js`: reusable inline SVG goods and contextual scenes.
- `assets/js/pricing-journey.js`: rendering, state transitions, validation, focus, persistence, and local quote payload.
- `assets/js/pricing-rules.dev.js`: deterministic and replaceable development calculations.

No framework or external runtime was introduced. Rendering uses semantic DOM APIs and event delegation.

## Visual Architecture

- One near-black navy canvas with subtle woven grain and localized object light.
- Contained matte woven seal physically separate from the landing copy, with one integrated `Begin` tab.
- Horizontal editorial rails for Operation, Goods, Finish, and specialty choices.
- Numeric Scale steppers paired with semantic inputs and branch-specific `Not sure` paths.
- Open ownership service paths, minimal ZIP/city location field, and a small route-resolution marker.
- Review uses a selected-goods scene and editable atelier-note lines rather than a dashboard or form table.
- Result places range, rhythm, model, comparison, evidence, and actions inside one parchment dossier.

## Motion And Focus

- Motion communicates seal activation, selection, chapter completion, narrowing, and finish transformation.
- Transforms and opacity are preferred; there is no parallax, particle field, bounce, path animation, or scroll hijacking.
- Focus moves to the revealed chapter heading after user activation.
- Reduced motion removes smooth-scroll dependence and shortens transitions to effectively immediate state changes.

## Responsive Strategy

- Desktop/laptop: editorial two-column scenes with controls visible at 1440x900, 1366x768, and 1280x800.
- Tablet: scenes stack above controls while the continuous grid and hierarchy remain intact.
- Mobile: intentionally composed single-column landing, horizontal choice rails where useful, full-width actions, 44px minimum audited targets, and no horizontal document overflow.
- Browser scrolling remains natural at every viewport; controls are not trapped inside internal scroll panes except intentional horizontal rails.

## Development Pricing Boundary

The UI calls:

```js
calculatePlanningRange(pricingJourneyState, pricingRules)
```

The renderer contains no rates. Every result displays `DEVELOPMENT ESTIMATE - NOT APPROVED PRICING`. Exact-quote handoff prepares a local payload, explicitly states that nothing was submitted, and never calls Formspree or another endpoint.

## Verification Boundary

- Static syntax and canonical configuration tests.
- Deterministic pricing-rule tests.
- Browser paths for inputs, narrowing, editing, result, and no-submit handoff.
- Keyboard-only completion, semantic audit, error recovery, session restoration, reduced motion, 200% reflow equivalent, and touch-target checks.
- Viewport matrix at desktop, laptop, tablet, and two mobile sizes.
- Console, overflow, non-GET request, resource-count, and cumulative-layout-shift checks.
