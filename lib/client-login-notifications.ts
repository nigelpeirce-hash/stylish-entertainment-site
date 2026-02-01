/**
 * Client first-login notification – email to admin when a client logs into the portal for the first time.
 * Called from lib/auth.ts authorize (fire-and-forget, does not block login).
 */

import { prisma } from "@/lib/prisma";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";
import sendEmail from "@/lib/email/send-email";

const getResend = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" || !apiKey.startsWith("re_") || apiKey.length < 35) {
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Send email to admin when a client logs into the portal for the first time.
 * Looks up user and a related booking to include venue/date context.
 */
export async function sendClientFirstLoginNotification(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) return;

    const name = user.name || user.email || "Client";

    // Find a booking for this user (userId or email match), prefer one with userId
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { userId },
          { email: user.email, status: { not: "cancelled" } },
        ],
      },
      orderBy: { eventDate: "desc" },
      select: {
        id: true,
        venueName: true,
        eventDate: true,
        eventType: true,
      },
    });

    const venueName = booking?.venueName || "No venue linked";
    const eventDateStr = booking?.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : null;
    const subject = `[Stylish] Client first portal login: ${name} – ${venueName}${eventDateStr ? ` (${eventDateStr})` : ""}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">Client First Portal Login</h2>
        <p style="color: #333; line-height: 1.6;">A client has logged into the portal for the first time.</p>
        <p><strong>Client:</strong> ${name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        ${booking ? `
          <p><strong>Venue:</strong> ${venueName}</p>
          ${eventDateStr ? `<p><strong>Event date:</strong> ${eventDateStr}</p>` : ""}
          <p style="margin-top: 20px; font-size: 14px;">
            <a href="${process.env.NEXTAUTH_URL || "https://stylishentertainment.co.uk"}/admin/bookings/${booking.id}" 
               style="color: #D4AF37; font-weight: bold;">View booking →</a>
          </p>
        ` : `<p style="color: #666; font-size: 14px;">No booking linked to this user.</p>`}
      </div>
    `;

    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const backupEmail = process.env.NOTIFICATION_EMAIL;
    const recipients = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];

    const emailConfig = getResendConfig("general");
    const resend = getResend();

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
            console.log("[client-login] First login notification sent to", to);
            return;
          }
        }
      } catch (e) {
        console.warn("[client-login] Resend failed for", to, e);
      }
    }

    // Fallback
    try {
      const fallback = await sendEmail({ to: recipientEmail, subject, html });
      if (fallback?.data?.id && !fallback?.error) {
        console.log("[client-login] First login notification sent via fallback");
      }
    } catch (e) {
      console.error("[client-login] Fallback sendEmail failed:", e);
    }
  } catch (err) {
    console.error("[client-login] sendClientFirstLoginNotification error:", err);
  }
}
