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
  .resize({ width: 720, fit: "contain" })
  .png()
  .toBuffer();

const qrMetadata = await sharp(qrSource).metadata();
if (!qrMetadata.width || qrMetadata.width !== qrMetadata.height) {
  throw new Error("The generated QR source must be square.");
}

// The local QR generator includes its exact four-unit quiet zone, so it is
// composited without any resizing or filtering.
const qrBacking = await sharp(qrSource).png().toBuffer();

const calloutSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="280" viewBox="0 0 720 280">
    <style>
      .support { font-family: Inter, Arial, sans-serif; font-weight: 500; fill: ${navy}; }
    </style>
    <text class="support" x="0" y="58" font-size="51" letter-spacing="0.8">SCAN FOR A QUOTE</text>
    <text class="support" x="0" y="128" font-size="43" letter-spacing="0.8">(000) 000-0000</text>
    <line x1="0" y1="164" x2="590" y2="164" stroke="${gold}" stroke-width="5"/>
    <text class="support" x="0" y="222" font-size="35" letter-spacing="0.15">sheltonlinen.com</text>
  </svg>
`);

const output = path.join(
  outputDir,
  "shelton-mt45-rear-approved-stacked-qr-v5.png",
);

await sharp(rearPhoto)
  .composite([
    { input: logo, left: 408, top: 620 },
    { input: qrBacking, left: 235, top: 1175 },
    { input: calloutSvg, left: 620, top: 1192 },
  ])
  .png()
  .toFile(output);

console.log(output);
