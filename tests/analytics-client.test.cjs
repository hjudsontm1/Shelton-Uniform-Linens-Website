const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repositoryRoot = path.resolve(__dirname, "..");
const distClient = path.join(repositoryRoot, "dist", "client");
const analyticsPath = path.join(distClient, "assets", "js", "analytics.js");
const analyticsSource = fs.readFileSync(analyticsPath, "utf8");
const pricingSource = fs.readFileSync(path.join(distClient, "assets", "js", "pricing-learning.js"), "utf8");
const quoteSource = fs.readFileSync(path.join(distClient, "assets", "js", "quote-form.js"), "utf8");
const servicesSource = fs.readFileSync(path.join(distClient, "assets", "js", "services-editorial.js"), "utf8");
const privacyHtml = fs.readFileSync(path.join(distClient, "privacy.html"), "utf8");

const canonicalPages = [
  "index.html",
  "services.html",
  "industries.html",
  "pricing.html",
  "about.html",
  "quote.html",
  "thank-you.html",
  "privacy.html"
];
const prototypePages = [
  "brand-assets.html",
  "estimate.html",
  "industries-tailored-concept.html",
  "pickup-delivery.html"
];
const sessionKey = "sheltonAnalyticsSessionV1";
const queueKey = "sheltonAnalyticsQueueV2";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const makeStorage = () => {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    value(key) {
      return values.get(key);
    }
  };
};

