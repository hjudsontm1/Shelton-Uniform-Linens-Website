const API_ROUTES = new Map([
  ["/api/commercial-estimate", "/api/public/commercial-estimate"],
  ["/api/commercial-leads", "/api/public/commercial-leads"]
]);
const MAX_REQUEST_BYTES = 1_000_000;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 8_000;
const FORBIDDEN_RESPONSE_KEY_PARTS = ["assumption", "cost", "economics", "labor", "margin", "wage"];
const PRIMARY_HOST = "sheltonlinen.com";
const REDIRECT_HOSTS = new Set([
  "www.sheltonlinen.com",
  "sheltonlinenanduniform.com",
  "www.sheltonlinenanduniform.com"
]);
const encoder = new TextEncoder();

const safeString = (value, maxLength = 240) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
};

const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const safeStringList = (value, maxItems = 20) => Array.isArray(value)
  ? value.slice(0, maxItems).map((item) => safeString(item, 300)).filter(Boolean)
  : [];

const jsonResponse = (status, body, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders
  }
});

const workerError = (status, code, message) => Object.assign(new Error(message), { status, code });

const containsForbiddenData = (value, seen = new Set()) => {
  if (!value || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.some((item) => containsForbiddenData(item, seen));
  return Object.entries(value).some(([key, child]) => {
    const normalizedKey = key.replace(/[^a-z]/gi, "").toLowerCase();
    return FORBIDDEN_RESPONSE_KEY_PARTS.some((part) => normalizedKey.includes(part))
      || containsForbiddenData(child, seen);
  });
};

const normalizeEstimateResponse = (value) => {
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
};

const normalizeLeadResponse = (value) => {
  const normalized = { accepted: true };
  const schemaVersion = safeString(value?.schemaVersion, 100);
  const reviewId = safeString(value?.reviewId, 200);
  const status = safeString(value?.status, 100);
  if (schemaVersion) normalized.schemaVersion = schemaVersion;
  if (reviewId) normalized.reviewId = reviewId;
  if (status) normalized.status = status;
  return normalized;
};

const normalizeErrorResponse = (value, status) => {
  const upstreamCode = safeString(value?.code, 100);
  const upstreamMessage = safeString(value?.error, 300);
  return {
    error: status >= 500 ? "The planning estimator is temporarily unavailable." : upstreamMessage || "The request could not be processed.",
    code: upstreamCode && /^[a-z0-9_.-]+$/i.test(upstreamCode) ? upstreamCode : "upstream_request_failed"
  };
};

const configuredOffice = (env) => {
  const rawBaseUrl = safeString(env.SHELTON_OFFICE_BASE_URL, 2_000);
  const bypassToken = safeString(env.SHELTON_OFFICE_BYPASS_TOKEN, 4_000);
  const proxySecret = safeString(env.SHELTON_PUBLIC_PROXY_SECRET, 4_000);
  if (!rawBaseUrl || !bypassToken || !proxySecret) return null;
  try {
    const baseUrl = new URL(rawBaseUrl);
    if (baseUrl.protocol !== "https:" || baseUrl.username || baseUrl.password) return null;
    return { baseUrl: baseUrl.toString().replace(/\/$/, ""), bypassToken, proxySecret };
  } catch {
    return null;
  }
};

const upstreamTimeoutMs = (env) => {
  const configured = Number.parseInt(env.SHELTON_OFFICE_TIMEOUT_MS || "", 10);
  return Number.isFinite(configured) && configured > 0 && configured <= 30_000
    ? configured
    : DEFAULT_UPSTREAM_TIMEOUT_MS;
};

const readJsonRequest = async (request) => {
  const contentLength = Number.parseInt(request.headers.get("content-length") || "", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    throw workerError(413, "request_too_large", "The request is too large.");
  }
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_REQUEST_BYTES) {
    throw workerError(413, "request_too_large", "The request is too large.");
  }
  const raw = new TextDecoder().decode(bytes);
  if (!raw.trim()) return {};
  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("object required");
    return body;
  } catch {
    throw workerError(400, "invalid_json", "A valid JSON request is required.");
  }
};

