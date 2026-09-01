import assert from "node:assert/strict";
import test from "node:test";

import worker from "../dist/server/index.js";

const SITE_ORIGIN = "https://sheltonlinen.com";
const OFFICE_ORIGIN = "https://office.example.test";
const BATCH_ID = "1707b5d8-ec83-4df7-a5b9-6d65029a6f83";
const SESSION_ID = "8ab1f897-e65f-4289-836d-ef92679a347e";
const EVENT_ID = "d23cb2e4-8ca3-4f53-a949-24d64705fc5c";

const env = {
  ASSETS: { fetch: async () => new Response("asset") },
  SHELTON_OFFICE_BASE_URL: OFFICE_ORIGIN,
  SHELTON_OFFICE_BYPASS_TOKEN: "trusted-bypass-token",
  SHELTON_PUBLIC_PROXY_SECRET: "trusted-public-proxy-secret"
};

const analyticsBatch = (overrides = {}) => {
  const now = new Date();
  return {
    schemaVersion: "website-analytics.v1",
    batchId: BATCH_ID,
    sessionId: SESSION_ID,
    sentAt: now.toISOString(),
    events: [
      {
        eventId: EVENT_ID,
        name: "estimator_range_viewed",
        occurredAt: now.toISOString(),
        pageKey: "pricing",
        pagePath: "/pricing?email=private@example.test#factor-route",
        viewport: "compact",
        elementKey: " pricing.range ",
        estimatorStep: " range ",
        properties: {
          stage: " range ",
          confidence: " high ",
          evidence: " measured_pounds "
        },
        ignoredEventField: "not-forwarded"
      }
    ],
    ignoredBatchField: "not-forwarded",
    ...overrides
  };
};

const analyticsRequest = (body = analyticsBatch(), options = {}) => {
  const method = options.method || "POST";
  const headers = new Headers(options.headers || {});
  if (options.origin !== null) headers.set("Origin", options.origin || SITE_ORIGIN);
  if (method === "POST" && options.contentType !== null) {
    headers.set("Content-Type", options.contentType || "application/json");
  }
  headers.set("CF-Connecting-IP", "203.0.113.42");
  return new Request(`${SITE_ORIGIN}/api/website-events`, {
    method,
    headers,
    body: method === "POST" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined
  });
};

const readJson = async (response) => JSON.parse(await response.text());

