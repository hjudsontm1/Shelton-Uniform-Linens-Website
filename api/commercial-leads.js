const {
  headerValue,
  readRequestJson,
  requestPublicOffice,
  sendError,
  sendJson
} = require("../server/office-client");

module.exports = async function commercialLeads(request, response) {
  const method = String(request.method || "POST").toUpperCase();
  if (method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    response.statusCode = 204;
    return response.end();
  }
  if (method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return sendJson(response, 405, { error: "Method not allowed.", code: "method_not_allowed" });
  }
  try {
    const body = await readRequestJson(request);
    const idempotencyKey = String(headerValue(request, "idempotency-key") || body.idempotencyKey || "").trim();
    const upstream = await requestPublicOffice(
      request,
      "/api/public/commercial-leads",
      body,
      idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}
    );
    return sendJson(response, upstream.status, upstream.body);
  } catch (error) {
    return sendError(response, error);
  }
};
