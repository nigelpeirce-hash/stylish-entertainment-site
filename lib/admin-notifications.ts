/**
 * Admin notifications for significant booking events.
 * Sends email to admin inbox(es) and writes to AuditLog for dashboard activity feed.
 */

import { logActivity, type ActivityActor } from "@/lib/activity-log";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";
import sendEmail from "@/lib/email/send-email";

export type SignificantEventType =
  | "booking_request_received"
  | "quote_sent"
  | "deposit_paid"
  | "artist_assigned"
  | "handoff"
  | "dispatched"
  | "portal_message"
  | "final_details_confirmed"
  | "brief_sent";

export interface NotifyAdminOptions {
  type: SignificantEventType;
  bookingId: string;
  title: string;
  description: string;
  performedBy?: string | null;
  actor?: ActivityActor;
  metadata?: Record<string, unknown>;
  /** Optional: booking name/venue/date for email body */
  bookingName?: string;
  venueName?: string;
  eventDate?: string;
  /** Optional: link text (default "View booking") - e.g. "View enquiry" for new enquiries */
  linkText?: string;
}

const getResend = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" || !apiKey.startsWith("re_") || apiKey.length < 35) {
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Send admin notification email and create AuditLog entry for dashboard activity.
 * Does not throw; logs errors and returns.
 */
export async function notifyAdminSignificantEvent(options: NotifyAdminOptions): Promise<void> {
  const { type, bookingId, title, description, performedBy, actor, metadata, bookingName, venueName, eventDate, linkText } = options;

  const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
  const backupEmail = process.env.NOTIFICATION_EMAIL;
  const recipients = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];

  // 1. Create AuditLog entry (for dashboard activity feed)
  await logActivity({
    bookingId,
    action: type,
    description: description.slice(0, 500),
    performedBy,
    actor: actor ?? "system",
    metadata: metadata ?? undefined,
  });

  // 2. Send email to admin(s)
  const emailConfig = getResendConfig("general");
  const subject = `[Stylish] ${title}`;
  const bodyParts = [description];
  if (bookingName) bodyParts.push(`Booking: ${bookingName}`);
  if (venueName) bodyParts.push(`Venue: ${venueName}`);
  if (eventDate) bodyParts.push(`Event date: ${eventDate}`);
  const bodyText = bodyParts.join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">${title}</h2>
      <p style="color: #333; line-height: 1.6;">${description.replace(/\n/g, "<br>")}</p>
      ${bookingName ? `<p><strong>Booking:</strong> ${bookingName}</p>` : ""}
      ${venueName ? `<p><strong>Venue:</strong> ${venueName}</p>` : ""}
      ${eventDate ? `<p><strong>Event date:</strong> ${eventDate}</p>` : ""}
      ${performedBy ? `<p style="color: #666; font-size: 14px;"><strong>By:</strong> ${performedBy}</p>` : ""}
      <p style="margin-top: 20px; font-size: 14px;">
        <a href="${process.env.NEXTAUTH_URL || "https://stylishentertainment.co.uk"}/admin/bookings/${bookingId}" 
           style="color: #D4AF37; font-weight: bold;">${linkText || "View booking"} →</a>
      </p>
    </div>
  `;

  const resend = getResend();
  let sent = false;
  for (const to of recipients) {
    try {
      if (resend) {
        const result = await resend.emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [to],
          subject,
          html,
        });
        if (result.data?.id && !result.error) {
          console.log("[admin-notifications] Email sent to", to, "for", type);
          sent = true;
        }
      }
    } catch (e) {
      console.warn("[admin-notifications] Resend failed for", to, e);
    }
  }
  if (!sent) {
    try {
      const fallback = await sendEmail({
        to: recipientEmail,
        subject,
        html,
      });
      if (fallback?.data?.id && !fallback?.error) {
        console.log("[admin-notifications] Email sent via fallback to", recipientEmail);
      }
    } catch (e) {
      console.error("[admin-notifications] Fallback sendEmail failed:", e);
    }
  }
}
