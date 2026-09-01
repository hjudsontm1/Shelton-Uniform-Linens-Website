const API_ROUTES = new Map([
  ["/api/commercial-estimate", "/api/public/commercial-estimate"],
  ["/api/commercial-leads", "/api/public/commercial-leads"],
  ["/api/website-events", "/api/public/website-events"]
]);
const MAX_REQUEST_BYTES = 1_000_000;
const MAX_ANALYTICS_REQUEST_BYTES = 32 * 1024;
const MAX_ANALYTICS_EVENTS = 20;
const MAX_ANALYTICS_PROPERTIES = 8;
const WEBSITE_ANALYTICS_TIMEOUT_MS = 3_000;
const WEBSITE_ANALYTICS_SCHEMA_VERSION = "website-analytics.v1";
const DEFAULT_UPSTREAM_TIMEOUT_MS = 8_000;
const FORBIDDEN_RESPONSE_KEY_PARTS = ["assumption", "cost", "economics", "labor", "margin", "wage"];
const WEBSITE_ANALYTICS_EVENT_NAMES = new Set([
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
const WEBSITE_ANALYTICS_PAGE_KEYS = new Set([
  "home",
  "services",
  "industries",
  "pricing",
  "about",
  "quote",
  "thank_you",
  "privacy"
]);
const WEBSITE_ANALYTICS_VIEWPORTS = new Set(["mobile", "compact", "desktop"]);
const WEBSITE_ANALYTICS_PROPERTY_KEYS = new Set([
  "answerCountBucket",
  "bfcache",
  "campaignMedium",
  "campaignName",
  "campaignSource",
  "channel",
  "confidence",
  "ctaId",
  "destinationKey",
  "evidence",
  "goodsCountBucket",
  "metric",
  "mode",
  "moduleId",
  "navigationType",
  "operation",
  "referrerClass",
  "result",
  "stage",
  "value"
]);
const WEBSITE_ANALYTICS_PROPERTIES_BY_EVENT = new Map([
  ["page_view", new Set([
    "bfcache",
    "campaignMedium",
    "campaignName",
    "campaignSource",
    "navigationType",
    "referrerClass"
  ])],
  ["cta_click", new Set(["channel", "ctaId", "destinationKey", "moduleId", "result"])],
  ["contact_click", new Set(["channel", "destinationKey", "result"])],
  ["content_engaged", new Set(["moduleId", "result", "stage"])],
  ["estimator_started", new Set(["stage"])],
  ["estimator_operation_selected", new Set(["operation", "stage"])],
  ["estimator_goods_mode_selected", new Set(["goodsCountBucket", "mode", "stage"])],
  ["estimator_range_viewed", new Set([
    "answerCountBucket",
    "confidence",
    "evidence",
    "goodsCountBucket",
    "stage"
  ])],
  ["estimator_precision_opened", new Set(["answerCountBucket", "stage"])],
  ["estimator_precision_completed", new Set(["answerCountBucket", "confidence", "stage"])],
  ["estimator_quote_started", new Set(["stage"])],
  ["performance_metric", new Set(["metric", "navigationType", "value"])]
]);
const WEBSITE_ANALYTICS_DEFAULT_PROPERTIES = new Set(["channel", "result", "stage"]);
const WEBSITE_ANALYTICS_OPERATIONS = new Set([
  "casino",
  "event",
  "gym",
  "homeless_shelter",
  "hotel",
  "medspa",
  "residential_treatment",
  "resort_spa",
  "restaurant",
  "senior_living",
  "specialty",
  "str",
  "uniform"
]);
const WEBSITE_ANALYTICS_MODES = new Set(["custom", "typical"]);
const WEBSITE_ANALYTICS_EVIDENCE = new Set([
  "customer_provided",
  "estimated",
  "known_pieces",
  "known_pounds",
  "measured",
  "measured_pounds",
  "operation_default",
  "piece_counts",
  "proxy",
  "rooms_occupancy"
]);
const WEBSITE_ANALYTICS_CONFIDENCE = new Set(["high", "known", "low", "medium"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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

const requiredAnalyticsString = (value, label, maxLength) => {
  if (typeof value !== "string") {
    throw workerError(400, "validation_error", `${label} is invalid.`);
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw workerError(400, "validation_error", `${label} is invalid.`);
  }
  return normalized;
};

const normalizeAnalyticsTimestamp = (value, now) => {
  const timestamp = Date.parse(requiredAnalyticsString(value, "Event time", 40));
  if (!Number.isFinite(timestamp) || timestamp > now + 5 * 60_000 || timestamp < now - 24 * 60 * 60_000) {
    throw workerError(400, "validation_error", "An event time is outside the accepted window.");
  }
  return new Date(timestamp).toISOString();
};

const normalizeAnalyticsPath = (value) => {
  const raw = requiredAnalyticsString(value, "Page path", 240);
  let path = raw.split(/[?#]/, 1)[0] || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  return path.replace(/\/{2,}/g, "/");
};

const normalizeAnalyticsOptionalKey = (value, label, maxLength = 80) => {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string") {
    throw workerError(400, "validation_error", `${label} is invalid.`);
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength || !/^[a-z0-9_.:-]+$/i.test(normalized)) {
    throw workerError(400, "validation_error", `${label} is invalid.`);
  }
  return normalized;
};

const normalizeAnalyticsProperties = (eventName, value) => {
  if (value == null) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw workerError(400, "validation_error", "Event properties are invalid.");
  }
  const entries = Object.entries(value);
  if (entries.length > MAX_ANALYTICS_PROPERTIES) {
    throw workerError(400, "validation_error", "An analytics event has too many properties.");
  }
  const normalized = {};
  const permittedForEvent = WEBSITE_ANALYTICS_PROPERTIES_BY_EVENT.get(eventName)
    || WEBSITE_ANALYTICS_DEFAULT_PROPERTIES;
  for (const [key, property] of entries) {
    if (!WEBSITE_ANALYTICS_PROPERTY_KEYS.has(key) || !permittedForEvent.has(key)) {
      throw workerError(400, "validation_error", "An analytics property is not permitted.");
    }
    if (key === "bfcache") {
      if (typeof property !== "boolean") {
        throw workerError(400, "validation_error", "An analytics property is invalid.");
      }
      normalized[key] = property;
    } else if (key === "value") {
      if (eventName !== "performance_metric" || typeof property !== "number" || !Number.isFinite(property) || property < 0 || property > 120_000) {
        throw workerError(400, "validation_error", "An analytics number is invalid.");
      }
      normalized[key] = Math.round(property * 100) / 100;
    } else {
      const clean = normalizeAnalyticsOptionalKey(property, "Analytics property", 64);
      if (!clean) {
        throw workerError(400, "validation_error", "An analytics property is invalid.");
      }
      if (key === "operation" && !WEBSITE_ANALYTICS_OPERATIONS.has(clean)) {
        throw workerError(400, "validation_error", "The analytics operation is invalid.");
      }
      if (key === "mode" && !WEBSITE_ANALYTICS_MODES.has(clean)) {
        throw workerError(400, "validation_error", "The analytics mode is invalid.");
      }
      if (key === "evidence" && !WEBSITE_ANALYTICS_EVIDENCE.has(clean)) {
        throw workerError(400, "validation_error", "The analytics evidence is invalid.");
      }
      if (key === "confidence" && !WEBSITE_ANALYTICS_CONFIDENCE.has(clean)) {
        throw workerError(400, "validation_error", "The analytics confidence is invalid.");
      }
      if ((key === "answerCountBucket" || key === "goodsCountBucket") && !/^(none|unknown|[0-9]{1,2}|[0-9]{1,2}_[0-9]{1,2}|[0-9]{1,2}_plus)$/.test(clean)) {
        throw workerError(400, "validation_error", "The analytics count bucket is invalid.");
      }
      normalized[key] = clean;
    }
  }
  return normalized;
};

const normalizeWebsiteAnalyticsBatch = (value) => {
  if (value?.schemaVersion !== WEBSITE_ANALYTICS_SCHEMA_VERSION) {
    throw workerError(400, "validation_error", "The analytics schema version is not supported.");
  }
  const batchId = requiredAnalyticsString(value.batchId, "Batch ID", 60);
  const sessionId = requiredAnalyticsString(value.sessionId, "Session ID", 60);
  if (!UUID_PATTERN.test(batchId) || !UUID_PATTERN.test(sessionId)) {
    throw workerError(400, "validation_error", "The analytics identifiers are invalid.");
  }
  if (!Array.isArray(value.events) || !value.events.length || value.events.length > MAX_ANALYTICS_EVENTS) {
    throw workerError(400, "validation_error", `Analytics batches must contain 1 to ${MAX_ANALYTICS_EVENTS} events.`);
  }
  const now = Date.now();
  const normalized = {
    schemaVersion: WEBSITE_ANALYTICS_SCHEMA_VERSION,
    batchId,
    sessionId,
    sentAt: normalizeAnalyticsTimestamp(value.sentAt, now),
    events: value.events.map((event) => {
      if (!event || typeof event !== "object" || Array.isArray(event)) {
        throw workerError(400, "validation_error", "An analytics event is invalid.");
      }
      const eventId = requiredAnalyticsString(event.eventId, "Event ID", 60);
      if (!UUID_PATTERN.test(eventId)) {
        throw workerError(400, "validation_error", "An event identifier is invalid.");
      }
      if (!WEBSITE_ANALYTICS_EVENT_NAMES.has(event.name)) {
        throw workerError(400, "validation_error", "An analytics event is not permitted.");
      }
      if (!WEBSITE_ANALYTICS_PAGE_KEYS.has(event.pageKey)) {
        throw workerError(400, "validation_error", "An analytics page is not permitted.");
      }
      if (!WEBSITE_ANALYTICS_VIEWPORTS.has(event.viewport)) {
        throw workerError(400, "validation_error", "An analytics viewport is invalid.");
      }
      const cleanEvent = {
        eventId,
        name: event.name,
        occurredAt: normalizeAnalyticsTimestamp(event.occurredAt, now),
        pageKey: event.pageKey,
        pagePath: normalizeAnalyticsPath(event.pagePath),
        viewport: event.viewport
      };
      const elementKey = normalizeAnalyticsOptionalKey(event.elementKey, "Element key");
      const estimatorStep = normalizeAnalyticsOptionalKey(event.estimatorStep, "Estimator step");
      const properties = normalizeAnalyticsProperties(event.name, event.properties);
      if (elementKey) cleanEvent.elementKey = elementKey;
      if (estimatorStep) cleanEvent.estimatorStep = estimatorStep;
      if (properties) cleanEvent.properties = properties;
      return cleanEvent;
    })
  };
  return normalized;
};

const normalizeAnalyticsResponse = (value, expectedCount) => {
  if (!value || value.schemaVersion !== WEBSITE_ANALYTICS_SCHEMA_VERSION) return null;
  const counts = [value.accepted, value.duplicates, value.rejected];
  if (counts.some((count) => !Number.isInteger(count) || count < 0 || count > MAX_ANALYTICS_EVENTS)) return null;
  if (counts.reduce((sum, count) => sum + count, 0) !== expectedCount) return null;
  return {
    schemaVersion: WEBSITE_ANALYTICS_SCHEMA_VERSION,
    accepted: value.accepted,
    duplicates: value.duplicates,
    rejected: value.rejected
  };
};

const normalizeErrorResponse = (value, status, serverMessage = "The planning estimator is temporarily unavailable.") => {
  const upstreamCode = safeString(value?.code, 100);
  const upstreamMessage = safeString(value?.error, 300);
  return {
    error: status >= 500 ? serverMessage : upstreamMessage || "The request could not be processed.",
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

const readJsonRequest = async (request, maxBytes = MAX_REQUEST_BYTES) => {
  const contentLength = Number.parseInt(request.headers.get("content-length") || "", 10);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw workerError(413, "request_too_large", "The request is too large.");
  }
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxBytes) {
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

const assertSameOrigin = (request) => {
  const supplied = safeString(request.headers.get("origin"), 2_000);
  if (!supplied || supplied === "null") {
    throw workerError(403, "origin_not_allowed", "A same-origin request is required.");
  }
  try {
    if (new URL(supplied).origin !== new URL(request.url).origin) {
      throw workerError(403, "origin_not_allowed", "A same-origin request is required.");
    }
  } catch (error) {
    if (error?.code === "origin_not_allowed") throw error;
    throw workerError(403, "origin_not_allowed", "A same-origin request is required.");
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

const requestPublicOffice = async (request, env, upstreamPath, body, extraHeaders = {}, timeoutOverride) => {
  const analyticsRequest = upstreamPath === "/api/public/website-events";
  const office = configuredOffice(env);
  if (!office) {
    throw analyticsRequest
      ? workerError(503, "analytics_not_configured", "Website measurement is temporarily unavailable.")
      : workerError(503, "estimator_not_configured", "The planning estimator is temporarily unavailable.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutOverride || upstreamTimeoutMs(env));
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
      redirect: "manual"
    });
  } catch (error) {
    console.error("Shelton Office proxy fetch failed", {
      name: error?.name || "Error",
      message: String(error?.message || "Unknown upstream fetch failure").slice(0, 300)
    });
    if (error?.name === "AbortError") {
      throw analyticsRequest
        ? workerError(504, "analytics_timeout", "Website measurement took too long to respond.")
        : workerError(504, "estimator_timeout", "The planning estimator took too long to respond.");
    }
    throw analyticsRequest
      ? workerError(502, "analytics_unavailable", "Website measurement could not be reached.")
      : workerError(502, "estimator_unavailable", "The planning estimator could not be reached.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    throw analyticsRequest
      ? workerError(502, "analytics_redirect_rejected", "Website measurement returned an unexpected redirect.")
      : workerError(502, "estimator_redirect_rejected", "The planning estimator returned an unexpected redirect.");
  }

  const text = await upstream.text();
  let responseBody;
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch {
    throw analyticsRequest
      ? workerError(502, "invalid_analytics_response", "Website measurement returned an unreadable response.")
      : workerError(502, "invalid_estimator_response", "The planning estimator returned an unreadable response.");
  }
  if (!upstream.ok) {
    return {
      status: upstream.status,
      body: normalizeErrorResponse(
        responseBody,
        upstream.status,
        analyticsRequest ? "Website measurement is temporarily unavailable." : undefined
      )
    };
  }
  if (containsForbiddenData(responseBody)) {
    throw analyticsRequest
      ? workerError(502, "unsafe_analytics_response", "Website measurement returned an unsafe response.")
      : workerError(502, "unsafe_estimator_response", "The planning estimator response was rejected.");
  }
  const normalized = upstreamPath === "/api/public/commercial-estimate"
    ? normalizeEstimateResponse(responseBody)
    : analyticsRequest
      ? normalizeAnalyticsResponse(responseBody, body.events.length)
      : normalizeLeadResponse(responseBody);
  if (!normalized) {
    throw analyticsRequest
      ? workerError(502, "invalid_analytics_response", "Website measurement returned an invalid response.")
      : workerError(502, "invalid_estimator_response", "The planning estimator returned an invalid response.");
  }
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

const handleWebsiteAnalyticsRequest = async (request, env, upstreamPath) => {
  const method = request.method.toUpperCase();
  if (method !== "POST" && method !== "OPTIONS") {
    return jsonResponse(405, { error: "Method not allowed.", code: "method_not_allowed" }, { Allow: "POST, OPTIONS" });
  }

  try {
    assertSameOrigin(request);
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: "POST, OPTIONS",
          "Cache-Control": "no-store",
          Vary: "Origin"
        }
      });
    }
    const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (contentType !== "application/json") {
      throw workerError(415, "unsupported_media_type", "A JSON request is required.");
    }
    const body = normalizeWebsiteAnalyticsBatch(
      await readJsonRequest(request, MAX_ANALYTICS_REQUEST_BYTES)
    );
    const upstream = await requestPublicOffice(
      request,
      env,
      upstreamPath,
      body,
      {},
      WEBSITE_ANALYTICS_TIMEOUT_MS
    );
    return jsonResponse(upstream.status, upstream.body, { Vary: "Origin" });
  } catch (error) {
    const status = Number(error?.status) || 502;
    const message = status < 500 || error?.code === "analytics_not_configured"
      ? error.message
      : "Website measurement is temporarily unavailable.";
    return jsonResponse(
      status,
      { error: message, code: error?.code || "analytics_unavailable" },
      { Vary: "Origin" }
    );
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
    if (upstreamPath === "/api/public/website-events") {
      return handleWebsiteAnalyticsRequest(request, env, upstreamPath);
    }
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
