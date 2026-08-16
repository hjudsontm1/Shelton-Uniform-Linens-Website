import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const [, , basePath, qrPath, outputPath] = process.argv;

if (!basePath || !qrPath || !outputPath) {
  throw new Error("Usage: node compose_verified_qr.mjs BASE QR OUTPUT");
}

const backingSize = 184;
const qrSize = 180;
const backingLeft = 258;
const backingTop = 887;
const qrLeft = backingLeft + Math.floor((backingSize - qrSize) / 2);
const qrTop = backingTop + Math.floor((backingSize - qrSize) / 2);

const whiteBacking = await sharp({
  create: {
    width: backingSize,
    height: backingSize,
    channels: 4,
    background: "#ffffff",
  },
})
  .png()
  .toBuffer();

const verifiedQr = await sharp(qrPath)
  .resize(qrSize, qrSize, { kernel: "nearest", fit: "fill" })
  .png()
  .toBuffer();

await sharp(basePath)
  .composite([
    { input: whiteBacking, left: backingLeft, top: backingTop },
    { input: verifiedQr, left: qrLeft, top: qrTop },
  ])
  .png()
  .toFile(outputPath);
