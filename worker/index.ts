/** Read-only Cloudflare Worker entry point for the public portfolio. */
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const worker = {
  async fetch(
    request: Request,
    environment: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          allow: "GET, HEAD",
          "cache-control": "no-store",
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    return handler.fetch(request, environment, ctx);
  },
};

export default worker;
