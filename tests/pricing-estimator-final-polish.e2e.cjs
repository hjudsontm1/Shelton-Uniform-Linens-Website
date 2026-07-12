const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_PREVIEW_URL || "http://127.0.0.1:8045/pricing-journey-preview.html";
const artifactDir = process.env.PRICING_FINAL_ARTIFACT_DIR || path.resolve(__dirname, "../docs/pricing-estimator-final-polish-artifacts/final");
const videoSourceDir = path.join(artifactDir, "video-source");
fs.mkdirSync(videoSourceDir, { recursive: true });

const wait = (page, duration = 420) => page.waitForTimeout(duration);

const alignBelowHeader = async (page, selector) => {
  await page.locator(selector).evaluate((element) => {
    const header = document.querySelector(".journey-private-bar")?.getBoundingClientRect().height || 0;
    const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - header - 20);
    const currentMax = document.documentElement.scrollHeight - window.innerHeight;
    if (top > currentMax) {
      let spacer = document.querySelector("[data-final-capture-spacer]");
      if (!spacer) {
        spacer = document.createElement("div");
        spacer.dataset.finalCaptureSpacer = "true";
        spacer.setAttribute("aria-hidden", "true");
        document.body.append(spacer);
      }
      spacer.style.height = `${top - currentMax + 32}px`;
      void spacer.offsetHeight;
    }
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
  await wait(page, 90);
};

const capture = async (page, fileName, selector) => {
  if (selector) await alignBelowHeader(page, selector);
  await page.screenshot({ path: path.join(artifactDir, fileName), fullPage: false });
};

const click = async (page, selector, duration = 420) => {
  const control = page.locator(selector);
  await control.scrollIntoViewIfNeeded();
  await control.click();
  await wait(page, duration);
};

const assertNoOverflow = async (page, label) => {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    viewportWidth: window.innerWidth,
    visibleOverflow: [...document.querySelectorAll("body *")].filter((element) => {
      if (element.offsetParent === null) return false;
      const rect = element.getBoundingClientRect();
      return rect.left < -2 || rect.right > window.innerWidth + 2;
    }).slice(0, 8).map((element) => ({
      tag: element.tagName,
      className: String(element.className).slice(0, 90),
      left: element.getBoundingClientRect().left,
      right: element.getBoundingClientRect().right
    }))
  }));
  assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `${label}: ${JSON.stringify(metrics)}`);
  return metrics;
};

const assertChapterActionVisible = async (page, chapterSelector, actionSelector, label) => {
  await alignBelowHeader(page, chapterSelector);
  const metrics = await page.evaluate(({ chapterSelector, actionSelector }) => {
    const chapter = document.querySelector(chapterSelector);
    const heading = chapter?.querySelector("h2");
    const action = chapter?.querySelector(actionSelector);
    const header = document.querySelector(".journey-private-bar");
    return {
      headingTop: heading?.getBoundingClientRect().top,
      actionBottom: action?.getBoundingClientRect().bottom,
      headerBottom: header?.getBoundingClientRect().bottom,
      viewportHeight: window.innerHeight
    };
  }, { chapterSelector, actionSelector });
  assert.ok(metrics.headingTop >= metrics.headerBottom - 1, `${label} heading collision: ${JSON.stringify(metrics)}`);
  assert.ok(metrics.actionBottom <= metrics.viewportHeight + 2, `${label} action below viewport: ${JSON.stringify(metrics)}`);
};

const beginAndChooseOperation = async (page, operationId) => {
  await click(page, "[data-begin-journey]", 620);
  await click(page, `[data-operation-id="${operationId}"]`, 220);
  await click(page, "[data-operation-continue]", 500);
};

const selectGoods = async (page, goodsIds) => {
  for (const id of goodsIds) await click(page, `[data-good-id="${id}"]`, 170);
};

const captureBranch = async (browser, operationId, goodsIds, fileName) => {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await beginAndChooseOperation(page, operationId);
  await selectGoods(page, goodsIds);
  await capture(page, fileName, '[data-chapter-editor="goods"]');
  await assertNoOverflow(page, `${operationId} branch`);
  await context.close();
};

const captureNarrowedBranch = async (browser, operationId, goodsIds, fileName) => {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  await beginAndChooseOperation(page, operationId);
  await selectGoods(page, goodsIds);
  await click(page, "[data-goods-continue]", 300);
  await capture(page, fileName, '[data-chapter-editor="scale"]');
  assert.equal(await page.locator("[data-scale-scene] [data-vector-good]").count(), goodsIds.length);
  await assertNoOverflow(page, `${operationId} narrowed branch`);
  await context.close();
};

