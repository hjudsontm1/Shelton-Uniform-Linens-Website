# Shelton About Archive - Figma Image Grade

## Objective

Create one consistent archival treatment for every About-page montage image and TV story image. The target is warm black-and-white with a restrained beige/sepia cast that blends with the site's cream header and dark walnut TV.

Use `REFERENCE-desired-archive-tint.png` in the handoff package as the visual target.

## Treatment

- Convert images to grayscale or near-grayscale before adding warmth.
- Add a subtle beige/sepia tint; avoid orange, yellow, blue, or green casts.
- Slightly reduce contrast and soften bright highlights.
- Lift very dark source images only enough to retain useful detail.
- Normalize exposure so neighboring montage tiles feel like one archive installation.
- Preserve natural grain and age in historic photographs.
- Keep modern photographs subdued enough to sit comfortably beside historic images.
- Do not crop or alter the original aspect ratio.

## Suggested Starting Values

These are visual starting points, not strict requirements:

- Saturation: `0%` to `8%`
- Contrast: `-10%` to `-18%`
- Highlights: `-12%` to `-22%`
- Shadows: `+4%` to `+12%`
- Warm beige/sepia overlay: `#b7a783` at roughly `12%` to `18%`

## Export

- Color space: sRGB
- Format: WebP preferred, JPEG acceptable
- Long edge: 1600px maximum
- WebP quality: 80 to 84
- JPEG quality: 82 to 86
- Preserve each source basename and append `-graded`, for example:
  `shelton-cleaners-exterior-sign-graded.webp`
- Export each image individually; do not export the montage as one flattened image.

## Important

Keep the source files unchanged. The website can use the graded exports later, while retaining the originals for future crops or higher-resolution uses.
