const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_LIVE_URL || "http://127.0.0.1:8045/pricing.html";

const click = async (page, selector) => {
  const control = page.locator(selector);
  await control.scrollIntoViewIfNeeded();
  await control.click();
  await page.waitForTimeout(60);
};

const assertNoOverflow = async (page, label) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: ${JSON.stringify(dimensions)}`);
};

const publicEstimate = (lane, rental = []) => ({
  schemaVersion: "commercial-estimator.v3",
  estimateToken: `signed-${lane}-estimate`,
  estimate: {
    modelVersion: "commercial-estimator.v2.4",
    lane,
    ready: true,
    requiresReview: false,
    reviewMessages: [],
    confidence: { score: 76, label: "Directional", evidence: "estimated" },
    sizing: { driver: "Approved V2.4 volume model", weeklyPounds: 6142.5 },
    pricing: {
      weeklyRange: { low: 5100, base: 5500, high: 5900 },
      monthlyRange: { low: 22100, base: 23850, high: 25550 },
      unitPrices: [{ label: lane === "event" ? "Tablecloth" : "Customer-owned linen", billingUnit: lane === "event" ? "piece" : "pound", weeklyUnits: lane === "event" ? 250 : 6142.5, recommendedRate: 0.88 }]
    },
    route: { label: "Weekday commercial pickup and return", recommendedPickupsPerWeek: 5, remoteReview: false },
    rental
  }
});

const installApiMocks = async (page, captures, options = {}) => {
  const leadStatus = options.leadStatus || 201;
  await page.route("**/api/commercial-estimate", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    captures.estimates.push(body);
    const rentals = body.estimate?.rentalSelections?.length
      ? [{ category: "sheets", tier: body.estimate.rentalSelections[0].tier, quantity: body.estimate.rentalSelections[0].quantity, weeklyRatePerItem: 0.42, weeklyCharge: 210, requiresManagementReview: false }]
      : [];
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(publicEstimate(body.estimate?.lane || "hotel", rentals)) });
  });
  await page.route("**/api/commercial-leads", async (route) => {
    const lead = JSON.parse(route.request().postData() || "{}");
    captures.lead = lead;
    captures.leadAttempts ||= [];
    captures.leadAttempts.push({
      body: lead,
      idempotencyKey: route.request().headers()["idempotency-key"]
    });
    await route.fulfill({
      status: leadStatus,
      contentType: "application/json",
      body: JSON.stringify(leadStatus < 400
        ? { reviewId: "review-1", status: "inbound_review" }
        : { error: "Durable review intake is unavailable.", code: "estimator_unavailable" })
    });
  });
  await page.route("https://formspree.io/**", async (route) => {
    captures.formspree = route.request().postData() || "";
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ ok: true }) });
  });
};

const reachScale = async (browser, operation, good, expectedField) => {
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await click(page, "[data-begin-journey]");
  await click(page, `[data-operation-id="${operation}"]`);
  await click(page, "[data-operation-continue]");
  await click(page, `[data-good-id="${good}"]`);
  await click(page, "[data-goods-continue]");
  assert.equal(await page.locator(`[data-scale-input="${expectedField}"]`).count(), 1, `${operation} shows ${expectedField}`);
  await assertNoOverflow(page, `${operation} scale branch`);
  await context.close();
};

const completeHotelJourney = async (page) => {
  await click(page, "[data-begin-journey]");
  await click(page, '[data-operation-id="hotel"]');
  await click(page, "[data-operation-continue]");
  await click(page, '[data-good-id="sheets"]');
  await click(page, '[data-good-id="robes"]');
  await click(page, "[data-goods-continue]");
  await page.locator('[data-scale-input="rooms"]').fill("100");
  await page.locator('[data-scale-input="occupancy"]').selectOption("75to89");
  await page.locator('[data-scale-input="bedSystem"]').selectOption("mixed");
  await page.locator('[data-scale-input="storage"]').selectOption("limited");
  await page.locator('[data-scale-input="weeklyRobes"]').fill("40");
  await click(page, '[data-scale-form] button[type="submit"]');
  await click(page, '[data-choice-id="pressed"]');
  await click(page, '[data-choice-id="hanging"]');
  await click(page, "[data-finish-continue]");
  await click(page, '[data-ownership-id="own"]');
  await click(page, "[data-ownership-continue]");
  await page.locator("[data-location-input]").fill("92101");
  await click(page, '[data-location-form] button[type="submit"]');
  await click(page, "[data-build-result]");
  await page.locator("[data-result]").waitFor({ state: "visible" });
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const keyboardContext = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const keyboardPage = await keyboardContext.newPage();
  await keyboardPage.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await keyboardPage.locator(".journey-skip-link").focus();
  assert.equal(await keyboardPage.locator(".journey-skip-link").isVisible(), true);
  await keyboardPage.keyboard.press("Enter");
  assert.equal(await keyboardPage.evaluate(() => document.activeElement?.id), "journey-main");
  await keyboardPage.locator("[data-begin-journey]").focus();
  await keyboardPage.keyboard.press("Enter");
  await keyboardPage.locator('[data-chapter-editor="operation"]').waitFor();
  const firstOperation = keyboardPage.locator("[data-operation-id]").first();
  await firstOperation.focus();
  await keyboardPage.keyboard.press("ArrowRight");
  const focusedOperation = await keyboardPage.evaluate(() => document.activeElement?.getAttribute("data-operation-id"));
  assert.ok(focusedOperation, "arrow keys move focus through operation choices");
  await keyboardPage.keyboard.press("Space");
  assert.equal(await keyboardPage.locator(`[data-operation-id="${focusedOperation}"]`).getAttribute("aria-checked"), "true");
  const accessibility = await keyboardPage.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    const unnamedButtons = [...document.querySelectorAll("button")].filter((button) =>
      !String(button.textContent || "").trim() && !button.getAttribute("aria-label")
    ).length;
    return { duplicateIds: [...new Set(duplicateIds)], unnamedButtons };
  });
  assert.deepEqual(accessibility, { duplicateIds: [], unnamedButtons: 0 });
  await keyboardContext.close();

  const branches = [
    ["hotel", "sheets", "bedSystem"], ["str", "sheets", "averageBedrooms"], ["spa", "towels", "goodsUse"],
    ["medspa", "sheets", "handTowelsPerAppointment"], ["gym", "towels", "weeklyTowelUses"],
    ["events", "tablecloths", "weeklyTablecloths"], ["restaurant", "chefCoats", "weeklyChefCoats"],
    ["casino", "banquetLinens", "hotelRooms"], ["uniforms", "uniformShirts", "weeklyUniformTops"],
    ["other", "towels", "weeklyVolume"]
  ];
  for (const branch of branches) await reachScale(browser, ...branch);

  const errors = [];
  const captures = { estimates: [], lead: null, formspree: "" };
  const desktop = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const page = await desktop.newPage();
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  await installApiMocks(page, captures);
  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('meta[name="robots"]').count(), 0, "public Pricing route remains indexable");
  assert.equal(await page.locator("body").getAttribute("data-quote-mode"), "live");
  assert.equal(await page.locator(".pricing-builder").count(), 0, "legacy estimator does not render");
  await completeHotelJourney(page);
  assert.match(await page.locator("[data-result-warning]").innerText(), /COMMERCIAL PLANNING RANGE/i);
  assert.equal(await page.locator("[data-result-weekly]").innerText(), "$5,100-$5,900");
  assert.match(await page.locator("[data-result-unit-rates]").innerText(), /\$0\.88 per pound/);
  const retained = JSON.parse(await page.evaluate(() => sessionStorage.getItem("shelton-pricing-journey-v5")));
  assert.equal(retained.scale.rooms, "100");
  assert.equal(captures.estimates[0].estimate.specialtyItems[0].type, "robe");
  await click(page, "[data-exact-quote]");
  await page.locator('input[name="name"]').fill("Jordan Hudson");
  await page.locator('input[name="business"]').fill("Shelton Test Hotel");
  await page.locator('input[name="email"]').fill("jordan@example.com");
  await page.locator('input[name="preferredContact"][value="email"]').check();
  await Promise.all([page.waitForURL("**/thank-you.html"), page.locator("[data-quote-submit]").click()]);
  assert.equal(captures.lead.estimateToken, "signed-hotel-estimate");
  assert.equal(captures.lead.contact.businessName, "Shelton Test Hotel");
  assert.match(captures.formspree, /name="pricing_journey"/);
  assert.deepEqual(errors, []);
  await desktop.close();

  const retryCaptures = { estimates: [], lead: null, leadAttempts: [], formspree: "" };
  const retryContext = await browser.newContext({ viewport: { width: 1200, height: 850 }, reducedMotion: "reduce" });
  const retryPage = await retryContext.newPage();
  await installApiMocks(retryPage, retryCaptures, { leadStatus: 503 });
  await retryPage.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await completeHotelJourney(retryPage);
  await click(retryPage, "[data-exact-quote]");
  await retryPage.locator('input[name="name"]').fill("Retry Tester");
  await retryPage.locator('input[name="business"]').fill("Durable Save QA Hotel");
  await retryPage.locator('input[name="email"]').fill("retry@example.com");
  await retryPage.locator('input[name="preferredContact"][value="email"]').check();
  await retryPage.locator("[data-quote-submit]").click();
  await retryPage.locator('[data-quote-status][data-status="failure"]').waitFor();
  assert.equal(await retryPage.locator('input[name="business"]').inputValue(), "Durable Save QA Hotel");
  await retryPage.locator("[data-quote-submit]").click();
  await retryPage.locator('[data-quote-status][data-status="failure"]').waitFor();
  assert.equal(retryCaptures.leadAttempts.length, 2);
  assert.ok(retryCaptures.formspree, "Formspree can still notify while the durable save fails");
  assert.equal(retryCaptures.leadAttempts[0].idempotencyKey, retryCaptures.leadAttempts[1].idempotencyKey);
  assert.equal(retryCaptures.leadAttempts[0].body.idempotencyKey, retryCaptures.leadAttempts[1].body.idempotencyKey);
  assert.equal(retryPage.url().includes("thank-you.html"), false, "notification-only success must not show confirmation");
  await retryContext.close();

  const manualContext = await browser.newContext({ viewport: { width: 1200, height: 850 }, reducedMotion: "reduce" });
  const manualPage = await manualContext.newPage();
  await manualPage.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await click(manualPage, "[data-begin-journey]");
  await click(manualPage, '[data-operation-id="other"]');
  await click(manualPage, "[data-operation-continue]");
  await click(manualPage, '[data-good-id="towels"]');
  await click(manualPage, "[data-goods-continue]");
  await manualPage.locator('[data-scale-input="weeklyVolume"]').fill("1000");
  await manualPage.locator('[data-scale-input="volumeUnit"]').selectOption("pieces");
  await manualPage.locator('[data-scale-input="activeDays"]').fill("5");
  await manualPage.locator('[data-scale-input="variability"]').selectOption("steady");
  await manualPage.locator('[data-scale-input="storage"]').selectOption("limited");
  await click(manualPage, '[data-scale-form] button[type="submit"]');
  await click(manualPage, '[data-choice-id="folded"]');
  await click(manualPage, "[data-finish-continue]");
  await click(manualPage, '[data-ownership-id="own"]');
  await click(manualPage, "[data-ownership-continue]");
  await manualPage.locator("[data-location-input]").fill("San Diego");
  await click(manualPage, '[data-location-form] button[type="submit"]');
  await click(manualPage, "[data-build-result]");
  assert.equal(await manualPage.locator("[data-result-weekly]").innerText(), "Exact review required");
  assert.match(await manualPage.locator("[data-result-warning]").innerText(), /EXACT REVIEW REQUIRED/);
  await manualContext.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await assertNoOverflow(mobilePage, "mobile landing");
  await mobilePage.locator(".menu-toggle").click();
  assert.equal(await mobilePage.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
  await mobilePage.locator(".menu-toggle").click();
  assert.equal(await mobilePage.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
  await click(mobilePage, "[data-begin-journey]");
  await assertNoOverflow(mobilePage, "mobile operation branch");
  await mobile.close();

  await browser.close();
  console.log("Commercial Estimator V2.3 passed public lanes, durable-save retry, manual fallback, retained input, safe handoff, and mobile checks.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
