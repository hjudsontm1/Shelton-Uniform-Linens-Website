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
const stripeAngle = -2.6;

const markNavySvg = await fs.readFile(path.join(brandDir, "shelton-mark-navy.svg"));
const vehicleLightSvg = await fs.readFile(
  path.join(brandDir, "shelton-vehicle-lockup-light.svg"),
);

function canvas({ width, height, body }) {
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

async function renderAngledNameBlock(width) {
  // Remove only the official circled-S group so the mark can remain upright.
  // All lettering, divider, and descriptor artwork remains the canonical SVG.
  const textOnlyVehicleSvg = Buffer.from(
    vehicleLightSvg
      .toString()
      .replace(/\s*<g transform="translate\(36 36\) scale\(\.50061\)">[\s\S]*?<\/g>\s*/, "")
      .replace('viewBox="0 0 1900 480"', 'viewBox="450 110 1100 310"'),
  );

  const nameBlock = await renderSvg(textOnlyVehicleSvg, width);
  return sharp(nameBlock)
    .rotate(stripeAngle, {
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function renderContact() {
  const fontSize = 27;
  const phoneEnd = fontSize * 8.7;
  const bulletX = phoneEnd + 22;
  const urlX = bulletX + 25;
  const svg = canvas({
    width: 920,
    height: 64,
    body: `
      <g transform="rotate(${stripeAngle} 0 40)">
        <text class="support" x="0" y="42" fill="${cream}" font-size="${fontSize}" letter-spacing="1">(000) 000-0000</text>
        <circle cx="${bulletX}" cy="32" r="3.5" fill="${gold}"/>
        <text class="support" x="${urlX}" y="42" fill="${cream}" font-size="${fontSize}" letter-spacing="0.25">sheltonuniformandlinen.com</text>
      </g>
    `,
  });
  return sharp(svg).png().toBuffer();
}

const mainMark = await renderSvg(markNavySvg, 194);
const doorMark = await renderSvg(markNavySvg, 94);
const angledName = await renderAngledNameBlock(650);
const contact = await renderContact();

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

const output = path.join(
  outputDir,
  "shelton-mt45-side-option-2-route-stripe-oriented-v6.png",
);

await sharp(sidePhoto)
  .composite([
    { input: routeStripe, left: 0, top: 0, blend: "multiply" },
    { input: goldCap, left: 0, top: 0 },
    // The S remains upright and its base follows the same visual axis as the stripe.
    { input: mainMark, left: 790, top: 514 },
    // Only the official lettering/divider/descriptor group follows the 2.6° stripe angle.
    { input: angledName, left: 1005, top: 478 },
    { input: contact, left: 900, top: 719 },
    { input: doorMark, left: 570, top: 810 },
  ])
  .png()
  .toFile(output);

console.log(output);
