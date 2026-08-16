const assert = require("node:assert/strict");

const estimateHandler = require("../api/commercial-estimate");
const leadHandler = require("../api/commercial-leads");
const { visitorFingerprint } = require("../server/office-client");

function invoke(handler, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const responseHeaders = new Map();
    const response = {
      statusCode: 200,
      setHeader(name, value) { responseHeaders.set(String(name).toLowerCase(), String(value)); },
      end(payload = "") {
        try {
          resolve({
            status: this.statusCode,
            headers: responseHeaders,
            text: String(payload),
            body: payload ? JSON.parse(String(payload)) : {}
          });
        } catch (error) { reject(error); }
      }
    };
    Promise.resolve(handler({ method, body, headers, socket: { remoteAddress: "127.0.0.1" } }, response)).catch(reject);
  });
}

async function main() {
  const originalFetch = global.fetch;
  const originalEnvironment = {
    SHELTON_OFFICE_BASE_URL: process.env.SHELTON_OFFICE_BASE_URL,
    SHELTON_OFFICE_BYPASS_TOKEN: process.env.SHELTON_OFFICE_BYPASS_TOKEN,
    SHELTON_PUBLIC_PROXY_SECRET: process.env.SHELTON_PUBLIC_PROXY_SECRET,
    SHELTON_OFFICE_TIMEOUT_MS: process.env.SHELTON_OFFICE_TIMEOUT_MS
  };
  const calls = [];
  Object.assign(process.env, {
    SHELTON_OFFICE_BASE_URL: "https://office.example/",
    SHELTON_OFFICE_BYPASS_TOKEN: "private-bypass-must-not-leak",
    SHELTON_PUBLIC_PROXY_SECRET: "private-proxy-secret-must-not-leak"
  });
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("commercial-leads")) {
      return new Response(JSON.stringify({ schemaVersion: "public-commercial-lead.v2", reviewId: "review-1" }), { status: 201 });
    }
    return new Response(JSON.stringify({
      schemaVersion: "commercial-estimator.v3",
      estimateToken: "signed-token",
      estimate: {
        modelVersion: "commercial-estimator.v2.4",
        debugTrace: "must-not-reach-the-browser",
        confidence: { label: "Directional" },
        sizing: { weeklyPounds: 1250 },
        route: { label: "Two weekly commercial stops", remoteReview: false },
        pricing: {
          weeklyRange: { low: 1000, base: 1100, high: 1200 },
          unitPrices: [{ label: "Customer-owned linen", billingUnit: "pound", recommendedRate: 0.88, weeklyUnits: 1250 }]
        }
      }
    }), { status: 200 });
  };

  try {
    const requestHeaders = { "x-forwarded-for": "203.0.113.8, 10.0.0.1" };
    const estimate = await invoke(estimateHandler, "POST", { estimate: { schemaVersion: "commercial-estimator.v3", operation: "hotel" } }, requestHeaders);
    assert.equal(estimate.status, 200);
    assert.equal(estimate.body.estimate.modelVersion, "commercial-estimator.v2.4");
    assert.equal(estimate.body.estimate.debugTrace, undefined);
    assert.equal(estimate.headers.get("cache-control"), "no-store");
    const estimateCall = calls.at(-1);
    assert.equal(estimateCall.url, "https://office.example/api/public/commercial-estimate");
    assert.equal(estimateCall.options.headers["OAI-Sites-Authorization"], "Bearer private-bypass-must-not-leak");
    assert.equal(estimateCall.options.headers["x-shelton-proxy-secret"], "private-proxy-secret-must-not-leak");
    assert.match(estimateCall.options.headers["x-shelton-client-fingerprint"], /^[a-f0-9]{64}$/);
    assert.equal(estimateCall.options.headers.Origin, undefined);

    assert.equal(
      visitorFingerprint({ headers: requestHeaders }, process.env.SHELTON_PUBLIC_PROXY_SECRET),
      estimateCall.options.headers["x-shelton-client-fingerprint"]
    );
    assert.notEqual(
      visitorFingerprint({ headers: { "x-forwarded-for": "203.0.113.9" } }, process.env.SHELTON_PUBLIC_PROXY_SECRET),
      estimateCall.options.headers["x-shelton-client-fingerprint"]
    );

    const lead = await invoke(
      leadHandler,
      "POST",
      { estimateToken: "signed-token", idempotencyKey: "lead-key", contact: { email: "qa@example.com" } },
      { ...requestHeaders, "idempotency-key": "lead-key" }
    );
    assert.equal(lead.status, 201);
    assert.equal(calls.at(-1).url, "https://office.example/api/public/commercial-leads");
    assert.equal(calls.at(-1).options.headers["Idempotency-Key"], "lead-key");

    global.fetch = async () => new Response(JSON.stringify({
      estimate: { modelVersion: "commercial-estimator.v2.4", economics: { marginPercent: 25 } }
    }), { status: 200 });
    const unsafe = await invoke(estimateHandler, "POST", { estimate: { schemaVersion: "commercial-estimator.v3", operation: "hotel" } }, requestHeaders);
    assert.equal(unsafe.status, 502);
    assert.equal(unsafe.body.code, "unsafe_estimator_response");
    assert.doesNotMatch(unsafe.text, /economics|marginPercent|private-bypass|private-proxy/i);

    global.fetch = async () => new Response(JSON.stringify({
      schemaVersion: "commercial-estimator.v3",
      estimate: { modelVersion: "commercial-estimator.v2.4", totalCost: 900 }
    }), { status: 200 });
    const compoundUnsafe = await invoke(estimateHandler, "POST", { estimate: { operation: "hotel" } }, requestHeaders);
    assert.equal(compoundUnsafe.status, 502);
    assert.equal(compoundUnsafe.body.code, "unsafe_estimator_response");
    assert.doesNotMatch(compoundUnsafe.text, /totalCost|900/);

    process.env.SHELTON_OFFICE_TIMEOUT_MS = "20";
    global.fetch = async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })), { once: true });
    });
    const timeout = await invoke(estimateHandler, "POST", { estimate: { operation: "hotel" } }, requestHeaders);
    assert.equal(timeout.status, 504);
    assert.equal(timeout.body.code, "estimator_timeout");

    const wrongMethod = await invoke(estimateHandler, "GET");
    assert.equal(wrongMethod.status, 405);
    assert.equal(wrongMethod.headers.get("allow"), "POST, OPTIONS");
  } finally {
    global.fetch = originalFetch;
    for (const [key, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }

  console.log("Website Office proxies verified: fixed routes, visitor fingerprinting, idempotency, V2.4, and leakage rejection.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
