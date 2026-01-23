import { Booking } from "@prisma/client";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";

/** Sanitize client name for subject/body (fixes e.g. "Tim & SarahTim & Sarah"). */
function safeClientName(name: string | null | undefined): string {
  if (!name || !String(name).trim()) return "there";
  return deduplicateName(getDisplayName(name) || name) || "there";
}

export interface TemplateVariables {
  djFee?: string;
  eventDate?: string;
  eventTimings?: string;
  djName?: string;
  venueName?: string;
  clientName?: string;
  eventType?: string;
  numberOfGuests?: number;
  [key: string]: any;
}

/**
 * Process email template by replacing variables
 * Variables format: {{variableName}}
 */
export function processTemplate(
  template: string,
  variables: TemplateVariables
): string {
  let processed = template;

  // Replace all variables in format {{variableName}}
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    if (value !== undefined && value !== null) {
      // Replace {{key}} with value
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      processed = processed.replace(regex, String(value));
    }
  });

  // Remove any remaining unreplaced variables
  processed = processed.replace(/\{\{[^}]+\}\}/g, "");

  return processed;
}

/**
 * Extract template variables from booking (clientName sanitized).
 */
export function extractBookingVariables(booking: Booking): TemplateVariables {
  return {
    clientName: safeClientName(booking.name),
    venueName: booking.venueName,
    eventType: booking.eventType,
    eventDate: booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    eventTimings: booking.djStartTime && booking.djFinishTime
      ? `${booking.djStartTime} - ${booking.djFinishTime}`
      : booking.djStartTime || "TBC",
    djName: booking.preferredDJ || "TBC",
    numberOfGuests: booking.numberOfGuests || undefined,
  };
}

/**
 * Format DJ fee with currency
 */
export function formatDJFee(fee: number | string, accommodation?: boolean): string {
  const feeNum = typeof fee === "string" ? parseFloat(fee) : fee;
  const formatted = `£${feeNum.toLocaleString("en-GB")}`;
  return accommodation ? `${formatted} + accommodation` : formatted;
}

/**
 * Email template functions - Placeholder implementations
 * TODO: Implement proper email templates with HTML formatting
 */

interface BookingDetails {
  name?: string;
  eventType?: string;
  eventDate?: Date | string;
  venueName?: string;
  bookingId?: string;
}

