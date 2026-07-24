import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mmd": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = normalize(join(root, decoded.replace(/^\/+/, "")));
  if (relative(root, candidate).startsWith("..")) return null;

  try {
    const info = await stat(candidate);
    if (info.isDirectory()) return join(candidate, "index.html");
    return candidate;
  } catch {
    const htmlCandidate = `${candidate}.html`;
    try {
      if ((await stat(htmlCandidate)).isFile()) return htmlCandidate;
    } catch {
      return join(root, "404", "index.html");
    }
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const file = await resolveFile(url.pathname);
  if (!file) {
    response.writeHead(400).end("Bad request");
    return;
  }

  try {
    const body = await readFile(file);
    const isNotFound = file.endsWith(join("404", "index.html"));
    response.writeHead(isNotFound ? 404 : 200, {
      "Content-Type": mimeTypes[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static portfolio preview: http://127.0.0.1:${port}/`);
});
