const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_PREVIEW_URL || "http://127.0.0.1:8045/pricing-journey-preview.html";
const artifactDir = process.env.PRICING_ARTIFACT_DIR || path.resolve(__dirname, "../docs/pricing-journey-artifacts/checkpoint-4");

fs.mkdirSync(artifactDir, { recursive: true });

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));

  await page.goto(`${baseUrl}?concept=label&motion=reduce`, { waitUntil: "networkidle" });
  assert.equal(await page.title(), "Private Adaptive Pricing Journey | Shelton Linen & Uniform Services");
  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow, noarchive");

  await page.locator('[data-concept-panel="label"] [data-begin-journey]').click();
  await page.locator('[data-operation-id="hotel"]').click();
  await page.locator("[data-operation-continue]").click();
  await page.locator('[data-good-id="robes"]').click();
  await page.locator("[data-goods-continue]").click();
  await page.waitForTimeout(80);

  assert.equal(await page.locator('[data-scale-scene] [data-vector-good="robes"]').count(), 1);
  assert.equal(await page.locator("[data-scale-scene] [data-vector-good]").count(), 1, "only the selected good remains in later scenes");
  await page.screenshot({ path: path.join(artifactDir, "cp4-scale-1366x768.png") });

  await page.locator('[data-scale-input="rooms"]').fill("80");
  await page.locator('[data-scale-input="occupancy"]').selectOption("75to89");
  await page.locator('[data-scale-input="weeklyTurns"]').fill("220");
  await page.locator('[data-scale-input="storage"]').selectOption("limited");
  await page.locator("[data-scale-form]").evaluate((form) => form.requestSubmit());
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(artifactDir, "cp4-finish-1366x768.png") });

  const finishLabels = await page.locator('[data-choice-type="finish"] strong').allTextContents();
  assert.ok(finishLabels.includes("Hanging") && finishLabels.includes("Poly protection"));
  assert.ok(!finishLabels.includes("Linen-cart return"), "irrelevant return options are removed for robes");
  await page.locator('[data-choice-id="hanging"]').click();
  await page.locator('[data-choice-id="poly"]').click();
  await page.locator('[data-choice-id="delicate"]').click();
  await page.locator("[data-finish-continue]").click();
  await page.waitForTimeout(80);

  assert.equal(await page.locator('[data-ownership-id][aria-checked="true"]').count(), 0, "ownership begins without a favored model");
  await page.screenshot({ path: path.join(artifactDir, "cp4-ownership-1366x768.png") });
  await page.locator('[data-ownership-id="some"]').click();
  await page.locator("[data-ownership-continue]").click();
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(artifactDir, "cp4-location-1366x768.png") });
  await page.locator("[data-location-input]").fill("92101");
  await page.locator("[data-location-form]").evaluate((form) => form.requestSubmit());
  await page.waitForTimeout(80);

  assert.equal(await page.locator("[data-review-handoff]").isVisible(), true);
  const state = await page.evaluate(() => window.SheltonPricingJourney.getState());
  assert.deepEqual(state.goods, ["robes"]);
  assert.deepEqual(state.finish, ["hanging", "poly"]);
  assert.deepEqual(state.specialtyNeeds, ["delicate"]);
  assert.equal(state.ownership, "some");
  assert.deepEqual(state.location, { type: "zip", value: "92101" });
  assert.ok(state.completedChapters.includes("location"));

  await page.screenshot({ path: path.join(artifactDir, "cp4-review-1366x768.png") });

  await page.locator('[data-edit-chapter="finish"]').first().click();
  await page.waitForTimeout(80);
  const editedState = await page.evaluate(() => window.SheltonPricingJourney.getState());
  assert.equal(editedState.activeChapter, "finish");
  assert.ok(!editedState.completedChapters.includes("finish"));
  assert.ok(!editedState.completedChapters.includes("location"));
  assert.equal(await page.locator('[data-chapter-editor="finish"]').isVisible(), true);
  assert.equal(await page.locator('[data-choice-id="hanging"]').getAttribute("aria-checked"), "true", "compatible finish answers remain visible while editing");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-chapter="finish"]').scrollIntoViewIfNeeded();
  const viewportMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(viewportMetrics.scrollWidth <= viewportMetrics.clientWidth + 1, "mobile layout has no horizontal overflow");
  await page.screenshot({ path: path.join(artifactDir, "cp4-finish-390x844.png") });

  assert.deepEqual(errors, [], `browser errors: ${errors.join(" | ")}`);
  await browser.close();
  console.log("Checkpoint 4 pricing journey browser smoke test passed.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
