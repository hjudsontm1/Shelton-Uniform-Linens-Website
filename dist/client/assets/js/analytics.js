(function () {
  "use strict";

  const endpoint = "/api/website-events";
  const schemaVersion = "website-analytics.v1";
  const activationEnabled = document.documentElement?.dataset?.analyticsEnabled === "true";
  const sessionKey = "sheltonAnalyticsSessionV1";
  const queueKey = "sheltonAnalyticsQueueV2";
  const onceKey = "sheltonAnalyticsOnceV2";
  const maxQueueSize = 50;
  const maxBatchSize = 20;
  const eventTtlMs = 30 * 60 * 1000;
  const flushDelayMs = 10000;
  const retryDelays = [1000, 2000, 4000, 8000, 30000];
  const allowedEvents = new Set([
    "page_view",
    "cta_click",
    "content_engaged",
    "contact_click",
    "estimator_started",
    "estimator_operation_selected",
    "estimator_goods_mode_selected",
    "estimator_range_viewed",
    "estimator_precision_opened",
    "estimator_precision_completed",
    "estimator_quote_started",
    "lead_submit_attempt",
    "lead_submit_success",
    "lead_submit_error",
    "quote_form_started",
    "quote_submit_attempt",
    "quote_submit_result",
    "route_review_started",
    "route_review_handoff",
    "performance_metric"
  ]);
  const pagePathByKey = Object.freeze({
    home: "/",
    services: "/services",
    industries: "/industries",
    pricing: "/pricing",
    about: "/about",
    quote: "/quote",
    thank_you: "/thank-you",
    privacy: "/privacy"
  });
  const propertyKeysByEvent = Object.freeze({
    page_view: new Set(["bfcache", "campaignMedium", "campaignName", "campaignSource", "navigationType", "referrerClass"]),
    cta_click: new Set(["channel", "ctaId", "destinationKey", "moduleId", "result"]),
    contact_click: new Set(["channel", "destinationKey", "result"]),
    content_engaged: new Set(["moduleId", "result", "stage"]),
    estimator_started: new Set(["stage"]),
    estimator_operation_selected: new Set(["operation", "stage"]),
    estimator_goods_mode_selected: new Set(["goodsCountBucket", "mode", "stage"]),
    estimator_range_viewed: new Set(["answerCountBucket", "confidence", "evidence", "goodsCountBucket", "stage"]),
    estimator_precision_opened: new Set(["answerCountBucket", "stage"]),
    estimator_precision_completed: new Set(["answerCountBucket", "confidence", "stage"]),
    estimator_quote_started: new Set(["stage"]),
    performance_metric: new Set(["metric", "navigationType", "value"])
  });
  const defaultPropertyKeys = new Set(["channel", "result", "stage"]);
  const allowedOperations = new Set([
    "casino", "event", "gym", "homeless_shelter", "hotel", "medspa",
    "other", "residential_treatment", "resort_spa", "restaurant", "senior_living",
    "specialty", "str", "uniform", "wholesale"
  ]);
  const allowedModes = new Set(["custom", "typical"]);
  const allowedEvidence = new Set([
    "customer_provided", "estimated", "known_pieces", "known_pounds", "measured",
    "measured_pounds", "operation_default", "piece_counts", "proxy", "rooms_occupancy"
  ]);
  const allowedConfidence = new Set(["high", "known", "low", "medium"]);
  const countBucketPattern = /^(none|unknown|[0-9]{1,2}|[0-9]{1,2}_[0-9]{1,2}|[0-9]{1,2}_plus)$/;

  const storage = (() => {
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  })();

  const hostname = String(window.location?.hostname || "").toLowerCase();
  const localhost = hostname === "localhost"
    || hostname === "127.0.0.1"
    || hostname === "::1"
    || hostname === "[::1]"
    || hostname.endsWith(".localhost");
  const dnt = [window.navigator?.doNotTrack, window.doNotTrack, window.navigator?.msDoNotTrack]
    .some((value) => ["1", "yes"].includes(String(value || "").toLowerCase()));
  const bodyPage = String(document.body?.dataset?.page || "");
  const pageKey = bodyPage === "quote-success" ? "thank_you" : bodyPage;
  const pagePath = pagePathByKey[pageKey] || "";
  const disabled = !activationEnabled
    || localhost
    || window.navigator?.globalPrivacyControl === true
    || dnt
    || !storage
    || !pagePath;

  const disabledApi = Object.freeze({
    enabled: false,
    track: () => false,
    trackOnce: () => false,
    flush: () => Promise.resolve(false)
  });

  if (disabled) {
    window.SheltonAnalytics = disabledApi;
    return;
  }

  const makeUuid = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256);
      }
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  };

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const readJson = (key, fallback) => {
    try {
      const parsed = JSON.parse(storage.getItem(key) || "null");
      return parsed === null ? fallback : parsed;
    } catch {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  let sessionId = String(storage.getItem(sessionKey) || "").trim();
  if (!uuidPattern.test(sessionId)) {
    sessionId = makeUuid();
    storage.setItem(sessionKey, sessionId);
  }

  let queue = readJson(queueKey, []);
  let once = readJson(onceKey, {});
  let flushTimer = 0;
  let retryTimer = 0;
  let retryAttempt = 0;
  let inFlight = false;

  const now = () => Date.now();
  const cleanQueue = () => {
    const cutoff = now() - eventTtlMs;
    queue = (Array.isArray(queue) ? queue : [])
      .filter((event) => event
        && Number(event.queuedAt) >= cutoff
        && uuidPattern.test(String(event.eventId || ""))
        && allowedEvents.has(event.name)
        && pagePathByKey[event.pageKey] === event.pagePath)
      .slice(-maxQueueSize);
    writeJson(queueKey, queue);
  };
  cleanQueue();

  const viewportClass = () => {
    const width = Number(window.innerWidth) || 0;
    if (width <= 620) return "mobile";
    if (width <= 1180) return "compact";
    return "desktop";
  };

  const navigationType = () => {
    const type = window.performance?.getEntriesByType?.("navigation")?.[0]?.type;
    return ["navigate", "reload", "back_forward", "prerender"].includes(type) ? type : "navigate";
  };

  const referrerClass = () => {
    if (!document.referrer) return "direct";
    try {
      return new URL(document.referrer).origin === window.location.origin ? "same_site" : "external";
    } catch {
      return "unknown";
    }
  };

  const cleanToken = (value, maxLength = 64) => {
    const token = String(value || "").trim();
    return token && token.length <= maxLength && /^[a-z0-9_.:-]+$/i.test(token) ? token : "";
  };

  const sanitizeProperties = (name, input) => {
    const source = input && typeof input === "object" ? input : {};
    const allowed = propertyKeysByEvent[name] || defaultPropertyKeys;
    const properties = {};
    allowed.forEach((key) => {
      if (!(key in source)) return;
      if (key === "bfcache") {
        if (typeof source[key] === "boolean") properties[key] = source[key];
        return;
      }
      if (key === "value") {
        const value = Number(source[key]);
        if (name === "performance_metric" && Number.isFinite(value) && value >= 0 && value <= 120000) {
          properties[key] = Math.round(value * 100) / 100;
        }
        return;
      }
      const value = cleanToken(source[key]);
      if (!value) return;
      if (key === "operation" && !allowedOperations.has(value)) return;
      if (key === "mode" && !allowedModes.has(value)) return;
      if (key === "evidence" && !allowedEvidence.has(value)) return;
      if (key === "confidence" && !allowedConfidence.has(value)) return;
      if ((key === "answerCountBucket" || key === "goodsCountBucket") && !countBucketPattern.test(value)) return;
      properties[key] = value;
    });
    return properties;
  };

  const persistQueue = () => writeJson(queueKey, queue);
  const scheduleFlush = (delay = flushDelayMs) => {
    if (flushTimer || inFlight || !queue.length) return;
    flushTimer = window.setTimeout(() => {
      flushTimer = 0;
      flush();
    }, delay);
  };

  const track = (name, properties, context) => {
    if (!allowedEvents.has(name)) return false;
    cleanQueue();
    const event = {
      eventId: makeUuid(),
      name,
      occurredAt: new Date().toISOString(),
      queuedAt: now(),
      pageKey,
      pagePath,
      viewport: viewportClass(),
      properties: sanitizeProperties(name, properties)
    };
    const elementKey = cleanToken(context?.elementKey, 80);
    const estimatorStep = cleanToken(context?.estimatorStep, 80);
    if (elementKey) event.elementKey = elementKey;
    if (estimatorStep) event.estimatorStep = estimatorStep;
    queue.push(event);
    queue = queue.slice(-maxQueueSize);
    persistQueue();
    scheduleFlush();
    return true;
  };

  const trackOnce = (name, key, properties, context) => {
    const onceId = cleanToken(key, 80);
    if (!onceId || once[onceId]) return false;
    if (!track(name, properties, context)) return false;
    once[onceId] = now();
    const entries = Object.entries(once).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 40);
    once = Object.fromEntries(entries);
    writeJson(onceKey, once);
    return true;
  };

  const makeEnvelope = (events) => ({
    schemaVersion,
    batchId: makeUuid(),
    sessionId,
    sentAt: new Date().toISOString(),
    events: events.map(({ queuedAt, ...event }) => event)
  });

  const removeBatch = (eventIds) => {
    const sent = new Set(eventIds);
    queue = queue.filter((event) => !sent.has(event.eventId));
    persistQueue();
  };

  const scheduleRetry = () => {
    if (retryTimer || !queue.length) return;
    const delay = retryDelays[Math.min(retryAttempt, retryDelays.length - 1)];
    retryAttempt = Math.min(retryAttempt + 1, retryDelays.length - 1);
    retryTimer = window.setTimeout(() => {
      retryTimer = 0;
      flush();
    }, delay);
  };

  async function flush(options = {}) {
    cleanQueue();
    if (!queue.length || inFlight) return false;
    const batch = queue.slice(0, maxBatchSize);
    const ids = batch.map((event) => event.eventId);
    const body = JSON.stringify(makeEnvelope(batch));

    if (options.beacon && typeof window.navigator?.sendBeacon === "function") {
      const accepted = window.navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      if (accepted) {
        removeBatch(ids);
        retryAttempt = 0;
        return true;
      }
    }

    inFlight = true;
    try {
      const response = await window.fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body,
        credentials: "same-origin",
        keepalive: true
      });
      if (!response.ok) throw new Error("Analytics intake rejected");
      removeBatch(ids);
      retryAttempt = 0;
      return true;
    } catch {
      scheduleRetry();
      return false;
    } finally {
      inFlight = false;
      if (queue.length && retryAttempt === 0) scheduleFlush(0);
    }
  }

  const api = Object.freeze({
    enabled: true,
    track,
    trackOnce,
    flush
  });
  window.SheltonAnalytics = api;

  const engagementTimers = new WeakMap();
  const recordModuleEngagement = (module, stage) => {
    const moduleId = cleanToken(module?.dataset?.analyticsModule, 64);
    if (!moduleId) return;
    trackOnce("content_engaged", `engaged-${moduleId}`, {
      moduleId,
      result: "engaged",
      stage
    }, { elementKey: moduleId });
  };
  const modules = Array.from(document.querySelectorAll("[data-analytics-module]"));
  modules.forEach((module) => {
    module.addEventListener("click", () => recordModuleEngagement(module, "interaction"));
    module.addEventListener("change", () => recordModuleEngagement(module, "interaction"));
  });
  if ("IntersectionObserver" in window) {
    const engagementObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const existing = engagementTimers.get(entry.target);
        if (existing) {
          window.clearTimeout(existing);
          engagementTimers.delete(entry.target);
        }
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
        const timer = window.setTimeout(() => {
          engagementTimers.delete(entry.target);
          recordModuleEngagement(entry.target, "viewed");
          engagementObserver.unobserve(entry.target);
        }, 1000);
        engagementTimers.set(entry.target, timer);
      });
    }, { threshold: [0, 0.5] });
    modules.forEach((module) => engagementObserver.observe(module));
  }

  const coarseMilliseconds = (value) => {
    const milliseconds = Number(value);
    if (!Number.isFinite(milliseconds) || milliseconds < 0) return null;
    return Math.min(120000, Math.round(milliseconds / 100) * 100);
  };
  const recordPerformance = (metric, value) => {
    const rounded = coarseMilliseconds(value);
    if (rounded === null) return;
    trackOnce("performance_metric", `performance-${pageKey}-${metric}`, {
      metric,
      navigationType: navigationType(),
      value: rounded
    });
  };
  window.addEventListener("load", () => {
    const navigation = window.performance?.getEntriesByType?.("navigation")?.[0];
    recordPerformance("page_load_ms", navigation?.duration || window.performance?.now?.());
  }, { once: true });

  let largestContentfulPaint = 0;
  let largestContentfulPaintObserver = null;
  if (typeof window.PerformanceObserver === "function") {
    try {
      largestContentfulPaintObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1];
        if (latest) largestContentfulPaint = latest.startTime;
      });
      largestContentfulPaintObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      largestContentfulPaintObserver = null;
    }
  }
  const reportLargestContentfulPaint = () => {
    if (!largestContentfulPaint) return;
    recordPerformance("largest_contentful_paint_ms", largestContentfulPaint);
    largestContentfulPaintObserver?.disconnect();
  };

  document.addEventListener("click", (event) => {
    const target = event.target?.closest?.("[data-analytics-id]");
    if (!target) return;
    const elementKey = target.dataset.analyticsId;
    const destinationKey = target.dataset.analyticsDestination;
    if (target.dataset.analyticsChannel) {
      track("contact_click", {
        channel: target.dataset.analyticsChannel,
        destinationKey: destinationKey || target.dataset.analyticsChannel
      }, { elementKey });
      return;
    }
    track("cta_click", {
      ctaId: elementKey,
      destinationKey
    }, { elementKey });
  });

  window.addEventListener("pageshow", (event) => {
    track("page_view", {
      navigationType: navigationType(),
      referrerClass: referrerClass(),
      bfcache: Boolean(event.persisted)
    });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      reportLargestContentfulPaint();
      flush({ beacon: true });
    }
  });
  window.addEventListener("pagehide", () => {
    reportLargestContentfulPaint();
    flush({ beacon: true });
  });
  scheduleFlush();
}());
