const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const root = path.resolve(__dirname, "..");
const port = 4184;
let submissionCount = 0;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const send = (response, status, contentType, body) => {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(body);
};

const serveFile = (requestUrl, response) => {
  const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath || "quote.html");
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    send(response, 404, "text/plain; charset=utf-8", "Not found");
    return;
  }

  let body = fs.readFileSync(filePath);
  if (relativePath === "quote.html" || relativePath === "") {
    const mode = requestUrl.searchParams.get("mode") || "success";
    let html = body.toString("utf8").replace(
      "https://formspree.io/f/mdenldgn",
      `http://127.0.0.1:${port}/mock/${mode}`
    );
    if (mode === "timeout") {
      html = html.replace("data-quote-form>", "data-quote-form data-submit-timeout=\"120\">");
    }
    body = Buffer.from(html);
  }

  send(response, 200, contentTypes[path.extname(filePath)] || "application/octet-stream", body);
};

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);

  if (request.method === "POST" && requestUrl.pathname.startsWith("/mock/")) {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const body = Buffer.concat(chunks).toString("utf8");
      submissionCount += 1;
      console.log(JSON.stringify({
        event: "submission",
        mode: requestUrl.pathname.split("/").pop(),
        submissionCount,
        textileFields: (body.match(/name=\"textiles\"/g) || []).length,
        hasCompany: body.includes("Shelton QA Test Account"),
        hasSubmittedAt: body.includes("name=\"submitted_at\"")
      }));

      const mode = requestUrl.pathname.split("/").pop();
      if (mode === "error") {
        send(response, 500, "application/json; charset=utf-8", JSON.stringify({ ok: false }));
        return;
      }
      if (mode === "ratelimit") {
        send(response, 429, "application/json; charset=utf-8", JSON.stringify({ ok: false }));
        return;
      }
      if (mode === "timeout") {
        setTimeout(() => send(response, 200, "application/json; charset=utf-8", JSON.stringify({ ok: true })), 900);
        return;
      }
      if (mode === "slow") {
        setTimeout(() => send(response, 200, "application/json; charset=utf-8", JSON.stringify({ ok: true })), 900);
        return;
      }
      send(response, 200, "application/json; charset=utf-8", JSON.stringify({ ok: true }));
    });
    return;
  }

  serveFile(requestUrl, response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`quote form mock server listening on http://127.0.0.1:${port}`);
});
