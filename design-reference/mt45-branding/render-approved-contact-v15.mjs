import path from "node:path";
import sharp from "/Users/jordanhudson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/jordanhudson/Documents/Shelton-Uniform-Linens-Website 2";
const outputDir = path.join(root, "design-reference/mt45-branding");
const referenceMockup = path.join(
  outputDir,
  "shelton-mt45-route-stripe-approved-lockup-v13.png",
);

const gold = "#B8965A";
const navy = "#041228";

// Refinish only the safely inset interior of the existing navy route stripe.
// The visible navy edges and gold pinstripe remain pixels from the approved v13
// mockup, so their exact position, angle, and thickness cannot move.
const cleanBandInterior = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086">
    <polygon points="590,601 1285,561 1285,598 590,654" fill="${navy}"/>
  </svg>
`);

const contactSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="590" height="76" viewBox="0 0 590 76">
    <style>
      .contact { font-family: Inter, Arial, sans-serif; font-weight: 500; }
    </style>
    <g transform="rotate(-3.2 0 43)">
      <text class="contact" x="0" y="44" fill="${gold}" font-size="29" letter-spacing="0.65">(000) 000-0000</text>
      <circle cx="254" cy="34" r="3.4" fill="${gold}"/>
      <text class="contact" x="282" y="44" fill="${gold}" font-size="29" letter-spacing="0.25">sheltonlinen.com</text>
    </g>
  </svg>
`);

const output = path.join(
  outputDir,
  "shelton-mt45-route-stripe-approved-contact-v15.png",
);

await sharp(referenceMockup)
  .composite([
    { input: cleanBandInterior, left: 0, top: 0 },
    { input: contactSvg, left: 660, top: 578 },
  ])
  .png()
  .toFile(output);

console.log(output);
