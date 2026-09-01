const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const baseUrl = new URL(process.env.SHELTON_SMOKE_URL || "http://127.0.0.1:4183/");
const routes = [
  "index.html",
  "services.html",
  "industries.html",
  "pricing.html",
  "about.html",
  "quote.html",
  "privacy.html",
  "thank-you.html"
];
const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["compact", { width: 900, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
  ["small-mobile", { width: 320, height: 740 }]
];

const pathnameFor = (href) => {
  const url = new URL(href, baseUrl);
  return `${url.pathname}${url.search}`;
};

const auditPage = async (page, route, viewportName) => {
  const failedAssets = [];
  const onResponse = (response) => {
    const url = new URL(response.url());
    if (url.origin === baseUrl.origin && response.status() >= 400) {
      failedAssets.push(`${response.status()} ${url.pathname}`);
    }
  };
  page.on("response", onResponse);
  const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "networkidle" });
  assert.ok(response && response.ok(), `${viewportName} ${route}: document loads`);
  const audit = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((node) => node.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const brokenImages = [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src);
    const unnamedButtons = [...document.querySelectorAll("button")]
      .filter((button) => !String(button.textContent || "").trim() && !button.getAttribute("aria-label"))
      .length;
    return {
      title: document.title,
      main: document.querySelectorAll("main").length,
      nav: document.querySelectorAll("nav").length,
      footer: document.querySelectorAll("footer").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      duplicateIds,
      brokenImages,
      unnamedButtons
    };
  });
  assert.ok(audit.title.trim(), `${viewportName} ${route}: document title exists`);
  assert.equal(audit.main, 1, `${viewportName} ${route}: one main landmark`);
  assert.ok(audit.nav >= 1, `${viewportName} ${route}: navigation landmark exists`);
  assert.ok(audit.footer >= 1, `${viewportName} ${route}: footer landmark exists`);
  assert.ok(audit.overflow <= 1, `${viewportName} ${route}: no horizontal overflow (${audit.overflow}px)`);
  assert.deepEqual(audit.duplicateIds, [], `${viewportName} ${route}: no duplicate IDs`);
  assert.deepEqual(audit.brokenImages, [], `${viewportName} ${route}: images load`);
  assert.equal(audit.unnamedButtons, 0, `${viewportName} ${route}: buttons have names`);
  assert.deepEqual(failedAssets, [], `${viewportName} ${route}: same-origin assets load`);
  page.off("response", onResponse);
};

const verifyKeyboard = async (page, route) => {
  await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "networkidle" });
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    href: document.activeElement?.getAttribute?.("href")
  }));
  assert.match(firstFocus.text || "", /skip/i, `${route}: first keyboard stop is the skip link`);
  await page.keyboard.press("Enter");
  assert.notEqual(await page.evaluate(() => document.activeElement?.tagName), "BODY", `${route}: skip link moves focus into content`);
};

const verifyMobileMenu = async (page) => {
  await page.goto(new URL("index.html", baseUrl).toString(), { waitUntil: "networkidle" });
  const toggle = page.locator(".menu-toggle");
  await toggle.focus();
  await page.keyboard.press("Enter");
  assert.equal(await toggle.getAttribute("aria-expanded"), "true", "mobile menu opens from the keyboard");
  await page.keyboard.press("Escape");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false", "mobile menu closes with Escape");
};

const verifyQuoteValidation = async (page) => {
  await page.goto(new URL("quote.html", baseUrl).toString(), { waitUntil: "networkidle" });
  await page.locator("[data-quote-submit]").click();
  const validation = await page.evaluate(() => {
    const form = document.querySelector("[data-quote-form]");
    const firstInvalid = form?.querySelector(":invalid");
    return {
      hasInvalid: Boolean(firstInvalid),
      invalidNamed: Boolean(firstInvalid?.getAttribute("aria-label") || firstInvalid?.id && document.querySelector(`label[for="${firstInvalid.id}"]`) || firstInvalid?.closest("label")),
      focused: document.activeElement === firstInvalid
    };
  });
  assert.equal(validation.hasInvalid, true, "quote form exposes native required-field validation");
  assert.equal(validation.invalidNamed, true, "first invalid quote field has an accessible label");
  assert.equal(validation.focused, true, "quote validation focuses the first invalid field");
};

const verifyInternalLinks = async (page) => {
  const paths = new Set();
  for (const route of routes) {
    await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    const hrefs = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    hrefs.forEach((href) => {
      const url = new URL(href);
      if (url.origin === baseUrl.origin) paths.add(pathnameFor(href).split("#")[0]);
    });
  }
  for (const path of paths) {
    const response = await page.request.get(new URL(path, baseUrl).toString());
    assert.ok(response.status() < 400, `internal link ${path} returns ${response.status()}`);
  }
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    for (const [viewportName, viewport] of viewports) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      for (const route of routes) await auditPage(page, route, viewportName);
      await context.close();
    }

    const keyboardContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    const keyboardPage = await keyboardContext.newPage();
    for (const route of ["index.html", "pricing.html", "quote.html"]) await verifyKeyboard(keyboardPage, route);
    await verifyQuoteValidation(keyboardPage);
    await verifyInternalLinks(keyboardPage);
    await keyboardContext.close();

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await verifyMobileMenu(await mobileContext.newPage());
    await mobileContext.close();
  } finally {
    await browser.close();
  }
  console.log(`Final Shelton smoke matrix passed for ${baseUrl.origin}: desktop, compact, mobile, keyboard, landmarks, form validation, links, and asset loading.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
