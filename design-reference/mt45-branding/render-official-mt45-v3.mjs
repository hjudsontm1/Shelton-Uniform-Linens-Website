import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const brandDir = path.join(root, "assets/Shelton Brand Assets/brand");
const outputDir = path.join(root, "design-reference/mt45-branding");
const sidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";
const rearPhoto = "/Users/jordanhudson/Downloads/1000081477.JPG";

const navy = "#081321";
const gold = "#B8965A";
const lockupSvg = await fs.readFile(path.join(brandDir, "shelton-vehicle-lockup-light.svg"));
const darkLockupSvg = await fs.readFile(path.join(brandDir, "shelton-vehicle-lockup-dark.svg"));
const stackedLockupSvg = await fs.readFile(path.join(brandDir, "shelton-lockup-stacked-light.svg"));
const qrSvg = await fs.readFile(path.join(outputDir, "shelton-website-qr-navy.svg"));

function svgText({ width, height, body }) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .contact { font-family: Inter, Arial, sans-serif; font-weight: 500; fill: ${navy}; }
      </style>
      ${body}
    </svg>
  `);
}

async function renderLockup(width) {
  return sharp(lockupSvg, { density: 300 })
    .resize({ width, fit: "contain" })
    .png()
    .toBuffer();
}

async function renderQr(size) {
  return sharp(qrSvg, { density: 72 })
    .resize(size, size, { fit: "fill", kernel: "nearest" })
    .png()
    .toBuffer();
}

async function renderSide() {
  const lockup = await renderLockup(870);
  const contact = await sharp(svgText({
    width: 870,
    height: 54,
    body: `
      <text class="contact" x="0" y="38" font-size="30" letter-spacing="1.4">(000) 000-0000</text>
      <circle cx="294" cy="29" r="3.5" fill="${gold}"/>
      <text class="contact" x="316" y="38" font-size="30" letter-spacing="0.6">sheltonuniformandlinen.com</text>
    `,
  })).png().toBuffer();

  await sharp(sidePhoto)
    .composite([
      { input: lockup, left: 825, top: 490 },
      { input: contact, left: 1014, top: 690 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-side-official-short-divider-v3.png"));
}

async function renderRear() {
  const lockup = await renderLockup(1038);
  const qrSize = 258;
  const qr = await renderQr(qrSize);
  const backing = await sharp({
    create: {
      width: qrSize + 20,
      height: qrSize + 20,
      channels: 4,
      background: "#ffffff",
    },
  }).png().toBuffer();
  const action = await sharp(svgText({
    width: 530,
    height: 250,
    body: `
      <text class="contact" x="0" y="48" font-size="43" letter-spacing="1.2">SCAN FOR A QUOTE</text>
      <text class="contact" x="0" y="112" font-size="37" letter-spacing="1.1">(000) 000-0000</text>
      <line x1="0" y1="142" x2="470" y2="142" stroke="${gold}" stroke-width="4"/>
      <text class="contact" x="0" y="194" font-size="27" letter-spacing="0.2">sheltonuniformandlinen.com</text>
    `,
  })).png().toBuffer();

  await sharp(rearPhoto)
    .composite([
      { input: lockup, left: 310, top: 700 },
      { input: backing, left: 243, top: 1002 },
      { input: qr, left: 253, top: 1012 },
      { input: action, left: 560, top: 1013 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-rear-official-short-divider-qr-v3.png"));
}

const preview = await renderLockup(1900);
await sharp(preview).toFile(path.join(outputDir, "shelton-vehicle-lockup-light-short-divider-preview.png"));
await sharp(darkLockupSvg, { density: 300 })
  .resize({ width: 1900, fit: "contain" })
  .png()
  .toFile(path.join(outputDir, "shelton-vehicle-lockup-dark-short-divider-preview.png"));
await sharp(stackedLockupSvg, { density: 300 })
  .resize({ width: 1200, fit: "contain" })
  .png()
  .toFile(path.join(outputDir, "shelton-lockup-stacked-light-preview.png"));
await Promise.all([renderSide(), renderRear()]);

console.log("Rendered official short-divider lockup preview and MT45 v3 mockups.");