let uuidCounter = 0;
const nextUuid = () => {
  uuidCounter += 1;
  return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, "0")}`;
};

const executeAnalytics = ({
  activationEnabled = true,
  page = "pricing",
  hostname = "sheltonlinen.com",
  origin = "https://sheltonlinen.com",
  storage = makeStorage(),
  dnt = "0",
  gpc = false,
  referrer = "",
  width = 1280,
  navigation = "navigate",
  navigationDuration = 1234,
  modules = []
} = {}) => {
  const windowListeners = new Map();
  const documentListeners = new Map();
  const timers = new Map();
  let timerId = 0;
  const document = {
    documentElement: {
      dataset: activationEnabled ? { analyticsEnabled: "true" } : {}
    },
    body: { dataset: { page } },
    referrer,
    visibilityState: "visible",
    querySelectorAll(selector) {
      return selector === "[data-analytics-module]" ? modules : [];
    },
    addEventListener(name, listener) {
      documentListeners.set(name, listener);
    }
  };
  const window = {
    document,
    sessionStorage: storage,
    innerWidth: width,
    location: { hostname, origin },
    navigator: {
      doNotTrack: dnt,
      globalPrivacyControl: gpc,
      sendBeacon: () => false
    },
    doNotTrack: dnt,
    crypto: { randomUUID: nextUuid },
    performance: {
      getEntriesByType(type) {
        return type === "navigation" ? [{ type: navigation, duration: navigationDuration }] : [];
      },
      now: () => navigationDuration
    },
    fetch: async () => ({ ok: true }),
    setTimeout(callback) {
      timerId += 1;
      timers.set(timerId, callback);
      return timerId;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    addEventListener(name, listener) {
      windowListeners.set(name, listener);
    }
  };
  window.window = window;
  const context = vm.createContext({
    window,
    document,
    URL,
    Blob,
    Uint8Array,
    Date,
    Math,
    Object,
    Array,
    Set,
    Map,
    WeakMap,
    JSON,
    String,
    Number,
    Boolean,
    Promise
  });
  vm.runInContext(analyticsSource, context, { filename: analyticsPath });
  return {
    window,
    document,
    storage,
    windowListeners,
    documentListeners,
    timers,
    queue() {
      return JSON.parse(storage.getItem(queueKey) || "[]");
    }
  };
};

test("analytics loads only on canonical public pages with stable high-value identifiers", () => {
  canonicalPages.forEach((file) => {
    const html = fs.readFileSync(path.join(distClient, file), "utf8");
    assert.match(html, /assets\/js\/analytics\.js\?v=20260825-first-party-v1/);
    assert.match(html, /data-analytics-id="[a-z0-9-]+"/);
  });
  prototypePages.forEach((file) => {
    const html = fs.readFileSync(path.join(distClient, file), "utf8");
    assert.doesNotMatch(html, /assets\/js\/analytics\.js/);
  });
  assert.match(fs.readFileSync(path.join(distClient, "index.html"), "utf8"), /data-analytics-module="home-program-builder"/);
  assert.match(fs.readFileSync(path.join(distClient, "services.html"), "utf8"), /data-analytics-module="services-cleaning-standard"/);
  assert.match(fs.readFileSync(path.join(distClient, "pricing.html"), "utf8"), /data-analytics-module="pricing-program-builder"/);
  assert.match(fs.readFileSync(path.join(distClient, "about.html"), "utf8"), /data-analytics-module="about-archive"/);
});

test("analytics client is anonymous, session-only, and avoids page or form content", () => {
  assert.match(analyticsSource, /document\.documentElement\?\.dataset\?\.analyticsEnabled === "true"/);
  canonicalPages.forEach((file) => {
    const html = fs.readFileSync(path.join(distClient, file), "utf8");
    assert.doesNotMatch(html, /data-analytics-enabled=/);
  });
  assert.doesNotMatch(analyticsSource, /localStorage|document\.cookie|location\.search|location\.hash|\.textContent/);
  assert.doesNotMatch(analyticsSource, /getSessionId|analyticsSessionId/);
  assert.doesNotMatch(pricingSource + quoteSource + servicesSource, /analyticsSessionId/);
  assert.match(analyticsSource, /const sessionKey = "sheltonAnalyticsSessionV1"/);
  assert.match(analyticsSource, /const pagePathByKey = Object\.freeze/);
  assert.match(analyticsSource, /destinationKey/);
  assert.doesNotMatch(analyticsSource, /\bdestination\s*:/);
  assert.match(privacyHtml, /random identifier stored only for the browser session/i);
  assert.match(privacyHtml, /do not include form contents, exact estimator quantities or prices/i);
  assert.match(privacyHtml, /disabled when your browser sends Global Privacy Control or a Do Not Track preference/i);
});

test("localhost, Global Privacy Control, and Do Not Track prevent collection", () => {
  [
    { activationEnabled: false },
    { hostname: "localhost" },
    { gpc: true },
    { dnt: "1" },
    { dnt: "yes" }
  ].forEach((options) => {
    const storage = makeStorage();
    const runtime = executeAnalytics({ storage, ...options });
    assert.equal(runtime.window.SheltonAnalytics.enabled, false);
    assert.equal(storage.getItem(sessionKey), null);
    assert.equal(storage.getItem(queueKey), null);
  });
});

test("page views use canonical paths and retain pending events across navigation", () => {
  const storage = makeStorage();
  const home = executeAnalytics({ page: "home", storage, navigation: "reload", width: 500 });
  home.windowListeners.get("pageshow")({ persisted: false });
  let queue = home.queue();
  assert.equal(queue.length, 1);
  assert.equal(queue[0].pageKey, "home");
  assert.equal(queue[0].pagePath, "/");
  assert.equal(queue[0].viewport, "mobile");
  assert.deepEqual(queue[0].properties, {
    navigationType: "reload",
    referrerClass: "direct",
    bfcache: false
  });

  const pricing = executeAnalytics({ page: "pricing", storage, width: 900 });
  pricing.windowListeners.get("pageshow")({ persisted: true });
  queue = pricing.queue();
  assert.equal(queue.length, 2);
  assert.equal(queue[0].pageKey, "home");
  assert.equal(queue[0].pagePath, "/");
  assert.equal(queue[1].pageKey, "pricing");
  assert.equal(queue[1].pagePath, "/pricing");
  assert.equal(queue[1].viewport, "compact");
  assert.equal(queue[1].properties.bfcache, true);
  assert.match(storage.getItem(sessionKey), uuidPattern);
  assert.equal(Object.hasOwn(pricing.window.SheltonAnalytics, "getSessionId"), false);
});

test("queues larger than one batch continue draining after the first request", async () => {
  const runtime = executeAnalytics({ page: "pricing" });
  for (let index = 0; index < 25; index += 1) {
    runtime.window.SheltonAnalytics.track("content_engaged", {
      moduleId: "pricing-program-builder",
      result: "engaged",
      stage: "interaction"
    });
  }

  const runNextTimer = async () => {
    const next = runtime.timers.entries().next().value;
    assert.ok(next, "a queued batch should have a scheduled flush");
    runtime.timers.delete(next[0]);
    next[1]();
    await new Promise((resolve) => setImmediate(resolve));
  };

  await runNextTimer();
  assert.equal(runtime.queue().length, 5, "the first request sends the 20-event batch cap");
  await runNextTimer();
  assert.equal(runtime.queue().length, 0, "the remaining events drain in a follow-up batch");
});

test("estimator properties follow the Office allowlist and discard exact values", () => {
  const runtime = executeAnalytics({ page: "pricing" });
  runtime.window.SheltonAnalytics.track("estimator_range_viewed", {
    answerCountBucket: "2_3",
    confidence: "high",
    evidence: "known_pounds",
    goodsCountBucket: "2",
    stage: "refined",
    operation: "hotel",
    weeklyPounds: 7505,
    exactPrice: 6604,
    formValue: "Jordan"
  }, { estimatorStep: "range" });
  const [event] = runtime.queue();
  assert.equal(event.name, "estimator_range_viewed");
  assert.equal(event.pagePath, "/pricing");
  assert.equal(event.estimatorStep, "range");
  assert.deepEqual(event.properties, {
    answerCountBucket: "2_3",
    confidence: "high",
    evidence: "known_pounds",
    goodsCountBucket: "2",
    stage: "refined"
  });
  assert.doesNotMatch(JSON.stringify(event), /weeklyPounds|exactPrice|formValue|Jordan|7505|6604/);

  runtime.window.SheltonAnalytics.track("estimator_operation_selected", {
    operation: "hotel",
    stage: "selected"
  });
  runtime.window.SheltonAnalytics.track("estimator_goods_mode_selected", {
    goodsCountBucket: "4_plus",
    mode: "typical",
    stage: "typical"
  });
  const queue = runtime.queue();
  assert.deepEqual(queue[1].properties, { operation: "hotel", stage: "selected" });
  assert.deepEqual(queue[2].properties, { goodsCountBucket: "4_plus", mode: "typical", stage: "typical" });
});

test("CTA, contact, module engagement, and performance events stay coarse and explicit", () => {
  const moduleListeners = new Map();
  const module = {
    dataset: { analyticsModule: "pricing-program-builder" },
    addEventListener(name, listener) {
      moduleListeners.set(name, listener);
    }
  };
  const runtime = executeAnalytics({ page: "pricing", modules: [module], navigation: "navigate" });
  const click = runtime.documentListeners.get("click");
  click({
    target: {
      closest: () => ({
        dataset: {
          analyticsId: "pricing-build-range",
          analyticsDestination: "pricing"
        }
      })
    }
  });
  click({
    target: {
      closest: () => ({
        dataset: {
          analyticsId: "phone-footer",
          analyticsChannel: "phone"
        }
      })
    }
  });
  moduleListeners.get("click")();
  moduleListeners.get("click")();
  runtime.windowListeners.get("load")();

  const queue = runtime.queue();
  assert.deepEqual(queue.map((event) => event.name), [
    "cta_click",
    "contact_click",
    "content_engaged",
    "performance_metric"
  ]);
  assert.deepEqual(queue[0].properties, {
    ctaId: "pricing-build-range",
    destinationKey: "pricing"
  });
  assert.deepEqual(queue[1].properties, {
    channel: "phone",
    destinationKey: "phone"
  });
  assert.deepEqual(queue[2].properties, {
    moduleId: "pricing-program-builder",
    result: "engaged",
    stage: "interaction"
  });
  assert.deepEqual(queue[3].properties, {
    metric: "page_load_ms",
    navigationType: "navigate",
    value: 1200
  });
});

test("estimator and form hooks use only anonymous Office event vocabulary", () => {
  assert.match(pricingSource, /estimator_operation_selected/);
  assert.match(pricingSource, /operation: analyticsOperationValue\(operationId\)/);
  assert.doesNotMatch(pricingSource, /wholesale:\s*"specialty"|other:\s*"specialty"/);
  assert.match(pricingSource, /estimator_goods_mode_selected/);
  assert.match(pricingSource, /goodsCountBucket: analyticsCountBucket\(state\.goods\.length\)/);
  assert.match(pricingSource, /mode: state\.goodsMode,[\s\S]*?stage: "default"/);
  assert.match(pricingSource, /estimator_range_viewed/);
  assert.match(pricingSource, /evidence: analyticsEvidence\(latestResult\)/);
  assert.match(pricingSource, /confidence: analyticsConfidence\(currentPrecision\(\)\)/);
  assert.match(pricingSource, /lead_submit_success/);
  assert.match(pricingSource, /const durableAccepted = requireAccepted\(durableRequest\)\.then/);
  assert.doesNotMatch(pricingSource, /estimator_lead_submit_(?:attempt|result)/);
  assert.match(quoteSource, /quote_form_started/);
  assert.match(quoteSource, /quote_submit_result/);
  assert.match(servicesSource, /route_review_started/);
  assert.match(servicesSource, /route_review_handoff/);
});
