import fs from "node:fs/promises";
import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const brandDir = path.join(root, "assets/Shelton Brand Assets/brand");
const outputDir = path.join(root, "design-reference/mt45-branding");
const sidePhoto = "/Users/jordanhudson/Downloads/1000081478.JPG";
const routeReference = "/Users/jordanhudson/Downloads/Navy Strip van.png";

const width = 1448;
const height = 1086;
const navy = "#081321";
const cream = "#FAF6EE";
const gold = "#B8965A";

const markNavySvg = await fs.readFile(path.join(brandDir, "shelton-mark-navy.svg"));
const vehicleLightSvg = await fs.readFile(
  path.join(brandDir, "shelton-vehicle-lockup-light.svg"),
);

function canvas({ canvasWidth, canvasHeight, body }) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
      <style>
        .support { font-family: Inter, Arial, sans-serif; font-weight: 500; }
      </style>
      ${body}
    </svg>
  `);
}

async function renderSvg(svg, targetWidth) {
  return sharp(svg, { density: 300 })
    .resize({ width: targetWidth, fit: "contain" })
    .png()
    .toBuffer();
}

async function renderExpandedWordmark(targetWidth) {
  const textOnlyVehicleSvg = Buffer.from(
    vehicleLightSvg
      .toString()
      .replace(/\s*<g transform="translate\(36 36\) scale\(\.50061\)">[\s\S]*?<\/g>\s*/, "")
      .replace('viewBox="0 0 1900 480"', 'viewBox="450 90 1400 340"')
      .replace(
        'font-size="28" letter-spacing="7">COMMERCIAL LAUNDRY · SAN DIEGO</text>',
        'font-size="25" letter-spacing="3.5">COMMERCIAL LAUNDRY · UNIFORM RENTAL · LINEN SERVICE</text>',
      ),
  );
  return renderSvg(textOnlyVehicleSvg, targetWidth);
}

async function renderFoldedContact() {
  const svg = canvas({
    canvasWidth: 320,
    canvasHeight: 72,
    body: `
      <text class="support" x="0" y="25" fill="${navy}" font-size="20" letter-spacing="0.8">(000) 000-0000</text>
      <line x1="0" y1="37" x2="276" y2="37" stroke="${gold}" stroke-width="2"/>
      <text class="support" x="0" y="63" fill="${navy}" font-size="15" letter-spacing="0.1">sheltonuniformandlinen.com</text>
    `,
  });
  return sharp(svg).png().toBuffer();
}

const cleanPhoto = await sharp(sidePhoto)
  .resize({ width, height, fit: "fill" })
  .png()
  .toBuffer();

const mainMark = await renderSvg(markNavySvg, 135);
const foldedWordmark = await renderExpandedWordmark(420);
const routeWordmark = await renderExpandedWordmark(500);
const foldedContact = await renderFoldedContact();

async function renderFoldedLinen() {
  const rearFolds = await sharp(canvas({
    canvasWidth: width,
    canvasHeight: height,
    body: `
      <!-- Narrow leading fold -->
      <polygon points="1105,366 1135,367 1072,596 1040,599" fill="${navy}"/>
      <!-- Gold selvedge -->
      <polygon points="1150,366 1170,367 1108,594 1085,597" fill="${gold}"/>
      <!-- Broad rear fold; the truck white between shapes is intentional negative space -->
      <polygon points="1195,367 1300,369 1240,582 1130,592" fill="${navy}"/>
    `,
  })).png().toBuffer();

  const output = path.join(
    outputDir,
    "shelton-mt45-expanded-folded-linen-v11.png",
  );

  await sharp(cleanPhoto)
    .composite([
      { input: rearFolds, left: 0, top: 0, blend: "multiply" },
      { input: mainMark, left: 575, top: 398 },
      { input: foldedWordmark, left: 720, top: 387 },
      { input: foldedContact, left: 720, top: 505 },
    ])
    .png()
    .toFile(output);

  return output;
}

async function renderRouteStripe() {
  // Restore only the old upper lockup from the clean photograph. The user's
  // saved stripe, gold pinline, reversed contact copy, and door mark remain
  // untouched pixels from Navy Strip van.png.
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

  const output = path.join(
    outputDir,
    "shelton-mt45-expanded-route-stripe-v11.png",
  );

  await sharp(routeReference)
    .composite([
      {
        input: featheredCleanPatch,
        left: patchBox.left,
        top: patchBox.top,
      },
      { input: mainMark, left: 590, top: 393 },
      { input: routeWordmark, left: 744, top: 381 },
    ])
    .png()
    .toFile(output);

  return output;
}

const outputs = await Promise.all([renderFoldedLinen(), renderRouteStripe()]);
console.log(outputs.join("\n"));
