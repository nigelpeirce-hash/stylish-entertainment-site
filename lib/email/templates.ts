/**
 * Email templates for transactional emails (first touch, etc.)
 */

import { getGreetingName } from "@/lib/utils/name-helpers";
import { SIGNATURE_BLOCK_HTML, CLIENT_SIGNOFF_TEXT, EMAIL_LOGO_HTML } from "@/lib/email-signature";

export interface FirstTouchInput {
  name: string;
  email: string;
  venueName: string;
  eventDate: Date;
}

/**
 * FIRST_TOUCH – Thank-you for enquiry; venue and date from booking.
 * Greeting and sign-off use Georgia serif for a refined, high-end feel.
 */
export function FIRST_TOUCH(input: FirstTouchInput): {
  subject: string;
  html: string;
  text: string;
} {
  const greetingName = getGreetingName(input.name) || "there";
  const venue = (input.venueName || "your venue").trim();
  const eventDate = input.eventDate instanceof Date ? input.eventDate : new Date(input.eventDate);
  const dateStr = eventDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `Thank you for your enquiry – ${venue} | Stylish Entertainment Ltd`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(180deg, #fdf8f0 0%, #f5f0e8 100%);">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.25);">
        <div style="text-align: center; margin-bottom: 32px;">
          ${EMAIL_LOGO_HTML}
          <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0;">Stylish Entertainment</p>
        </div>
        <p style="font-family: 'Georgia', serif; font-size: 18px; line-height: 1.6; color: #222222; margin: 20px 0;">Hi ${greetingName},</p>
        <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">Thanks for reaching out about <strong>${venue}</strong> on <strong>${dateStr}</strong>.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">We're checking our talent availability and will get back to you shortly. We're excited to help make your event unforgettable.</p>
        ${SIGNATURE_BLOCK_HTML}
      </div>
    </body>
    </html>
  `;

  const text = `Hi ${greetingName},\n\nThanks for reaching out about ${venue} on ${dateStr}.\n\nWe're checking our talent availability and will get back to you shortly. We're excited to help make your event unforgettable.\n\n${CLIENT_SIGNOFF_TEXT}`;

  return { subject, html, text };
}
