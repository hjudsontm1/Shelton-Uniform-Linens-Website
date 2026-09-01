import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const baseUrl = String(process.env.SHELTON_PRODUCTION_URL || "").replace(/\/$/, "");
const bypassToken = String(process.env.SHELTON_SITE_BYPASS_TOKEN || "");
const qaEmail = String(process.env.SHELTON_QA_EMAIL || "info@sheltonlinenanduniform.com");
const publicOrigin = String(process.env.SHELTON_PUBLIC_ORIGIN || "https://sheltonlinen.com").replace(/\/$/, "");
assert.ok(baseUrl.startsWith("https://"), "SHELTON_PRODUCTION_URL must be HTTPS");
assert.ok(publicOrigin.startsWith("https://"), "SHELTON_PUBLIC_ORIGIN must be HTTPS");

const headers = {
  "Content-Type": "application/json",
  Origin: publicOrigin,
  ...(bypassToken ? { "OAI-Sites-Authorization": `Bearer ${bypassToken}` } : {})
};
const estimateInput = {
  schemaVersion: "commercial-estimator.v3",
  operation: "hotel",
  accountName: "Shelton Internal Launch QA",
  selectedGoods: [{ id: "sheets" }, { id: "towels" }, { id: "robes", weeklyPieces: 40 }],
  volume: {
    evidence: "business_proxy",
    rooms: 100,
    occupancyPercent: 82,
    linenServicePercent: 90,
    bedSystem: "mixed",
    duvetPercent: 50
  },
  pattern: { seasonal: false },
  service: { storage: "limited", customSorting: false },
  route: { zip: "92101", access: "standard" },
  ownership: { model: "customer_owned" }
};

const estimateResponse = await fetch(`${baseUrl}/api/public/commercial-estimate`, {
  method: "POST",
  headers,
  body: JSON.stringify({ estimate: estimateInput })
});
const estimateBody = await estimateResponse.json();
assert.equal(estimateResponse.status, 200, JSON.stringify(estimateBody));
assert.equal(estimateBody.schemaVersion, "commercial-estimator.v3");
assert.equal(estimateBody.estimate?.modelVersion, "commercial-estimator.v2.4");
assert.ok(estimateBody.estimateToken, "production estimate returns a signed handoff token");
assert.equal(estimateResponse.headers.get("cache-control"), "no-store");

const idempotencyKey = `launch-verification-${new Date().toISOString().slice(0, 10)}-${randomUUID()}`;
const leadBody = {
  estimateToken: estimateBody.estimateToken,
  idempotencyKey,
  contact: {
    businessName: "Shelton Internal Launch QA",
    contactName: "Launch Verification",
    email: qaEmail,
    phone: null,
    preferredContact: "email",
    location: "92101",
    notes: "Synthetic pre-launch verification. Safe to archive after confirming durable intake."
  },
  journeySnapshot: {
    schemaVersion: "website-pricing-spine.v3",
    estimatorVersion: "commercial-estimator.v2.4",
    source: { host: new URL(baseUrl).host, page: "/pricing.html", campaign: "launch-verification" },
    operation: "hotel",
    operationLabel: "Hotel / Boutique Stay",
    goods: ["sheets", "towels", "robes"],
    specialtyNeeds: [],
    scale: { entryMode: "drivers", rooms: "100", occupancy: "75to89", bedSystem: "mixed", duvetPercent: "50", weeklyRobes: "40" },
    finish: ["Pressed and folded", "Professionally folded", "Pressed and returned on hangers"],
    ownership: "own",
    rental: { category: null, tier: null, quantity: null, par: null, customization: null },
    route: { location: "92101", requestedPickups: null, access: "standard" },
    publicRecommendation: {
      modelVersion: estimateBody.estimate.modelVersion,
      warning: estimateBody.estimate.requiresReview ? "REVIEW REQUIRED" : "COMMERCIAL PLANNING RANGE",
      range: estimateBody.estimate.pricing?.weeklyRange || null,
      rhythm: estimateBody.estimate.route || null,
      confidence: estimateBody.estimate.confidence || null
    }
  }
};

const submitLead = async () => {
  const response = await fetch(`${baseUrl}/api/public/commercial-leads`, {
    method: "POST",
    headers: { ...headers, "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(leadBody)
  });
  return { status: response.status, body: await response.json(), cacheControl: response.headers.get("cache-control") };
};

const firstLead = await submitLead();
const repeatedLead = await submitLead();
assert.ok([200, 201].includes(firstLead.status), JSON.stringify(firstLead.body));
assert.ok([200, 201].includes(repeatedLead.status), JSON.stringify(repeatedLead.body));
assert.equal(firstLead.body.accepted ?? firstLead.body.queuedForManagerReview, true);
assert.equal(repeatedLead.body.accepted ?? repeatedLead.body.queuedForManagerReview, true);
assert.ok(firstLead.body.reviewId, "durable handoff returns a review ID");
assert.equal(repeatedLead.body.reviewId, firstLead.body.reviewId, "retry resolves to the same durable record");
assert.equal(firstLead.cacheControl, "no-store");
assert.equal(repeatedLead.cacheControl, "no-store");

console.log(JSON.stringify({
  productionHost: new URL(baseUrl).host,
  estimateStatus: estimateResponse.status,
  schemaVersion: estimateBody.schemaVersion,
  modelVersion: estimateBody.estimate.modelVersion,
  leadStatus: firstLead.status,
  retryStatus: repeatedLead.status,
  reviewId: firstLead.body.reviewId,
  idempotent: repeatedLead.body.reviewId === firstLead.body.reviewId
}));
