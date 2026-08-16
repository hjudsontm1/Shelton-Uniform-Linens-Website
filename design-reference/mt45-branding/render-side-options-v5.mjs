import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const brandDir = path.join(root, "assets/Shelton Brand Assets/brand");
const outputDir = path.join(root, "design-reference/mt45-branding");
const sidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";

const navy = "#081321";
const cream = "#FAF6EE";
const gold = "#B8965A";

const markNavySvg = await fs.readFile(path.join(brandDir, "shelton-mark-navy.svg"));
const vehicleLightSvg = await fs.readFile(path.join(brandDir, "shelton-vehicle-lockup-light.svg"));

function canvas({ width, height, body }) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .brand-name { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500; }
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

async function renderNameBlock(width) {
  const textOnlyVehicleSvg = Buffer.from(
    vehicleLightSvg
      .toString()
      .replace(/\s*<g transform="translate\(36 36\) scale\(\.50061\)">[\s\S]*?<\/g>\s*/, "")
      .replace('viewBox="0 0 1900 480"', 'viewBox="450 110 1100 310"'),
  );
  return renderSvg(textOnlyVehicleSvg, width);
}

async function renderContact({
  width = 760,
  fontSize = 30,
  fill = navy,
  rotated = false,
}) {
  const phoneEnd = fontSize * 8.7;
  const bulletX = phoneEnd + 22;
  const urlX = bulletX + 25;
  const transform = rotated ? 'transform="rotate(-2.6 0 40)"' : "";
  const svg = canvas({
    width,
    height: 64,
    body: `
      <g ${transform}>
        <text class="support" x="0" y="42" fill="${fill}" font-size="${fontSize}" letter-spacing="1">(000) 000-0000</text>
        <circle cx="${bulletX}" cy="32" r="3.5" fill="${gold}"/>
        <text class="support" x="${urlX}" y="42" fill="${fill}" font-size="${fontSize}" letter-spacing="0.25">sheltonuniformandlinen.com</text>
      </g>
    `,
  });
  return sharp(svg).png().toBuffer();
}

async function renderTwoLineContact() {
  const svg = canvas({
    width: 520,
    height: 104,
    body: `
      <text class="support" x="0" y="39" fill="${navy}" font-size="32" letter-spacing="1.1">(000) 000-0000</text>
      <line x1="0" y1="55" x2="455" y2="55" stroke="${gold}" stroke-width="3"/>
      <text class="support" x="0" y="94" fill="${navy}" font-size="27" letter-spacing="0.2">sheltonuniformandlinen.com</text>
    `,
  });
  return sharp(svg).png().toBuffer();
}

const mainMark = await renderSvg(markNavySvg, 194);
const doorMark = await renderSvg(markNavySvg, 94);

async function renderOptionOne() {
  const name = await renderNameBlock(690);
  const contact = await renderContact({ width: 710, fontSize: 30 });

  await sharp(sidePhoto)
    .composite([
      { input: mainMark, left: 865, top: 570 },
      { input: name, left: 1085, top: 525 },
      { input: contact, left: 1085, top: 721 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-side-option-1-enlarged-wording-v5.png"));
}

async function renderOptionTwo() {
  const name = await renderNameBlock(650);
  const routeStripe = await sharp(canvas({
    width: 2048,
    height: 1536,
    body: `<polygon points="720,738 1810,687 1810,765 720,822" fill="${navy}"/>`,
  })).png().toBuffer();
  const goldCap = await sharp(canvas({
    width: 2048,
    height: 1536,
    body: `<polygon points="720,724 1810,673 1810,687 720,738" fill="${gold}"/>`,
  })).png().toBuffer();
  const contact = await renderContact({ width: 920, fontSize: 27, fill: cream, rotated: true });

  await sharp(sidePhoto)
    .composite([
      { input: routeStripe, left: 0, top: 0, blend: "multiply" },
      { input: goldCap, left: 0, top: 0 },
      { input: mainMark, left: 790, top: 510 },
      { input: name, left: 1010, top: 490 },
      { input: contact, left: 900, top: 719 },
      { input: doorMark, left: 570, top: 810 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-side-option-2-route-stripe-v5.png"));
}

async function renderOptionThree() {
  const name = await renderNameBlock(560);
  const contact = await renderTwoLineContact();
  const navySlashes = await sharp(canvas({
    width: 2048,
    height: 1536,
    body: `
      <polygon points="1575,520 1612,520 1502,789 1460,792" fill="${navy}"/>
      <polygon points="1685,520 1800,522 1710,770 1580,785" fill="${navy}"/>
    `,
  })).png().toBuffer();
  const goldSlash = await sharp(canvas({
    width: 2048,
    height: 1536,
    body: `<polygon points="1630,520 1660,520 1550,783 1517,788" fill="${gold}"/>`,
  })).png().toBuffer();

  await sharp(sidePhoto)
    .composite([
      { input: navySlashes, left: 0, top: 0, blend: "multiply" },
      { input: goldSlash, left: 0, top: 0 },
      { input: mainMark, left: 790, top: 540 },
      { input: name, left: 1020, top: 520 },
      { input: contact, left: 1020, top: 688 },
    ])
    .png()
    .toFile(path.join(outputDir, "shelton-mt45-side-option-3-folded-motion-v5.png"));
}

await Promise.all([renderOptionOne(), renderOptionTwo(), renderOptionThree()]);
console.log("Rendered three MT45 side options with canonical Shelton artwork.");
