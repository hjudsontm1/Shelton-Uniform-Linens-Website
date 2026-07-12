# Pricing and Estimate Performance Report

## Outcome

The private Pricing journey is dependency-light, layout-stable, and visually responsive. The final Chromium run reports zero console errors, zero unexpected non-GET requests, no horizontal overflow, and zero measured cumulative layout shift in the focused performance suite.

## Measured baseline

- Local journey resources: 7
- Measured CLS: 0
- Unexpected non-GET requests: 0
- Console/page errors: 0
- Active source size before transport compression: 216,424 bytes
- Journey raster images: 0
- Maximum goods per active SVG scene: 6

Source-size detail:

| File | Bytes |
| --- | ---: |
| `pricing-journey-preview.html` | 22,662 |
| `assets/css/pricing-journey.css` | 91,816 |
| `assets/js/pricing-journey.js` | 53,009 |
| `assets/js/pricing-journey-config.js` | 22,898 |
| `assets/js/pricing-journey-vectors.js` | 15,466 |
| `assets/js/pricing-rules.dev.js` | 10,573 |

## Production characteristics

- No application framework or runtime dependency
- Custom inline SVG assembled from local trusted configuration
- Inactive scenes are removed instead of accumulating hidden SVGs
- Selection motion uses transform and opacity
- One static SVG drop shadow; no page-wide animated filter
- Fixed scene dimensions prevent selection-driven layout shift
- Rail state updates are animation-frame scheduled and limited to four containers
- Session persistence is synchronous, small, and guarded when storage is unavailable
- Reduced-motion users receive effectively immediate transitions
- Retired Label and Portal concept styles were removed in the final pass

## Deployment note

The files are intentionally readable source in this static preview. A production host should serve Brotli/Gzip compression and long-lived caching for versioned CSS/JavaScript. Google Fonts remain the only external presentation dependency; system fallbacks preserve usable typography if the font request fails.
