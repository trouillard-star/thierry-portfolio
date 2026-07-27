import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const outputRoot = fileURLToPath(new URL("../out/", import.meta.url));
const scriptSourcePattern =
  /<script\b[^>]*\bsrc="\/_next\/static\/chunks\/[^"]+\.js"[^>]*><\/script>/g;
const scriptPreloadPattern =
  /<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="script")[^>]*>/g;
const flightDataPattern =
  /<script>\s*(?:\(self\.__next_f|self\.__next_f)[\s\S]*?<\/script>/g;

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat();
}

const files = await listFiles(outputRoot);
const htmlFiles = files.filter((file) => extname(file) === ".html");
const frameworkScripts = files.filter(
  (file) =>
    extname(file) === ".js" &&
    file.includes(`${join("_next", "static", "chunks")}`),
);
const interactivePages = new Set([
  "projets/neuro-lens/index.html",
  "en/projects/neuro-lens/index.html",
]);

let removedBytes = 0;
let hydratedPages = 0;

for (const file of htmlFiles) {
  const original = await readFile(file, "utf8");
  const outputPath = relative(outputRoot, file).replaceAll("\\", "/");

  if (interactivePages.has(outputPath)) {
    if (!/\/_next\/static\/chunks\/[^"]+\.js/.test(original)) {
      throw new Error(`Interactive runtime is missing from ${file}`);
    }
    hydratedPages += 1;
    continue;
  }

  const stripped = original
    .replace(scriptSourcePattern, "")
    .replace(scriptPreloadPattern, "")
    .replace(flightDataPattern, "");

  if (
    stripped.includes("self.__next_f") ||
    /\/_next\/static\/chunks\/[^"]+\.js/.test(stripped)
  ) {
    throw new Error(`Next.js client runtime remains in ${file}`);
  }

  if (
    !stripped.includes("application/ld+json") &&
    file.endsWith("index.html")
  ) {
    // Only portfolio home pages carry Person structured data.
    const isHome = file === join(outputRoot, "index.html");
    const isEnglishHome = file === join(outputRoot, "en", "index.html");
    if (isHome || isEnglishHome) {
      throw new Error(`Structured data was removed from ${file}`);
    }
  }

  removedBytes += Buffer.byteLength(original) - Buffer.byteLength(stripped);
  await writeFile(file, stripped);
}

if (hydratedPages === 0) {
  for (const file of frameworkScripts) {
    removedBytes += (await stat(file)).size;
    await rm(file);
  }
}

console.log(
  `Static runtime removed from ${htmlFiles.length - hydratedPages} pages; retained for ${hydratedPages} interactive pages; ${hydratedPages === 0 ? frameworkScripts.length : 0} unused JavaScript files deleted; ${Math.round(removedBytes / 1024)} KiB removed.`,
);
