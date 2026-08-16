import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const assetDir = path.join(projectRoot, "design-reference/cleaners-van/generic-sprinter");
const sideBlank = path.join(assetDir, "generic-high-roof-sprinter-side-blank.png");
const rearBlank = path.join(assetDir, "generic-high-roof-sprinter-rear-blank.png");
const approvedLockup = path.join(
  projectRoot,
  "assets/Shelton Brand Assets/cleaners/shelton-cleaners-lockup-dark.png",
);

const black = "#000000";
const white = "#FFFFFF";
const website = "SHELTONCLEANERSSD.COM";
const services = "DRY CLEANING  ·  LAUNDERED SHIRTS  ·  HOUSEHOLD";
const delivery = "FREE PICKUP & DELIVERY";

function esc(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function svg(width, height, body) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .inter { font-family: Inter, Arial, sans-serif; font-variation-settings: 'wght' 620; }
      </style>
      ${body}
    </svg>
  `);
}

async function logo(width) {
  return sharp(approvedLockup)
    .resize({ width, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
}

async function renderSide() {
  const primaryLogo = await logo(800);
  const graphics = svg(1693, 929, `
    <text x="590" y="432" class="inter" font-size="19" letter-spacing="2.15" text-anchor="middle" fill="${black}">${esc(services)}</text>

    <!-- One continuous rear-quarter gesture. Its bottom edge lands on the van's existing black sill. -->
    <path d="M 150 458
             C 250 464 360 488 500 512
             C 675 530 850 535 1018 535
             L 1018 578
             L 492 578
             C 482 542 447 524 402 522
             C 357 522 326 542 316 578
             L 150 578 Z" fill="${black}"/>

    <text x="760" y="562" class="inter" font-size="23" letter-spacing="2.7" text-anchor="middle" fill="${white}">${esc(delivery)}</text>
    <text x="785" y="617" class="inter" font-size="20" letter-spacing="2.25" text-anchor="middle" fill="${white}">${website}</text>
  `);

  await sharp(sideBlank)
    .composite([
      { input: primaryLogo, left: 180, top: 286 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "shelton-cleaners-generic-sprinter-side-v2.png"));
}

async function renderRear() {
  const primaryLogo = await logo(500);
  const graphics = svg(1536, 1024, `
    <text x="768" y="394" class="inter" font-size="17" letter-spacing="1.8" text-anchor="middle" fill="${black}">${esc(services)}</text>

    <!-- Bowed panel follows the lower radius of the twin door recess instead of cutting across it. -->
    <path d="M 510 414
             Q 768 428 1026 414
             L 1026 462
             Q 1026 474 1012 478
             Q 768 510 524 478
             Q 510 474 510 462 Z" fill="${black}"/>
    <text x="768" y="451" class="inter" font-size="23" letter-spacing="2.65" text-anchor="middle" fill="${white}">${esc(delivery)}</text>
    <text x="768" y="483" class="inter" font-size="17" letter-spacing="2.25" text-anchor="middle" fill="${white}">${website}</text>
  `);

  await sharp(rearBlank)
    .composite([
      { input: primaryLogo, left: 518, top: 279 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "shelton-cleaners-generic-sprinter-rear-v2.png"));
}

async function renderBoard() {
  const side = await sharp(path.join(assetDir, "shelton-cleaners-generic-sprinter-side-v2.png"))
    .resize({ width: 1460, height: 802, fit: "cover" })
    .png()
    .toBuffer();
  const rear = await sharp(path.join(assetDir, "shelton-cleaners-generic-sprinter-rear-v2.png"))
    .resize({ width: 700, height: 467, fit: "cover" })
    .png()
    .toBuffer();
  const board = svg(2400, 1200, `
    <rect width="2400" height="1200" fill="${white}"/>
    <text x="120" y="125" class="inter" font-size="54" letter-spacing="3" fill="${black}">SHELTON CLEANERS · HIGH-ROOF SPRINTER</text>
    <text x="120" y="185" class="inter" font-size="27" letter-spacing="3" fill="${black}">BLACK + WHITE PARTIAL VINYL · EXACT APPROVED LOCKUP</text>
    <line x1="120" y1="220" x2="2280" y2="220" stroke="${black}" stroke-width="4"/>
    <text x="120" y="270" class="inter" font-size="24" letter-spacing="2.2" fill="${black}">SIDE</text>
    <text x="1660" y="270" class="inter" font-size="24" letter-spacing="2.2" fill="${black}">REAR</text>
  `);

  await sharp(board)
    .composite([
      { input: side, left: 120, top: 305 },
      { input: rear, left: 1660, top: 440 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "shelton-cleaners-generic-sprinter-board-v2.png"));
}

await renderSide();
await renderRear();
await renderBoard();
