import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const sideSource = "/Users/jordanhudson/Library/Messages/Attachments/db/11/2E13BDA8-4791-4853-BDD4-FA34907DFE2C/IMG_0464.jpeg";
const rearSource = "/Users/jordanhudson/Library/Messages/Attachments/51/01/09DE7ABC-D56C-4376-B22D-2E4EBE04C9A2/IMG_0465.jpeg";
const lockupSource = path.join(projectRoot, "assets/Shelton Brand Assets/cleaners/shelton-cleaners-lockup-dark.png");
const markSource = path.join(projectRoot, "assets/Shelton Brand Assets/cleaners/shelton-cleaners-mark-dark.png");
const outputDir = path.join(projectRoot, "design-reference/cleaners-van");

const colors = {
  navy: "#081321",
  cream: "#FAF6EE",
  gold: "#B8965A",
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

async function mark(size) {
  return sharp(markSource).resize({ width: size, height: size, fit: "contain" }).png().toBuffer();
}

// These are direct crops from the approved one-line lockup. The letterforms are
// unchanged; only their relationship is rearranged to fit the van's panel geometry.
async function word(part, height) {
  const crops = {
    shelton: { left: 483, top: 152, width: 934, height: 125 },
    cleaners: { left: 1479, top: 152, width: 1127, height: 125 },
    registered: { left: 2614, top: 239, width: 34, height: 34 },
  };
  return sharp(lockupSource)
    .extract(crops[part])
    .resize({ height, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
}

async function renderSide() {
  const width = 2400;
  const height = 1800;
  const [sMark, shelton, cleaners, registered] = await Promise.all([
    mark(305),
    word("shelton", 82),
    word("cleaners", 82),
    word("registered", 20),
  ]);
  const serviceLine = "DRY CLEANING  ·  LAUNDRY  ·  ALTERATIONS";
  const accents = svgBuffer(width, height, `
    <rect x="520" y="654" width="5" height="294" rx="2.5" fill="${colors.gold}"/>
    <rect x="558" y="904" width="745" height="6" rx="3" fill="${colors.gold}"/>
    <text x="558" y="974" class="inter" font-size="32" letter-spacing="3.15" fill="${colors.navy}">${esc(serviceLine)}</text>
  `);

  await sharp(sideSource)
    .rotate()
    .resize({ width, height, fit: "fill" })
    .composite([
      { input: sMark, left: 185, top: 650 },
      { input: shelton, left: 560, top: 680 },
      { input: cleaners, left: 560, top: 790 },
      { input: registered, left: 1307, top: 842 },
      { input: accents, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-side-v2.png"));
}

async function renderRear() {
  const width = 1800;
  const height = 2400;
  const [sMark, shelton, cleaners, registered] = await Promise.all([
    mark(370),
    word("shelton", 62),
    word("cleaners", 62),
    word("registered", 15),
  ]);
  const accents = svgBuffer(width, height, `
    <rect x="950" y="880" width="560" height="6" rx="3" fill="${colors.gold}"/>
    <text x="950" y="944" class="inter" font-size="28" letter-spacing="2.2" fill="${colors.navy}">DRY CLEANING  ·  LAUNDRY</text>
    <text x="950" y="1008" class="inter" font-size="24" letter-spacing="2.1" fill="${colors.gold}">ALTERATIONS  ·  PICKUP &amp; DELIVERY</text>
  `);

  await sharp(rearSource)
    .rotate()
    .resize({ width, height, fit: "fill" })
    .composite([
      { input: sMark, left: 380, top: 650 },
      { input: shelton, left: 950, top: 710 },
      { input: cleaners, left: 950, top: 798 },
      { input: registered, left: 1522, top: 839 },
      { input: accents, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-rear-v2.png"));
}

async function renderBoard() {
  const boardWidth = 3000;
  const boardHeight = 1800;
  const side = await sharp(path.join(outputDir, "shelton-cleaners-van-side-v2.png"))
    .resize({ width: 1840, height: 1380, fit: "cover" })
    .png()
    .toBuffer();
  const rear = await sharp(path.join(outputDir, "shelton-cleaners-van-rear-v2.png"))
    .resize({ width: 760, height: 1013, fit: "cover" })
    .png()
    .toBuffer();
  const board = svgBuffer(boardWidth, boardHeight, `
    <rect width="${boardWidth}" height="${boardHeight}" fill="${colors.cream}"/>
    <text x="130" y="145" class="inter" font-size="54" letter-spacing="3" fill="${colors.navy}">SHELTON CLEANERS · VAN IDENTITY</text>
    <text x="130" y="210" class="inter" font-size="28" letter-spacing="3" fill="${colors.gold}">PANEL-AWARE PARTIAL VINYL · APPROVED ARTWORK · INTER SUPPORTING TYPE</text>
    <text x="130" y="1700" class="inter" font-size="25" letter-spacing="2" fill="${colors.navy}">SIDE VIEW</text>
    <text x="2170" y="1700" class="inter" font-size="25" letter-spacing="2" fill="${colors.navy}">REAR VIEW</text>
  `);

  await sharp(board)
    .composite([
      { input: side, left: 130, top: 250 },
      { input: rear, left: 2170, top: 400 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, "shelton-cleaners-van-mockup-board-v2.png"));
}

await renderSide();
await renderRear();
await renderBoard();
