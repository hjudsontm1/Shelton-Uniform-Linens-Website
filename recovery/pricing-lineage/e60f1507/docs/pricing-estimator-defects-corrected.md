# Pricing and Estimate Defects Corrected

| Defect | Resolution | Evidence |
| --- | --- | --- |
| Mobile Begin could reveal an almost blank viewport | Unified all chapter positioning behind a fixed-header-aware focus helper | `18-mobile-estimator-390x844.png` |
| Mobile Result heading clipped under the header | Removed Operation-only top scroll and stabilized focus before guided scroll | `19-mobile-result-390x844.png` |
| Selecting an Operation could move the full document | Replaced `scrollIntoView` with rail-only centering | Full desktop/mobile recordings |
| Orb states were too similar | Added distinct lift, focus ring, highlight, and pressed compression | `02-orb-hover-focus-1366x768.png` |
| Long horizontal rails lacked continuation feedback | Added overflow-aware edge treatment and bounded scrolling | Operation/Goods recordings |
| Scale inputs were compressed or left an awkward partial row | Four-field branches use 4 columns; five-field branches use 3 + 2 | `09-scale-1366x768.png`, `08-robes-only-1366x768.png` |
| Ownership used four narrow, low-contrast columns | Changed to readable 2 × 2 desktop treatment with stronger hierarchy | `11-ownership-1366x768.png` |
| Review extended beyond normal laptop height | Restored a compact 3 × 2 assembled answer field | `14-review-1366x768.png` |
| Quote action sat below normal laptop viewport | Reduced form-field height and consolidated contact-method layout | `16-quote-handoff-1366x768.png` |
| Event and Uniform vectors used the generic backdrop | Corrected operation IDs to `events` and `uniforms`; added regression assertions | `07-event-goods-1366x768.png`, unit test |
| Single-item visual felt vacant | Added a larger centered single-item composition | `08-robes-only-1366x768.png` |
| Scale controls lacked explicit names/error references | Added accessible labels, descriptions, and error-message associations | Accessibility suite/report |
| Location and quote errors were not explicitly associated | Added stable error IDs and `aria-errormessage` references | Validation evidence |
| Retired concept code remained in the active stylesheet | Removed unreachable Label/Portal CSS and dead switcher JavaScript | Performance report |
