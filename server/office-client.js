const crypto = require("node:crypto");

const MAX_REQUEST_BYTES = 1_000_000;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 8_000;
const FORBIDDEN_RESPONSE_KEYS = new Set([
  "assumptions",
  "cost",
  "costlines",
  "costs",
  "economics",
  "landedcost",
  "loadedlabor",
  "margin",
  "marginpercent",
  "productivelabor",
  "wage",
  "wages"
]);
const FORBIDDEN_RESPONSE_KEY_PARTS = ["assumption", "cost", "economics", "labor", "margin", "wage"];

function headerValue(request, name) {
  if (typeof request.headers?.get === "function") return request.headers.get(name);
  const found = Object.entries(request.headers || {}).find(([key]) => key.toLowerCase() === name.toLowerCase());
  const value = found?.[1];
  return Array.isArray(value) ? value[0] : value;
}

function configuredOffice() {
  const baseUrl = String(process.env.SHELTON_OFFICE_BASE_URL || "").trim().replace(/\/$/, "");
  const bypassToken = String(process.env.SHELTON_OFFICE_BYPASS_TOKEN || "").trim();
  const proxySecret = String(process.env.SHELTON_PUBLIC_PROXY_SECRET || "").trim();
  return { baseUrl, bypassToken, proxySecret, ready: Boolean(baseUrl && bypassToken && proxySecret) };
}

function proxyError(status, code, message) {
  return Object.assign(new Error(message), { status, code });
}

async function readRequestJson(request) {
  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) return request.body;
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > MAX_REQUEST_BYTES) {
      throw proxyError(413, "request_too_large", "The request is too large.");
    }
  }
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw proxyError(400, "invalid_json", "A valid JSON request is required.");
  }
}

function visitorFingerprint(request, proxySecret) {
  const address = String(
    headerValue(request, "x-vercel-forwarded-for") ||
    headerValue(request, "x-forwarded-for") ||
    headerValue(request, "cf-connecting-ip") ||
    request.socket?.remoteAddress ||
    "unknown"
  ).split(",")[0].trim();
  return crypto.createHmac("sha256", proxySecret).update(address).digest("hex");
}

function containsForbiddenData(value, seen = new Set()) {
  if (!value || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.some((item) => containsForbiddenData(item, seen));
  return Object.entries(value).some(([key, child]) => {
    const normalizedKey = key.replace(/[^a-z]/gi, "").toLowerCase();
    return FORBIDDEN_RESPONSE_KEYS.has(normalizedKey)
      || FORBIDDEN_RESPONSE_KEY_PARTS.some((part) => normalizedKey.includes(part))
      || containsForbiddenData(child, seen);
  });
}

function safeString(value, maxLength = 240) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function safeStringList(value, maxItems = 20) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => safeString(item, 300)).filter(Boolean);
}

function normalizeEstimateResponse(value) {
  if (!value || value.schemaVersion !== "commercial-estimator.v3" || !value.estimate) return null;
  const source = value.estimate;
  if (source.modelVersion !== "commercial-estimator.v2.4") return null;

  const estimate = {
    modelVersion: source.modelVersion,
    requiresReview: Boolean(source.requiresReview),
    reviewMessages: safeStringList(source.reviewMessages),
    unresolvedFactors: safeStringList(source.unresolvedFactors)
  };
  const dominantUncertainty = safeString(source.dominantUncertainty, 300);
  if (dominantUncertainty) estimate.dominantUncertainty = dominantUncertainty;

  if (source.pricing) {
    const weeklyRange = source.pricing.weeklyRange || {};
    const low = safeNumber(weeklyRange.low);
    const base = safeNumber(weeklyRange.base);
    const high = safeNumber(weeklyRange.high);
    const weeklyPounds = safeNumber(source.sizing?.weeklyPounds);
    const routeLabel = safeString(source.route?.label, 200);
    const confidenceLabel = safeString(source.confidence?.label, 100);
    if ([low, base, high, weeklyPounds].some((item) => item === undefined) || !routeLabel || !confidenceLabel) return null;

    estimate.pricing = {
      weeklyRange: { low, base, high },
      unitPrices: Array.isArray(source.pricing.unitPrices)
        ? source.pricing.unitPrices.slice(0, 40).map((line) => {
          const label = safeString(line?.label, 160);
          const billingUnit = safeString(line?.billingUnit, 60);
          const recommendedRate = safeNumber(line?.recommendedRate);
          const weeklyUnits = safeNumber(line?.weeklyUnits);
          if (!label || !billingUnit || recommendedRate === undefined || weeklyUnits === undefined) return null;
          return { label, billingUnit, recommendedRate, weeklyUnits };
        }).filter(Boolean)
        : []
    };
    estimate.sizing = { weeklyPounds };
    estimate.route = { label: routeLabel, remoteReview: Boolean(source.route?.remoteReview) };
    estimate.confidence = { label: confidenceLabel };
  }

  estimate.rental = Array.isArray(source.rental)
    ? source.rental.slice(0, 20).map((item) => {
      const category = safeString(item?.category, 100);
      const tier = safeString(item?.tier, 100);
      const quantity = safeNumber(item?.quantity);
      const weeklyRatePerItem = safeNumber(item?.weeklyRatePerItem);
      const weeklyCharge = safeNumber(item?.weeklyCharge);
      if (!category || !tier || [quantity, weeklyRatePerItem, weeklyCharge].some((entry) => entry === undefined)) return null;
      return { category, tier, quantity, weeklyRatePerItem, weeklyCharge, requiresManagementReview: Boolean(item?.requiresManagementReview) };
    }).filter(Boolean)
    : [];

  const normalized = { schemaVersion: value.schemaVersion, estimate };
  const estimateToken = safeString(value.estimateToken, 2_000);
  if (estimateToken) normalized.estimateToken = estimateToken;
  return normalized;
}

