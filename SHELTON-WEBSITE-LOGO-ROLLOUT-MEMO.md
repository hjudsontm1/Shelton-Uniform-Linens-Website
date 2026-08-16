# Memo: Shelton Website Logo Rollout

**To:** Website implementation team  
**From:** Shelton brand owner  
**Date:** July 23, 2026  
**Subject:** Replace website logo artwork with the approved Shelton logo packet

## Objective

Replace every customer-facing website logo with an approved, unmodified asset from the Shelton Complete Logo Packet. Do not rebuild the mark in HTML, retype the company name beside it, trace it, recolor it, or generate a substitute.

## Approved website assets

Copy only the needed vector masters into the project's managed brand-assets directory, preserving their filenames and SVG contents:

- Dark header or footer: `logos/shelton-primary-horizontal-dark.svg`
- Cream or light header: `logos/shelton-primary-horizontal-light.svg`
- Browser icon: `master-marks/shelton-favicon.svg`

Use the Primary Horizontal layout for normal website headers. Use another packet layout only when the placement is genuinely narrow, square, or editorial and the packet README identifies that layout for the application.

## Implementation instructions

1. Read the destination project's brand README and locate every logo reference in templates, components, page files, CSS, metadata, manifests, and static assets.
2. Replace any old standalone mark plus live-text wordmark construction with one complete approved SVG lockup.
3. Use the `dark` SVG on navy or dark photography and the `light` SVG on cream or light backgrounds.
4. Preserve the SVG aspect ratio with `width: 100%; height: auto;`. Do not stretch, crop, filter, shadow, mask, or CSS-recolor the artwork.
5. Keep the logo's home link accessible. If the link already has an `aria-label`, use an empty image `alt` so assistive technology does not announce the brand twice.
6. Update every favicon reference to the packet favicon. Remove cache-stale URLs or bump the shared stylesheet/asset version when the site relies on long-lived caching.
7. Do not delete historical logos or a brand-gallery page unless that cleanup is separately approved. They may remain as reference material, but customer-facing templates must not point to them.

Recommended accessible markup:

```html
<a class="nav-brand" href="/" aria-label="Shelton Linen and Uniform Services home">
  <img
    class="nav-brand-logo"
    src="/assets/brand/shelton-primary-horizontal-dark.svg"
    alt=""
    width="1900"
    height="480"
    aria-hidden="true"
  />
</a>
```

Recommended responsive sizing:

```css
.nav-brand {
  width: clamp(14.5rem, 22vw, 17.25rem);
}

.nav-brand-logo {
  display: block;
  width: 100%;
  height: auto;
}
```

## Quality check

Confirm all of the following before handoff:

- Every customer-facing header and footer uses a packet SVG.
- Light and dark variants match their backgrounds.
- The logo remains legible and uncropped at desktop and mobile widths.
- The home link and mobile navigation still work.
- No old PNG logo or live-text recreation remains in active templates.
- The favicon loads from the approved packet.
- All referenced files exist and parse as valid SVG/XML.
- The site completes its normal build or static validation with no missing-asset errors.

## Required license checkpoint

The packet states that Sharp Grotesk Medium 25 was supplied as a personal-use trial and must be licensed before commercial production or public deployment. The logo lettering is outlined, but that does not remove the underlying font-license requirement. Confirm the commercial web/brand-use license before publishing these lockups publicly.
