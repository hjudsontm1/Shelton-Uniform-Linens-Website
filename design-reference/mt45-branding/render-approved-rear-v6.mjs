import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const outputDir = path.join(root, "design-reference/mt45-branding");
const rearPhoto = "/Users/jordanhudson/Downloads/1000081477.JPG";
const approvedStackedLogo = path.join(
  root,
  "exports/Shelton Complete Logo Packet/logos/shelton-stacked-centered-light.svg",
);
const qrSource = path.join(outputDir, "sheltonlinen-website-qr-source.png");

const navy = "#081321";
const gold = "#B8965A";

const logoSvg = await fs.readFile(approvedStackedLogo);
const logo = await sharp(logoSvg, { density: 300 })
  .resize({ width: 620, fit: "contain" })
  .png()
  .toBuffer();

const qrMetadata = await sharp(qrSource).metadata();
if (qrMetadata.width !== 350 || qrMetadata.height !== 350) {
  throw new Error("Expected the verified 350 x 350 Shelton Linen QR source.");
}

const qr = await sharp(qrSource).png().toBuffer();

const calloutSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="530" height="250" viewBox="0 0 530 250">
    <style>
      .support { font-family: Inter, Arial, sans-serif; font-weight: 500; fill: ${navy}; }
    </style>
    <text class="support" x="0" y="48" font-size="43" letter-spacing="1.2">SCAN FOR A QUOTE</text>
    <text class="support" x="0" y="112" font-size="37" letter-spacing="1.1">(000) 000-0000</text>
    <line x1="0" y1="142" x2="470" y2="142" stroke="${gold}" stroke-width="4"/>
    <text class="support" x="0" y="194" font-size="27" letter-spacing="0.2">sheltonlinen.com</text>
  </svg>
`);

const output = path.join(
  outputDir,
  "shelton-mt45-rear-approved-stacked-qr-v6.png",
);

// Preserve the approved v4 rear layout: centered stacked identity above, QR
// at lower left, and compact quote/contact block immediately to its right.
await sharp(rearPhoto)
  .composite([
    { input: logo, left: 458, top: 620 },
    { input: qr, left: 208, top: 1050 },
    { input: calloutSvg, left: 580, top: 1061 },
  ])
  .png()
  .toFile(output);

console.log(output);
