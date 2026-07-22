# Process Page — Design QA

Date: 2026-07-16
Target: `process.html`
Preview used for QA: `http://127.0.0.1:8063/process.html`
Production-local target: `http://127.0.0.1:8062/process.html`

## Source of truth

- Mockup: `design-reference/route-command-process-refinement.png`
  - Source raster: 854 × 1842
  - Proportional desktop evaluation: 1440 × 3106
- Official logo used directly:
  - `assets/Shelton Brand Assets/brand/shelton-mark-white.svg`
- Existing site system inspected and retained:
  - `assets/css/site.css`
  - `assets/js/site.js`
- Process implementation:
  - `process.html`
  - `assets/css/process-story.css`
  - `assets/js/process-story.js`

The supplied mockup includes photography, but the implementation deliberately uses no photos or generated image assets, per the project direction. The hero and all seven process media regions are intentionally blank navy surfaces. This is an approved difference, not an open QA finding.

## Final captures

- Integrated desktop top, 1440 × 900: `design-qa-artifacts/process-site-integration-1440x900.png`
- Integrated desktop full-page reconstruction, 1440 × 3149: `design-qa-artifacts/process-integrated-desktop-full-final.png`
- Full-view reference and implementation comparison: `design-qa-artifacts/process-integrated-comparison-final.png`
- Focused desktop top comparison: `design-qa-artifacts/process-integrated-top-comparison-final.png`
- Laptop-height desktop, 1280 × 720: `design-qa-artifacts/process-short-1280x720.png`
- Wide desktop, 1920 × 1080: `design-qa-artifacts/process-refined-1920x1080.png`
- Mobile top, 390 × 844: `design-qa-artifacts/process-mobile-top-final.png`
- Integrated mobile menu: `design-qa-artifacts/process-site-integration-mobile-390x844.png`
- Mobile Route Command dialog: `design-qa-artifacts/process-mobile-route-command-final.png`
- Mobile Pickup stage: `design-qa-artifacts/process-mobile-pickup-final.png`

## Comparison findings and fixes

| Severity | Region | Finding | Fix | Result |
| --- | --- | --- | --- | --- |
| P1 | Mobile shell | The original off-canvas navigation transform doubled the document width at 390 px. | Reworked the mobile menu transition to use opacity and pointer events, then constrained page overflow. | Resolved; document and body widths both measure 390 px. |
| P1 | Process sections | Global site `section` padding leaked into the custom hero and stage rows, changing the mockup's measured proportions. | Explicitly reset padding on the Process hero and stage components. | Resolved. |
| P2 | Full composition | First pass rendered 3882 px tall at 1440 px wide, materially looser than the reference's proportional 3106 px height. | Tightened hero height, stage padding/type scale, CTA spacing, and Process-specific footer spacing. | Resolved; final page is 3105 px tall. |
| P2 | Brand | The first logo variant had navy artwork and disappeared against the dark navigation. | Switched to the supplied official dark-background lockup SVG. | Resolved; logo is visible and remains an unmodified source asset. |
| P2 | Route Command dialog | The first dialog pass aligned to the upper-left corner. | Centered the native dialog with fixed positioning, inset, automatic margins, and a bounded mobile width. | Resolved at desktop and 390 × 844. |
| P2 | Mobile controls | View toggles, finish options, Route Command links, and footer links had sub-44 px tap areas. | Added mobile-only minimum tap dimensions while preserving the mockup's visual density. | Resolved for primary and supporting controls. |
| P2 | Capture accuracy | Sticky navigation, tracker, and rail could repeat during stitched full-page QA captures. | Added a query-driven capture state that makes sticky regions static only for QA and hides capture scrollbars. | Resolved; product behavior remains sticky in the normal route. |
| P1 | Wide desktop hero | At 1600 px and wider, the fixed 704 px copy column forced the headline into three lines and increased the hero to 735 px tall. | Expanded the large-desktop copy measure to 832 px while preserving the display scale. | Resolved; the headline stays on two lines and the hero remains approximately 632 px tall at 1600, 1728, and 1920 px widths. |
| P1 | Hero view control | The absolutely positioned view switcher expanded across most of the hero instead of staying as a compact top-right control. | Set an explicit `max-content` width with a safe viewport maximum. | Resolved; final control width is 186 px across desktop sizes. |
| P1 | Laptop-height Route Command | The customer-facing Route Command action fell below the visible rail at 1280 × 720 and 1366 × 768. | Added height-aware rail density: reduced vertical spacing, suppressed the lowest-value account ID on short desktops, and kept the primary portal action visible. | Resolved; both the button and service-change entry are visible at 1280 × 720. |
| P2 | Website integration | The first Process implementation used a custom logo lockup and footer taxonomy instead of the site's shared navigation and directory structure. | Reused the site's brand-mark/copy header, active navigation behavior, footer categories, versioned shared CSS/JS, and existing internal links. | Resolved; navigating from the homepage loads `/process.html` with Process active. |
| P1 | Live navigation cache | Unversioned Process links could reopen the browser's cached legacy Process document after the new file was installed. | Versioned the Process navigation and footer destination across the production pages as `process.html?v=20260716b`. | Resolved; a live homepage click loads the Route Command implementation with the Process state active. |

