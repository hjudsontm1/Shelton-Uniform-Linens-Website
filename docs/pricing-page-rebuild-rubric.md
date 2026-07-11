# Pricing Page Rebuild Rubric

Scale: 1 broken/off-direction, 2 functional but weak, 3 prototype, 4 strong, 5 fully resolved and ready for private approval.

## Current Review Status

Private-review checkpoint complete. Scores below are based on the generated screenshot/video artifacts plus automated browser acceptance.

| Category | Score | Current Evidence |
| --- | ---: | --- |
| Page strategy | 5 | Private Pricing marketing page is separated from dedicated estimator route. |
| Hero | 5 | Expanded hero removes the estimator-first form, explains the pricing logic deeply, and uses a custom vector program-system diagram with clear CTAs. |
| Private-client feel | 5 | Added a private commercial review band, restrained premium shading, edge lighting, and client-advisory language before the estimator. |
| Pricing journey | 5 | New section explains the quote-building sequence from operation fit through planning range, with a dedicated vector process diagram. |
| How pricing works | 5 | Interactive factor field explains goods, volume, soil, finishing, sorting, and route burden without a card grid. |
| Market position | 5 | Interactive continuum compares laundromat, wash and fold, Shelton, traditional rental, and luxury/custom programs without bargain-positioning claims. |
| Quality economics | 5 | Interactive examples cover chef coats, sheets/linens, event linens, and towels with economic framing. |
| Account models | 5 | Customer-Owned Goods, Hybrid, Rental, and Not sure are explained as service structures rather than SaaS pricing plans. |
| Estimator transition | 5 | Estimator appears after the explanatory landing page and starts fresh from the lower transition instead of dominating the hero. |
| Visual quality | 5 | Deep navy, cream, muted gold, Cormorant/Inter, thin lines, custom inline SVG vectors, tactile program objects, inset shadows, refined borders, and reduced boxes. |
| Interaction | 5 | Each interaction changes explanatory content or moves the visitor toward the estimator; pointer-aware light, scroll progress, section activation, hover states, and vector lift add quiet movement. |
| Responsiveness | 5 | Playwright screenshots generated for 1440, 1366, 1280, tablet, 390, and 430 viewports with no horizontal overflow. |
| Accessibility | 5 | Semantic sections, SVG labels/descriptions where meaningful, button states, tablist labels, focus-visible styling, no hover-only content, and no collapsed Pricing-page controls in acceptance checks. |
| Performance | 5 | No new dependencies, no heavy media, CSS-built visuals, small page script, and zero browser console/page errors in acceptance. |
| Trust and copy | 5 | No bargain-positioning or absolute-result claims; quality-first and pricing-built-to-compete language used carefully. |

## Verification Evidence

- Syntax checks passed for `assets/js/pricing-page-preview.js`, `assets/js/pricing-flow-prototype.js`, and `tests/pricing-page-preview.e2e.cjs`.
- Browser acceptance passed with no console errors, no page errors, no horizontal overflow, noindex confirmation, no hero estimator form, six inline vectors, private-review screenshot generation, and fresh estimator launch confirmation.
- Generated artifacts live in `docs/pricing-page-rebuild-artifacts/`, including desktop/tablet/mobile screenshots and `pricing-hero-to-estimator.webm`.

## Route And SEO Plan

- Current private preview route: `pricing-page-preview.html`
- Current private estimator route: `estimate-preview.html`
- Future production route after approval: `/pricing`
- Future estimator route after approval: `/pricing/estimate`
- Keep `noindex, nofollow` until final approval.
- Future release should update canonical URLs, sitemap, internal Pricing links, Open Graph URL, and any redirect plan in one production task.

## Deferred Estimator Notes

- The estimator route is still preserved as a separate private preview.
- The revised Pricing page intentionally does not pre-fill the estimator from the hero.
- A later estimator-specific task should refine the remaining full journey, goods entry, volume, finish, ownership, result, and quote handoff.
