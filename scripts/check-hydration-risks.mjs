#!/usr/bin/env node
/**
 * Lightweight guard against common hydration foot-guns in client UI code.
 * Not exhaustive — run alongside manual mobile reload checks.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const SCAN_DIRS = ["app", "components", "hooks", "lib"];
const EXT = /\.(tsx|ts|jsx|js)$/;

const PATTERNS = [
  { name: "Math.random() in file", re: /Math\.random\s*\(/ },
  { name: "Date.now() in file", re: /Date\.now\s*\(/ },
];

/** Files allowed to use randomness (client-only effects, APIs, seeds). */
const ALLOWLIST = new Set([
  "lib/deterministic-shuffle.ts",
  "data/reviews.ts",
  "scripts/check-hydration-risks.mjs",
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".next" || name === "api") continue;
      walk(p, out);
    } else if (EXT.test(name)) out.push(p);
  }
  return out;
}

let failed = false;

for (const dir of SCAN_DIRS) {
  const base = join(ROOT, dir);
  for (const file of walk(base)) {
    const rel = file.slice(ROOT.length + 1);
    if (ALLOWLIST.has(rel)) continue;
    if (rel.includes("/api/") || rel.startsWith("app/api/")) continue;

    const text = readFileSync(file, "utf8");
    if (rel === "app/HomeClient.tsx") {
      const withoutComments = text
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "");
      if (withoutComments.includes("Math.random")) {
        console.error(`FAIL ${rel}: homepage must not use Math.random — use deterministicShuffle after mount only`);
        failed = true;
      }
      continue;
    }

    for (const { name, re } of PATTERNS) {
      if (!re.test(text)) continue;
      if (rel.endsWith(".tsx") && name === "Math.random() in file") {
        if (text.includes("useEffect") && !text.match(/Math\.random[\s\S]{0,200}return\s*\(/)) {
          console.warn(`WARN ${rel}: contains Math.random — ensure it only runs inside useEffect, not render`);
        }
      }
    }
  }
}

if (failed) process.exit(1);
console.log("check:hydration — no critical homepage randomness violations");
