import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const sideSource = "/Users/jordanhudson/Library/Messages/Attachments/db/11/2E13BDA8-4791-4853-BDD4-FA34907DFE2C/IMG_0464.jpeg";
const rearSource = "/Users/jordanhudson/Library/Messages/Attachments/51/01/09DE7ABC-D56C-4376-B22D-2E4EBE04C9A2/IMG_0465.jpeg";
const darkLockup = path.join(projectRoot, "assets/Shelton Brand Assets/cleaners/shelton-cleaners-lockup-dark.png");
const outputDir = path.join(projectRoot, "design-reference/cleaners-van");

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
  return sharp(darkLockup).resize({ width, fit: "inside", withoutEnlargement: false }).png().toBuffer();
}

async function sideBase() {
  return sharp(sideSource).rotate().resize({ width: 2400, height: 1800, fit: "fill" }).png().toBuffer();
}

async function rearBase() {
  return sharp(rearSource).rotate().resize({ width: 1800, height: 2400, fit: "fill" }).png().toBuffer();
}

async function renderSimpleSide(base) {
  const primaryLogo = await logo(1280);
  const graphics = svg(2400, 1800, `
    <text x="250" y="910" class="inter" font-size="32" letter-spacing="3.2" fill="${colors.navy}">${esc(services)}</text>
    <text x="250" y="975" class="inter" font-size="37" letter-spacing="4.2" fill="${colors.gold}">${esc(delivery)}</text>
    <path d="M 70 1118 L 1545 1118 L 1630 1230 L 70 1230 Z" fill="${colors.navy}"/>
    <path d="M 70 1118 L 1545 1118 L 1555 1131 L 70 1131 Z" fill="${colors.gold}"/>
    <text x="830" y="1194" class="inter" font-size="35" letter-spacing="4" text-anchor="middle" fill="${colors.white}">${website}</text>
  `);
  await sharp(base)
    .composite([
      { input: primaryLogo, left: 190, top: 630 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-side-simple-v3.png"));
}

async function renderSimpleRear(base) {
  const primaryLogo = await logo(1150);
  const graphics = svg(1800, 2400, `
    <text x="900" y="865" class="inter" font-size="31" letter-spacing="3" text-anchor="middle" fill="${colors.navy}">${esc(services)}</text>
    <text x="900" y="950" class="inter" font-size="42" letter-spacing="4.6" text-anchor="middle" fill="${colors.gold}">${esc(delivery)}</text>
    <rect x="260" y="1025" width="1280" height="116" rx="3" fill="${colors.navy}"/>
    <rect x="260" y="1025" width="1280" height="9" fill="${colors.gold}"/>
    <text x="900" y="1102" class="inter" font-size="36" letter-spacing="4.4" text-anchor="middle" fill="${colors.white}">${website}</text>
  `);
  await sharp(base)
    .composite([
      { input: primaryLogo, left: 325, top: 610 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-rear-simple-v3.png"));
}

async function renderSweepSide(base) {
  const primaryLogo = await logo(1150);
  const graphics = svg(2400, 1800, `
    <text x="440" y="912" class="inter" font-size="31" letter-spacing="3.1" fill="${colors.navy}">${esc(services)}</text>
    <text x="440" y="975" class="inter" font-size="36" letter-spacing="4" fill="${colors.gold}">${esc(delivery)}</text>
    <path d="M 70 892 C 245 930 415 1015 580 1080 C 865 1115 1230 1105 1625 1065 L 1625 1230 C 1230 1240 865 1242 580 1228 C 350 1190 165 1080 70 1000 Z" fill="${colors.navy}"/>
    <path d="M 70 892 C 245 930 415 1015 580 1080 C 865 1115 1230 1105 1625 1065" fill="none" stroke="${colors.gold}" stroke-width="13"/>
    <text x="1080" y="1198" class="inter" font-size="34" letter-spacing="4" text-anchor="middle" fill="${colors.white}">${website}</text>
  `);
  await sharp(base)
    .composite([
      { input: primaryLogo, left: 365, top: 645 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-side-sweep-v3.png"));
}

async function renderSweepRear(base) {
  const primaryLogo = await logo(1080);
  const graphics = svg(1800, 2400, `
    <text x="900" y="850" class="inter" font-size="30" letter-spacing="2.8" text-anchor="middle" fill="${colors.navy}">${esc(services)}</text>
    <text x="900" y="930" class="inter" font-size="41" letter-spacing="4.4" text-anchor="middle" fill="${colors.gold}">${esc(delivery)}</text>
    <path d="M 250 1012 C 610 972 1130 1000 1550 918 L 1550 1135 C 1120 1180 625 1188 250 1118 Z" fill="${colors.navy}"/>
    <path d="M 250 1012 C 610 972 1130 1000 1550 918" fill="none" stroke="${colors.gold}" stroke-width="12"/>
    <text x="915" y="1094" class="inter" font-size="35" letter-spacing="4.2" text-anchor="middle" fill="${colors.white}">${website}</text>
  `);
  await sharp(base)
    .composite([
      { input: primaryLogo, left: 360, top: 590 },
      { input: graphics, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-rear-sweep-v3.png"));
}

async function renderBoard() {
  const sideSimple = await sharp(path.join(outputDir, "shelton-cleaners-van-side-simple-v3.png")).resize({ width: 1250, height: 938, fit: "cover" }).png().toBuffer();
  const sideSweep = await sharp(path.join(outputDir, "shelton-cleaners-van-side-sweep-v3.png")).resize({ width: 1250, height: 938, fit: "cover" }).png().toBuffer();
  const rearSimple = await sharp(path.join(outputDir, "shelton-cleaners-van-rear-simple-v3.png")).resize({ width: 420, height: 560, fit: "cover" }).png().toBuffer();
  const rearSweep = await sharp(path.join(outputDir, "shelton-cleaners-van-rear-sweep-v3.png")).resize({ width: 420, height: 560, fit: "cover" }).png().toBuffer();
  const board = svg(2000, 2300, `
    <rect width="2000" height="2300" fill="${colors.cream}"/>
    <text x="120" y="120" class="inter" font-size="52" letter-spacing="3" fill="${colors.navy}">SHELTON CLEANERS · WHITE VAN DIRECTIONS</text>
    <text x="120" y="180" class="inter" font-size="26" letter-spacing="2.8" fill="${colors.gold}">EXACT APPROVED LOCKUP · BODY-HARDWARE-AWARE LAYOUTS</text>
    <text x="120" y="270" class="inter" font-size="32" letter-spacing="3" fill="${colors.navy}">01 · SIMPLE BAND</text>
    <text x="120" y="1300" class="inter" font-size="32" letter-spacing="3" fill="${colors.navy}">02 · MOTION SWEEP</text>
    <text x="1430" y="270" class="inter" font-size="23" letter-spacing="2" fill="${colors.gold}">REAR</text>
    <text x="1430" y="1300" class="inter" font-size="23" letter-spacing="2" fill="${colors.gold}">REAR</text>
  `);
  await sharp(board)
    .composite([
      { input: sideSimple, left: 120, top: 310 },
      { input: rearSimple, left: 1430, top: 400 },
      { input: sideSweep, left: 120, top: 1340 },
      { input: rearSweep, left: 1430, top: 1430 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-mockup-board-v3.png"));
}

const [side, rear] = await Promise.all([sideBase(), rearBase()]);
await renderSimpleSide(side);
await renderSimpleRear(rear);
await renderSweepSide(side);
await renderSweepRear(rear);
await renderBoard();
