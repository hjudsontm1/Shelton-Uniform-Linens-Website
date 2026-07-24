const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const { installCommercialEstimatorV2Fixture, isEstimatorCalculationRequest } = require("./commercial-estimator-v2-browser-fixture.cjs");

const baseUrl = process.env.PRICING_PREVIEW_URL || "http://127.0.0.1:8045/pricing-journey-preview.html";
const artifactDir = process.env.PRICING_ARTIFACT_DIR || path.resolve(__dirname, "../docs/pricing-journey-artifacts/checkpoint-7");
const videoDir = path.join(artifactDir, "video-source");
fs.mkdirSync(videoDir, { recursive: true });

const pause = (page, duration = 350) => page.waitForTimeout(duration);

const capture = async (page, name, selector) => {
  let addedCaptureSpacer = false;
  if (selector) {
    addedCaptureSpacer = await page.locator(selector).evaluate((element) => {
      const header = document.querySelector(".journey-private-bar")?.getBoundingClientRect().height || 0;
      const targetY = Math.max(0, element.getBoundingClientRect().top + window.scrollY - header - 24);
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      if (targetY > maxScrollY) {
        const spacer = document.createElement("div");
        spacer.dataset.captureSpacer = "true";
        spacer.setAttribute("aria-hidden", "true");
        spacer.style.height = `${targetY - maxScrollY + 32}px`;
        document.body.append(spacer);
        void spacer.offsetHeight;
      }
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, targetY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      return targetY > maxScrollY;
    });
    await pause(page, 150);
  }
  await page.screenshot({ path: path.join(artifactDir, name), fullPage: false });
  if (addedCaptureSpacer) {
    await page.locator("[data-capture-spacer]").evaluate((element) => element.remove());
  }
};