const visitorFingerprint = async (request, proxySecret) => {
  const address = String(
    request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")
    || "unknown"
  ).split(",")[0].trim();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(proxySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(address));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const requestPublicOffice = async (request, env, upstreamPath, body, extraHeaders = {}) => {
  const office = configuredOffice(env);
  if (!office) throw workerError(503, "estimator_not_configured", "The planning estimator is temporarily unavailable.");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), upstreamTimeoutMs(env));
  let upstream;
  try {
    upstream = await fetch(`${office.baseUrl}${upstreamPath}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "OAI-Sites-Authorization": `Bearer ${office.bypassToken}`,
        "x-shelton-proxy-secret": office.proxySecret,
        "x-shelton-client-fingerprint": await visitorFingerprint(request, office.proxySecret),
        ...extraHeaders
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      redirect: "error"
    });
  } catch (error) {
    if (error?.name === "AbortError") throw workerError(504, "estimator_timeout", "The planning estimator took too long to respond.");
    throw workerError(502, "estimator_unavailable", "The planning estimator could not be reached.");
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await upstream.text();
  let responseBody;
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch {
    throw workerError(502, "invalid_estimator_response", "The planning estimator returned an unreadable response.");
  }
  if (!upstream.ok) return { status: upstream.status, body: normalizeErrorResponse(responseBody, upstream.status) };
  if (containsForbiddenData(responseBody)) {
    throw workerError(502, "unsafe_estimator_response", "The planning estimator response was rejected.");
  }
  const normalized = upstreamPath === "/api/public/commercial-estimate"
    ? normalizeEstimateResponse(responseBody)
    : normalizeLeadResponse(responseBody);
  if (!normalized) throw workerError(502, "invalid_estimator_response", "The planning estimator returned an invalid response.");
  return { status: upstream.status, body: normalized };
};

const handleApiRequest = async (request, env, upstreamPath) => {
  const method = request.method.toUpperCase();
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: "POST, OPTIONS", "Cache-Control": "no-store" } });
  if (method !== "POST") return jsonResponse(405, { error: "Method not allowed.", code: "method_not_allowed" }, { Allow: "POST, OPTIONS" });

  try {
    const body = await readJsonRequest(request);
    const idempotencyKey = upstreamPath === "/api/public/commercial-leads"
      ? safeString(request.headers.get("idempotency-key") || body.idempotencyKey, 300)
      : undefined;
    const upstream = await requestPublicOffice(
      request,
      env,
      upstreamPath,
      body,
      idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}
    );
    return jsonResponse(upstream.status, upstream.body);
  } catch (error) {
    const status = Number(error?.status) || 502;
    const message = status < 500 || error?.code === "estimator_not_configured"
      ? error.message
      : "The planning estimator is temporarily unavailable.";
    return jsonResponse(status, { error: message, code: error?.code || "estimator_unavailable" });
  }
};

const worker = {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    if (REDIRECT_HOSTS.has(requestUrl.hostname.toLowerCase())) {
      requestUrl.protocol = "https:";
      requestUrl.hostname = PRIMARY_HOST;
      requestUrl.port = "";
      return new Response(null, {
        status: 308,
        headers: {
          "Cache-Control": "public, max-age=3600",
          Location: requestUrl.toString()
        }
      });
    }
    const upstreamPath = API_ROUTES.get(requestUrl.pathname);
    if (upstreamPath) return handleApiRequest(request, env, upstreamPath);

    if (requestUrl.pathname === "/") requestUrl.pathname = "/index.html";

    let response = await env.ASSETS.fetch(new Request(requestUrl, request));
    if (response.status === 404 && !requestUrl.pathname.split("/").pop().includes(".")) {
      requestUrl.pathname = `${requestUrl.pathname.replace(/\/$/, "")}.html`;
      response = await env.ASSETS.fetch(new Request(requestUrl, request));
    }
    return response;
  }
};

export default worker;