function normalizeLeadResponse(value) {
  const normalized = { accepted: true };
  const schemaVersion = safeString(value?.schemaVersion, 100);
  const reviewId = safeString(value?.reviewId, 200);
  const status = safeString(value?.status, 100);
  if (schemaVersion) normalized.schemaVersion = schemaVersion;
  if (reviewId) normalized.reviewId = reviewId;
  if (status) normalized.status = status;
  return normalized;
}

function normalizeErrorResponse(value, status) {
  const upstreamCode = safeString(value?.code, 100);
  const upstreamMessage = safeString(value?.error, 300);
  return {
    error: status >= 500 ? "The planning estimator is temporarily unavailable." : upstreamMessage || "The request could not be processed.",
    code: upstreamCode && /^[a-z0-9_.-]+$/i.test(upstreamCode) ? upstreamCode : "upstream_request_failed"
  };
}

function upstreamTimeoutMs() {
  const configured = Number.parseInt(process.env.SHELTON_OFFICE_TIMEOUT_MS || "", 10);
  return Number.isFinite(configured) && configured > 0 && configured <= 30_000
    ? configured
    : DEFAULT_UPSTREAM_TIMEOUT_MS;
}

async function requestPublicOffice(request, path, body, extraHeaders = {}) {
  const office = configuredOffice();
  if (!office.ready) {
    throw proxyError(503, "estimator_not_configured", "The planning estimator is temporarily unavailable.");
  }
  if (!["/api/public/commercial-estimate", "/api/public/commercial-leads"].includes(path)) {
    throw proxyError(500, "office_route_invalid", "The estimator route is invalid.");
  }

  let upstream;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), upstreamTimeoutMs());
  try {
    upstream = await fetch(`${office.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "OAI-Sites-Authorization": `Bearer ${office.bypassToken}`,
        "x-shelton-proxy-secret": office.proxySecret,
        "x-shelton-client-fingerprint": visitorFingerprint(request, office.proxySecret),
        ...extraHeaders
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      redirect: "error"
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw proxyError(504, "estimator_timeout", "The planning estimator took too long to respond.");
    }
    throw proxyError(502, "estimator_unavailable", "The planning estimator could not be reached.");
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await upstream.text();
  let responseBody;
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch {
    throw proxyError(502, "invalid_estimator_response", "The planning estimator returned an unreadable response.");
  }
  if (!upstream.ok) {
    return { status: upstream.status, body: normalizeErrorResponse(responseBody, upstream.status) };
  }
  if (containsForbiddenData(responseBody)) {
    throw proxyError(502, "unsafe_estimator_response", "The planning estimator response was rejected.");
  }
  const normalized = path === "/api/public/commercial-estimate"
    ? normalizeEstimateResponse(responseBody)
    : normalizeLeadResponse(responseBody);
  if (!normalized) {
    throw proxyError(502, "invalid_estimator_response", "The planning estimator returned an invalid response.");
  }
  return { status: upstream.status, body: normalized };
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

function sendError(response, error) {
  const status = Number(error?.status) || 502;
  const safeMessage = status < 500 || error?.code === "estimator_not_configured"
    ? error.message
    : "The planning estimator is temporarily unavailable.";
  sendJson(response, status, { error: safeMessage, code: error?.code || "estimator_unavailable" });
}

module.exports = {
  configuredOffice,
  headerValue,
  readRequestJson,
  requestPublicOffice,
  normalizeEstimateResponse,
  normalizeLeadResponse,
  sendError,
  sendJson,
  visitorFingerprint
};
