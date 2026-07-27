import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const emptyHostingConfig = Object.freeze({ d1: null, r2: null });

/**
 * Loads local Sites metadata without making the public source repository
 * depend on the ignored `.openai` directory.
 *
 * @param {string} [configPath]
 * @returns {Promise<{ d1: string | null; r2: string | null }>}
 */
export async function loadHostingConfig(
  configPath = resolve(".openai", "hosting.json"),
) {
  let source;
  try {
    source = await readFile(configPath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return emptyHostingConfig;
    }
    throw error;
  }

  const parsed = JSON.parse(source);
  return {
    d1: readOptionalBinding(parsed, "d1"),
    r2: readOptionalBinding(parsed, "r2"),
  };
}

function readOptionalBinding(value, key) {
  if (value === null || typeof value !== "object") {
    throw new TypeError(`Invalid Sites configuration: ${key} is unavailable.`);
  }

  const binding = value[key];
  if (binding === null || binding === undefined) return null;
  if (typeof binding === "string" && binding.trim()) return binding;

  throw new TypeError(
    `Invalid Sites configuration: ${key} must be a non-empty string or null.`,
  );
}
