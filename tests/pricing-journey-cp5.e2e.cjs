const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_PREVIEW_URL || "http://127.0.0.1:8045/pricing-journey-preview.html";
const artifactDir = process.env.PRICING_ARTIFACT_DIR || path.resolve(__dirname, "../docs/pricing-journey-artifacts/checkpoint-5");
fs.mkdirSync(artifactDir, { recursive: true });

const completeHotelRobesProgram = async (page) => {
  await page.locator('[data-concept-panel="orb"] [data-begin-journey]').click();
  await page.locator('[data-operation-id="hotel"]').click();
  await page.locator("[data-operation-continue]").click();
  await page.locator('[data-good-id="robes"]').click();
  await page.locator("[data-goods-continue]").click();
  await page.locator('[data-scale-input="rooms"]').fill("80");
  await page.locator('[data-scale-input="occupancy"]').selectOption("75to89");
  await page.locator('[data-scale-input="weeklyTurns"]').fill("220");
  await page.locator('[data-scale-input="storage"]').selectOption("limited");
  await page.locator("[data-scale-form]").evaluate((form) => form.requestSubmit());
  await page.locator('[data-choice-id="hanging"]').click();
  await page.locator('[data-choice-id="poly"]').click();
  await page.locator('[data-choice-id="delicate"]').click();
  await page.locator("[data-finish-continue]").click();
  await page.locator('[data-ownership-id="some"]').click();
  await page.locator("[data-ownership-continue]").click();
  await page.locator("[data-location-input]").fill("92101");
  await page.locator("[data-location-form]").evaluate((form) => form.requestSubmit());
  await page.waitForTimeout(100);
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  const nonGetRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("request", (request) => {
    if (request.method() !== "GET") nonGetRequests.push(`${request.method()} ${request.url()}`);
  });

  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await completeHotelRobesProgram(page);
  assert.equal(await page.locator('[data-chapter-editor="review"]').isVisible(), true);
  assert.equal(await page.locator("[data-review-selections] article").count(), 6);
  assert.equal(await page.locator("[data-review-scene] [data-vector-good]").count(), 1);
  await page.screenshot({ path: path.join(artifactDir, "cp5-review-1366x768.png") });

  await page.locator("[data-build-result]").click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator("[data-result]").isVisible(), true);
  assert.match(await page.locator("[data-result-warning]").innerText(), /DEVELOPMENT ESTIMATE - NOT APPROVED PRICING/);
  assert.match(await page.locator("[data-result-rhythm]").innerText(), /Twice-weekly commercial pickup and return/);
  assert.equal(await page.locator("[data-result-model]").innerText(), "Hybrid Program");
  assert.equal(await page.locator("[data-model-comparison] article").count(), 3);
  assert.equal(await page.locator('[data-model-id="hybrid"].is-recommended').count(), 1);
  assert.match(await page.locator("[data-result-weekly]").innerText(), /^\$[\d,]+-\$[\d,]+$/);
  await page.screenshot({ path: path.join(artifactDir, "cp5-result-1366x768.png") });
  await page.locator(".result-recommendations").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(artifactDir, "cp5-recommendations-1366x768.png") });
  await page.locator(".model-comparison").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(artifactDir, "cp5-model-comparison-1366x768.png") });

  await page.locator('[data-result] [data-edit-chapter="review"]').click();
  await page.waitForTimeout(80);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("[data-build-result]").click();
  await page.waitForTimeout(100);
  const mobileWarningBox = await page.locator("[data-result-warning]").boundingBox();
  assert.ok(mobileWarningBox && mobileWarningBox.y >= 140, "mobile result warning settles below the fixed header and chapter thread");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await page.screenshot({ path: path.join(artifactDir, "cp5-result-390x844.png") });
  await page.setViewportSize({ width: 1366, height: 768 });

  await page.locator("[data-exact-quote]").click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator("[data-quote-handoff]").isVisible(), true);
  await page.locator('input[name="name"]').fill("Jordan Hudson");
  await page.locator('input[name="business"]').fill("Shelton Preview Account");
  await page.locator('input[name="email"]').fill("jordan@example.com");
  await page.locator('input[name="phone"]').fill("619-555-0100");
  await page.locator('input[name="preferredContact"][value="email"]').check();
  await page.screenshot({ path: path.join(artifactDir, "cp5-handoff-1366x768.png") });
  await page.locator("[data-quote-form]").evaluate((form) => form.requestSubmit());
  await page.waitForTimeout(180);
  assert.equal(await page.locator("[data-quote-status]").getAttribute("data-status"), "ready");
  assert.match(await page.locator("[data-quote-status]").innerText(), /Nothing has been submitted/);
  const payload = JSON.parse(await page.locator("[data-quote-payload]").textContent());
  assert.equal(payload.preview, true);
  assert.equal(payload.endpointIntegrated, false);
  assert.deepEqual(payload.goods, ["robes"]);
  assert.equal(payload.contact.email, "jordan@example.com");
  assert.deepEqual(nonGetRequests, [], "the preview never sends a non-GET request");
  await page.screenshot({ path: path.join(artifactDir, "cp5-payload-ready-1366x768.png") });

  await page.goto(`${baseUrl}?motion=reduce&quote=fail`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("[data-quote-handoff]").isVisible(), true, "the completed preview state restores in the same tab");
  await page.locator('input[name="phone"]').fill("619-555-0101");
  await page.locator("[data-quote-form]").evaluate((form) => form.requestSubmit());
  await page.waitForTimeout(180);
  assert.equal(await page.locator("[data-quote-status]").getAttribute("data-status"), "failure");
  assert.match(await page.locator("[data-quote-status]").innerText(), /Your program and contact details remain available/);
  assert.deepEqual(nonGetRequests, [], "the failure preview also makes no submission request");
  await page.screenshot({ path: path.join(artifactDir, "cp5-handoff-failure-1366x768.png") });

  assert.deepEqual(errors, [], `browser errors: ${errors.join(" | ")}`);
  await browser.close();
  console.log("Checkpoint 5 pricing result and quote handoff browser test passed.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
