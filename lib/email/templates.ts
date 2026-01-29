/**
 * Email templates for transactional emails (portal invite, etc.)
 */

import { deduplicateName, getDisplayName, getGreetingName } from "@/lib/utils/name-helpers";
import { CLIENT_SIGNOFF_TEXT, CLIENT_SIGNATURE_BLOCK_HTML, yourEventLabel } from "@/lib/email-templates";

const GOLD = "#D4AF37";

export interface PortalInvitationInput {
  name: string;
  venueName: string;
  portalUrl: string;
  eventType?: string;
}

/**
 * PORTAL_INVITATION – Welcome to Your [Venue] Wedding/Booking Portal
 * Event-type aware: wedding → "Wedding Portal"; corporate/private → "Booking Portal".
 * CTA: Gold-accented "Step Into Your Portal" (magic link).
 */
export function PORTAL_INVITATION(input: PortalInvitationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const greetingName = getGreetingName(input.name) || "there";
  const displayName = deduplicateName(getDisplayName(input.name) || input.name) || input.name;
  let venue = (input.venueName || "your venue").trim();
  const isWedding = (input.eventType || "").toLowerCase().trim() === "wedding";
  const portalLabel = isWedding ? "Wedding Portal" : "Booking Portal";

  venue = venue.replace(/babington\s+hiouse/gi, "Babington House");
  venue = venue.replace(/babington\s+houe/gi, "Babington House");
  venue = venue.replace(/^babington\s+house$/i, "Babington House");

  const subject = `Welcome to Your ${venue} ${portalLabel} | Stylish Entertainment Ltd`;

  const eventLabel = yourEventLabel(input.eventType);
  const intro = isWedding
    ? `We've set up your personal planning portal for your wedding at <strong>${venue}</strong>. We've already added the key timings and venue details for you. This is where you can add music requests, dislikes, and your first dance song.`
    : `We've set up your personal booking portal for ${eventLabel} at <strong>${venue}</strong>. We've added the key timings and venue details. You can manage your preferences, add music details, and keep in touch with us.`;

  const introText = isWedding
    ? `We've set up your personal planning portal for your wedding at ${venue}. We've already added the key timings and venue details for you. This is where you can add music requests, dislikes, and your first dance song.`
    : `We've set up your personal booking portal for ${eventLabel} at ${venue}. We've added the key timings and venue details. You can manage your preferences, add music details, and keep in touch with us.`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
      <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 20px;"></div>
      <h1 style="font-size: 24px; font-weight: 600; color: #1A1A1A; margin: 20px 0;">Welcome to Your ${venue} ${portalLabel}</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
        Hi ${greetingName},
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
        ${intro}
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${input.portalUrl}" style="display: inline-block; background-color: ${GOLD}; color: #1A1A1A; padding: 16px 32px; text-decoration: none; font-weight: 700; border-radius: 6px; font-size: 16px; letter-spacing: 0.02em; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);">
          View Your Countdown
        </a>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;">
        You can access your portal anytime using the link above — no password required.
      </p>
      ${CLIENT_SIGNATURE_BLOCK_HTML}
    </div>
  `;

  const text = `Hi ${greetingName},\n\n${introText}\n\nView Your Countdown: ${input.portalUrl}\n\nYou can access your portal anytime using the link above — no password required.\n\n${CLIENT_SIGNOFF_TEXT}`;

  return { subject, html, text };
}

/**
 * PORTAL_REMINDER – 3-day follow-up if client hasn't opened the portal.
 * "We sent you your portal link – here it is again."
 */
export function PORTAL_REMINDER(input: PortalInvitationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const greetingName = getGreetingName(input.name) || "there";
  let venue = (input.venueName || "your venue").trim();
  const isWedding = (input.eventType || "").toLowerCase().trim() === "wedding";
  const portalLabel = isWedding ? "Wedding Portal" : "Booking Portal";

  venue = venue.replace(/babington\s+hiouse/gi, "Babington House");
  venue = venue.replace(/babington\s+houe/gi, "Babington House");

  const subject = `Reminder: Your ${venue} ${portalLabel} link | Stylish Entertainment Ltd`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
      <h1 style="font-size: 22px; font-weight: 600; color: #1A1A1A; margin: 20px 0;">Reminder: Your portal link</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
        Hi ${greetingName},
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
        We recently sent you a link to your ${portalLabel} for ${venue}. If you haven&apos;t had a chance to use it yet, here it is again — no password required.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${input.portalUrl}" style="display: inline-block; background-color: ${GOLD}; color: #1A1A1A; padding: 16px 32px; text-decoration: none; font-weight: 700; border-radius: 6px; font-size: 16px; letter-spacing: 0.02em; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);">
          View Your Countdown
        </a>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;">
        You can access your portal anytime using the link above.
      </p>
      ${CLIENT_SIGNATURE_BLOCK_HTML}
    </div>
  `;

  const text = `Hi ${greetingName},\n\nWe recently sent you a link to your ${portalLabel} for ${venue}. If you haven't had a chance to use it yet, here it is again — no password required.\n\nView Your Countdown: ${input.portalUrl}\n\nYou can access your portal anytime using the link above.\n\n${CLIENT_SIGNOFF_TEXT}`;

  return { subject, html, text };
}
