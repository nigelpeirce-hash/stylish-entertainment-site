/**
 * Regression checks for lib/public-form-security.ts (used only by DJ worksheet + Babington public routes).
 * Run: npx tsx scripts/test-public-form-security.ts
 */
import assert from "node:assert/strict";
import {
  checkPublicFormRateLimit,
  isReasonableTimeField,
  isSafeReplyToEmail,
  rejectIfTooLong,
  sanitizeSubjectUserPart,
} from "../lib/public-form-security";

function ok(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok: ${name}`);
  } catch (e) {
    console.error(`FAIL: ${name}`, e);
    process.exit(1);
  }
}

ok("isSafeReplyToEmail accepts normal address", () => {
  assert.equal(isSafeReplyToEmail("client@example.com"), true);
});

ok("isSafeReplyToEmail rejects CRLF injection", () => {
  assert.equal(isSafeReplyToEmail("a@b.com\nBcc:evil@x.com"), false);
});

ok("isSafeReplyToEmail rejects overlong", () => {
  assert.equal(isSafeReplyToEmail(`${"a".repeat(250)}@x.co`), false);
});

ok("sanitizeSubjectUserPart strips newlines and truncates", () => {
  assert.match(sanitizeSubjectUserPart("Jane\n\r & John"), /^Jane\s+& John$/);
  const long = "x".repeat(300);
  assert.ok(sanitizeSubjectUserPart(long, 50).length <= 50);
});

ok("rejectIfTooLong returns error when over", () => {
  assert.equal(rejectIfTooLong("hi", 1, "F"), "F is too long.");
  assert.equal(rejectIfTooLong("hi", 10, "F"), null);
});

ok("isReasonableTimeField accepts HH:MM", () => {
  assert.equal(isReasonableTimeField("14:30", 16), true);
  assert.equal(isReasonableTimeField("9:05", 16), true);
  assert.equal(isReasonableTimeField("3pm", 16), false);
});

ok("rate limit allows then blocks same route+ip", () => {
  const routeId = "dj-worksheet";
  const ip = `test-ip-${Date.now()}`;
  for (let i = 0; i < 10; i++) {
    assert.equal(checkPublicFormRateLimit(routeId, ip).ok, true);
  }
  assert.equal(checkPublicFormRateLimit(routeId, ip).ok, false);
});

ok("rate limit is isolated per route id", () => {
  const ip = `test-ip-2-${Date.now()}`;
  assert.equal(checkPublicFormRateLimit("babington-dj-final-details", ip).ok, true);
});

console.log("\nAll public-form-security regression checks passed.");
