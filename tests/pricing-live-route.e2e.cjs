const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_LIVE_URL || "http://127.0.0.1:8045/pricing.html";

const click = async (page, selector) => {
  const control = page.locator(selector);
  await control.scrollIntoViewIfNeeded();
  await control.click();
  await page.waitForTimeout(90);
};

const assertNoOverflow = async (page, label) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: ${JSON.stringify(dimensions)}`);
};

const completeHotelJourney = async (page) => {
  await click(page, "[data-begin-journey]");
  await click(page, '[data-operation-id="hotel"]');
  await click(page, "[data-operation-continue]");
  await click(page, '[data-good-id="robes"]');
  await click(page, "[data-goods-continue]");
  await page.locator('[data-scale-input="rooms"]').fill("80");
  await page.locator('[data-scale-input="occupancy"]').selectOption("75to89");
  await page.locator('[data-scale-input="weeklyTurns"]').fill("220");
  await page.locator('[data-scale-input="storage"]').selectOption("limited");
  await click(page, '[data-scale-form] button[type="submit"]');
  await click(page, '[data-choice-id="hanging"]');
  await click(page, '[data-choice-id="poly"]');
  await click(page, "[data-finish-continue]");
  await click(page, '[data-ownership-id="own"]');
  await click(page, "[data-ownership-continue]");
  await page.locator("[data-location-input]").fill("92101");
  await click(page, '[data-location-form] button[type="submit"]');
  await click(page, "[data-build-result]");
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];
  let submittedBody = "";

  const desktop = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await desktop.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  await page.route("https://formspree.io/**", async (route) => {
    submittedBody = route.request().postData() || "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('meta[name="robots"]').count(), 0, "public Pricing route must be indexable");
  assert.equal(await page.locator("body").getAttribute("data-quote-mode"), "live");
  assert.equal((await page.locator(".journey-nav-links a.is-active").textContent()).trim(), "Pricing");
  assert.equal(await page.locator(".journey-site-footer").count(), 1);
  assert.equal(await page.locator(".pricing-builder").count(), 0, "legacy estimator must not render");
  assert.equal(await page.locator("[data-begin-journey]").isVisible(), true);
  await assertNoOverflow(page, "desktop landing");

  await completeHotelJourney(page);
  assert.equal(await page.locator("[data-result]").isVisible(), true);
  assert.match(await page.locator("[data-result-warning]").innerText(), /DEVELOPMENT ESTIMATE/i);
  await click(page, "[data-exact-quote]");
  await page.locator('input[name="name"]').fill("Jordan Hudson");
  await page.locator('input[name="business"]').fill("Shelton Test Hotel");
  await page.locator('input[name="email"]').fill("jordan@example.com");
  await page.locator('input[name="preferredContact"][value="email"]').check();
  await Promise.all([
    page.waitForURL("**/thank-you.html"),
    page.locator("[data-quote-submit]").click()
  ]);
  assert.match(submittedBody, /name="pricing_journey"/);
  assert.match(submittedBody, /Shelton Test Hotel/);
  assert.match(submittedBody, /Hotel/);
  assert.match(submittedBody, /Robes/);
  assert.match(await page.locator("main h1").innerText(), /quote request has been received/i);
  assert.deepEqual(errors, []);
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await assertNoOverflow(mobilePage, "mobile landing");
  await mobilePage.locator(".journey-menu-toggle").click();
  assert.equal(await mobilePage.locator(".journey-menu-toggle").getAttribute("aria-expanded"), "true");
  assert.equal(await mobilePage.locator("#primary-menu").evaluate((menu) => menu.classList.contains("is-open")), true);
  assert.equal(await mobilePage.locator('#primary-menu a[href="about.html"]').isVisible(), true);
  await mobilePage.locator(".journey-menu-toggle").click();
  await click(mobilePage, "[data-begin-journey]");
  const placement = await mobilePage.evaluate(() => ({
    headingTop: document.querySelector("#operation-title")?.getBoundingClientRect().top,
    headerBottom: document.querySelector(".journey-private-bar")?.getBoundingClientRect().bottom
  }));
  assert.ok(placement.headingTop >= placement.headerBottom - 1, JSON.stringify(placement));
  await assertNoOverflow(mobilePage, "mobile estimator");
  await mobile.close();

  await browser.close();
  console.log("Public Pricing route passed desktop, live-handoff, navigation, and mobile checks.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
