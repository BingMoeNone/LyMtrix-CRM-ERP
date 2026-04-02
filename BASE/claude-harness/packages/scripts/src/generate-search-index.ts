import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

interface SearchEntry {
  path: string;
  lines: { num: number; text: string }[];
}

async function collectFiles(dir: string, base: string): Promise<SearchEntry[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: SearchEntry[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(fullPath, base)));
    } else {
      const content = await readFile(fullPath, "utf-8");
      const lines = content.split("\n").map((text, i) => ({ num: i + 1, text }));
      results.push({ path: relative(base, fullPath), lines });
    }
  }

  return results;
}

export async function generateSearchIndex(sourceDir: string): Promise<SearchEntry[]> {
  return collectFiles(sourceDir, sourceDir);
}