test("website analytics forwards only the Office contract through the trusted proxy", async () => {
  const originalFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return new Response(JSON.stringify({
      schemaVersion: "website-analytics.v1",
      accepted: 1,
      duplicates: 0,
      rejected: 0,
      internalSecret: "must-not-leak"
    }), { status: 202, headers: { "Content-Type": "application/json" } });
  };

  try {
    const response = await worker.fetch(analyticsRequest(), env);
    assert.equal(response.status, 202);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("vary"), "Origin");
    assert.deepEqual(await readJson(response), {
      schemaVersion: "website-analytics.v1",
      accepted: 1,
      duplicates: 0,
      rejected: 0
    });

    assert.equal(captured.url, `${OFFICE_ORIGIN}/api/public/website-events`);
    assert.equal(captured.options.method, "POST");
    assert.equal(captured.options.redirect, "manual");
    const headers = new Headers(captured.options.headers);
    assert.equal(headers.get("oai-sites-authorization"), "Bearer trusted-bypass-token");
    assert.equal(headers.get("x-shelton-proxy-secret"), "trusted-public-proxy-secret");
    assert.match(headers.get("x-shelton-client-fingerprint"), /^[a-f0-9]{64}$/);

    const forwarded = JSON.parse(captured.options.body);
    assert.deepEqual(Object.keys(forwarded), ["schemaVersion", "batchId", "sessionId", "sentAt", "events"]);
    assert.deepEqual(forwarded.events[0], {
      eventId: EVENT_ID,
      name: "estimator_range_viewed",
      occurredAt: forwarded.events[0].occurredAt,
      pageKey: "pricing",
      pagePath: "/pricing",
      viewport: "compact",
      elementKey: "pricing.range",
      estimatorStep: "range",
      properties: { stage: "range", confidence: "high", evidence: "measured_pounds" }
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("website analytics is same-origin POST/OPTIONS only", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("upstream must not be called");
  };

  try {
    const crossOrigin = await worker.fetch(
      analyticsRequest(analyticsBatch(), { origin: "https://attacker.example" }),
      env
    );
    assert.equal(crossOrigin.status, 403);
    assert.equal((await readJson(crossOrigin)).code, "origin_not_allowed");
    assert.equal(crossOrigin.headers.get("cache-control"), "no-store");

    const missingOrigin = await worker.fetch(
      analyticsRequest(analyticsBatch(), { origin: null }),
      env
    );
    assert.equal(missingOrigin.status, 403);
    assert.equal((await readJson(missingOrigin)).code, "origin_not_allowed");

    const options = await worker.fetch(
      analyticsRequest(null, { method: "OPTIONS" }),
      env
    );
    assert.equal(options.status, 204);
    assert.equal(options.headers.get("allow"), "POST, OPTIONS");
    assert.equal(options.headers.get("cache-control"), "no-store");
    assert.equal(options.headers.get("access-control-allow-origin"), null);

    const get = await worker.fetch(
      analyticsRequest(null, { method: "GET" }),
      env
    );
    assert.equal(get.status, 405);
    assert.equal((await readJson(get)).code, "method_not_allowed");
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("website analytics accepts the published manual-only estimator operations", async () => {
  const originalFetch = globalThis.fetch;
  const forwardedOperations = [];
  globalThis.fetch = async (_url, options) => {
    forwardedOperations.push(JSON.parse(options.body).events[0].properties.operation);
    return new Response(JSON.stringify({
      schemaVersion: "website-analytics.v1",
      accepted: 1,
      duplicates: 0,
      rejected: 0
    }), { status: 202, headers: { "Content-Type": "application/json" } });
  };

  try {
    for (const operation of ["other", "wholesale"]) {
      const event = analyticsBatch().events[0];
      const response = await worker.fetch(
        analyticsRequest(analyticsBatch({
          events: [{
            ...event,
            name: "estimator_operation_selected",
            properties: { operation, stage: "selected" }
          }]
        })),
        env
      );
      assert.equal(response.status, 202);
    }
    assert.deepEqual(forwardedOperations, ["other", "wholesale"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("website analytics enforces content type, 32KB, 20-event, and allowlist limits", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("upstream must not be called");
  };

  try {
    const wrongType = await worker.fetch(
      analyticsRequest(analyticsBatch(), { contentType: "text/plain" }),
      env
    );
    assert.equal(wrongType.status, 415);
    assert.equal((await readJson(wrongType)).code, "unsupported_media_type");

    const oversized = await worker.fetch(
      analyticsRequest(JSON.stringify({ padding: "x".repeat(32 * 1024) })),
      env
    );
    assert.equal(oversized.status, 413);
    assert.equal((await readJson(oversized)).code, "request_too_large");

    const event = analyticsBatch().events[0];
    const tooManyEvents = await worker.fetch(
      analyticsRequest(analyticsBatch({ events: Array.from({ length: 21 }, () => event) })),
      env
    );
    assert.equal(tooManyEvents.status, 400);
    assert.equal((await readJson(tooManyEvents)).code, "validation_error");

    const disallowedProperty = await worker.fetch(
      analyticsRequest(analyticsBatch({
        events: [{ ...event, properties: { privateEmail: "private@example.test" } }]
      })),
      env
    );
    assert.equal(disallowedProperty.status, 400);
    assert.equal((await readJson(disallowedProperty)).code, "validation_error");

    const disallowedEvent = await worker.fetch(
      analyticsRequest(analyticsBatch({ events: [{ ...event, name: "arbitrary_event" }] })),
      env
    );
    assert.equal(disallowedEvent.status, 400);
    assert.equal((await readJson(disallowedEvent)).code, "validation_error");

    const wrongEventProperty = await worker.fetch(
      analyticsRequest(analyticsBatch({
        events: [{ ...event, properties: { bfcache: false } }]
      })),
      env
    );
    assert.equal(wrongEventProperty.status, 400);
    assert.equal((await readJson(wrongEventProperty)).code, "validation_error");

    const wrongPropertyType = await worker.fetch(
      analyticsRequest(analyticsBatch({
        events: [{ ...event, properties: { confidence: true } }]
      })),
      env
    );
    assert.equal(wrongPropertyType.status, 400);
    assert.equal((await readJson(wrongPropertyType)).code, "validation_error");
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("website analytics uses a fixed three-second upstream timeout", async () => {
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  const originalConsoleError = console.error;
  let observedDelay;

  globalThis.setTimeout = (callback, delay) => {
    observedDelay = delay;
    queueMicrotask(callback);
    return 1;
  };
  globalThis.fetch = async (_url, options) => {
    const aborted = Object.assign(new Error("aborted"), { name: "AbortError" });
    if (options.signal.aborted) throw aborted;
    return new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(aborted), { once: true });
    });
  };
  console.error = () => {};

  try {
    const response = await worker.fetch(analyticsRequest(), {
      ...env,
      SHELTON_OFFICE_TIMEOUT_MS: "30000"
    });
    assert.equal(observedDelay, 3_000);
    assert.equal(response.status, 504);
    assert.deepEqual(await readJson(response), {
      error: "Website measurement is temporarily unavailable.",
      code: "analytics_timeout"
    });
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
    console.error = originalConsoleError;
  }
});
