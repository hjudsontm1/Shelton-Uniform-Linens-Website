import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const assetDir = path.join(projectRoot, "design-reference/cleaners-van/generic-sprinter");
const sideBlank = path.join(assetDir, "generic-high-roof-sprinter-side-blank.png");
const rearBlank = path.join(assetDir, "generic-high-roof-sprinter-rear-blank.png");
const approvedLockup = path.join(projectRoot, "assets/Shelton Brand Assets/cleaners/shelton-cleaners-lockup-dark.png");

const colors = {
  navy: "#081321",
  cream: "#FAF6EE",
  gold: "#B8965A",
  white: "#FFFFFF",
};

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
        .inter { font-family: Inter, Arial, sans-serif; font-variation-settings: 'wght' 560; }
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
    <text x="575" y="425" class="inter" font-size="27" letter-spacing="3.2" text-anchor="middle" fill="${colors.gold}">${esc(delivery)}</text>
    <text x="575" y="508" class="inter" font-size="19" letter-spacing="2.15" text-anchor="middle" fill="${colors.navy}">${esc(services)}</text>
    <path d="M 150 538 L 1002 544 L 1024 589 L 150 583 Z" fill="${colors.navy}"/>
    <path d="M 150 538 L 1002 544 L 1007 553 L 150 547 Z" fill="${colors.gold}"/>
    <text x="590" y="575" class="inter" font-size="22" letter-spacing="3.1" text-anchor="middle" fill="${colors.white}">${website}</text>
  `);

  await sharp(sideBlank)
    .composite([
      { input: primaryLogo, left: 180, top: 286 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "shelton-cleaners-generic-sprinter-side-v1.png"));
}

async function renderRear() {
  const primaryLogo = await logo(500);
  const graphics = svg(1536, 1024, `
    <text x="768" y="392" class="inter" font-size="17" letter-spacing="1.8" text-anchor="middle" fill="${colors.navy}">${esc(services)}</text>
    <text x="768" y="431" class="inter" font-size="26" letter-spacing="3.2" text-anchor="middle" fill="${colors.gold}">${esc(delivery)}</text>
    <path d="M 488 468 L 1048 468 L 1048 526 L 488 526 Z" fill="${colors.navy}"/>
    <rect x="488" y="468" width="560" height="7" fill="${colors.gold}"/>
    <text x="768" y="509" class="inter" font-size="21" letter-spacing="2.9" text-anchor="middle" fill="${colors.white}">${website}</text>
  `);

  await sharp(rearBlank)
    .composite([
      { input: primaryLogo, left: 518, top: 279 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "shelton-cleaners-generic-sprinter-rear-v1.png"));
}

async function renderBoard() {
  const side = await sharp(path.join(assetDir, "shelton-cleaners-generic-sprinter-side-v1.png"))
    .resize({ width: 1460, height: 802, fit: "cover" })
    .png()
    .toBuffer();
  const rear = await sharp(path.join(assetDir, "shelton-cleaners-generic-sprinter-rear-v1.png"))
    .resize({ width: 700, height: 467, fit: "cover" })
    .png()
    .toBuffer();
  const board = svg(2400, 1200, `
    <rect width="2400" height="1200" fill="${colors.cream}"/>
    <text x="120" y="125" class="inter" font-size="54" letter-spacing="3" fill="${colors.navy}">SHELTON CLEANERS · HIGH-ROOF SPRINTER</text>
    <text x="120" y="185" class="inter" font-size="27" letter-spacing="3" fill="${colors.gold}">WHITE-DOMINANT PARTIAL VINYL · EXACT APPROVED LOCKUP</text>
    <text x="120" y="265" class="inter" font-size="24" letter-spacing="2.2" fill="${colors.navy}">SIDE</text>
    <text x="1660" y="265" class="inter" font-size="24" letter-spacing="2.2" fill="${colors.navy}">REAR</text>
  `);

  await sharp(board)
    .composite([
      { input: side, left: 120, top: 305 },
      { input: rear, left: 1660, top: 440 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "shelton-cleaners-generic-sprinter-board-v1.png"));
}

await renderSide();
await renderRear();
await renderBoard();
