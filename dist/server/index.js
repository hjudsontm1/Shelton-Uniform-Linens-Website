const worker = {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname === "/") {
      requestUrl.pathname = "/index.html";
    }

    let response = await env.ASSETS.fetch(new Request(requestUrl, request));

    if (response.status === 404 && !requestUrl.pathname.split("/").pop().includes(".")) {
      requestUrl.pathname = `${requestUrl.pathname.replace(/\/$/, "")}.html`;
      response = await env.ASSETS.fetch(new Request(requestUrl, request));
    }

    return response;
  },
};

export default worker;