## Final visual assessment

- Composition: the left Route Command rail, hero, seven-stage tracker, alternating copy/media grid, CTA, and footer follow the reference structure and proportions.
- Typography: Shelton's existing Cormorant Garamond and Inter system is retained, with the reference's display/body hierarchy reproduced.
- Color and surfaces: navy, cream, gold, green service status, fine borders, and square-edged utility surfaces match the reference direction.
- Assets: both visible images are the official Shelton mark SVG used by the shared header and footer. No photo, generated photo, inline SVG illustration, CSS illustration, or placeholder image asset is present.
- Responsive behavior: 1024, 1280, 1366, 1440, 1536, 1600, 1728, and 1920 px desktop checks plus 390 × 844 mobile show no page-level horizontal overflow, clipping, or control overlap.
- Final unresolved P0/P1/P2 visual findings: none.

## Interaction verification

Verified in the in-app browser:

- Main navigation and mobile navigation menu open/close behavior.
- Homepage `Process` navigation enters `/process.html?v=20260716b` and preserves the shared Shelton header, active navigation state, footer, and internal route links.
- `Start the route` scrolls to Pickup and updates the URL hash.
- Both the Route Command journey and the top stage tracker navigate between all seven stages and keep their active state synchronized.
- Finish options update `aria-pressed`, checkpoint text, and customer-facing finish copy.
- `From Cab` / `Inside Plant` updates active state, `aria-pressed`, and the route status label.
- Route Command buttons open the native modal; Close dismisses it.
- Official logo assets load successfully.
- Desktop browser console: no errors or warnings.
- Mobile browser console: no errors or warnings.

## Responsive measurements

- Desktop viewport: 1440 × 900
  - Page width: 1440
  - Page height: 3149
  - Hero height: 632
  - Route Command rail width: 245
  - Stage heights: 274, 312, 254, 281, 254, 292, 292
  - Footer height: 253
- Laptop desktop viewport: 1280 × 720
  - Page width: 1280
  - Horizontal overflow: none
  - Route Command button: visible in the initial screen
- Wide desktop viewport: 1920 × 1080
  - Page width: 1920
  - Horizontal overflow: none
  - Headline: two lines
  - Hero height: 633
- Mobile viewport: 390 × 844
  - Document width: 390
  - Body width: 390
  - Horizontal overflow: none

## Code and build checks

- `node --check assets/js/process-story.js`: pass
- `node --check assets/js/site.js`: pass
- Local `href` and `src` reference check: 29 checked, none missing
- Browser render/load check at desktop and mobile: pass
- Photo/generated-image scan across Process HTML, CSS, and JS: pass; none found
- Formal lint/build scripts: not available because this is a static HTML/CSS/JS site with no `package.json` or configured build pipeline.

## Not yet verifiable

- Route Command authentication, account lookup, live route events, dispatch timing, and customer data are not connected in this static frontend. The modal states this clearly and routes users to request account access.
- No hardware, delivery vehicle, scanner, plant equipment, or backend integration behavior can be confirmed from the local static site.

