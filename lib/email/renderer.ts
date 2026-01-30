/**
 * Email Formatting Utility
 *
 * Table-based layout, inline CSS only. SMTP-friendly for Outlook, Gmail, Apple Mail.
 * - Global: dark bg #0a0a0a, white text. Accents by event type: Champagne Gold | Slate & Silver | Amber Glow.
 * - Conditional header, CTA, and branding per event type.
 * - Footer: "Every gathering deserves to be extraordinary" tagline + event-type CTA magic link.
 *
 * bodyHtml should use inline styles (e.g. <a href="..." style="color: #d4af37;">). No external CSS.
 */

import { getEventTypeEmailProfile } from "@/lib/utils/event-type-messaging";

const BG = "#0a0a0a";
const TEXT = "#ffffff";
const MUTED = "#a3a3a3";

/** Champagne Gold */
const CHAMPAGNE_GOLD = "#d4af37";
/** Slate & Silver: primary CTA uses silver */
const SLATE = "#64748b";
const SILVER = "#c0c0c0";
/** Amber Glow */
const AMBER_GLOW = "#f59e0b";

const ACCENT_HEX: Record<string, { cta: string; border: string }> = {
  "Champagne Gold": { cta: CHAMPAGNE_GOLD, border: "#2a2518" },
  "Slate & Silver": { cta: SILVER, border: SLATE },
  "Amber Glow": { cta: AMBER_GLOW, border: "#78350f" },
};

const LOGO_URL =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png";

const TAGLINE = "Every gathering deserves to be extraordinary";

export type EventTypeVariant = "wedding" | "corporate" | "private";

export interface EmailRenderOptions {
  /** wedding | corporate | private; default: private */
  eventType?: string | null;
  /** Magic link for CTA button */
  portalUrl: string;
  /** Main body HTML (will be wrapped in styled container) */
  bodyHtml: string;
  /** Optional plain-text fallback for multipart emails */
  bodyText?: string;
  /** Override logo URL (default: Stylish Entertainment gold logo) */
  logoUrl?: string;
  /** Override header title; else derived from eventType */
  headerTitle?: string;
  /** [Name] in subject – e.g. "Sarah & Mike" */
  clientName?: string | null;
  /** [Company Name] in subject – for corporate */
  companyName?: string | null;
}

function resolveVariant(eventType: string | null | undefined): EventTypeVariant {
  if (!eventType) return "private";
  const n = eventType.toLowerCase().trim();
  if (n === "wedding") return "wedding";
  if (n === "corporate") return "corporate";
  return "private";
}

function getHeaderConfig(
  variant: EventTypeVariant,
  accentHex: { cta: string; border: string },
  overrideTitle?: string
): { title: string; fontFamily: string; titleColor: string; logoStyle: string } {
  if (overrideTitle) {
    return {
      title: overrideTitle,
      fontFamily: "Georgia, 'Times New Roman', serif",
      titleColor: accentHex.cta,
      logoStyle: "max-width: 200px; height: auto; display: block; margin: 0 auto 16px auto;",
    };
  }
  switch (variant) {
    case "wedding":
      return {
        title: "Your Wedding Journey",
        fontFamily: "Georgia, 'Times New Roman', serif",
        titleColor: accentHex.cta,
        logoStyle: "max-width: 200px; height: auto; display: block; margin: 0 auto 16px auto;",
      };
    case "corporate":
      return {
        title: "Event Confirmation",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        titleColor: accentHex.cta,
        logoStyle:
          "max-width: 180px; height: auto; display: block; margin: 0 auto 16px auto; opacity: 0.9;",
      };
    default:
      return {
        title: "Your Celebration",
        fontFamily: "Georgia, 'Times New Roman', serif",
        titleColor: accentHex.cta,
        logoStyle: "max-width: 200px; height: auto; display: block; margin: 0 auto 16px auto;",
      };
  }
}

/**
 * Renders a full email HTML document with global dark theme, conditional header, and footer.
 * Uses tables + inline CSS for Outlook, Gmail, and Apple Mail.
 * CTA and accent come from event-type email profile.
 */
export function renderEmail(options: EmailRenderOptions): string {
  const {
    eventType,
    portalUrl,
    bodyHtml,
    logoUrl = LOGO_URL,
    headerTitle: overrideTitle,
  } = options;

  const variant = resolveVariant(eventType);
  const profile = getEventTypeEmailProfile(eventType);
  const accentHex = ACCENT_HEX[profile.accent] ?? ACCENT_HEX["Champagne Gold"];
  const header = getHeaderConfig(variant, accentHex, overrideTitle ?? undefined);

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${header.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BG}; color: ${TEXT}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BG};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid ${accentHex.border};">
              <img src="${logoUrl}" alt="Stylish Entertainment" style="${header.logoStyle}" />
              <h1 style="margin: 0; font-family: ${header.fontFamily}; font-size: 24px; font-weight: 600; color: ${header.titleColor}; letter-spacing: 0.02em;">
                ${header.title}
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 0; font-size: 16px; line-height: 1.6; color: ${TEXT};">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid ${accentHex.border};">
              <p style="margin: 0 0 16px 0; font-size: 10px; color: ${MUTED}; font-style: italic; text-transform: uppercase; letter-spacing: 2px;">
                ${TAGLINE}
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0;">
                <tr>
                  <td style="background-color: ${accentHex.cta}; border-radius: 4px;">
                    <a href="${portalUrl}" style="display: inline-block; background-color: ${accentHex.cta}; color: ${BG}; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 600;">
                      ${profile.cta}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 12px; color: ${MUTED};">
                &copy; Stylish Entertainment Ltd. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Builds plain-text version from bodyText (if provided) or bodyHtml (strip tags), then appends
 * tagline + event-type CTA link. Use as fallback when sending multipart emails.
 */
export function renderEmailText(options: EmailRenderOptions): string {
  const { bodyHtml, bodyText, portalUrl, eventType } = options;
  const main = bodyText ?? bodyHtml.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const profile = getEventTypeEmailProfile(eventType);
  return `${main}

${TAGLINE}

${profile.cta}: ${portalUrl}

— Stylish Entertainment Ltd`;
}

/**
 * Returns both HTML and plain-text for multipart send.
 */
export function renderEmailMultipart(options: EmailRenderOptions): { html: string; text: string } {
  return {
    html: renderEmail(options),
    text: renderEmailText(options),
  };
}
