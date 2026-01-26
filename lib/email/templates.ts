/**
 * Email templates for transactional emails (portal invite, etc.)
 */

import { deduplicateName, getDisplayName, getGreetingName } from "@/lib/utils/name-helpers";

const GOLD = "#D4AF37";

export interface PortalInvitationInput {
  name: string;
  venueName: string;
  portalUrl: string;
}

/**
 * PORTAL_INVITATION – Welcome to Your [Venue] Wedding Portal
 * Subject: Welcome to Your [Venue Name] Wedding Portal | Stylish Entertainment
 * Content: Hi [Name], we've set up your personal planning portal...
 * CTA: Gold-accented "Step Into Your Portal" (magic link).
 */
export function PORTAL_INVITATION(input: PortalInvitationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const greetingName = getGreetingName(input.name) || "there";
  const displayName = deduplicateName(getDisplayName(input.name) || input.name) || input.name;
  const venue = (input.venueName || "your venue").trim();

  const subject = `Welcome to Your ${venue} Wedding Portal | Stylish Entertainment Ltd`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
      <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 20px;"></div>
      <h1 style="font-size: 24px; font-weight: 600; color: #1A1A1A; margin: 20px 0;">Welcome to Your ${venue} Wedding Portal</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
        Hi ${greetingName},
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
        We've set up your personal planning portal for your wedding at <strong>${venue}</strong>. We've already added the key timings and venue details for you.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${input.portalUrl}" style="display: inline-block; background-color: ${GOLD}; color: #1A1A1A; padding: 16px 32px; text-decoration: none; font-weight: 700; border-radius: 6px; font-size: 16px; letter-spacing: 0.02em; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);">
          Step Into Your Portal
        </a>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;">
        You can access your portal anytime using the link above — no password required.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;">
        Best regards,<br />
        <strong>Stylish Entertainment Ltd</strong>
      </p>
    </div>
  `;

  const text = `Hi ${greetingName},\n\nWe've set up your personal planning portal for your wedding at ${venue}. We've already added the key timings and venue details for you.\n\nStep Into Your Portal: ${input.portalUrl}\n\nYou can access your portal anytime using the link above — no password required.\n\nBest regards,\nStylish Entertainment Ltd`;

  return { subject, html, text };
}