const recordTransition = async (browser) => {
  const dir = path.join(videoSourceDir, "transition");
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: { dir, size: { width: 1366, height: 768 } }
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await wait(page, 350);
  const video = page.video();
  await click(page, "[data-begin-journey]", 950);
  await page.close();
  await video.saveAs(path.join(artifactDir, "03-pricing-to-estimate-transition.webm"));
  await context.close();
};

const recordMobileJourney = async (browser) => {
  const dir = path.join(videoSourceDir, "mobile");
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: { dir, size: { width: 390, height: 844 } }
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await capture(page, "17-mobile-landing-390x844.png");
  await click(page, "[data-begin-journey]", 650);
  await capture(page, "18-mobile-estimator-390x844.png", '[data-chapter-editor="operation"]');
  assert.equal(await page.evaluate(() => document.activeElement?.id), "operation-title");
  await click(page, '[data-operation-id="hotel"]', 180);
  await click(page, "[data-operation-continue]", 450);
  await click(page, '[data-good-id="robes"]', 150);
  await click(page, "[data-goods-continue]", 450);
  await page.locator('[data-scale-input="rooms"]').fill("80");
  await page.locator('[data-scale-input="occupancy"]').selectOption("75to89");
  await page.locator('[data-scale-input="weeklyTurns"]').fill("220");
  await page.locator('[data-scale-input="storage"]').selectOption("limited");
  await click(page, '[data-scale-form] button[type="submit"]', 450);
  await click(page, '[data-choice-id="hanging"]', 130);
  await click(page, '[data-choice-id="poly"]', 130);
  await click(page, "[data-finish-continue]", 450);
  await click(page, '[data-ownership-id="own"]', 130);
  await click(page, "[data-ownership-continue]", 450);
  await page.locator("[data-location-input]").fill("92101");
  await click(page, '[data-location-form] button[type="submit"]', 500);
  await click(page, "[data-build-result]", 650);
  await capture(page, "19-mobile-result-390x844.png", "[data-result]");
  const mobileResultMetrics = await page.evaluate(() => {
    const heading = document.querySelector("#result-title")?.getBoundingClientRect();
    const header = document.querySelector(".journey-private-bar")?.getBoundingClientRect();
    return { headingTop: heading?.top, headerBottom: header?.bottom };
  });
  assert.ok(mobileResultMetrics.headingTop >= mobileResultMetrics.headerBottom - 1, JSON.stringify(mobileResultMetrics));
  await assertNoOverflow(page, "mobile result");
  const video = page.video();
  await page.close();
  await video.saveAs(path.join(artifactDir, "21-full-mobile-interaction.webm"));
  await context.close();
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];
  const nonGetRequests = [];

  await recordTransition(browser);

  const desktopSource = path.join(videoSourceDir, "desktop");
  const desktopContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: { dir: desktopSource, size: { width: 1366, height: 768 } }
  });
  const page = await desktopContext.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("request", (request) => {
    if (request.method() !== "GET") nonGetRequests.push(`${request.method()} ${request.url()}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/i);
  await capture(page, "01-pricing-landing-1366x768.png");
  const begin = page.locator("[data-begin-journey]");
  await begin.hover();
  await begin.focus();
  await capture(page, "02-orb-hover-focus-1366x768.png");

  await click(page, "[data-begin-journey]", 650);
  await capture(page, "04-operation-1366x768.png", '[data-chapter-editor="operation"]');
  assert.equal(await page.evaluate(() => document.activeElement?.id), "operation-title");
  await click(page, '[data-operation-id="events"]', 180);
  await click(page, "[data-operation-continue]", 480);
  await selectGoods(page, ["tablecloths"]);
  await capture(page, "07-event-goods-1366x768.png", '[data-chapter-editor="goods"]');
  await click(page, "[data-goods-continue]", 480);
  await page.locator('[data-scale-input="eventsPerMonth"]').fill("24");
  await page.locator('[data-scale-input="piecesPerEvent"]').fill("900");
  await page.locator('[data-scale-input="returnWindow"]').selectOption("urgent");
  await page.locator('[data-scale-input="seasonality"]').selectOption("seasonal");
  await assertChapterActionVisible(page, '[data-chapter-editor="scale"]', 'button[type="submit"]', "Scale");
  await capture(page, "09-scale-1366x768.png", '[data-chapter-editor="scale"]');
  await click(page, '[data-scale-form] button[type="submit"]', 480);
  for (const id of ["pressed", "linenCart", "colorRetention", "moldTreatment", "deadline"]) {
    await click(page, `[data-choice-id="${id}"]`, 120);
  }
  await capture(page, "10-finish-return-1366x768.png", '[data-chapter-editor="finish"]');
  await click(page, "[data-finish-continue]", 480);
  await assertChapterActionVisible(page, '[data-chapter-editor="ownership"]', "[data-ownership-continue]", "Ownership");
  await capture(page, "11-ownership-1366x768.png", '[data-chapter-editor="ownership"]');
  await click(page, '[data-ownership-id="own"]', 160);
  await click(page, "[data-ownership-continue]", 480);
  await page.locator("[data-location-input]").fill("92101");
  await assertChapterActionVisible(page, '[data-chapter-editor="location"]', 'button[type="submit"]', "Location");
  await capture(page, "12-location-1366x768.png", '[data-chapter-editor="location"]');
  await click(page, '[data-location-form] button[type="submit"]', 520);
  await capture(page, "13-completed-summary-1366x768.png", '[data-chapter-summary="location"]');
  await assertChapterActionVisible(page, '[data-chapter-editor="review"]', "[data-build-result]", "Review");
  await capture(page, "14-review-1366x768.png", '[data-chapter-editor="review"]');
  await click(page, "[data-build-result]", 650);
  await capture(page, "15-result-dossier-1366x768.png", "[data-result]");

  const viewportMatrix = [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 834, height: 1194 },
    { width: 390, height: 844 },
    { width: 430, height: 932 }
  ];
  const viewportResults = [];
  for (const viewport of viewportMatrix) {
    await page.setViewportSize(viewport);
    await alignBelowHeader(page, "[data-result]");
    const overflow = await assertNoOverflow(page, `result ${viewport.width}x${viewport.height}`);
    const position = await page.evaluate(() => ({
      headingTop: document.querySelector("#result-title")?.getBoundingClientRect().top,
      headerBottom: document.querySelector(".journey-private-bar")?.getBoundingClientRect().bottom
    }));
    assert.ok(position.headingTop >= position.headerBottom - 1, `${viewport.width}x${viewport.height}: ${JSON.stringify(position)}`);
    viewportResults.push({ ...viewport, overflow, position });
  }
  await page.setViewportSize({ width: 1366, height: 768 });
  await click(page, "[data-exact-quote]", 520);
  await capture(page, "16-quote-handoff-1366x768.png", "[data-quote-handoff]");
  await click(page, "[data-quote-submit]", 180);
  assert.equal(await page.locator("[data-quote-error]").isVisible(), true);
  await capture(page, "22-quote-validation-1366x768.png", "[data-quote-handoff]");
  await page.locator('input[name="name"]').fill("Jordan Hudson");
  await page.locator('input[name="business"]').fill("Private Preview Account");
  await page.locator('input[name="email"]').fill("jordan@example.com");
  await page.locator('input[name="preferredContact"][value="email"]').check();
  await click(page, "[data-quote-submit]", 80);
  assert.equal(await page.locator("[data-quote-status]").getAttribute("data-status"), "loading");
  await capture(page, "23-quote-loading-1366x768.png", "[data-quote-handoff]");
  await page.waitForFunction(() => document.querySelector("[data-quote-status]")?.dataset.status === "ready");
  await capture(page, "24-local-completion-1366x768.png", "[data-quote-handoff]");

  assert.deepEqual(errors, []);
  assert.deepEqual(nonGetRequests, []);
  const desktopVideo = page.video();
  await page.close();
  await desktopVideo.saveAs(path.join(artifactDir, "20-full-desktop-interaction.webm"));
  await desktopContext.close();

  await captureBranch(browser, "hotel", ["sheets", "towels"], "05-hotel-goods-1366x768.png");
  await captureBranch(browser, "casino", ["casinoUniforms", "banquetLinens"], "06-casino-goods-1366x768.png");
  await captureNarrowedBranch(browser, "hotel", ["robes"], "08-robes-only-1366x768.png");
  await recordMobileJourney(browser);

  await browser.close();
  fs.rmSync(videoSourceDir, { recursive: true, force: true });
  fs.writeFileSync(path.join(artifactDir, "final-polish-metrics.json"), JSON.stringify({
    baseUrl,
    generatedAt: new Date().toISOString(),
    errors,
    nonGetRequests,
    viewportResults
  }, null, 2));
  console.log("Final Pricing and Estimate polish evidence suite passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