export function welcomeEmail({ booking }: { booking: BookingDetails }): { subject: string; html: string } {
  const eventDate = booking.eventDate 
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBC";
  const name = safeClientName(booking.name);
  
  return {
    subject: `Welcome ${name}! Your booking with Stylish Entertainment`,
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for booking with Stylish Entertainment.</p>
      <p><strong>Event:</strong> ${booking.eventType || "TBC"}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Venue:</strong> ${booking.venueName || "TBC"}</p>
      <p>We'll be in touch soon with more details.</p>
    `,
  };
}

export function bookingConfirmationEmail({ booking }: { booking: BookingDetails }): { subject: string; html: string } {
  const eventDate = booking.eventDate 
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBC";
  const name = safeClientName(booking.name);
  
  return {
    subject: `Booking Confirmation - ${booking.eventType || "Event"} at ${booking.venueName || "TBC"}`,
    html: `
      <h1>Booking Confirmed</h1>
      <p>Hi ${name},</p>
      <p>Your booking has been confirmed!</p>
      <p><strong>Event:</strong> ${booking.eventType || "TBC"}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Venue:</strong> ${booking.venueName || "TBC"}</p>
      <p>We're looking forward to making your event special.</p>
    `,
  };
}

export function finalDetailsReminderEmail({ booking }: { booking: BookingDetails }): { subject: string; html: string } {
  const eventDate = booking.eventDate 
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBC";
  const name = safeClientName(booking.name);
  
  return {
    subject: `Final Details Reminder - ${booking.eventType || "Event"} on ${eventDate}`,
    html: `
      <h1>Final Details Reminder</h1>
      <p>Hi ${name},</p>
      <p>Your event is coming up soon! We need to finalize some details.</p>
      <p><strong>Event:</strong> ${booking.eventType || "TBC"}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Venue:</strong> ${booking.venueName || "TBC"}</p>
      <p>Please get in touch if you have any questions or need to make changes.</p>
    `,
  };
}

export function paymentReminderEmail({ booking }: { booking: BookingDetails }): { subject: string; html: string } {
  const eventDate = booking.eventDate 
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBC";
  const name = safeClientName(booking.name);
  
  return {
    subject: `Payment Reminder - ${booking.eventType || "Event"} on ${eventDate}`,
    html: `
      <h1>Payment Reminder</h1>
      <p>Hi ${name},</p>
      <p>This is a reminder that payment is due soon for your upcoming event.</p>
      <p><strong>Event:</strong> ${booking.eventType || "TBC"}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Venue:</strong> ${booking.venueName || "TBC"}</p>
      <p>Please contact us to arrange payment.</p>
    `,
  };
}

/** Event-type wording for deposit confirmed: date label + closing phrase. */
function depositWording(eventType: string | null | undefined): { dateLabel: string; closing: string } {
  const t = (eventType || "").toLowerCase().trim();
  switch (t) {
    case "wedding":
      return { dateLabel: "ceremony", closing: "We can't wait for your big day." };
    case "corporate":
      return { dateLabel: "commencement", closing: "We look forward to your event." };
    default:
      return { dateLabel: "date", closing: "We look forward to celebrating with you." };
  }
}

const TAGLINE = "Make every gathering extraordinary";

/** Shared deposit-email data; clientName must be pre-cleaned (deduplicated). */
function depositEmailData(booking: BookingDetails & { clientName?: string }) {
  const eventDate = booking.eventDate 
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBC";
  const venue = (booking.venueName || "").trim();
  const showVenue = venue && venue.toUpperCase() !== "TBD" && venue.toUpperCase() !== "TBC";
  const clientName = booking.clientName ?? safeClientName(booking.name);
  return { eventDate, venue, showVenue, clientName };
}

/**
 * Wedding Celebration – gold confetti theme. Use when eventType === 'wedding'.
 */
export function depositEmailWeddingCelebration({
  booking,
  portalUrl,
}: {
  booking: BookingDetails & { clientName?: string };
  portalUrl: string;
}): { subject: string; html: string; text: string } {
  const { eventDate, venue, showVenue, clientName } = depositEmailData(booking);
  const GOLD = "#D4AF37";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(180deg, #fdf8f0 0%, #f5f0e8 100%);">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15); border: 1px solid ${GOLD}40;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="Stylish Entertainment" style="max-width: 220px; height: auto; margin-bottom: 20px;" />
          <p style="font-size: 14px; color: ${GOLD}; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin: 0;">Wedding Celebration</p>
        </div>
        <div style="text-align: center; margin-bottom: 28px;">
          <p style="font-size: 22px; line-height: 1.5; color: #1A1A1A; font-weight: 500; margin: 0 0 16px 0;">You're in — we're thrilled to confirm it.</p>
          <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: 300; margin: 0 0 16px 0;">Your ceremony date, <strong style="color: ${GOLD}; font-weight: 600;">${eventDate}</strong>, is officially secured.${showVenue ? ` We'll be with you at <strong style="color: #1A1A1A;">${venue}</strong>.` : ""}</p>
          <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: 300; margin: 0;">We can't wait for your big day.</p>
        </div>
        <div style="text-align: center; margin: 36px 0;">
          <a href="${portalUrl}" style="display: inline-block; background-color: ${GOLD}; color: #1A1A1A; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; letter-spacing: 0.05em; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);">View Your Countdown</a>
        </div>
        <div style="border-top: 1px solid #eee; padding-top: 28px; margin-top: 32px; text-align: center;">
          <p style="font-size: 14px; color: #888; font-style: italic; margin: 0;">${TAGLINE}</p>
          <p style="font-size: 14px; color: #666; margin: 14px 0 0 0;">Questions or changes? We're here to help.</p>
          <p style="font-size: 14px; color: #666; margin-top: 18px;">Best regards,<br><strong style="color: #1A1A1A;">Stylish Entertainment</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Wedding Celebration\n\nYou're in — we're thrilled to confirm it.\n\nYour ceremony date, ${eventDate}, is officially secured.${showVenue ? ` We'll be with you at ${venue}.` : ""}\n\nWe can't wait for your big day.\n\nView Your Countdown: ${portalUrl}\n\n${TAGLINE}\n\nQuestions or changes? We're here to help.\n\nBest regards,\nStylish Entertainment`;

  return {
    subject: `Your Date is Secured: ${clientName} x Stylish Entertainment`,
    html,
    text,
  };
}

/**
 * Event Confirmed – professional template. Use for corporate / private.
 */
export function depositEmailEventConfirmed({
  booking,
  portalUrl,
}: {
  booking: BookingDetails & { clientName?: string };
  portalUrl: string;
}): { subject: string; html: string; text: string } {
  const { eventDate, venue, showVenue, clientName } = depositEmailData(booking);
  const { dateLabel, closing } = depositWording(booking.eventType);
  const ACCENT = "#475569";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <div style="text-align: center; margin-bottom: 28px;">
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="Stylish Entertainment" style="max-width: 200px; height: auto; margin-bottom: 16px; opacity: 0.95;" />
          <p style="font-size: 13px; color: ${ACCENT}; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">Event Confirmed</p>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <p style="font-size: 20px; line-height: 1.5; color: #1A1A1A; font-weight: 500; margin: 0 0 14px 0;">You're in — we're thrilled to confirm it.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #374151; font-weight: 400; margin: 0 0 14px 0;">Your ${dateLabel} date, <strong style="color: ${ACCENT};">${eventDate}</strong>, is officially secured.${showVenue ? ` We'll be with you at <strong>${venue}</strong>.` : ""}</p>
          <p style="font-size: 16px; line-height: 1.6; color: #374151; font-weight: 400; margin: 0;">${closing}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${portalUrl}" style="display: inline-block; background-color: ${ACCENT}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">View Your Countdown</a>
        </div>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 28px; text-align: center;">
          <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">${TAGLINE}</p>
          <p style="font-size: 13px; color: #6b7280; margin: 12px 0 0 0;">Questions or changes? We're here to help.</p>
          <p style="font-size: 13px; color: #6b7280; margin-top: 16px;">Best regards,<br><strong style="color: #1A1A1A;">Stylish Entertainment</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Event Confirmed\n\nYou're in — we're thrilled to confirm it.\n\nYour ${dateLabel} date, ${eventDate}, is officially secured.${showVenue ? ` We'll be with you at ${venue}.` : ""}\n\n${closing}\n\nView Your Countdown: ${portalUrl}\n\n${TAGLINE}\n\nQuestions or changes? We're here to help.\n\nBest regards,\nStylish Entertainment`;

  return {
    subject: `Your Date is Secured: ${clientName} x Stylish Entertainment`,
    html,
    text,
  };
}

export function DEPOSIT_CONFIRMED({ booking, portalUrl }: { booking: BookingDetails; portalUrl: string }): { subject: string; html: string; text: string } {
  const eventDate = booking.eventDate 
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "TBC";
  const venue = (booking.venueName || "").trim();
  const showVenue = venue && venue.toUpperCase() !== "TBD" && venue.toUpperCase() !== "TBC";
  
  const clientNames = safeClientName(booking.name);
  const { dateLabel, closing } = depositWording(booking.eventType);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f0;">
      <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="Stylish Entertainment Logo" style="max-width: 250px; height: auto; margin-bottom: 20px;" />
        </div>
        
        <!-- Main Content - premium invitation tone -->
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="font-size: 22px; line-height: 1.5; color: #1A1A1A; font-weight: 400; margin: 0 0 16px 0;">
            You're in — we're thrilled to confirm it.
          </p>
          <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: 300; margin: 0 0 20px 0;">
            Your ${dateLabel} date, <strong style="color: #D4AF37; font-weight: 600;">${eventDate}</strong>, is officially secured.${showVenue ? ` We'll be with you at <strong style="color: #1A1A1A;">${venue}</strong>.` : ""}
          </p>
          <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: 300; margin: 0;">
            ${closing}
          </p>
        </div>
        
        <!-- CTA - unique portal link per booking -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${portalUrl}" style="display: inline-block; background-color: #D4AF37; color: #1A1A1A; text-decoration: none; padding: 18px 40px; border-radius: 4px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(212, 175, 55, 0.3);">View Your Countdown</a>
        </div>
        
        <!-- Footer -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 40px; text-align: center;">
          <p style="font-size: 14px; line-height: 1.6; color: #888; font-style: italic; margin: 0;">
            ${TAGLINE}
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 16px 0 0 0;">
            Questions or changes? We're here to help.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
            Best regards,<br><strong style="color: #1A1A1A;">Stylish Entertainment</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
You're in — we're thrilled to confirm it.

Your ${dateLabel} date, ${eventDate}, is officially secured.${showVenue ? ` We'll be with you at ${venue}.` : ""}


${closing}

View Your Countdown: ${portalUrl}

${TAGLINE}

Questions or changes? We're here to help.

Best regards,
Stylish Entertainment
  `;
  
  return {
    subject: `Your Date is Secured: ${clientNames} x Stylish Entertainment`,
    html,
    text,
  };
}
