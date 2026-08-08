const crypto = require("node:crypto");

const MAX_REQUEST_BYTES = 1_000_000;
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
  return Object.entries(value).some(([key, child]) =>
    FORBIDDEN_RESPONSE_KEYS.has(key.replace(/[^a-z]/gi, "").toLowerCase()) || containsForbiddenData(child, seen)
  );
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
      redirect: "error"
    });
  } catch {
    throw proxyError(502, "estimator_unavailable", "The planning estimator could not be reached.");
  }

  const text = await upstream.text();
  let responseBody;
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch {
    throw proxyError(502, "invalid_estimator_response", "The planning estimator returned an unreadable response.");
  }
  if (containsForbiddenData(responseBody)) {
    throw proxyError(502, "unsafe_estimator_response", "The planning estimator response was rejected.");
  }
  return { status: upstream.status, body: responseBody };
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
  sendError,
  sendJson,
  visitorFingerprint
};
