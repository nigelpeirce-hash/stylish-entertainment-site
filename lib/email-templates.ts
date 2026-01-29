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
    subject: `Welcome ${name}! Your booking with Stylish Entertainment Ltd`,
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for booking with Stylish Entertainment Ltd.</p>
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

/** Event-type wording: "Your X date" (wedding / corporate party / party) + closing. */
function depositWording(eventType: string | null | undefined): { dateLabel: string; closing: string } {
  const label = yourEventLabel(eventType);
  if (label === "your wedding") return { dateLabel: "wedding", closing: "We can't wait for your big day." };
  if (label === "your corporate party") return { dateLabel: "corporate party", closing: "We look forward to your event." };
  return { dateLabel: "party", closing: "We look forward to celebrating with you." };
}

const TAGLINE = "Make every gathering extraordinary";

/** All client emails end with this sign-off. */
export const CLIENT_SIGNOFF_HTML = "Kind Regards,<br /><strong>Ali & Nige</strong>";
export const CLIENT_SIGNOFF_TEXT = "Kind Regards,\nAli & Nige";

/**
 * Dedicated signature block for client emails – "Kind Regards, Ali & Nige".
 * Use in templates so the sign-off is clearly visible (not lost in gray footer text).
 */
export const CLIENT_SIGNATURE_BLOCK_HTML = `<div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;"><p style="font-size: 15px; color: #1a1a1a; margin: 0; font-weight: 500;">Kind Regards,</p><p style="font-size: 15px; color: #1a1a1a; margin: 4px 0 0 0; font-weight: 700;">Ali & Nige</p></div>`;

/** Event-type label: "your wedding" | "your corporate party" | "your party". */
export function yourEventLabel(eventType: string | null | undefined): string {
  const t = (eventType || "").toLowerCase().trim();
  if (t === "wedding") return "your wedding";
  if (t === "corporate") return "your corporate party";
  return "your party";
}

/** Short label for "Your X date" (no "your"): "wedding" | "corporate party" | "party". */
function eventLabelShort(eventType: string | null | undefined): string {
  const t = (eventType || "").toLowerCase().trim();
  if (t === "wedding") return "wedding";
  if (t === "corporate") return "corporate party";
  return "party";
}

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
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 220px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
          <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px 0;">Stylish Entertainment</p>
          <p style="font-size: 14px; color: ${GOLD}; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin: 0;">Wedding Celebration</p>
        </div>
        <div style="text-align: center; margin-bottom: 28px;">
          <p style="font-size: 22px; line-height: 1.5; color: #1A1A1A; font-weight: 500; margin: 0 0 16px 0;">You're in — we're thrilled to confirm it.</p>
          <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: 300; margin: 0 0 16px 0;">Your wedding date, <strong style="color: ${GOLD}; font-weight: 600;">${eventDate}</strong>, is officially secured.${showVenue ? ` We'll be with you at <strong style="color: #1A1A1A;">${venue}</strong>.` : ""}</p>
          <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: 300; margin: 0;">We can't wait for your big day.</p>
        </div>
        <div style="text-align: center; margin: 36px 0;">
          <a href="${portalUrl}" style="display: inline-block; background-color: ${GOLD}; color: #1A1A1A; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; letter-spacing: 0.05em; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);">View Your Countdown</a>
        </div>
        <div style="border-top: 1px solid #eee; padding-top: 28px; margin-top: 32px; text-align: center;">
          <p style="font-size: 14px; color: #888; font-style: italic; margin: 0;">${TAGLINE}</p>
          <p style="font-size: 14px; color: #666; margin: 14px 0 0 0;">Questions or changes? We're here to help.</p>
          ${CLIENT_SIGNATURE_BLOCK_HTML}
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Wedding Celebration\n\nYou're in — we're thrilled to confirm it.\n\nYour wedding date, ${eventDate}, is officially secured.${showVenue ? ` We'll be with you at ${venue}.` : ""}\n\nWe can't wait for your big day.\n\nView Your Countdown: ${portalUrl}\n\n${TAGLINE}\n\nQuestions or changes? We're here to help.\n\n${CLIENT_SIGNOFF_TEXT}`;

  return {
    subject: `Your Date is Secured: ${clientName} x Stylish Entertainment Ltd`,
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
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 200px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto; opacity: 0.95;" />
          <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px 0;">Stylish Entertainment</p>
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
          ${CLIENT_SIGNATURE_BLOCK_HTML}
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Event Confirmed\n\nYou're in — we're thrilled to confirm it.\n\nYour ${dateLabel} date, ${eventDate}, is officially secured.${showVenue ? ` We'll be with you at ${venue}.` : ""}\n\n${closing}\n\nView Your Countdown: ${portalUrl}\n\n${TAGLINE}\n\nQuestions or changes? We're here to help.\n\n${CLIENT_SIGNOFF_TEXT}`;

  return {
    subject: `Your Date is Secured: ${clientName} x Stylish Entertainment Ltd`,
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
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 250px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
          <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px 0;">Stylish Entertainment</p>
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
          ${CLIENT_SIGNATURE_BLOCK_HTML}
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

${CLIENT_SIGNOFF_TEXT}
  `;
  
  return {
    subject: `Your Date is Secured: ${clientNames} x Stylish Entertainment Ltd`,
    html,
    text,
  };
}