const click = async (page, selector, duration = 350) => {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.locator(selector).click();
  await pause(page, duration);
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: { dir: videoDir, size: { width: 1366, height: 768 } }
  });
  const page = await context.newPage();
  const errors = [];
  const nonGetRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("request", (request) => {
    if (request.method() !== "GET" && !isEstimatorCalculationRequest(request)) nonGetRequests.push(`${request.method()} ${request.url()}`);
  });
  await installCommercialEstimatorV2Fixture(page);

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/i);
  assert.equal(await page.locator('[data-concept-panel="orb"]').isVisible(), true);
  await capture(page, "cp7-01-winning-landing-1366x768.png");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(artifactDir, "cp7-08-mobile-landing-390x844.png"), fullPage: false });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await page.setViewportSize({ width: 1366, height: 768 });

  await page.locator('[data-concept-panel="orb"] [data-begin-journey]').click();
  await pause(page, 180);
  await page.screenshot({ path: path.join(artifactDir, "cp7-01b-orb-activation-1366x768.png"), fullPage: false });
  await pause(page, 400);
  assert.equal(await page.locator('[data-chapter-editor="operation"]:not([hidden])').isVisible(), true);
  await capture(page, "cp7-02-operation-1366x768.png", '[data-chapter-editor="operation"]');

  await click(page, '[data-operation-id="events"]', 250);
  await capture(page, "cp7-02b-operation-selected-1366x768.png", '[data-chapter-editor="operation"]');
  await click(page, "[data-operation-continue]", 450);
  assert.equal(await page.locator('[data-chapter-editor="goods"]:not([hidden])').isVisible(), true);
  await click(page, '[data-good-id="tablecloths"]', 300);
  assert.match(await page.locator("[data-goods-education]").innerText(), /Tablecloths require cleaning/i);
  await capture(page, "cp7-03-adaptive-goods-1366x768.png", '[data-chapter-editor="goods"]');
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, "cp7-09-mobile-goods-390x844.png", '[data-chapter-editor="goods"]');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await page.setViewportSize({ width: 1366, height: 768 });
  await click(page, "[data-goods-continue]", 450);

  await page.locator('[data-scale-input="weeklyTablecloths"]').fill("600");
  await page.locator('[data-scale-input="returnWindow"]').selectOption("urgent");
  await page.locator('[data-scale-input="seasonality"]').selectOption("seasonal");
  await click(page, '[data-scale-form] button[type="submit"]', 450);

  await click(page, '[data-choice-id="pressed"]', 180);
  await click(page, '[data-choice-id="linenCart"]', 180);
  await click(page, '[data-choice-id="colorRetention"]', 180);
  await click(page, '[data-choice-id="moldTreatment"]', 180);
  await click(page, '[data-choice-id="deadline"]', 250);
  await capture(page, "cp7-04-finish-narrowing-1366x768.png", '[data-chapter-editor="finish"]');
  assert.equal(await page.locator('[data-choice-id="hanging"]').count(), 0, "irrelevant garment finish is not rendered");
  await click(page, "[data-finish-continue]", 450);

  await click(page, '[data-ownership-id="own"]', 250);
  await click(page, "[data-ownership-continue]", 450);
  await page.locator("[data-location-input]").fill("92101");
  await click(page, '[data-location-form] button[type="submit"]', 550);

  assert.equal(await page.locator('[data-chapter-editor="review"]:not([hidden])').isVisible(), true);
  assert.match(await page.locator("[data-review-selections]").innerText(), /Tablecloths/i);
  await capture(page, "cp7-05-assembled-review-1366x768.png", '[data-chapter-editor="review"]');
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, "cp7-10-mobile-review-390x844.png", '[data-chapter-editor="review"]');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await page.setViewportSize({ width: 1366, height: 768 });
  await click(page, "[data-build-result]", 650);

  assert.equal(await page.locator("[data-result]").isVisible(), true);
  assert.match(await page.locator("[data-result-warning]").innerText(), /COMMERCIAL PLANNING RANGE/i);
  assert.match(await page.locator("[data-result-rhythm]").innerText(), /pickup.*return/i);
  assert.equal(await page.locator('[data-result-scene] [data-vector-good="tablecloths"]').count(), 1);
  assert.equal(await page.locator('[data-result-scene] [data-vector-good]:not([data-vector-good="tablecloths"])').count(), 0);
  await capture(page, "cp7-06-recommended-program-1366x768.png", "[data-result]");
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, "cp7-11-mobile-dossier-390x844.png", "[data-result]");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await page.setViewportSize({ width: 1366, height: 768 });

  await click(page, "[data-exact-quote]", 500);
  await page.locator('input[name="name"]').fill("Jordan Hudson");
  await page.locator('input[name="business"]').fill("Private Preview Account");
  await page.locator('input[name="email"]').fill("jordan@example.com");
  await page.locator('input[name="phone"]').fill("619-555-0100");
  await page.locator('input[name="preferredContact"][value="email"]').check();
  await click(page, "[data-quote-submit]", 450);
  await page.waitForFunction(() => document.querySelector("[data-quote-status]")?.dataset.status === "ready");

  assert.equal(await page.locator("[data-quote-status]").getAttribute("data-status"), "ready");
  assert.match(await page.locator("[data-quote-status]").innerText(), /Nothing has been submitted/i);
  assert.deepEqual(nonGetRequests, []);
  assert.deepEqual(errors, []);
  await capture(page, "cp7-07-payload-ready-1366x768.png", "[data-quote-handoff]");

  const finalState = await page.evaluate(() => window.SheltonPricingJourney.getState());
  assert.equal(finalState.operation, "events");
  assert.deepEqual(finalState.goods, ["tablecloths"]);
  assert.equal(finalState.location.value, "92101");
  assert.equal(finalState.quoteStatus, "ready");

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    activeElement: document.activeElement?.tagName || "",
    resourceCount: performance.getEntriesByType("resource").filter((entry) => entry.name.startsWith(location.origin)).length,
    overflow: [...document.querySelectorAll("body *")].filter((element) => {
      const rect = element.getBoundingClientRect();
      return element.offsetParent !== null && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
    }).slice(0, 12).map((element) => ({
      tag: element.tagName,
      className: element.className,
      text: element.textContent.trim().slice(0, 50),
      rect: element.getBoundingClientRect().toJSON()
    }))
  }));
  assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, JSON.stringify(metrics));

  const video = page.video();
  await page.close();
  await video.saveAs(path.join(artifactDir, "cp7-complete-interaction.webm"));
  await context.close();
  await browser.close();

  fs.rmSync(videoDir, { recursive: true, force: true });
  fs.writeFileSync(path.join(artifactDir, "cp7-final-metrics.json"), JSON.stringify({
    concept: "orb",
    operation: "events",
    goods: ["tablecloths"],
    noindex: true,
    nonGetRequests,
    errors,
    metrics
  }, null, 2));
  console.log("Checkpoint 7 final interaction recording and acceptance smoke test passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
