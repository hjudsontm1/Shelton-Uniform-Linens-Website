import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const outputDir = path.join(root, "design-reference/mt45-branding");
const referenceMockup = "/Users/jordanhudson/Downloads/Navy Strip van.png";
const cleanSidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";

const canvasWidth = 1448;
const canvasHeight = 1086;
const patchBox = { left: 390, top: 590, width: 102, height: 112 };

const cleanPhoto = await sharp(cleanSidePhoto)
  .resize({ width: canvasWidth, height: canvasHeight, fit: "fill" })
  .png()
  .toBuffer();

const cleanDoorPatch = await sharp(cleanPhoto)
  .extract(patchBox)
  .ensureAlpha()
  .png()
  .toBuffer();

const featherMask = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${patchBox.width}" height="${patchBox.height}">
    <defs>
      <filter id="feather" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="${patchBox.width - 16}" height="${patchBox.height - 16}" rx="16" fill="white" filter="url(#feather)"/>
  </svg>
`);

const featheredDoorPatch = await sharp(cleanDoorPatch)
  .composite([{ input: featherMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const output = path.join(
  outputDir,
  "shelton-mt45-route-stripe-no-door-logo-v12.png",
);

await sharp(referenceMockup)
  .composite([
    {
      input: featheredDoorPatch,
      left: patchBox.left,
      top: patchBox.top,
    },
  ])
  .png()
  .toFile(output);

console.log(output);
