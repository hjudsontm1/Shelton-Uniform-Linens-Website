import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const brandDir = path.join(root, "assets/Shelton Brand Assets/brand");
const outputDir = path.join(root, "design-reference/mt45-branding");
const referenceMockup = "/Users/jordanhudson/Downloads/Navy Strip van.png";
const cleanSidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";

const canvasWidth = 1448;
const canvasHeight = 1086;
const stripAngle = -4.8;

const vehicleLightSvg = await fs.readFile(
  path.join(brandDir, "shelton-vehicle-lockup-light.svg"),
);

async function renderSvg(svg, width) {
  return sharp(svg, { density: 300 })
    .resize({ width, fit: "contain" })
    .png()
    .toBuffer();
}

// Use the supplied Navy Strip van image as the positional master. Only the
// existing level lockup area is restored from the clean photograph; the navy
// band, gold pinstripe, contact line, and door mark remain untouched pixels.
const cleanPhoto = await sharp(cleanSidePhoto)
  .resize({ width: canvasWidth, height: canvasHeight, fit: "fill" })
  .png()
  .toBuffer();

const patchBox = { left: 570, top: 365, width: 630, height: 185 };
const cleanPatch = await sharp(cleanPhoto)
  .extract(patchBox)
  .ensureAlpha()
  .png()
  .toBuffer();

const featherMask = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${patchBox.width}" height="${patchBox.height}">
    <defs>
      <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="614" height="${patchBox.height - 16}" rx="14" fill="white" filter="url(#feather)"/>
  </svg>
`);

const featheredCleanPatch = await sharp(cleanPatch)
  .composite([{ input: featherMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// Render the canonical vehicle asset as one piece, then rotate the entire
// lockup—including its S—to the measured -4.8° dominant lower navy edge.
const fullLockup = await renderSvg(vehicleLightSvg, 600);
const rotatedFullLockup = await sharp(fullLockup)
  .rotate(stripAngle, {
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const output = path.join(
  outputDir,
  "shelton-mt45-navy-strip-reference-full-lockup-rotation-v10.png",
);

await sharp(referenceMockup)
  .composite([
    {
      input: featheredCleanPatch,
      left: patchBox.left,
      top: patchBox.top,
    },
    { input: rotatedFullLockup, left: 588, top: 357 },
  ])
  .png()
  .toFile(output);

console.log(output);
