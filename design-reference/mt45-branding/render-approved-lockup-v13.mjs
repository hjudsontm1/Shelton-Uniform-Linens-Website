import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const brandDir = path.join(root, "assets/Shelton Brand Assets/brand");
const outputDir = path.join(root, "design-reference/mt45-branding");

const referenceMockup = path.join(
  outputDir,
  "shelton-mt45-route-stripe-no-door-logo-v12.png",
);
const cleanSidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";
const approvedLockupPath = path.join(
  brandDir,
  "website/shelton-primary-horizontal-light.svg",
);

const canvasWidth = 1448;
const canvasHeight = 1086;
const patchBox = { left: 570, top: 365, width: 630, height: 185 };

const approvedLockupSvg = await fs.readFile(approvedLockupPath);

const cleanPhoto = await sharp(cleanSidePhoto)
  .resize({ width: canvasWidth, height: canvasHeight, fit: "fill" })
  .png()
  .toBuffer();

const cleanUpperPatch = await sharp(cleanPhoto)
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

const featheredUpperPatch = await sharp(cleanUpperPatch)
  .composite([{ input: featherMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// The selected July 2026 primary-horizontal SVG is fully outlined. Rendering
// the complete asset preserves the approved mark, typography, tracking,
// ampersand, divider, descriptor, spacing, and proportions without live fonts.
const approvedLockup = await sharp(approvedLockupSvg, { density: 300 })
  .resize({ width: 600, fit: "contain" })
  .png()
  .toBuffer();

const output = path.join(
  outputDir,
  "shelton-mt45-route-stripe-approved-lockup-v13.png",
);

await sharp(referenceMockup)
  .composite([
    {
      input: featheredUpperPatch,
      left: patchBox.left,
      top: patchBox.top,
    },
    {
      input: approvedLockup,
      left: 590,
      top: 387,
    },
  ])
  .png()
  .toFile(output);

console.log(output);
