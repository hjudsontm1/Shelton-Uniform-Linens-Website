import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const sideSource = "/Users/jordanhudson/Library/Messages/Attachments/db/11/2E13BDA8-4791-4853-BDD4-FA34907DFE2C/IMG_0464.jpeg";
const rearSource = "/Users/jordanhudson/Library/Messages/Attachments/51/01/09DE7ABC-D56C-4376-B22D-2E4EBE04C9A2/IMG_0465.jpeg";
const cleanersLockup = path.join(projectRoot, "assets/Shelton Brand Assets/cleaners/shelton-cleaners-lockup-dark.png");
const outputDir = path.join(projectRoot, "design-reference/cleaners-van");

const colors = {
  navy: "#081321",
  cream: "#FAF6EE",
  gold: "#B8965A",
  white: "#FFFFFF",
};

function esc(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function svgBuffer(width, height, body) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .inter { font-family: Inter, Arial, sans-serif; font-variation-settings: 'wght' 560; }
      </style>
      ${body}
    </svg>
  `);
}

async function sizedLogo(width, angle = 0) {
  let image = sharp(cleanersLockup).resize({ width, fit: "inside", withoutEnlargement: false });
  if (angle !== 0) image = image.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  return image.png().toBuffer();
}

async function renderSide() {
  const width = 2400;
  const height = 1800;
  const logo = await sizedLogo(1180, 0.35);
  const serviceLine = "DRY CLEANING  ·  LAUNDRY  ·  ALTERATIONS";

  const typography = svgBuffer(width, height, `
    <g transform="rotate(0.35 820 930)">
      <rect x="225" y="910" width="1175" height="6" rx="3" fill="${colors.gold}"/>
      <text x="225" y="978" class="inter" font-size="36" letter-spacing="4.2" fill="${colors.navy}">${esc(serviceLine)}</text>
    </g>
  `);

  await sharp(sideSource)
    .rotate()
    .resize({ width, height, fit: "fill" })
    .composite([
      { input: logo, left: 220, top: 675 },
      { input: typography, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-side-v1.png"));
}

async function renderRear() {
  const width = 1800;
  const height = 2400;
  const logo = await sizedLogo(1320);
  const serviceLine = "DRY CLEANING  ·  LAUNDRY  ·  ALTERATIONS";

  const typography = svgBuffer(width, height, `
    <rect x="300" y="985" width="1200" height="6" rx="3" fill="${colors.gold}"/>
    <text x="900" y="1065" class="inter" font-size="42" letter-spacing="5" text-anchor="middle" fill="${colors.navy}">${esc(serviceLine)}</text>
    <text x="900" y="1160" class="inter" font-size="48" letter-spacing="7" text-anchor="middle" fill="${colors.gold}">PICKUP &amp; DELIVERY</text>
  `);

  await sharp(rearSource)
    .rotate()
    .resize({ width, height, fit: "fill" })
    .composite([
      { input: logo, left: 240, top: 700 },
      { input: typography, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-rear-v1.png"));
}

async function renderBoard() {
  const boardWidth = 3000;
  const boardHeight = 1800;
  const side = await sharp(path.join(outputDir, "shelton-cleaners-van-side-v1.png"))
    .resize({ width: 1840, height: 1380, fit: "cover" })
    .png()
    .toBuffer();
  const rear = await sharp(path.join(outputDir, "shelton-cleaners-van-rear-v1.png"))
    .resize({ width: 760, height: 1013, fit: "cover" })
    .png()
    .toBuffer();
  const labels = svgBuffer(boardWidth, boardHeight, `
    <rect width="${boardWidth}" height="${boardHeight}" fill="${colors.cream}"/>
    <text x="130" y="145" class="inter" font-size="54" letter-spacing="3" fill="${colors.navy}">SHELTON CLEANERS · VAN IDENTITY</text>
    <text x="130" y="210" class="inter" font-size="28" letter-spacing="3" fill="${colors.gold}">PARTIAL VINYL · APPROVED ARTWORK · INTER SUPPORTING TYPE</text>
    <text x="130" y="1700" class="inter" font-size="25" letter-spacing="2" fill="${colors.navy}">SIDE VIEW</text>
    <text x="2170" y="1690" class="inter" font-size="25" letter-spacing="2" fill="${colors.navy}">REAR VIEW</text>
  `);

  await sharp(labels)
    .composite([
      { input: side, left: 130, top: 250 },
      { input: rear, left: 2170, top: 400 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-mockup-board-v1.png"));
}

await renderSide();
await renderRear();
await renderBoard();
