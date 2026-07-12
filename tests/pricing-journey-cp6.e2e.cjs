const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_PREVIEW_URL || "http://127.0.0.1:8045/pricing-journey-preview.html";
const artifactDir = process.env.PRICING_ARTIFACT_DIR || path.resolve(__dirname, "../docs/pricing-journey-artifacts/checkpoint-6");
fs.mkdirSync(artifactDir, { recursive: true });

const focusAndPress = async (page, selector, key = "Enter") => {
  const control = page.locator(selector);
  await control.focus();
  await control.press(key);
};

const expectFocused = async (page, id) => {
  await page.waitForTimeout(100);
  const focusState = await page.evaluate(() => ({
    id: document.activeElement?.id || "",
    tag: document.activeElement?.tagName || "",
    text: document.activeElement?.textContent?.trim().slice(0, 60) || "",
    view: document.querySelector("[data-pricing-journey]")?.dataset.view || "",
    chapter: window.SheltonPricingJourney?.getState().activeChapter || ""
  }));
  assert.equal(focusState.id, id, `focus state: ${JSON.stringify(focusState)}`);
};

const typeInto = async (page, selector, value) => {
  await page.locator(selector).focus();
  await page.keyboard.type(value);
};

const alignSectionBelowChrome = async (page, selector) => {
  await page.evaluate((targetSelector) => {
    const target = document.querySelector(targetSelector);
    const header = document.querySelector(".journey-private-bar")?.getBoundingClientRect().height || 0;
    const thread = document.querySelector(".program-thread")?.getBoundingClientRect().height || 0;
    window.scrollTo(0, Math.max(0, target.getBoundingClientRect().top + window.scrollY - header - thread - 16));
  }, selector);
  await page.waitForTimeout(60);
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  const nonGetRequests = [];

  await page.addInitScript(() => {
    window.__pricingCLS = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) window.__pricingCLS += entry.value;
      });
    }).observe({ type: "layout-shift", buffered: true });
  });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("request", (request) => {
    if (request.method() !== "GET") nonGetRequests.push(`${request.method()} ${request.url()}`);
  });

  await page.goto(`${baseUrl}?motion=reduce`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("[data-pricing-journey]").getAttribute("data-motion"), "reduce");
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");

  await focusAndPress(page, '[data-concept-panel="orb"] [data-begin-journey]');
  await expectFocused(page, "operation-title");
  await focusAndPress(page, '[data-operation-id="hotel"]', "Space");
  await focusAndPress(page, "[data-operation-continue]");
  await expectFocused(page, "goods-title");
  await focusAndPress(page, '[data-good-id="robes"]', "Space");
  await focusAndPress(page, "[data-goods-continue]");
  await expectFocused(page, "scale-title");

  await typeInto(page, '[data-scale-input="rooms"]', "80");
  const occupancySelect = page.locator('[data-scale-input="occupancy"]');
  await occupancySelect.focus();
  await occupancySelect.press("7");
  await typeInto(page, '[data-scale-input="weeklyTurns"]', "220");
  const storageSelect = page.locator('[data-scale-input="storage"]');
  await storageSelect.focus();
  await storageSelect.press("l");
  assert.equal(await page.locator('[data-scale-input="occupancy"]').inputValue(), "75to89");
  assert.equal(await page.locator('[data-scale-input="storage"]').inputValue(), "limited");
  await focusAndPress(page, '[data-scale-form] button[type="submit"]');
  await expectFocused(page, "finish-title");

  await focusAndPress(page, '[data-choice-id="hanging"]', "Space");
  await focusAndPress(page, '[data-choice-id="poly"]', "Space");
  await focusAndPress(page, '[data-choice-id="delicate"]', "Space");
  await focusAndPress(page, "[data-finish-continue]");
  await expectFocused(page, "ownership-title");
  const ownershipStart = page.locator('[data-ownership-id="own"]');
  await ownershipStart.focus();
  await ownershipStart.press("ArrowRight");
  assert.equal(await page.locator('[data-ownership-id="some"]').getAttribute("aria-checked"), "true");
  await focusAndPress(page, "[data-ownership-continue]");
  await expectFocused(page, "location-title");

  const locationControl = page.locator("[data-location-input]");
  await typeInto(page, "[data-location-input]", "12");
  await locationControl.press("Enter");
  assert.equal(await page.locator("[data-location-error]").isVisible(), true);
  assert.equal(await page.evaluate(() => document.activeElement?.matches("[data-location-input]")), true);
  await locationControl.press("Meta+A");
  await page.keyboard.type("92101");
  assert.equal(await locationControl.inputValue(), "92101");
  await locationControl.press("Enter");
  await expectFocused(page, "review-title");
  await focusAndPress(page, "[data-build-result]");
  await expectFocused(page, "result-title");
  await focusAndPress(page, "[data-exact-quote]");
  await expectFocused(page, "quote-title");

  await focusAndPress(page, "[data-quote-submit]");
  assert.equal(await page.locator("[data-quote-error]").isVisible(), true);
  await typeInto(page, 'input[name="name"]', "Jordan Hudson");
  await typeInto(page, 'input[name="business"]', "Shelton QA Account");
  await typeInto(page, 'input[name="email"]', "jordan@example.com");
  await typeInto(page, 'input[name="phone"]', "619-555-0100");
  await page.locator('input[name="preferredContact"][value="email"]').focus();
  await page.keyboard.press("Space");
  assert.equal(await page.locator('input[name="preferredContact"][value="email"]').isChecked(), true);
  await focusAndPress(page, "[data-quote-submit]");
  await page.waitForTimeout(180);
  assert.equal(await page.locator("[data-quote-status]").getAttribute("data-status"), "ready");
  assert.deepEqual(nonGetRequests, [], "keyboard journey makes no submission request");

  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("[data-quote-handoff]").isVisible(), true, "session state restores after reload");
  assert.equal(await page.locator('input[name="email"]').inputValue(), "jordan@example.com");
  assert.equal(await page.locator("[data-quote-status]").getAttribute("data-status"), "ready");
  await focusAndPress(page, "[data-return-result]");
  await expectFocused(page, "result-title");

  const semanticAudit = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((item) => item.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    const unlabeledInputs = [...document.querySelectorAll("input, select")].filter((control) => {
      if (control.closest("label")) return false;
      if (control.getAttribute("aria-label") || control.getAttribute("aria-labelledby")) return false;
      return true;
    }).map((control) => control.name || control.id);
    const invalidStates = [...document.querySelectorAll('[role="radio"], [role="checkbox"]')]
      .filter((control) => !["true", "false"].includes(control.getAttribute("aria-checked"))).length;
    const unnamedButtons = [...document.querySelectorAll("button")]
      .filter((button) => !(button.getAttribute("aria-label") || button.textContent.trim())).length;
    return { duplicateIds, unlabeledInputs, invalidStates, unnamedButtons };
  });
  assert.deepEqual(semanticAudit, { duplicateIds: [], unlabeledInputs: [], invalidStates: 0, unnamedButtons: 0 });

  const viewports = [
    [1440, 900, "1440x900"],
    [1366, 768, "1366x768"],
    [1280, 800, "1280x800"],
    [768, 1024, "tablet-768x1024"],
    [390, 844, "mobile-390x844"],
    [430, 932, "mobile-430x932"]
  ];

  for (const [width, height, label] of viewports) {
    await page.setViewportSize({ width, height });
    await alignSectionBelowChrome(page, "[data-result]");
    const metrics = await page.evaluate(() => {
      const candidates = [...document.querySelectorAll("[data-result] h2, [data-result] h3, [data-result] h4, [data-result] p, [data-result] strong, [data-result] button")]
        .filter((item) => item.offsetParent !== null);
      const clipped = candidates.filter((item) => {
        const rect = item.getBoundingClientRect();
        return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1 || item.scrollWidth > item.clientWidth + 2;
      }).map((item) => item.textContent.trim().slice(0, 60));
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        clipped
      };
    });
    assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `${label} has no horizontal overflow`);
    assert.deepEqual(metrics.clipped, [], `${label} has no clipped result text or controls`);
    await page.screenshot({ path: path.join(artifactDir, `cp6-result-${label}.png`) });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await focusAndPress(page, '[data-result] [data-edit-chapter="review"]');
  await expectFocused(page, "review-title");
  const touchTargets = await page.evaluate(() => [...document.querySelectorAll(
    '.journey-private-bar a, .journey-private-bar summary, [data-chapter-editor="review"] button, [data-chapter-summary]:not([hidden]) button, [data-start-over]'
  )].filter((item) => item.offsetParent !== null).map((item) => {
    const rect = item.getBoundingClientRect();
    return { name: item.getAttribute("aria-label") || item.textContent.trim(), width: rect.width, height: rect.height };
  }));
  assert.ok(touchTargets.length >= 9, "mobile touch audit includes header, review edits, summaries, and Start Over");
  touchTargets.forEach((target) => {
    assert.ok(target.width >= 44 && target.height >= 44, `${target.name} meets the 44px touch target`);
  });
  await page.screenshot({ path: path.join(artifactDir, "cp6-review-touch-targets-390x844.png") });
  await focusAndPress(page, "[data-build-result]");
  await expectFocused(page, "result-title");

  await page.setViewportSize({ width: 640, height: 400 });
  await alignSectionBelowChrome(page, "[data-result]");
  const zoomMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(zoomMetrics.scrollWidth <= zoomMetrics.clientWidth + 1, "200% reflow equivalent has no horizontal overflow");
  await page.screenshot({ path: path.join(artifactDir, "cp6-zoom-200-percent-equivalent.png") });

  const performance = await page.evaluate(() => {
    const localResources = performance.getEntriesByType("resource").filter((entry) => entry.name.startsWith(location.origin));
    return {
      cls: window.__pricingCLS,
      localTransferBytes: localResources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      localResourceCount: localResources.length
    };
  });
  assert.ok(performance.cls <= 0.1, `layout shift stays within target: ${performance.cls}`);
  assert.ok(performance.localTransferBytes < 750000, `local preview transfer remains restrained: ${performance.localTransferBytes}`);
  assert.ok(performance.localResourceCount <= 8, `preview keeps a small local resource graph: ${performance.localResourceCount}`);

  await focusAndPress(page, "[data-start-over]");
  await page.waitForTimeout(100);
  assert.equal(await page.locator('[data-concept-panel="orb"]').isVisible(), true);
  const resetState = JSON.parse(await page.evaluate(() => sessionStorage.getItem("shelton-pricing-journey-v4")));
  assert.equal(resetState.view, "landing");
  assert.equal(resetState.operation, null);
  assert.deepEqual(resetState.completedChapters, []);

  assert.deepEqual(nonGetRequests, [], "the complete QA journey makes no submission request");
  assert.deepEqual(errors, [], `browser errors: ${errors.join(" | ")}`);
  fs.writeFileSync(path.join(artifactDir, "cp6-metrics.json"), JSON.stringify({ semanticAudit, touchTargets, performance }, null, 2));
  await browser.close();
  console.log("Checkpoint 6 responsive, accessibility, restoration, and performance test passed.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
