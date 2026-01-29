#!/usr/bin/env tsx
/**
 * Pre-push check: verify reCAPTCHA env vars are in place.
 * Run: npm run test:recaptcha-env
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_RECAPTCHA_SITE_KEY  (public, for contact forms)
 *   RECAPTCHA_SECRET_KEY            (private, for server-side verification)
 */

import { config } from "dotenv";

config({ path: ".env.local" });

const SITE = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
const SECRET = process.env.RECAPTCHA_SECRET_KEY?.trim() ?? "";

const PLACEHOLDERS = [
  "YOUR_RECAPTCHA_SITE_KEY",
  "your-recaptcha-site-key",
  "6Ldxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "xxx",
  "",
];

function isPlaceholder(val: string): boolean {
  const v = val.toLowerCase();
  return (
    PLACEHOLDERS.some((p) => p && v.includes(p.toLowerCase())) ||
    /x{8,}/.test(val) // 6Ldxxx... style placeholder
  );
}

function looksLikeKey(val: string): boolean {
  return val.length >= 35 && /^6L[a-zA-Z0-9_-]+$/.test(val);
}

function mask(s: string): string {
  if (s.length < 12) return "***";
  return s.slice(0, 6) + "…" + s.slice(-4);
}

function main(): number {
  console.log("🔍 Checking reCAPTCHA env (pre-push)...\n");

  let ok = true;

  if (!SITE || isPlaceholder(SITE)) {
    console.log("   ❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY: missing or placeholder");
    ok = false;
  } else if (!looksLikeKey(SITE)) {
    console.log("   ⚠️  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: set but format unexpected (expect 6L... ≈40 chars)");
    console.log("      Value: " + mask(SITE));
    // don't fail, might be valid
  } else {
    console.log("   ✅ NEXT_PUBLIC_RECAPTCHA_SITE_KEY: " + mask(SITE));
  }

  if (!SECRET || isPlaceholder(SECRET)) {
    console.log("   ❌ RECAPTCHA_SECRET_KEY: missing or placeholder");
    ok = false;
  } else if (!looksLikeKey(SECRET)) {
    console.log("   ⚠️  RECAPTCHA_SECRET_KEY: set but format unexpected");
    console.log("      Value: " + mask(SECRET));
  } else {
    console.log("   ✅ RECAPTCHA_SECRET_KEY: " + mask(SECRET));
  }

  console.log("");
  if (ok) {
    console.log("   ✅ reCAPTCHA env check passed. Safe to push.\n");
    return 0;
  }
  console.log("   Add keys to .env.local (see .env.local.example) and run again.\n");
  return 1;
}

process.exit(main());
