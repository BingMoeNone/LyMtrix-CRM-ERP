import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

function findSourceRoot(): string {
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, "../claude-code-source/src"),
    resolve(cwd, "packages/claude-code-source/src"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[0];
}

let _sourceRoot: string | null = null;
function getSourceRoot(): string {
  if (!_sourceRoot) _sourceRoot = findSourceRoot();
  return _sourceRoot;
}

export async function readSourceFile(filePath: string): Promise<string> {
  const root = getSourceRoot();
  const fullPath = resolve(root, filePath);
  // Prevent path traversal
  if (!fullPath.startsWith(root)) {
    throw new Error("Invalid path");
  }
  return readFile(fullPath, "utf-8");
}
