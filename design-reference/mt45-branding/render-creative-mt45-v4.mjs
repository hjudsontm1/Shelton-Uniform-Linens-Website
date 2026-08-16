import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const brandDir = path.join(root, "assets/Shelton Brand Assets/brand");
const outputDir = path.join(root, "design-reference/mt45-branding");
const sidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";
const rearPhoto = "/Users/jordanhudson/Downloads/1000081477.JPG";

const navy = "#081321";
const cream = "#FAF6EE";
const gold = "#B8965A";

const vehicleDarkSvg = await fs.readFile(path.join(brandDir, "shelton-vehicle-lockup-dark.svg"));
const stackedLightSvg = await fs.readFile(path.join(brandDir, "shelton-lockup-stacked-light.svg"));
const markNavySvg = await fs.readFile(path.join(brandDir, "shelton-mark-navy.svg"));
const qrSvg = await fs.readFile(path.join(outputDir, "shelton-website-qr-navy.svg"));

function svgCanvas({ width, height, body }) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .support { font-family: Inter, Arial, sans-serif; font-weight: 500; }
      </style>
      ${body}
    </svg>
  `);
}

async function renderSvg(svg, width) {
  return sharp(svg, { density: 300 })
    .resize({ width, fit: "contain" })
    .png()
    .toBuffer();
}

async function renderQr(size) {
  const sizedQrSvg = Buffer.from(
    qrSvg
      .toString()
      .replace('width="2000" height="2000"', `width="${size}" height="${size}"`),
  );
  return sharp(sizedQrSvg, { density: 72 })
    .png()
    .toBuffer();
}

async function renderCreativeSide() {
  const navyField = await sharp(svgCanvas({
    width: 2048,
    height: 1536,
    body: `<polygon points="742,502 1814,512 1836,769 872,817" fill="${navy}"/>`,
  })).png().toBuffer();

  const goldEdge = await sharp(svgCanvas({
    width: 2048,
    height: 1536,
    body: `<polygon points="742,502 758,502 891,816 872,817" fill="${gold}"/>`,
  })).png().toBuffer();

  const lockup = await renderSvg(vehicleDarkSvg, 900);
  const doorMark = await renderSvg(markNavySvg, 96);
  const contact = await sharp(svgCanvas({
    width: 780,
    height: 58,
    body: `
      <text class="support" x="0" y="38" fill="${cream}" font-size="28" letter-spacing="1.1">(000) 000-0000</text>
      <circle cx="273" cy="29" r="3.5" fill="${gold}"/>
      <text class="support" x="295" y="38" fill="${cream}" font-size="28" letter-spacing="0.35">sheltonuniformandlinen.com</text>
    `,
  })).png().toBuffer();

  await sharp(sidePhoto)
    .composite([
      { input: navyField, left: 0, top: 0, blend: "multiply" },
      { input: goldEdge, left: 0, top: 0 },
      { input: lockup, left: 860, top: 510 },
      { input: contact, left: 1010, top: 704 },
      { input: doorMark, left: 570, top: 810 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-side-creative-navy-panel-v4.png"));
}

async function renderStackedRear() {
  const stacked = await renderSvg(stackedLightSvg, 620);
  // The QR viewBox is 41 modules square. 328 px keeps every module on an 8 px grid.
  const qrSize = 328;
  const qr = await renderQr(qrSize);
  await sharp(qr).toFile(path.join(outputDir, "shelton-website-qr-navy-328-preview.png"));
  const backing = await sharp({
    create: {
      width: qrSize + 20,
      height: qrSize + 20,
      channels: 4,
      background: "#ffffff",
    },
  }).png().toBuffer();
  const action = await sharp(svgCanvas({
    width: 530,
    height: 250,
    body: `
      <text class="support" x="0" y="48" fill="${navy}" font-size="43" letter-spacing="1.2">SCAN FOR A QUOTE</text>
      <text class="support" x="0" y="112" fill="${navy}" font-size="37" letter-spacing="1.1">(000) 000-0000</text>
      <line x1="0" y1="142" x2="470" y2="142" stroke="${gold}" stroke-width="4"/>
      <text class="support" x="0" y="194" fill="${navy}" font-size="27" letter-spacing="0.2">sheltonuniformandlinen.com</text>
    `,
  })).png().toBuffer();

  await sharp(rearPhoto)
    .composite([
      { input: stacked, left: 458, top: 665 },
      { input: backing, left: 208, top: 1050 },
      { input: qr, left: 218, top: 1060 },
      { input: action, left: 580, top: 1061 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-rear-stacked-logo-qr-v4.png"));
}

await Promise.all([renderCreativeSide(), renderStackedRear()]);
console.log("Rendered creative side and stacked-logo rear MT45 v4 mockups.");
