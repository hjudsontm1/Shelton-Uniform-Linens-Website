import fs from "node:fs/promises";

const [, , imagePath] = process.argv;
if (!imagePath) {
  throw new Error("Usage: node verify-qr.mjs IMAGE");
}

const image = await fs.readFile(imagePath);
const response = await fetch("https://quickchart.io/qr-read", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ image: image.toString("base64") }),
});

const body = await response.text();
if (!response.ok) {
  throw new Error(`QR reader returned ${response.status}: ${body}`);
}

console.log(body);
