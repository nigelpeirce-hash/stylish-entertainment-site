/**
 * Unit tests for enquiry-reply-template.
 * Run: npx tsx scripts/test-enquiry-reply-template.ts
 */
import assert from "node:assert";
import {
  escapeHtml,
  renderCustomIntro,
  buildEnquiryReplyEmail,
} from "../lib/email/enquiry-reply-template";

const INJECTION_START = "<!-- ADMIN_CUSTOM_INTRO_START -->";
const INJECTION_END = "<!-- ADMIN_CUSTOM_INTRO_END -->";

const mockEnquiry = {
  id: "test-id",
  name: "Sarah & Mike",
  email: "sarah@example.com",
  eventDate: new Date("2026-06-15"),
  venueName: "The Grand Hall",
  venuePostcode: "BS1 1AA",
  eventType: "wedding",
  message: null,
};

function testEscapeHtml() {
  assert.strictEqual(escapeHtml("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.strictEqual(escapeHtml("a & b"), "a &amp; b");
  assert.strictEqual(escapeHtml('"quoted"'), "&quot;quoted&quot;");
  console.log("✓ escapeHtml");
}

function testRenderCustomIntro() {
  assert.ok(renderCustomIntro("Hello\nWorld").includes("<br />"));
  assert.ok(!renderCustomIntro("<b>bold</b>").includes("<b>"));
  assert.strictEqual(renderCustomIntro(""), "");
  console.log("✓ renderCustomIntro");
}

function testCustomIntroBetweenMarkers() {
  const { html } = buildEnquiryReplyEmail({
    enquiry: mockEnquiry,
    customIntro: "I've checked availability and we have our lead DJ free.",
  });

  const startIdx = html.indexOf(INJECTION_START);
  const endIdx = html.indexOf(INJECTION_END);

  assert.ok(startIdx >= 0, "ADMIN_CUSTOM_INTRO_START marker should exist");
  assert.ok(endIdx >= 0, "ADMIN_CUSTOM_INTRO_END marker should exist");
  assert.ok(startIdx < endIdx, "START should come before END");

  const between = html.slice(startIdx + INJECTION_START.length, endIdx);
  assert.ok(between.includes("checked availability"), "Custom intro should appear between markers");
  assert.ok(between.includes("lead DJ free"), "Custom intro content should be present");

  console.log("✓ custom intro appears between markers");
}

function testPlainTextEscaped() {
  const { html } = buildEnquiryReplyEmail({
    enquiry: mockEnquiry,
    customIntro: "<script>alert('xss')</script>",
  });

  assert.ok(!html.includes("<script>"), "HTML should not contain raw script tag");
  assert.ok(html.includes("&lt;script&gt;") || html.includes("&lt;"), "Script should be escaped");

  console.log("✓ plain text is escaped (XSS safe)");
}

function testEmptyCustomIntro() {
  const { html } = buildEnquiryReplyEmail({
    enquiry: mockEnquiry,
    customIntro: "",
  });

  assert.ok(html.includes(INJECTION_START));
  assert.ok(html.includes(INJECTION_END));
  // Body and salutation should still be present
  assert.ok(html.includes("Thanks for your enquiry"));
  assert.ok(html.includes("Hi Sarah"));

  console.log("✓ empty custom intro still produces valid email");
}

testEscapeHtml();
testRenderCustomIntro();
testCustomIntroBetweenMarkers();
testPlainTextEscaped();
testEmptyCustomIntro();

console.log("\nAll enquiry-reply-template tests passed.");
