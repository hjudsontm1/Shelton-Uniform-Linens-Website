import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const outputDir = path.join(root, "design-reference/mt45-branding");
const referenceMockup = path.join(
  outputDir,
  "shelton-mt45-route-stripe-approved-lockup-v13.png",
);

const gold = "#B8965A";

function bandTop(x) {
  return 595 + ((551 - 595) * (x - 548)) / (1318 - 548);
}

function bandBottom(x) {
  return 665 + ((604 - 665) * (x - 550)) / (1318 - 550);
}

function insideBandInterior(x, y) {
  if (x < 580 || x > 1260) return false;
  return y >= bandTop(x) + 8 && y <= bandBottom(x) - 8;
}

const { data, info } = await sharp(referenceMockup)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixelCount = width * height;
const textMask = new Uint8Array(pixelCount);

// Detect only the existing bright cream/gold contact lettering inside the
// navy-band interior. The gold pinstripe and both band edges are excluded.
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (!insideBandInterior(x, y)) continue;
    const pixel = y * width + x;
    const offset = pixel * channels;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (red + green + blue > 135 && red > 42 && green > 38) {
      textMask[pixel] = 1;
    }
  }
}

// Include antialiased edges around each detected character.
const expandedMask = new Uint8Array(textMask);
const radius = 3;
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const pixel = y * width + x;
    if (!textMask[pixel]) continue;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        if (dx * dx + dy * dy > radius * radius) continue;
        if (!insideBandInterior(nx, ny)) continue;
        expandedMask[ny * width + nx] = 1;
      }
    }
  }
}

const cleaned = Buffer.from(data);

// Reconstruct the local navy texture from the nearest untouched pixels above
// and below each character instead of painting a flat rectangle over the band.
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const pixel = y * width + x;
    if (!expandedMask[pixel]) continue;

    let upper = -1;
    let lower = -1;
    for (let distance = 1; distance <= 24; distance += 1) {
      const upperY = y - distance;
      if (
        upper < 0 &&
        upperY >= 0 &&
        insideBandInterior(x, upperY) &&
        !expandedMask[upperY * width + x]
      ) {
        upper = upperY;
      }

      const lowerY = y + distance;
      if (
        lower < 0 &&
        lowerY < height &&
        insideBandInterior(x, lowerY) &&
        !expandedMask[lowerY * width + x]
      ) {
        lower = lowerY;
      }

      if (upper >= 0 && lower >= 0) break;
    }

    const outputOffset = pixel * channels;
    for (let channel = 0; channel < 3; channel += 1) {
      if (upper >= 0 && lower >= 0) {
        const upperValue = data[(upper * width + x) * channels + channel];
        const lowerValue = data[(lower * width + x) * channels + channel];
        cleaned[outputOffset + channel] = Math.round(
          (upperValue + lowerValue) / 2,
        );
      } else if (upper >= 0 || lower >= 0) {
        const sourceY = upper >= 0 ? upper : lower;
        cleaned[outputOffset + channel] =
          data[(sourceY * width + x) * channels + channel];
      }
    }
  }
}

const cleanedBand = await sharp(cleaned, {
  raw: { width, height, channels },
})
  .png()
  .toBuffer();

const contactSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="590" height="76" viewBox="0 0 590 76">
    <style>
      .contact { font-family: Inter, Arial, sans-serif; font-weight: 500; }
    </style>
    <g transform="rotate(-3.2 0 43)">
      <text class="contact" x="0" y="44" fill="${gold}" font-size="29" letter-spacing="0.65">(000) 000-0000</text>
      <circle cx="254" cy="34" r="3.4" fill="${gold}"/>
      <text class="contact" x="282" y="44" fill="${gold}" font-size="29" letter-spacing="0.25">sheltonlinen.com</text>
    </g>
  </svg>
`);

const contact = await sharp(contactSvg).png().toBuffer();

const output = path.join(
  outputDir,
  "shelton-mt45-route-stripe-approved-contact-v14.png",
);

await sharp(cleanedBand)
  .composite([{ input: contact, left: 660, top: 578 }])
  .png()
  .toFile(output);

console.log(output);
