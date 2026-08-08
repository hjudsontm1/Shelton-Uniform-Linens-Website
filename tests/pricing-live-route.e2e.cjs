const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const baseUrl = process.env.PRICING_LIVE_URL || "http://127.0.0.1:8045/pricing.html";

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
    modelVersion: "commercial-estimator.v2.3",
    lane,
    ready: true,
    requiresReview: false,
    reviewMessages: [],
    confidence: { score: 76, label: "Directional", evidence: "estimated" },
    sizing: { driver: "Approved V2.3 volume model", weeklyPounds: 6142.5 },
    pricing: {
      weeklyRange: { low: 5100, base: 5500, high: 5900 },
      monthlyRange: { low: 22100, base: 23850, high: 25550 },
      lines: [{ key: "major", label: "Customer-owned linen", billingUnit: "pound", weeklyUnits: 6142.5, low: 0.82, target: 0.88, high: 0.96 }]
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
    const rental = body.estimate?.rentalSelections?.length
      ? [{ category: body.estimate.rentalSelections[0].category, tier: body.estimate.rentalSelections[0].tier, quantity: body.estimate.rentalSelections[0].quantity, weeklyRatePerItem: 0.42, weeklyCharge: 210, requiresManagementReview: false }]
      : [];
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(publicEstimate(body.estimate?.lane || "hotel", rental)) });
  });
  await page.route("**/api/commercial-leads", async (route) => {
    const lead = JSON.parse(route.request().postData() || "{}");
    captures.lead = lead;
    captures.leadAttempts ||= [];
    captures.leadAttempts.push({ body: lead, idempotencyKey: route.request().headers()["idempotency-key"] });
    await route.fulfill({
      status: leadStatus,
      contentType: "application/json",
      body: JSON.stringify(leadStatus < 400 ? { reviewId: "review-1", status: "inbound_review" } : { error: "Durable review intake is unavailable." })
    });
  });
  await page.route("https://formspree.io/**", async (route) => {
    captures.formspree = route.request().postData() || "";
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
};

const chooseOperation = async (page, id) => {
  await page.locator("[data-operation-trigger]").click();
  await page.locator(`[data-operation-option="${id}"]`).click();
};

const chooseGood = async (page, id) => {
  await page.locator(`[data-goods-options] input[value="${id}"]`).check();
};

const fillScale = async (page, values) => {
  for (const [id, value] of Object.entries(values)) {
    const control = page.locator(`[data-scale-field="${id}"]`);
    for (let step = 0; step < 20 && !await control.isVisible().catch(() => false); step += 1) {
      const next = page.locator("[data-scale-next]");
      assert.equal(await next.isVisible().catch(() => false), true, `can navigate to sizing field ${id}`);
      await next.click();
    }
    assert.equal(await control.isVisible().catch(() => false), true, `sizing field ${id} is in the question sequence`);
    if (await control.evaluate((node) => node.tagName === "SELECT")) await control.selectOption(String(value));
    else await control.fill(String(value));
  }
};

const openEarlyHotel = async (page) => {
  await chooseOperation(page, "hotel");
  await chooseGood(page, "sheets");
  await chooseGood(page, "robes");
  await fillScale(page, { rooms: 100 });
  await page.locator("[data-range-revealed]").waitFor({ state: "visible" });
};

const displayedRangeWidth = async (page) => {
  const values = (await page.locator("[data-weekly-range]").innerText())
    .match(/[\d,]+/g)
    .map((value) => Number(value.replaceAll(",", "")));
  return values[1] - values[0];
};

const main = async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const captures = { estimates: [], lead: null, formspree: "" };
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const page = await desktop.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  await installApiMocks(page, captures);
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  assert.equal(await page.locator('meta[name="robots"]').count(), 0, "Pricing remains indexable");
  assert.equal(await page.locator("html").getAttribute("class"), "pricing-spine-concept pricing-spine-workbench");
  assert.equal(await page.locator("[data-operation-option]").count(), 13);
  assert.equal(await page.locator("[data-operation-guide], [data-operation-guide-empty]").count(), 0, "the former operation note is removed");
  assert.equal(await page.locator("[data-program-details], .chapter-detail-list").count(), 0, "the compact detail-row introductions are removed");
  assert.equal(await page.locator(".learning-chapter__lesson > .chapter-editorial-title").count(), 5, "all estimator chapters use the established editorial headline treatment");
  assert.equal(await page.locator(".learning-chapter__lesson > .chapter-editorial-title:visible").count(), 5, "all editorial headlines are visible");
  const initialHeadlines = await page.locator(".chapter-editorial-title").allTextContents();
  await assertNoOverflow(page, "desktop landing");

  await page.locator("[data-operation-trigger]").click();
  assert.equal(await page.locator("[data-operation-panel]").evaluate((node) => getComputedStyle(node).position), "relative");
  assert.equal(await page.locator("[data-operation-panel]").getAttribute("role"), "region");
  assert.equal(await page.locator("[data-operation-panel]").getAttribute("aria-modal"), null);
  await assertNoOverflow(page, "desktop operation picker open");
  await page.locator("#factor-program .chapter-index").click();
  assert.equal(await page.locator("[data-operation-panel]").isVisible(), false, "desktop picker closes from an outside click");

  await openEarlyHotel(page);
  assert.equal(await page.locator("[data-scale-field]").count(), 1, "Section 02 presents one sizing question at a time");
  assert.equal(await page.getByText(/Estimator 2\.3 sizing/i).count(), 0, "technical estimator copy is removed from Section 02");
  const earlyWidth = await displayedRangeWidth(page);
  const desktopDock = await page.locator("[data-estimate-dock]").evaluate((dock) => {
    const box = dock.getBoundingClientRect();
    return {
      position: getComputedStyle(dock).position,
      rightGap: innerWidth - box.right,
      bottomGap: innerHeight - box.bottom,
      width: box.width
    };
  });
  assert.equal(desktopDock.position, "fixed", "the desktop progress card stays fixed to the viewport");
  assert.ok(desktopDock.rightGap >= 15 && desktopDock.rightGap <= 34, `desktop dock right gap: ${desktopDock.rightGap}`);
  assert.ok(desktopDock.bottomGap >= 15 && desktopDock.bottomGap <= 34, `desktop dock bottom gap: ${desktopDock.bottomGap}`);
  assert.ok(desktopDock.width <= 431, `desktop dock remains a compact utility card: ${desktopDock.width}`);
  assert.match(await page.locator("[data-range-stage]").innerText(), /WEEKLY PLANNING RANGE/i);
  assert.equal(await page.locator("[data-pound-range]").innerText(), "$0.82–$0.96 / lb");
  assert.match(await page.locator("[data-range-guidance-copy]").innerText(), /make this range more specific/i);
  assert.equal(await page.locator("[data-monthly-range], [data-confidence-label], [data-model-label], [data-range-assumptions]").count(), 0);
  await fillScale(page, { occupancy: "75to89", bedSystem: "mixed", storage: "limited", weeklyRobes: 40 });
  await page.waitForFunction((previous) => {
    const text = document.querySelector("[data-weekly-range]")?.textContent || "";
    const values = text.match(/[\d,]+/g)?.map((value) => Number(value.replaceAll(",", ""))) || [];
    return values.length === 2 && values[1] - values[0] < previous;
  }, earlyWidth);
  const refinedWidth = await displayedRangeWidth(page);
  assert.ok(refinedWidth < earlyWidth, `additional answers narrow the weekly range: ${earlyWidth} -> ${refinedWidth}`);
  assert.deepEqual(await page.locator(".chapter-editorial-title").allTextContents(), initialHeadlines, "the editorial headings remain stable as the operation changes");
  assert.equal(await page.locator("#factor-program .learning-chapter__lesson > p:not(.chapter-index)").count(), 0, "the repeated generic paragraph is removed");
  assert.equal(await page.locator("[data-operation-guide-link]").getAttribute("href"), "industries.html#hotels");
  assert.match(await page.locator("[data-operation-guide-link]").innerText(), /Who We Serve/i);
  assert.equal(await page.locator("[data-specialty-fieldset], [data-specialty-options], input[name='specialty']").count(), 0, "routine cleaning is not presented as special handling");
  const [desktopLessonBox, desktopAnswerBox] = await Promise.all([
    page.locator("#factor-program .learning-chapter__lesson").boundingBox(),
    page.locator("#factor-program .learning-chapter__answer").boundingBox()
  ]);
  assert.ok(desktopLessonBox && desktopAnswerBox, "desktop Section 01 columns are measurable");
  assert.ok(Math.abs(desktopLessonBox.height - desktopAnswerBox.height) <= 4, `desktop Section 01 columns share a baseline: ${desktopLessonBox.height}px vs ${desktopAnswerBox.height}px`);
  assert.match(await page.locator("[data-weekly-range]").innerText(), /^\$[\d,]+–\$[\d,]+$/);
  assert.match(await page.locator("[data-range-stage]").innerText(), /PLANNING RANGE/i);
  const retained = JSON.parse(await page.evaluate(() => sessionStorage.getItem("shelton-pricing-spine-v7")));
  assert.equal(retained.scale.rooms, "100");
  assert.deepEqual(retained.specialtyNeeds, []);
  assert.equal(captures.estimates.at(-1).estimate.specializedHandling, false);
  assert.equal(captures.estimates.at(-1).estimate.specialtyItems[0].type, "robe");

  await page.locator('[data-ownership-options] input[value="supply"]').check();
  await page.locator("[data-inventory-category]").selectOption("sheets");
  await page.locator("[data-inventory-tier]").selectOption("premium");
  await page.locator("[data-inventory-units]").fill("500");
  await page.waitForResponse("**/api/commercial-estimate");
  const rentalInput = captures.estimates.at(-1).estimate.rentalSelections[0];
  assert.deepEqual(rentalInput, { category: "sheets", tier: "premium", quantity: 500, landedCostPerItem: null });

  await page.locator("[data-location-input]").fill("92101");
  await page.locator('input[name="name"]').fill("Jordan Hudson");
  await page.locator('input[name="business"]').fill("Shelton Test Hotel");
  await page.locator('input[name="email"]').fill("jordan@example.com");
  await page.locator('input[name="preferredContact"][value="email"]').check();
  await Promise.all([page.waitForURL("**/thank-you.html"), page.locator("[data-quote-submit]").click()]);
  assert.equal(captures.lead.estimateToken, "signed-hotel-estimate");
  assert.equal(captures.lead.contact.businessName, "Shelton Test Hotel");
  assert.equal(captures.lead.journeySnapshot.estimatorVersion, "commercial-estimator.v2.3");
  assert.equal(captures.leadAttempts[0].body.idempotencyKey, captures.leadAttempts[0].idempotencyKey);
  assert.match(captures.formspree, /name="pricing_journey"/);
  assert.deepEqual(errors, []);
  await desktop.close();

  for (const width of [768, 847, 900, 980, 981, 1080, 1199]) {
    const compact = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const compactPage = await compact.newPage();
    await compactPage.goto(baseUrl + "#factor-program", { waitUntil: "networkidle" });
    await assertNoOverflow(compactPage, `compact ${width} landing`);
    const compactLayout = await compactPage.evaluate(() => {
      const rect = (node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width };
      };
      const shell = rect(document.querySelector(".learning-chapters"));
      const programLesson = rect(document.querySelector("#factor-program .learning-chapter__lesson"));
      const programEditorial = rect(document.querySelector("#factor-program .chapter-editorial-title"));
      return {
        shell: { ...shell, rightGap: innerWidth - shell.right },
        background: getComputedStyle(document.body).backgroundImage,
        backgroundSize: getComputedStyle(document.body).backgroundSize,
        programLessonAlign: getComputedStyle(document.querySelector("#factor-program .learning-chapter__lesson")).textAlign,
        programAnswerHeadingAlign: getComputedStyle(document.querySelector("#factor-program .answer-heading")).textAlign,
        programEditorialAlign: getComputedStyle(document.querySelector("#factor-program .chapter-editorial-title")).textAlign,
        programEditorialWidth: programEditorial.width,
        programEditorialCentered: Math.abs((programEditorial.left - programLesson.left) - (programLesson.right - programEditorial.right)) <= 2,
        chapters: Array.from(document.querySelectorAll(".learning-chapter")).map((chapter) => {
          const lesson = rect(chapter.querySelector(".learning-chapter__lesson"));
          const answer = rect(chapter.querySelector(".learning-chapter__answer"));
          return {
            id: chapter.id,
            stacked: answer.top >= lesson.bottom - 1,
            aligned: Math.abs(answer.left - lesson.left) <= 2,
            lessonWidth: lesson.width,
            answerWidth: answer.width
          };
        })
      };
    });
    assert.ok(compactLayout.shell.width <= width - 28, `${width}: compact shell exposes the patterned rails`);
    assert.ok(Math.abs(compactLayout.shell.left - compactLayout.shell.rightGap) <= 2, `${width}: compact shell is centered`);
    assert.match(compactLayout.background, /pricing-halftone-transition-tall-v5/, `${width}: compact shell keeps the spine motif`);
    assert.equal(compactLayout.backgroundSize, "100%", `${width}: the halftone reaches the visible compact rails`);
    assert.equal(compactLayout.programLessonAlign, "center", `${width}: the stacked Section 01 lesson is centered`);
    assert.equal(compactLayout.programAnswerHeadingAlign, "center", `${width}: the stacked Section 01 answer heading is centered`);
    assert.equal(compactLayout.programEditorialAlign, "center", `${width}: the Section 01 editorial stays centered`);
    assert.ok(compactLayout.programEditorialWidth <= compactLayout.chapters[0].lessonWidth, `${width}: the editorial headline stays within its lesson column`);
    assert.ok(compactLayout.programEditorialCentered, `${width}: the editorial headline is centered within the Section 01 lesson`);
    compactLayout.chapters.forEach((chapter) => {
      assert.ok(chapter.stacked, `${width}: ${chapter.id} uses the compact stacked rhythm`);
      assert.ok(chapter.aligned, `${width}: ${chapter.id} keeps lesson and answer aligned`);
      assert.ok(chapter.lessonWidth <= 762 && chapter.answerWidth <= 762, `${width}: ${chapter.id} stays on the compact reading measure`);
    });
    await compactPage.locator("[data-operation-trigger]").click();
    await assertNoOverflow(compactPage, `compact ${width} picker open`);
    assert.equal(await compactPage.locator("[data-operation-panel]").getAttribute("role"), "region", `${width}: compact picker remains an inline disclosure`);
    assert.equal(await compactPage.locator("[data-operation-panel]").getAttribute("aria-modal"), null, `${width}: compact picker does not claim modal semantics`);
    const panel = await compactPage.locator("[data-operation-panel]").boundingBox();
    assert.ok(panel && panel.x >= -1 && panel.x + panel.width <= width + 1 && panel.y >= -1 && panel.y + panel.height <= 1001, `${width}: picker stays inside the compact viewport`);
    await compact.close();
  }

  const restored = await browser.newContext({ viewport: { width: 1200, height: 850 }, reducedMotion: "reduce" });
  const restoredPage = await restored.newPage();
  await restoredPage.goto(baseUrl, { waitUntil: "networkidle" });
  await restoredPage.evaluate(() => {
    sessionStorage.setItem("shelton-pricing-spine-v7", JSON.stringify({
      operation: "hotel",
      goods: ["sheets"],
      specialtyNeeds: ["whiteRetention"]
    }));
  });
  await restoredPage.reload({ waitUntil: "networkidle" });
  const restoredState = JSON.parse(await restoredPage.evaluate(() => sessionStorage.getItem("shelton-pricing-spine-v7")));
  assert.deepEqual(restoredState.specialtyNeeds, [], "legacy specialty selections are removed from restored sessions");
  assert.equal(await restoredPage.locator("[data-specialty-fieldset], [data-specialty-options], input[name='specialty']").count(), 0);
  await restored.close();

  for (const branch of [
    {
      operation: "senior_living",
      goods: "sheets",
      values: { licensedCapacity: 120, occupancy: "75to89", careType: "mixed", memoryCarePercent: 35 },
      expected: { lane: "senior_living", licensedCapacity: 120, occupancyPercent: 82, careType: "mixed", memoryCarePercent: 35 }
    },
    {
      operation: "residential_treatment",
      goods: "sheets",
      values: { licensedCapacity: 48, occupancy: "90plus", careType: "detox_withdrawal", admissionsPerWeek: 11, averageStayDays: 9 },
      expected: { lane: "residential_treatment", licensedCapacity: 48, occupancyPercent: 94, careType: "detox_withdrawal", admissionsPerWeek: 11, averageStayDays: 9 }
    }
  ]) {
    const branchCaptures = { estimates: [], lead: null, formspree: "" };
    const context = await browser.newContext({ viewport: { width: 1200, height: 850 }, reducedMotion: "reduce" });
    const branchPage = await context.newPage();
    await installApiMocks(branchPage, branchCaptures);
    await branchPage.goto(baseUrl, { waitUntil: "networkidle" });
    await chooseOperation(branchPage, branch.operation);
    await chooseGood(branchPage, branch.goods);
    await fillScale(branchPage, branch.values);
    await branchPage.locator("[data-range-revealed]").waitFor({ state: "visible" });
    const estimate = branchCaptures.estimates.at(-1).estimate;
    for (const [key, value] of Object.entries(branch.expected)) assert.equal(estimate[key], value, `${branch.operation} maps ${key}`);
    await assertNoOverflow(branchPage, `${branch.operation} estimator`);
    await context.close();
  }

  const manual = await browser.newContext({ viewport: { width: 1200, height: 850 }, reducedMotion: "reduce" });
  const manualPage = await manual.newPage();
  await manualPage.goto(baseUrl, { waitUntil: "networkidle" });
  await chooseOperation(manualPage, "other");
  await chooseGood(manualPage, "towels");
  await fillScale(manualPage, { weeklyVolume: 1000, volumeUnit: "pieces", activeDays: 5, variability: "steady", storage: "limited" });
  await manualPage.locator("[data-range-revealed]").waitFor({ state: "visible" });
  assert.equal(await manualPage.locator("[data-weekly-range]").innerText(), "Shelton review");
  assert.match(await manualPage.locator("[data-range-stage]").innerText(), /PERSONALIZED PRICING REVIEW/i);
  assert.equal(await manualPage.locator(".range-number > span").isVisible(), false, "manual review does not show / week");
  await manual.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await assertNoOverflow(mobilePage, "mobile landing");
  assert.equal(await mobilePage.locator("#factor-program .learning-chapter__lesson").evaluate((node) => getComputedStyle(node).textAlign), "center", "mobile Section 01 lesson is centered");
  assert.equal(await mobilePage.locator("#factor-program .answer-heading").evaluate((node) => getComputedStyle(node).textAlign), "center", "mobile Section 01 answer heading is centered");
  const mobileEditorial = await mobilePage.locator("#factor-program .chapter-editorial-title").evaluate((node) => {
    const editorial = node.getBoundingClientRect();
    const lesson = node.closest(".learning-chapter__lesson").getBoundingClientRect();
    return {
      textAlign: getComputedStyle(node).textAlign,
      centered: Math.abs((editorial.left - lesson.left) - (lesson.right - editorial.right)) <= 2
    };
  });
  assert.equal(mobileEditorial.textAlign, "center", "mobile Section 01 editorial remains centered");
  assert.ok(mobileEditorial.centered, "mobile Section 01 editorial is centered within the lesson");
  await mobilePage.locator(".menu-toggle").click();
  assert.equal(await mobilePage.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
  await mobilePage.locator(".menu-toggle").click();
  assert.equal(await mobilePage.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
  await mobilePage.locator("[data-operation-trigger]").click();
  assert.equal(await mobilePage.locator("[data-operation-panel]").getAttribute("role"), "region");
  assert.equal(await mobilePage.locator("[data-operation-panel]").getAttribute("aria-modal"), null);
  assert.equal(await mobilePage.locator("[data-operation-close]").count(), 0, "mobile picker has no redundant Close control");
  await mobilePage.locator("#factor-program .chapter-index").click();
  assert.equal(await mobilePage.locator("[data-operation-panel]").isVisible(), false, "mobile picker closes from an outside click");
  await chooseOperation(mobilePage, "senior_living");
  await chooseGood(mobilePage, "sheets");
  await assertNoOverflow(mobilePage, "mobile senior living branch");
  await mobile.close();

  await browser.close();
  console.log("Pricing spine passed V2.3 lane mapping, evidence-gated rental, durable lead handoff, manual review, and responsive checks.");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
