import { access, readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const htmlFiles = [];
const missing = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith(".html")) htmlFiles.push(path);
  }
}

function candidates(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!clean) return [join(root, "index.html")];
  if (extname(clean)) return [join(root, clean)];
  return [join(root, clean, "index.html"), join(root, `${clean}.html`)];
}

async function exists(paths) {
  for (const path of paths) {
    try {
      await access(path);
      return true;
    } catch {
      // Try the next valid static-export shape.
    }
  }
  return false;
}

await walk(root);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const hrefs = [...html.matchAll(/\shref=["']([^"']+)["']/gi)].map(
    (match) => match[1],
  );

  for (const href of hrefs) {
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("data:")
    ) {
      continue;
    }

    const url = new URL(href, "https://portfolio.test/");
    if (url.origin !== "https://portfolio.test") continue;
    if (!(await exists(candidates(url.pathname)))) {
      missing.push(`${relative(root, file)} -> ${href}`);
    }
  }
}

if (missing.length) {
  console.error(`Broken internal links (${missing.length}):`);
  for (const item of [...new Set(missing)]) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated internal links across ${htmlFiles.length} static pages.`,
  );
}
