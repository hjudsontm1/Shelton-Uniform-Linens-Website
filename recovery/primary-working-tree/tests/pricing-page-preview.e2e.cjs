const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_PAGE_URL || "http://127.0.0.1:8051/pricing-page-preview.html";
const artifactDir = process.env.PRICING_PAGE_ARTIFACT_DIR || path.resolve(__dirname, "../docs/pricing-page-rebuild-artifacts");
const videoDir = path.join(artifactDir, "video-source");

fs.mkdirSync(artifactDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const pause = (page, duration = 160) => page.waitForTimeout(duration);

const capture = async (page, name, selector) => {
  if (selector) {
    if (selector !== ".pricing-hero") {
      if (!page.__sectionCaptureStyleAdded) {
        await page.addStyleTag({
          content: "html.section-capture .site-nav, html.section-capture .skip-link, html.section-capture .pricing-atmosphere__progress { display: none !important; }"
        });
        page.__sectionCaptureStyleAdded = true;
      }
      await page.evaluate(() => document.documentElement.classList.add("section-capture"));
      await page.locator(selector).screenshot({ path: path.join(artifactDir, name) });
      await page.evaluate(() => document.documentElement.classList.remove("section-capture"));
      return;
    }
    await page.locator(selector).evaluate((element) => {
      const top = element.getBoundingClientRect().top + window.scrollY - 104;
      window.scrollTo(0, Math.max(0, top));
    });
    await pause(page, 120);
  }
  await page.screenshot({ path: path.join(artifactDir, name), fullPage: false });
};

const assertNoOverflow = async (page, label) => {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll("body *")].filter((item) => {
      const rect = item.getBoundingClientRect();
      return item.offsetParent !== null && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
    }).slice(0, 10).map((item) => {
      const rect = item.getBoundingClientRect();
      return {
        tag: item.tagName,
        className: item.className,
        text: item.textContent.trim().slice(0, 50),
        left: Math.round(rect.left),
        right: Math.round(rect.right)
      };
    }),
    buttons: [...document.querySelectorAll(".pricing-rebuild button, .pricing-rebuild a")].filter((item) => item.offsetParent !== null).map((item) => {
      const rect = item.getBoundingClientRect();
      return { text: item.textContent.trim().slice(0, 40), width: rect.width, height: rect.height };
    })
  }));
  assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `${label} has no horizontal overflow: ${JSON.stringify(metrics)}`);
  metrics.buttons.forEach((button) => {
    assert.ok(button.height >= 32, `${label} control ${button.text || "unnamed"} is not collapsed`);
  });
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: { dir: videoDir, size: { width: 1366, height: 768 } }
  });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => errors.push(`Request failed: ${request.url()}`));
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(new URL(baseUrl).origin)) {
      errors.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  assert.match(await page.locator("h1").first().innerText(), /quote should match/i);
  assert.equal(await page.locator("[data-hero-estimator]").count(), 0);
  assert.equal(await page.locator(".pricing-vector").count(), 9);
  assert.equal(await page.locator(".market-position, .pricing-commitment, .pricing-client-room").count(), 0);
  assert.equal(await page.locator(".pricing-rebuild > section").count(), 6);
  assert.equal(await page.locator(".pricing-kicker").count(), 2);
  const tabs = page.locator("[role='tab']");
  for (let index = 0; index < await tabs.count(); index += 1) {
    const panelId = await tabs.nth(index).getAttribute("aria-controls");
    assert.equal(await page.locator(`#${panelId}`).count(), 1);
  }
  await capture(page, "pricing-hero-initial-1366x768.png", ".pricing-hero");

  assert.match(await page.locator("#pricing-journey-title").innerText(), /narrow the variables/i);
  await capture(page, "pricing-journey-1366x768.png", ".pricing-journey");

  const firstFactor = page.locator("#factor-tab-0");
  await firstFactor.focus();
  await firstFactor.press("End");
  assert.equal(await page.locator("#factor-tab-5").getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("[data-factor-detail]").getAttribute("aria-labelledby"), "factor-tab-5");
  await page.locator("[data-factor-list] [data-index='3']").click();
  assert.equal(await page.locator(".factor-visual").getAttribute("data-factor"), "finishing");
  await capture(page, "pricing-how-pricing-works-1366x768.png", ".pricing-factors");
  await page.locator("[data-quality-list] [data-index='0']").click();
  await capture(page, "pricing-quality-economics-1366x768.png", ".quality-economics");
  await page.locator("[data-model-list] [data-index='1']").click();
  await capture(page, "pricing-models-1366x768.png", ".account-models");
  await capture(page, "pricing-estimator-transition-1366x768.png", ".estimate-transition");

  await page.locator("[data-estimate-link]").click();
  await page.waitForURL(/estimate-preview\.html/);
  assert.equal(await page.locator("[data-hero-carryover]").isVisible(), false);
  assert.notEqual(await page.locator('[data-flow-step="operation"]').getAttribute("data-state"), "complete");
  await capture(page, "pricing-estimator-handoff-1366x768.png", "[data-pricing-flow]");

  const viewports = [
    [1440, 900, "desktop-1440x900"],
    [1366, 768, "desktop-1366x768"],
    [1280, 800, "desktop-1280x800"],
    [768, 1024, "tablet-768x1024"],
    [390, 844, "mobile-390x844"],
    [430, 932, "mobile-430x932"]
  ];

  for (const [width, height, label] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await assertNoOverflow(page, label);
    await page.screenshot({ path: path.join(artifactDir, `pricing-${label}.png`), fullPage: false });
    if (label === "desktop-1440x900") {
      await page.screenshot({ path: path.join(artifactDir, "pricing-full-desktop-1440x900.png"), fullPage: true });
    }
    if (label === "mobile-390x844") {
      await page.locator(".menu-toggle").click();
      assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
      await pause(page, 280);
      assert.equal(await page.locator("#primary-menu").isVisible(), true);
      await page.locator(".menu-toggle").click();
      await pause(page, 280);
      assert.equal(await page.locator("#primary-menu").isVisible(), false);
      await page.screenshot({ path: path.join(artifactDir, "pricing-full-mobile-390x844.png"), fullPage: true });
    }
  }

  assert.deepEqual(errors, [], `browser errors: ${errors.join(" | ")}`);
  const video = page.video();
  await page.close();
  await video.saveAs(path.join(artifactDir, "pricing-hero-to-estimator.webm"));
  await context.close();
  await browser.close();
  fs.rmSync(videoDir, { recursive: true, force: true });
  fs.writeFileSync(path.join(artifactDir, "pricing-page-metrics.json"), JSON.stringify({
    noindex: true,
    browserErrors: errors,
    checkedViewports: viewports.map((item) => item[2]),
    strategy: "five distinct customer questions lead from pricing context to a fresh estimator, without the rejected comparison or commitment sections"
  }, null, 2));
  console.log("Pricing page preview browser acceptance passed.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