/** Event-type wording for deposit invoice (please pay). */
function depositInvoiceWording(eventType: string | null | undefined): { intro: string; closing: string } {
  const label = yourEventLabel(eventType);
  if (label === "your wedding") return { intro: "Please pay your deposit to secure your wedding booking.", closing: "We can't wait for your big day." };
  if (label === "your corporate party") return { intro: "Please pay your deposit to secure your corporate party booking.", closing: "We look forward to your event." };
  return { intro: "Please pay your deposit to secure your party booking.", closing: "We look forward to celebrating with you." };
}

export interface DepositInvoiceBankDetails {
  name: string;
  sortCode: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
}

export interface DepositInvoicePayload {
  booking: BookingDetails & { clientName?: string };
  amount: number | null;
  reference: string;
  bankDetails?: DepositInvoiceBankDetails | null;
}

/**
 * Deposit invoice – "please pay" email. Event-type aware (wedding, corporate, private).
 * Use before payment; distinct from deposit confirmation ("you're in") sent after.
 */
export function depositInvoiceEmail({ booking, amount, reference, bankDetails }: DepositInvoicePayload): {
  subject: string;
  html: string;
  text: string;
} {
  const { eventDate, venue, showVenue, clientName } = depositEmailData(booking);
  const { intro, closing } = depositInvoiceWording(booking.eventType);
  const isWedding = (booking.eventType || "").toLowerCase().trim() === "wedding";
  const GOLD = "#D4AF37";
  const ACCENT = isWedding ? GOLD : "#475569";

  const amountBlock =
    amount != null && amount > 0
      ? `<p style="font-size: 20px; font-weight: 700; color: ${ACCENT}; margin: 24px 0;">Deposit amount: £${amount.toLocaleString("en-GB")}</p>`
      : '<p style="font-size: 18px; color: #333; margin: 24px 0;">Deposit amount as per your quote.</p>';

  const amountText = amount != null && amount > 0 ? `Deposit amount: £${amount.toLocaleString("en-GB")}` : "Deposit amount as per your quote.";

  const bank = bankDetails?.name && bankDetails?.sortCode && bankDetails?.accountNumber
    ? bankDetails
    : { name: "Stylish Entertainment Ltd", sortCode: "12-34-56", accountNumber: "12345678", iban: "GB82WEST12345698765432", swift: "EXMPGB21" };

  const bankBlock = `
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: left; border: 1px solid #eee;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin: 0 0 12px 0;">Payment details</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Bank</strong> ${bank.name}</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Sort code</strong> ${bank.sortCode}</p>
      <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Account number</strong> ${bank.accountNumber}</p>
      ${bank.iban ? `<p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>IBAN</strong> ${bank.iban}</p>` : ""}
      ${bank.swift ? `<p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>SWIFT / BIC</strong> ${bank.swift}</p>` : ""}
      <p style="font-size: 15px; color: #1a1a1a; margin: 12px 0 0 0;"><strong>Reference</strong> ${reference}</p>
    </div>`;

  const bankText = `\n\nPay by bank transfer\nUse the payment details below. Please quote the reference.\n\nBank details:\nBank: ${bank.name}\nSort code: ${bank.sortCode}\nAccount number: ${bank.accountNumber}${bank.iban ? `\nIBAN: ${bank.iban}` : ""}${bank.swift ? `\nSWIFT/BIC: ${bank.swift}` : ""}\nReference: ${reference}\n`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background: ${isWedding ? "linear-gradient(180deg, #fdf8f0 0%, #f5f0e8 100%)" : "#f8f9fa"};">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid ${isWedding ? `${GOLD}40` : "#e5e7eb"};">
        <div style="text-align: center; margin-bottom: 28px;">
          <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" style="max-width: 220px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
          <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px 0;">Stylish Entertainment</p>
          <p style="font-size: 14px; color: ${ACCENT}; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">Deposit invoice</p>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <p style="font-size: 18px; line-height: 1.6; color: #333; margin: 0 0 16px 0;">Hi ${clientName},</p>
          <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 500; margin: 0 0 16px 0;">${intro}</p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0;">Your ${eventLabelShort(booking.eventType)} date, <strong style="color: ${ACCENT};">${eventDate}</strong>,${showVenue ? ` at <strong>${venue}</strong>.` : "."}</p>
          ${amountBlock}
          <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 24px 0 8px 0;">Pay by bank transfer</p>
          <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;">Use the payment details below. Please quote the reference.</p>
          ${bankBlock}
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 24px 0 0 0;">${closing}</p>
        </div>
        <div style="border-top: 1px solid #eee; padding-top: 28px; margin-top: 32px; text-align: center;">
          <p style="font-size: 14px; color: #888; font-style: italic; margin: 0;">${TAGLINE}</p>
          <p style="font-size: 14px; color: #666; margin: 14px 0 0 0;">Questions or payment queries? Reply to this email or contact us.</p>
          ${CLIENT_SIGNATURE_BLOCK_HTML}
        </div>
      </div>
    </body>
    </html>
  `;

  const shortLabel = eventLabelShort(booking.eventType);
  const text = `Deposit invoice\n\nHi ${clientName},\n\n${intro}\n\nYour ${shortLabel} date, ${eventDate},${showVenue ? ` at ${venue}.` : "."}\n\n${amountText}${bankText}\n\n${closing}\n\n${TAGLINE}\n\nQuestions or payment queries? Reply to this email or contact us.\n\n${CLIENT_SIGNOFF_TEXT}`;

  return {
    subject: `Deposit invoice: ${clientName} – Stylish Entertainment Ltd`,
    html,
    text,
  };
}
