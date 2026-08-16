import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const [, , basePath, qrPath, outputPath] = process.argv;

if (!basePath || !qrPath || !outputPath) {
  throw new Error("Usage: node compose_verified_qr_side.mjs BASE QR OUTPUT");
}

const cardLeft = 1078;
const cardTop = 363;
const cardWidth = 204;
const cardHeight = 213;
const qrSize = 180;
const qrLeft = cardLeft + 12;
const qrTop = cardTop + 26;

const actionCard = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="102" y="19" text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif" font-size="15"
      font-weight="700" letter-spacing="0.45" fill="#081321">
      SCAN FOR A QUOTE
    </text>
  </svg>
`);

const verifiedQr = await sharp(qrPath)
  .resize(qrSize, qrSize, { kernel: "nearest", fit: "fill" })
  .png()
  .toBuffer();

await sharp(basePath)
  .composite([
    { input: actionCard, left: cardLeft, top: cardTop },
    { input: verifiedQr, left: qrLeft, top: qrTop },
  ])
  .png()
  .toFile(outputPath);