## Final Result

final result: passed

# About Page — Warm Folded-Towel Timeline QA

Date: 2026-07-21
Target: `about.html`
Verified preview: `http://localhost:8062/about.html?v=20260721-warm-terry-v4`

## Source of truth

- User-supplied color and folded-towel reference: `design-reference/about-folded-towel-warm-reference.png`
  - Source raster: 994 × 1090
  - Source density: 144 ppi
- Existing approved terry texture used directly: `assets/images/generated/about-terry-pile-white-v2.webp`
- Existing woven hem texture used directly: `assets/images/generated/about-linen-weave-v1.png`
- Implementation files inspected:
  - `about.html`
  - `assets/css/site.css`
  - `assets/js/site.js`

The About-page video montage is outside this change and was left untouched. The previously approved Pricing-aligned desktop container remains intentionally wider than the supplied reference.

## Final captures

- Reference-size implementation viewport, 994 × 1090: `design-qa-artifacts/about-warm-towel-reference-size-final.png`
- Same-input reference and implementation comparison: `design-qa-artifacts/about-warm-towel-comparison-final.png`
- Wide desktop viewport, 1440 × 900: `design-qa-artifacts/about-warm-towel-desktop-final.png`
- Mobile viewport, 390 × 844: `design-qa-artifacts/about-warm-towel-mobile-final.png`

## Comparison findings and fixes

| Severity | Region | Finding | Fix | Result |
| --- | --- | --- | --- | --- |
| P1 | Towel color | The preceding material pass was cooler and brighter than the user's selected warm ivory reference. | Restored a warm `#faf4e8` towel base and multiplied it through the existing neutral terry texture; the beige page background was preserved. | Resolved. |
| P1 | Stacked towel geometry | The eight folded headers used different heights and small asymmetric side margins. | Standardized every desktop header to 5.75 rem, every mobile header to 4.75 rem, and removed per-row width offsets while preserving the approved container width. | Resolved; all eight rows measure identically at each verified viewport. |
| P2 | Towel material | The folds needed clearer terry pile and stronger contact depth to read as folded towels. | Increased the terry texture scale, kept the woven selvedge and hem, warmed the edge treatment, and added tight contact plus soft falloff shadows. | Resolved. |
| P2 | Open towel header | The expanded towel's heading used a different height from the closed rows. | Tied the open heading to the same fold-height token as every closed header. | Resolved. |

## Final visual assessment

- Color: the towels return to the selected warm ivory family while retaining the current beige page field.
- Material: the existing terry pile is visibly readable; woven selvedges, front hems, lower-edge shading, and contact shadows reinforce the folded-towel construction.
- Geometry: all eight towel headers are equal in width and height. The open towel naturally expands only below its same-size header to reveal archival content.
- Layout: the previously approved wider desktop treatment remains aligned with the Pricing-page margin system.
- Final unresolved P0/P1/P2 visual findings: none.

## Interaction and responsive verification

Verified in the in-app browser on port 8062:

- Reference viewport 994 × 1090: eight headers at 888 × 92 px; no horizontal overflow.
- Wide desktop 1440 × 900: eight headers at 1178 × 92 px; no horizontal overflow.
- Mobile 390 × 844: eight headers at 364 × 76 px; no clipping or horizontal overflow.
- Accordion selection moves from the 1955 towel to another towel and back while maintaining exactly one open item.
- Current CSS cache key `site.css?v=20260721-warm-terry-v4` is loaded.
- Page, stylesheet, terry texture, woven texture, and sampled archive images return HTTP 200 from port 8062.
- Browser console: no errors or warnings.

## Code and build checks

- `git diff --check -- about.html assets/css/site.css`: pass
- `node --check assets/js/site.js`: pass
- Formal lint/build scripts: not available because this is a static HTML/CSS/JS site with no `package.json` or configured build pipeline.

## Not yet verifiable

- No hardware, route equipment, backend, or archive-management integration is part of this visual-only timeline refinement.

## Final Result

final result: passed
