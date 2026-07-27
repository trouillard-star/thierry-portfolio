/** Read-only Cloudflare Worker entry point for the public portfolio. */
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const securityHeaders = {
  "content-security-policy":
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests",
  "permissions-policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
} as const;

const worker = {
  async fetch(
    request: Request,
    environment: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return withSecurityHeaders(
        new Response("Method Not Allowed", {
          status: 405,
          headers: {
            allow: "GET, HEAD",
            "cache-control": "no-store",
            "content-type": "text/plain; charset=utf-8",
          },
        }),
      );
    }

    return withSecurityHeaders(await handler.fetch(request, environment, ctx));
  },
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) {
    if (!headers.has(name)) {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export default worker;
