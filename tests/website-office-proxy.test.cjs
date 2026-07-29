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
    SHELTON_PUBLIC_PROXY_SECRET: process.env.SHELTON_PUBLIC_PROXY_SECRET
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
      schemaVersion: "public-commercial-estimator.v2",
      estimateToken: "signed-token",
      estimate: {
        modelVersion: "commercial-estimator.v2.3",
        pricing: { weeklyRange: { low: 1000, high: 1200 } }
      }
    }), { status: 200 });
  };

  try {
    const requestHeaders = { "x-forwarded-for": "203.0.113.8, 10.0.0.1" };
    const estimate = await invoke(estimateHandler, "POST", { estimate: { lane: "hotel" } }, requestHeaders);
    assert.equal(estimate.status, 200);
    assert.equal(estimate.body.estimate.modelVersion, "commercial-estimator.v2.3");
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
      estimate: { modelVersion: "commercial-estimator.v2.3", economics: { marginPercent: 25 } }
    }), { status: 200 });
    const unsafe = await invoke(estimateHandler, "POST", { estimate: { lane: "hotel" } }, requestHeaders);
    assert.equal(unsafe.status, 502);
    assert.equal(unsafe.body.code, "unsafe_estimator_response");
    assert.doesNotMatch(unsafe.text, /economics|marginPercent|private-bypass|private-proxy/i);

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

  console.log("Website Office proxies verified: fixed routes, visitor fingerprinting, idempotency, V2.3, and leakage rejection.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
