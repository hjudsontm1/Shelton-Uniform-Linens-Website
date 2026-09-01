/** Dedicated permanent redirect service for Shelton's alternate domains. */
const PRIMARY_ORIGIN = "https://sheltonlinen.com";

const worker = {
  async fetch(request: Request): Promise<Response> {
    const incoming = new URL(request.url);
    const target = new URL(`${incoming.pathname}${incoming.search}`, PRIMARY_ORIGIN);

    return new Response(null, {
      status: 308,
      headers: {
        Location: target.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};

export default worker;
