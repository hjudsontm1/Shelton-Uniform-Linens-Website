const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const publicPages = {
  "index.html": "https://sheltonlinen.com/",
  "services.html": "https://sheltonlinen.com/services.html",
  "industries.html": "https://sheltonlinen.com/industries.html",
  "pricing.html": "https://sheltonlinen.com/pricing.html",
  "about.html": "https://sheltonlinen.com/about.html",
  "quote.html": "https://sheltonlinen.com/quote.html",
  "privacy.html": "https://sheltonlinen.com/privacy.html",
};

test("primary pages use the approved launch domain and sharing metadata", () => {
  Object.entries(publicPages).forEach(([file, canonical]) => {
    const html = read(file);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), `${file} canonical`);
    assert.match(html, /<meta property="og:url" content="https:\/\/sheltonlinen\.com\//, `${file} Open Graph URL`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `${file} Twitter card`);
  });

  assert.match(read("robots.txt"), /^Sitemap: https:\/\/sheltonlinen\.com\/sitemap\.xml$/m);
  const sitemap = read("sitemap.xml");
  Object.values(publicPages).forEach((url) => assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap includes ${url}`));
});

test("primary pages expose consistent contact and privacy paths", () => {
  Object.keys(publicPages).forEach((file) => {
    const html = read(file);
    assert.match(html, /href="privacy\.html"/, `${file} privacy link`);
    assert.match(html, /href="tel:\+16193208703"/, `${file} phone link`);
  });

  assert.match(read("quote.html"), /See our <a href="privacy\.html">privacy notice<\/a>/);
  assert.match(read("pricing.html"), /class="quote-privacy-note"/);
});

test("navigation exposes one current top-level page where appropriate", () => {
  const activePages = {
    "index.html": "Home",
    "services.html": "Services",
    "industries.html": "Who We Serve",
    "pricing.html": "Pricing",
    "about.html": "About",
    "quote.html": "Request a Quote",
  };

  Object.entries(activePages).forEach(([file, label]) => {
    const html = read(file);
    const currents = html.match(/aria-current="page"/g) || [];
    assert.equal(currents.length, 1, `${file} has one current top-level destination`);
    assert.match(html, new RegExp(`aria-current="page"[^>]*>${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</a>`));
  });
});

test("structured business data uses Shelton launch details", () => {
  const match = read("index.html").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "Home contains JSON-LD");
  const data = JSON.parse(match[1]);
  assert.equal(data["@type"], "DryCleaningOrLaundry");
  assert.equal(data.url, "https://sheltonlinen.com/");
  assert.equal(data.telephone, "+1-619-320-8703");
  assert.equal(data.address.postalCode, "92101");
});

test("unfinished industry drawers remain out of the launch build", () => {
  const html = read("industries.html");
  assert.doesNotMatch(html, /<dialog|program-drawer|data-program=/);
  const quoteLinks = html.match(/class="serve-program__link" href="quote\.html\?industry=[^"]+"/g) || [];
  assert.equal(quoteLinks.length, 10);
});

test("privacy notice covers actual inquiry and browser-storage flows", () => {
  const html = read("privacy.html");
  [
    "Information we collect",
    "How we use information",
    "Service providers and sharing",
    "Browser storage and external services",
    "Retention and security",
    "Your choices",
  ].forEach((heading) => assert.ok(html.includes(heading), `privacy heading: ${heading}`));
  assert.match(html, /Formspree/);
  assert.match(html, /session storage/);
});

test("visible production HTML and scripts do not use em dashes", () => {
  const files = [
    ...Object.keys(publicPages),
    "thank-you.html",
    "estimate.html",
    "assets/js/site.js",
    "assets/js/pricing-learning.js",
    "assets/js/services-editorial.js",
  ];

  files.forEach((file) => {
    assert.doesNotMatch(read(file), /—|&mdash;|&#8212;|\\u2014/, `${file} has no em dash`);
  });
});

test("local assets referenced by the primary pages exist", () => {
  Object.keys(publicPages).forEach((file) => {
    const html = read(file);
    const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((match) => match[1]);
    refs.forEach((ref) => {
      const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
      assert.ok(fs.existsSync(path.join(root, clean)), `${file} references missing ${clean}`);
    });
  });
});
