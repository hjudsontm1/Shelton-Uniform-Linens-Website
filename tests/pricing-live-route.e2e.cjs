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
  estimateToken: `signed-${lane}-estimate`,
  estimate: {
    modelVersion: "commercial-estimator.v2",
    lane,
    ready: true,
    requiresReview: false,
    reviewMessages: [],
    confidence: { score: 76, label: "Directional", evidence: "estimated" },
    sizing: { driver: "Approved V2 volume model", weeklyPounds: 6142.5 },
    pricing: {
      weeklyRange: { low: 5100, base: 5500, high: 5900 },
      monthlyRange: { low: 22100, base: 23850, high: 25550 },
      lines: [{ key: "major", label: lane === "event" ? "Tablecloth" : "Customer-owned linen", billingUnit: lane === "event" ? "piece" : "pound", weeklyUnits: lane === "event" ? 250 : 6142.5, low: 0.82, target: 0.88, high: 0.96 }]
    },
    route: { label: "Weekday commercial pickup and return", recommendedPickupsPerWeek: 5, remoteReview: false },
    rental
  }
});

const installApiMocks = async (page, captures) => {
  await page.route("**/api/public/commercial-estimate", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    captures.estimates.push(body);
    const rentals = body.estimate?.rentalSelections?.length
      ? [{ category: "sheets", tier: body.estimate.rentalSelections[0].tier, quantity: body.estimate.rentalSelections[0].quantity, weeklyRatePerItem: 0.42, weeklyCharge: 210, requiresManagementReview: false }]
      : [];
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(publicEstimate(body.estimate?.lane || "hotel", rentals)) });
  });
  await page.route("**/api/public/commercial-leads", async (route) => {
    captures.lead = JSON.parse(route.request().postData() || "{}");
    await route.fulfill({ status: 201, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ reviewId: "review-1", status: "inbound_review" }) });
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

  const branches = [
    ["hotel", "sheets", "bedSystem"], ["str", "sheets", "averageBedrooms"], ["spa", "towels", "goodsUse"],
    ["medspa", "sheets", "handTowelsPerAppointment"], ["gym", "towels", "weeklyTowelUses"],
    ["events", "tablecloths", "weeklyTablecloths"], ["restaurant", "chefCoats", "weeklyChefCoats"],
    ["casino", "banquetLinens", "hotelRooms"], ["uniforms", "uniformShirts", "weeklyUniformTops"],
    ["wholesale", "shirts", "weeklyVolume"], ["other", "towels", "weeklyVolume"]
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

  const manualContext = await browser.newContext({ viewport: { width: 1200, height: 850 }, reducedMotion: "reduce" });
  const manualPage = await manualContext.newPage();
  await manualPage.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await click(manualPage, "[data-begin-journey]");
  await click(manualPage, '[data-operation-id="wholesale"]');
  await click(manualPage, "[data-operation-continue]");
  await click(manualPage, '[data-good-id="shirts"]');
  await click(manualPage, "[data-goods-continue]");
  await manualPage.locator('[data-scale-input="weeklyVolume"]').fill("1000");
  await manualPage.locator('[data-scale-input="volumeUnit"]').selectOption("pieces");
  await manualPage.locator('[data-scale-input="batchDays"]').fill("5");
  await manualPage.locator('[data-scale-input="turnaround"]').selectOption("standard");
  await manualPage.locator('[data-scale-input="capacityNeed"]').selectOption("full");
  await click(manualPage, '[data-scale-form] button[type="submit"]');
  await click(manualPage, '[data-choice-id="pressed"]');
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
  await mobilePage.locator(".journey-menu-toggle").click();
  assert.equal(await mobilePage.locator(".journey-menu-toggle").getAttribute("aria-expanded"), "true");
  await click(mobilePage, "[data-begin-journey]");
  await assertNoOverflow(mobilePage, "mobile operation branch");
  await mobile.close();

  await browser.close();
  console.log("Commercial Estimator V2 passed all website branches, live dual submission, manual fallback, retained input, and mobile checks.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
