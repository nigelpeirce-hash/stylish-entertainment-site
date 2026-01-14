import { Booking } from "@prisma/client";

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
 * Extract template variables from booking
 */
export function extractBookingVariables(booking: Booking): TemplateVariables {
  return {
    clientName: booking.name,
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
  
  return {
    subject: `Welcome ${booking.name || "there"}! Your booking with Stylish Entertainment`,
    html: `
      <h1>Welcome ${booking.name || "there"}!</h1>
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
  
  return {
    subject: `Booking Confirmation - ${booking.eventType || "Event"} at ${booking.venueName || "TBC"}`,
    html: `
      <h1>Booking Confirmed</h1>
      <p>Hi ${booking.name || "there"},</p>
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
  
  return {
    subject: `Final Details Reminder - ${booking.eventType || "Event"} on ${eventDate}`,
    html: `
      <h1>Final Details Reminder</h1>
      <p>Hi ${booking.name || "there"},</p>
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
  
  return {
    subject: `Payment Reminder - ${booking.eventType || "Event"} on ${eventDate}`,
    html: `
      <h1>Payment Reminder</h1>
      <p>Hi ${booking.name || "there"},</p>
      <p>This is a reminder that payment is due soon for your upcoming event.</p>
      <p><strong>Event:</strong> ${booking.eventType || "TBC"}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Venue:</strong> ${booking.venueName || "TBC"}</p>
      <p>Please contact us to arrange payment.</p>
    `,
  };
}
