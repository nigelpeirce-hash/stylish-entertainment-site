/**
 * Admin enquiry reply email builder.
 * Allows admin to insert custom content between salutation and standard body.
 * Uses injection markers for tests, diffing, and safe refactors.
 */

import { getGreetingName } from "@/lib/utils/name-helpers";
import { SIGNATURE_BLOCK_HTML, CLIENT_SIGNOFF_TEXT } from "@/lib/email-signature";
import { toSafeDisplayString } from "@/lib/transformers/booking-transformer";

/** Minimal enquiry-like shape (NewEnquiry or booking-derived). */
export interface EnquiryLike {
  id: string;
  name: string;
  email: string;
  eventDate: Date | string;
  venueName?: string | null;
  venuePostcode?: string | null;
  eventType?: string | null;
  message?: string | null;
}

/** Escape HTML special chars to prevent XSS. Plain-text input only. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Convert plain-text custom intro to safe HTML. No raw HTML allowed. */
export function renderCustomIntro(text: string): string {
  if (!text || !text.trim()) return "";
  const escaped = escapeHtml(text.trim());
  return escaped.replace(/\n/g, "<br />");
}

const INJECTION_MARKER_START = "<!-- ADMIN_CUSTOM_INTRO_START -->";
const INJECTION_MARKER_END = "<!-- ADMIN_CUSTOM_INTRO_END -->";

/** Build admin enquiry reply email with custom intro between salutation and standard body. */
export function buildEnquiryReplyEmail(params: {
  enquiry: EnquiryLike;
  customIntro: string;
  meta?: { source: string };
}): { subject: string; html: string; text: string } {
  const { enquiry, customIntro } = params;

  const name = toSafeDisplayString(enquiry.name);
  const greetingName = getGreetingName(name) || "there";
  const venue = toSafeDisplayString(enquiry.venueName) || "your venue";
  const eventDate =
    enquiry.eventDate instanceof Date
      ? enquiry.eventDate
      : new Date(String(enquiry.eventDate));
  const dateStr = isNaN(eventDate.getTime())
    ? "your event date"
    : eventDate.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const salutationHtml = `<p style="font-family: 'Georgia', serif; font-size: 18px; line-height: 1.6; color: #222222; margin: 20px 0;">Hi ${escapeHtml(greetingName)},</p>`;
  const customIntroHtml = renderCustomIntro(customIntro);
  const customIntroBlock =
    customIntroHtml.length > 0
      ? `<p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">${customIntroHtml}</p>`
      : "";

  const bodyHtml = `
<p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">Thanks for your enquiry about <strong>${escapeHtml(venue)}</strong> on <strong>${escapeHtml(dateStr)}</strong>.</p>
<p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">If you have any questions or would like to discuss further, please don't hesitate to get in touch.</p>
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(180deg, #fdf8f0 0%, #f5f0e8 100%);">
  <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.25);">
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 220px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
      <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0;">Stylish Entertainment</p>
    </div>
    ${salutationHtml}
    ${INJECTION_MARKER_START}
    ${customIntroBlock}
    ${INJECTION_MARKER_END}
    ${bodyHtml}
    ${SIGNATURE_BLOCK_HTML}
  </div>
</body>
</html>
`.trim();

  const customIntroText = customIntro.trim();
  const textParts = [
    `Hi ${greetingName},`,
    "",
    customIntroText || "",
    customIntroText ? "" : null,
    `Thanks for your enquiry about ${venue} on ${dateStr}.`,
    "",
    "If you have any questions or would like to discuss further, please don't hesitate to get in touch.",
    "",
    CLIENT_SIGNOFF_TEXT,
  ].filter(Boolean);
  const text = textParts.join("\n");

  const subject = `Re: Your enquiry – ${venue} | Stylish Entertainment Ltd`;

  return { subject, html, text };
}
