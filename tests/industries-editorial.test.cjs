const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../dist/client");
const html = fs.readFileSync(path.join(root, "industries.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/css/industries.css"), "utf8");
const programs = fs.readFileSync(path.join(root, "assets/js/industries-programs.js"), "utf8");

assert.doesNotMatch(html, /data-drawer-image|program-drawer__image/);
assert.doesNotMatch(css, /program-drawer__image/);
assert.doesNotMatch(programs, /data-drawer-image|imageAlt|\bimage:\s*["']/);
assert.match(html, /industries\.css\?v=20260817-mobile-nav-docked-v31/);
assert.doesNotMatch(html, /industries-programs\.js/);
assert.doesNotMatch(html, /<dialog|program-drawer|data-program=/);
assert.match(html, /industries-directory\.js\?v=20260817-mobile-nav-docked-v3/);

const directoryScript = fs.readFileSync(path.join(root, "assets/js/industries-directory.js"), "utf8");
assert.match(directoryScript, /classList\.toggle\("is-docked", docked\)/);
assert.match(directoryScript, /setAttribute\("aria-current", "location"\)/);
assert.match(directoryScript, /directory\.scrollTo\(/);
assert.match(directoryScript, /--serve-directory-docked-offset/);
assert.match(directoryScript, /docked \? directoryHeight : siteNavigation\.offsetHeight/);
assert.doesNotMatch(directoryScript, /program-drawer|data-program=/);

assert.match(css, /@media \(max-width: 1080px\)[\s\S]*?\.industries-page\.has-directory-header \.site-nav[\s\S]*?visibility: visible;/);
assert.match(css, /\.serve-directory\.is-docked[\s\S]*?inset: var\(--serve-directory-docked-offset\) 0 auto;/);

const directQuoteLinks = html.match(/class="serve-program__link" href="quote\.html\?industry=[^"]+"/g) || [];
assert.equal(directQuoteLinks.length, 10, "all ten industry programs have direct quote links");

const overviewTitles = [
  "A complete linen program for the way your hotel operates.",
  "Hotel-level processing without hotel-level volume.",
  "A towel program built for peak demand.",
  "Every treatment starts with the right textiles.",
  "Presentation, color, and timing in one program.",
  "A higher standard for every service.",
  "Professional presentation for every role and every shift.",
  "One coordinated standard across every department.",
  "Capacity and quality behind your name.",
  "A process built around what makes the item different.",
];

overviewTitles.forEach((title) => assert.ok(programs.includes(title), `missing Overview title: ${title}`));
assert.equal((programs.match(/overviewFacts:\s*\[/g) || []).length, 10, "all ten programs have four-fact Overview data");
assert.equal((programs.match(/sections:\s*\[/g) || []).length, 10, "all ten programs have tailored section configuration");
assert.equal((programs.match(/panelContent:\s*\{/g) || []).length, 10, "all ten programs have tailored panel copy");
assert.match(programs, /The right care for every item\./);
assert.match(programs, /catalog:\s*true/);
assert.doesNotMatch(programs, /program-catalog__hero/);
assert.doesNotMatch(css, /program-catalog__hero/);
assert.doesNotMatch(programs, /Guest Room|Bath & Wellness|Dining & Banquet/);
assert.match(programs, /label: "Sheets"/);
assert.match(programs, /label: "Spa Towels"/);
assert.match(programs, /label: "Napkins"/);

const requiredRailLabels = [
  "Cleaning Quality",
  "Finishing & Presentation",
  "Bulk Cleaning & Pricing",
  "Cleaning & Odor",
  "Oil & Residue Removal",
  "Mold Removal",
  "Chef Coats & Kitchen Garments",
  "Organization & Return",
  "Departments & Goods",
  "Handoff & Batch Control",
  "Laundry & Dry Cleaning",
];

requiredRailLabels.forEach((label) => assert.ok(programs.includes(label), `missing tailored rail label: ${label}`));
assert.match(programs, /setAttribute\("role", "tab"\)/);
assert.match(programs, /setAttribute\("role", "tabpanel"\)/);
assert.match(programs, /setAttribute\("aria-controls", panelId\)/);
assert.match(programs, /setAttribute\("aria-labelledby", `program-tab-/);
assert.match(programs, /showPanel\("overview", \{ resetScroll: false \}\)/);
assert.match(programs, /quote\.href = program\.quoteHref/);
assert.match(programs, /quoteLabel\.textContent = program\.quoteLabel/);

console.log("Who We Serve exposes ten accessible direct quote paths while unfinished drawers remain offline.");
