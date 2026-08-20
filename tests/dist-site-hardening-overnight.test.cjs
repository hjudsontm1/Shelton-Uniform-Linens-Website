const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repositoryRoot = path.resolve(__dirname, "..");
const distClient = path.join(repositoryRoot, "dist", "client");
const receiptKey = "sheltonSubmissionReceiptV1";
const fixedNow = Date.UTC(2026, 7, 20, 9, 30, 0);
const maxReceiptAge = 10 * 60 * 1000;

const readDist = (relativePath) => fs.readFileSync(path.join(distClient, relativePath), "utf8");
const thankYouHtml = readDist("thank-you.html");
const quoteConfirmationScript = readDist("assets/js/quote-confirmation.js");
const quoteFormScript = readDist("assets/js/quote-form.js");
const pricingScript = readDist("assets/js/pricing-learning.js");
const servicesHtml = readDist("services.html");
const servicesScript = readDist("assets/js/services-editorial.js");
const servicesStandardCss = readDist("assets/css/services-standard.css");
const servicesPolishCss = readDist("assets/css/services-final-polish.css");
const siteCss = readDist("assets/css/site.css");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const attributeValue = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(name)}="([^"]*)"`));
  return match ? match[1] : null;
};

const cssDeclarations = (css, selector) => {
  const match = css.match(new RegExp(`${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `expected CSS rule for ${selector}`);
  return match[1];
};

const balancedBlocks = (source, header) => {
  const blocks = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = source.indexOf(header, searchFrom);
    if (start < 0) break;
    const openingBrace = source.indexOf("{", start + header.length);
    assert.ok(openingBrace >= 0, `expected opening brace after ${header}`);

    let depth = 0;
    let end = openingBrace;
    for (; end < source.length; end += 1) {
      if (source[end] === "{") depth += 1;
      if (source[end] === "}") depth -= 1;
      if (depth === 0) break;
    }

    assert.ok(end < source.length, `expected closing brace after ${header}`);
    blocks.push(source.slice(start, end + 1));
    searchFrom = end + 1;
  }

  return blocks;
};

const makeStorage = (rawReceipt) => {
  const values = new Map();
  if (rawReceipt !== undefined) values.set(receiptKey, rawReceipt);

  return {
    removedKeys: [],
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      this.removedKeys.push(key);
      values.delete(key);
    }
  };
};

const neutralConfirmation = () => ({
  documentTitle: "Request Confirmation | Shelton Linen & Uniform Services",
  iconClass: "ph ph-chat-circle",
  title: "How can we help?",
  copy: "This page confirms requests only after they are sent. Start a quote request, or contact Shelton directly.",
  actionHref: "quote.html",
  actionLabel: "Request a quote"
});

const executeConfirmation = (storage, now = fixedNow) => {
  const initial = neutralConfirmation();
  const nodes = {
    icon: { className: initial.iconClass },
    title: { textContent: initial.title },
    copy: { textContent: initial.copy },
    action: { href: initial.actionHref },
    actionLabel: { textContent: initial.actionLabel }
  };
  const selectors = new Map([
    ["[data-confirmation-icon] i", nodes.icon],
    ["[data-confirmation-title]", nodes.title],
    ["[data-confirmation-copy]", nodes.copy],
    ["[data-confirmation-action]", nodes.action],
    ["[data-confirmation-action-label]", nodes.actionLabel]
  ]);
  const document = {
    title: initial.documentTitle,
    querySelector(selector) {
      return selectors.get(selector) || null;
    }
  };
  class FixedDate extends Date {
    static now() {
      return now;
    }
  }
  const window = { document, sessionStorage: storage };
  window.window = window;

  vm.runInNewContext(quoteConfirmationScript, {
    Date: FixedDate,
    document,
    window
  }, { filename: "dist/client/assets/js/quote-confirmation.js" });

  return {
    documentTitle: document.title,
    iconClass: nodes.icon.className,
    title: nodes.title.textContent,
    copy: nodes.copy.textContent,
    actionHref: nodes.action.href,
    actionLabel: nodes.actionLabel.textContent
  };
};

const assertNeutral = (state) => assert.deepEqual(state, neutralConfirmation());

const receiptPayload = (script, expectedKind) => {
  const functionMatch = script.match(/const markSubmissionReceipt = \(\) => \{([\s\S]*?)\n  \};/);
  assert.ok(functionMatch, `${expectedKind} defines markSubmissionReceipt`);
  const payloadMatch = functionMatch[1].match(/JSON\.stringify\(\{([\s\S]*?)\}\)\)/);
  assert.ok(payloadMatch, `${expectedKind} stores a JSON receipt`);

  const keys = Array.from(payloadMatch[1].matchAll(/\b([A-Za-z_$][\w$]*)\s*:/g), (match) => match[1]);
  assert.deepEqual(keys, ["v", "kind", "at"], `${expectedKind} receipt contains only the approved non-PII keys`);
  assert.match(payloadMatch[1], new RegExp(`\\bkind\\s*:\\s*"${expectedKind}"`));
  assert.match(payloadMatch[1], /\bv\s*:\s*1\b/);
  assert.match(payloadMatch[1], /\bat\s*:\s*Date\.now\(\)/);

  const markIndex = script.lastIndexOf("markSubmissionReceipt();");
  const redirectIndex = script.indexOf("window.location.assign", markIndex);
  assert.ok(markIndex >= 0, `${expectedKind} marks its receipt after accepted submission`);
  assert.ok(redirectIndex > markIndex, `${expectedKind} marks its receipt before redirecting`);
};

test("canonical thank-you page is neutral by default and defers success to the receipt script", () => {
  assert.match(thankYouHtml, /data-confirmation-title>How can we help\?<\/h1>/);
  assert.match(thankYouHtml, /data-confirmation-copy>This page confirms requests only after they are sent\./);
  assert.match(thankYouHtml, /href="quote\.html" data-confirmation-action/);
  assert.match(thankYouHtml, /data-confirmation-action-label>Request a quote<\/span>/);
  assert.doesNotMatch(thankYouHtml, /data-confirmation-title>Thank you\./);

  const defaultContentIndex = thankYouHtml.indexOf("data-confirmation-title");
  const receiptScriptIndex = thankYouHtml.indexOf('src="assets/js/quote-confirmation.js');
  assert.ok(receiptScriptIndex > defaultContentIndex, "receipt enhancement loads after the neutral confirmation markup");
});

test("quote and estimator submissions persist only non-PII receipts before redirect", () => {
  receiptPayload(quoteFormScript, "quote");
  receiptPayload(pricingScript, "estimator");
});

test("direct confirmation visits stay neutral", () => {
  const storage = makeStorage();
  assertNeutral(executeConfirmation(storage));
  assert.equal(storage.getItem(receiptKey), null);
});

test("fresh quote and estimator receipts unlock the success confirmation", () => {
  for (const kind of ["quote", "estimator"]) {
    const storage = makeStorage(JSON.stringify({ v: 1, kind, at: fixedNow - 1000 }));
    const state = executeConfirmation(storage);
    assert.equal(state.documentTitle, "Thank You | Shelton Linen & Uniform Services");
    assert.equal(state.iconClass, "ph ph-check");
    assert.equal(state.title, "Thank you. Your request was sent.");
    assert.equal(state.actionHref, "index.html");
    assert.equal(state.actionLabel, "Return home");
    assert.equal(storage.getItem(receiptKey), null, `${kind} receipt is consumed`);
  }
});

test("stale receipts are consumed without claiming success", () => {
  const storage = makeStorage(JSON.stringify({
    v: 1,
    kind: "quote",
    at: fixedNow - maxReceiptAge - 1
  }));
  assertNeutral(executeConfirmation(storage));
  assert.equal(storage.getItem(receiptKey), null);
});

test("invalid receipts are consumed without claiming success", () => {
  const invalidReceipts = [
    "{not-json",
    JSON.stringify({ v: 2, kind: "quote", at: fixedNow }),
    JSON.stringify({ v: 1, kind: "unknown", at: fixedNow }),
    JSON.stringify({ v: 1, kind: "estimator", at: fixedNow + 1 })
  ];

  invalidReceipts.forEach((rawReceipt) => {
    const storage = makeStorage(rawReceipt);
    assertNeutral(executeConfirmation(storage));
    assert.equal(storage.getItem(receiptKey), null);
  });
});

test("a consumed valid receipt cannot unlock success twice", () => {
  const storage = makeStorage(JSON.stringify({ v: 1, kind: "estimator", at: fixedNow }));
  assert.equal(executeConfirmation(storage).title, "Thank you. Your request was sent.");
  assertNeutral(executeConfirmation(storage));
  assert.deepEqual(storage.removedKeys, [receiptKey, receiptKey]);
});

test("Services exposes exactly four focusable tabpanels with reciprocal labels", () => {
  const panelTags = servicesHtml.match(/<article\b[^>]*\bdata-standard-panel="[^"]+"[^>]*>/g) || [];
  const tabTags = servicesHtml.match(/<button\b[^>]*\bdata-standard-tab="[^"]+"[^>]*>/g) || [];

  assert.equal((servicesHtml.match(/\brole="tabpanel"/g) || []).length, 4);
  assert.equal(panelTags.length, 4);
  assert.equal(tabTags.length, 4);

  panelTags.forEach((panelTag) => {
    const key = attributeValue(panelTag, "data-standard-panel");
    const panelId = attributeValue(panelTag, "id");
    const labelledBy = attributeValue(panelTag, "aria-labelledby");
    const matchingTab = tabTags.find((tabTag) => attributeValue(tabTag, "data-standard-tab") === key);

    assert.equal(attributeValue(panelTag, "role"), "tabpanel", `${key} uses tabpanel semantics`);
    assert.equal(attributeValue(panelTag, "tabindex"), "0", `${key} panel is focusable when shown`);
    assert.ok(panelId && labelledBy, `${key} panel has an id and accessible label reference`);
    assert.ok(matchingTab, `${key} has a matching tab`);
    assert.equal(attributeValue(matchingTab, "role"), "tab");
    assert.equal(attributeValue(matchingTab, "id"), labelledBy);
    assert.equal(attributeValue(matchingTab, "aria-controls"), panelId);
    assert.match(
      servicesHtml,
      new RegExp(`<button[^>]*id="${escapeRegExp(labelledBy)}"[^>]*>[\\s\\S]*?<span class="shelton-cleaning-standard__label">[^<]+<\\/span>[\\s\\S]*?<\\/button>`),
      `${key} tab has visible label text`
    );
  });
});

test("Services uses a two-column tab layout with two-position vertical keyboard movement", () => {
  const phoneStandardBlocks = balancedBlocks(servicesStandardCss, "@media (max-width: 720px)");
  assert.ok(phoneStandardBlocks.some((block) => (
    /\.shelton-cleaning-standard__selector\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/.test(block)
  )), "phone cleaning-standard tabs form a 2x2 grid");

  assert.match(servicesScript, /const verticalStep = window\.matchMedia\("\(max-width: 720px\)"\)\.matches \? 2 : 1;/);
  assert.match(servicesScript, /event\.key === "ArrowDown"\) nextIndex = \(index \+ verticalStep\) % standardTabs\.length/);
  assert.match(servicesScript, /event\.key === "ArrowUp"\) nextIndex = \(index - verticalStep \+ standardTabs\.length\) % standardTabs\.length/);
});

test("Services reveals the live map only after both map and service-area readiness", () => {
  const revealMatch = servicesScript.match(/const revealLiveMap = \(\) => \{([\s\S]*?)\n    \};/);
  assert.ok(revealMatch, "Services defines a live-map reveal gate");
  assert.match(revealMatch[1], /if \(!mapReady \|\| !serviceAreaReady\) return;/);
  assert.match(revealMatch[1], /routeMapStage\?\.classList\.add\("has-live-map"\)/);
  assert.equal((servicesScript.match(/classList\.add\("has-live-map"\)/g) || []).length, 1);
  assert.match(servicesScript, /serviceAreaReady = true;[\s\S]*?revealLiveMap\(\)/);
  assert.match(servicesScript, /mapReady = true;[\s\S]*?revealLiveMap\(\)/);
  assert.match(servicesScript, /window\.L\.control\.zoom\(\{ position: "topright" \}\)\.addTo\(routeMap\)/);
});

test("Services CSS gates the live map and keeps fallback, focus, and scroll behavior hardened", () => {
  const hiddenMap = cssDeclarations(servicesPolishCss, ".service-route-check__map");
  assert.match(hiddenMap, /visibility:\s*hidden/);
  assert.match(hiddenMap, /opacity:\s*0/);
  assert.match(hiddenMap, /pointer-events:\s*none/);

  const liveMap = cssDeclarations(servicesPolishCss, ".service-route-check__map-stage.has-live-map .service-route-check__map");
  assert.match(liveMap, /visibility:\s*visible/);
  assert.match(liveMap, /opacity:\s*1/);
  assert.match(liveMap, /pointer-events:\s*auto/);

  const hiddenFallback = cssDeclarations(servicesPolishCss, ".service-route-check__map-stage.has-live-map .service-route-check__map-fallback");
  assert.match(hiddenFallback, /display:\s*none/);

  [
    [servicesStandardCss, ".shelton-cleaning-standard__tab:focus-visible"],
    [servicesStandardCss, ".shelton-cleaning-standard__panel:focus-visible"],
    [servicesPolishCss, ".service-route-check__field input:focus-visible"],
    [servicesPolishCss, ".service-route-check__facility-marker:focus-visible"]
  ].forEach(([css, selector]) => {
    const declarations = cssDeclarations(css, selector);
    assert.match(declarations, /outline:\s*2px solid/);
  });

  const compactBlocks = balancedBlocks(servicesPolishCss, "@media (min-width: 621px) and (max-width: 900px)");
  const phoneBlocks = balancedBlocks(servicesPolishCss, "@media (max-width: 620px)");
  assert.ok(compactBlocks.some((block) => /\.service-chapter\s*\{\s*scroll-margin-top:\s*9\.75rem;/.test(block)));
  assert.ok(phoneBlocks.some((block) => /\.service-chapter\s*\{\s*scroll-margin-top:\s*9\.35rem;/.test(block)));
});

test("Services map GeoJSON is a closed Polygon FeatureCollection", () => {
  const fetchMatch = servicesScript.match(/fetch\("([^"]+\.geojson(?:\?[^"]*)?)"\)/);
  assert.ok(fetchMatch, "Services fetches a GeoJSON service-area asset");
  const relativeGeoJsonPath = fetchMatch[1].split("?")[0];
  assert.ok(!path.isAbsolute(relativeGeoJsonPath) && !relativeGeoJsonPath.includes(".."));

  const serviceArea = JSON.parse(readDist(relativeGeoJsonPath));
  assert.equal(serviceArea.type, "FeatureCollection");
  assert.ok(Array.isArray(serviceArea.features) && serviceArea.features.length > 0);

  serviceArea.features.forEach((feature, featureIndex) => {
    assert.equal(feature.type, "Feature", `feature ${featureIndex} is a GeoJSON Feature`);
    assert.equal(feature.geometry?.type, "Polygon", `feature ${featureIndex} is a Polygon`);
    assert.ok(Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length > 0);

    feature.geometry.coordinates.forEach((ring, ringIndex) => {
      assert.ok(Array.isArray(ring) && ring.length >= 4, `feature ${featureIndex} ring ${ringIndex} has enough points`);
      ring.forEach((coordinate) => {
        assert.ok(Array.isArray(coordinate) && coordinate.length >= 2);
        assert.ok(coordinate.slice(0, 2).every(Number.isFinite));
      });
      assert.deepEqual(ring.at(-1), ring[0], `feature ${featureIndex} ring ${ringIndex} closes`);
    });
  });
});

test("Home story controls preserve 24px desktop targets and larger phone targets", () => {
  const baseControls = cssDeclarations(siteCss, ".story-carousel__controls button");
  const baseDots = cssDeclarations(siteCss, ".story-carousel__dots button");
  assert.match(baseControls, /width:\s*1\.5rem/);
  assert.match(baseControls, /height:\s*1\.5rem/);
  assert.match(baseDots, /width:\s*1\.5rem/);
  assert.match(baseDots, /height:\s*1\.5rem/);

  const phoneBlocks = balancedBlocks(siteCss, "@media (max-width: 620px)");
  assert.ok(phoneBlocks.some((block) => (
    /body\.home-page \.story-carousel__controls > button\s*\{[\s\S]*?width:\s*2\.75rem;[\s\S]*?height:\s*2\.75rem;/.test(block)
  )));
  assert.ok(phoneBlocks.some((block) => (
    /body\.home-page \.story-carousel__dots button\s*\{[\s\S]*?width:\s*1\.75rem;[\s\S]*?height:\s*2\.75rem;/.test(block)
  )));
});
