import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import worker from "../dist/server/index.js";

if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

const originalFetch = globalThis.fetch;
const calls = [];
const assetPaths = [];
const baseEnvironment = {
  SHELTON_OFFICE_BASE_URL: "https://office.example/",
  SHELTON_OFFICE_BYPASS_TOKEN: "private-bypass-token",
  SHELTON_PUBLIC_PROXY_SECRET: "private-proxy-secret",
  ASSETS: {
    async fetch(request) {
      const pathname = new URL(request.url).pathname;
      assetPaths.push(pathname);
      return pathname === "/index.html" || pathname === "/about.html"
        ? new Response("asset", { status: 200 })
        : new Response("missing", { status: 404 });
    }
  }
};

const request = (path, options = {}) => worker.fetch(new Request(`https://sheltonlinen.com${path}`, options), baseEnvironment);

try {
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("commercial-leads")) {
      return new Response(JSON.stringify({
        schemaVersion: "public-commercial-lead.v2",
        reviewId: "review-1",
        status: "inbound_review",
        internalQueue: "must-not-reach-the-browser"
      }), { status: 201 });
    }
    return new Response(JSON.stringify({
      schemaVersion: "commercial-estimator.v3",
      estimateToken: "signed-estimate",
      debugTrace: "must-not-reach-the-browser",
      estimate: {
        modelVersion: "commercial-estimator.v2.4",
        requiresReview: false,
        reviewMessages: [],
        unresolvedFactors: ["Confirm storage access"],
        dominantUncertainty: "Storage access",
        confidence: { label: "Directional", score: 76 },
        sizing: { weeklyPounds: 1250, driver: "internal detail" },
        route: { label: "Two weekly commercial stops", remoteReview: false, internalZone: "A" },
        pricing: {
          weeklyRange: { low: 1000, base: 1100, high: 1200 },
          unitPrices: [{ label: "Customer-owned linen", billingUnit: "pound", recommendedRate: 0.88, weeklyUnits: 1250, internalFloor: 0.7 }]
        },
        rental: []
      }
    }), { status: 200 });
  };

  const estimate = await request("/api/commercial-estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.8" },
    body: JSON.stringify({ estimate: { operation: "hotel" } })
  });
  assert.equal(estimate.status, 200);
  assert.equal(estimate.headers.get("cache-control"), "no-store");
  const estimateBody = await estimate.json();
  assert.equal(estimateBody.schemaVersion, "commercial-estimator.v3");
  assert.equal(estimateBody.estimate.modelVersion, "commercial-estimator.v2.4");
  assert.equal(estimateBody.debugTrace, undefined);
  assert.equal(estimateBody.estimate.route.internalZone, undefined);
  assert.equal(estimateBody.estimate.pricing.unitPrices[0].internalFloor, undefined);
  assert.match(calls.at(-1).options.headers["x-shelton-client-fingerprint"], /^[a-f0-9]{64}$/);
  assert.equal(calls.at(-1).options.headers["OAI-Sites-Authorization"], "Bearer private-bypass-token");

  const lead = await request("/api/commercial-leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": "lead-key" },
    body: JSON.stringify({ contact: { email: "qa@example.com" } })
  });
  assert.equal(lead.status, 201);
  assert.deepEqual(await lead.json(), {
    accepted: true,
    schemaVersion: "public-commercial-lead.v2",
    reviewId: "review-1",
    status: "inbound_review"
  });
  assert.equal(calls.at(-1).options.headers["Idempotency-Key"], "lead-key");

  const options = await request("/api/commercial-estimate", { method: "OPTIONS" });
  assert.equal(options.status, 204);
  assert.equal(options.headers.get("allow"), "POST, OPTIONS");

  const wrongMethod = await request("/api/commercial-estimate", { method: "GET" });
  assert.equal(wrongMethod.status, 405);

  const unconfigured = await worker.fetch(
    new Request("https://sheltonlinen.com/api/commercial-estimate", { method: "POST", body: "{}" }),
    { ASSETS: baseEnvironment.ASSETS }
  );
  assert.equal(unconfigured.status, 503);
  assert.equal((await unconfigured.json()).code, "estimator_not_configured");

  const malformed = await request("/api/commercial-estimate", { method: "POST", body: "not-json" });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, "invalid_json");

  const tooLarge = await request("/api/commercial-estimate", {
    method: "POST",
    headers: { "Content-Length": "1000001" },
    body: "{}"
  });
  assert.equal(tooLarge.status, 413);

  globalThis.fetch = async () => new Response(JSON.stringify({
    schemaVersion: "commercial-estimator.v3",
    estimate: { modelVersion: "commercial-estimator.v2.4", grossMargin: 35 }
  }), { status: 200 });
  const unsafe = await request("/api/commercial-estimate", { method: "POST", body: "{}" });
  assert.equal(unsafe.status, 502);
  const unsafeText = await unsafe.text();
  assert.doesNotMatch(unsafeText, /grossMargin|35|private-/);

  const timeoutEnvironment = { ...baseEnvironment, SHELTON_OFFICE_TIMEOUT_MS: "20" };
  globalThis.fetch = async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })), { once: true });
  });
  const timeout = await worker.fetch(
    new Request("https://sheltonlinen.com/api/commercial-estimate", { method: "POST", body: "{}" }),
    timeoutEnvironment
  );
  assert.equal(timeout.status, 504);
  assert.equal((await timeout.json()).code, "estimator_timeout");

  const home = await request("/");
  assert.equal(home.status, 200);
  assert.equal(assetPaths.at(-1), "/index.html");

  const about = await request("/about");
  assert.equal(about.status, 200);
  assert.deepEqual(assetPaths.slice(-2), ["/about", "/about.html"]);

  console.log("Sites worker API routes verified: routing, allowlists, idempotency, timeout, and static fallback.");
} finally {
  globalThis.fetch = originalFetch;
}
