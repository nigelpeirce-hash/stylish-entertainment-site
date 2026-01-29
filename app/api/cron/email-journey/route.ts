import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getJourneyEmail, type JourneyStage } from "@/lib/email-journey-templates";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";
import { getBrochureLink } from "@/lib/venue-assets";
import { deduplicateName, getGreetingName } from "@/lib/utils/name-helpers";
import { PORTAL_REMINDER } from "@/lib/email/templates";

// Lazy initialization to prevent build-time errors
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Email Journey Automation Cron Job
 *
 * This endpoint should be called periodically (e.g., daily via Vercel Cron)
 * to automatically send journey emails based on triggers:
 *
 * 1. 3-Day Reminder: After enquiry autoresponder sent, send gentle reminder if no booking confirmed
 * 2. 4-Week Check-in: 4 weeks before event date
 * 3. Week-of Excitement: 7 days before event date
 * 4. FINAL_CHASE: 3 days before event – tokenized magic link, no login required
 * 5. Post-Wedding Magic: 3 days after event date
 * 6. Portal Reminder: Portal invite sent 3+ days ago, no reminder yet – resend magic link
 *
 * Usage: Set up Vercel Cron or external cron service to call this endpoint daily
 */

interface EmailJourneyStatus {
  enquiryAutoresponder?: { sentAt: string; messageId?: string };
  threeDayReminder?: { sentAt: string; messageId?: string };
  bookingConfirmation?: { sentAt: string; messageId?: string };
  fourWeekCheckin?: { sentAt: string; messageId?: string };
  weekOfExcitement?: { sentAt: string; messageId?: string };
  finalChase?: { sentAt: string; messageId?: string };
  postWeddingMagic?: { sentAt: string; messageId?: string };
  portalInvite?: { sentAt: string };
  portalReminder?: { sentAt: string; messageId?: string };
}

export async function GET(request: NextRequest) {
  // Optional: Add authentication/secret check for cron security
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // 1. Find bookings that need 3-day reminder (enquiry sent 3+ days ago, no booking confirmed)
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const bookingsNeedingReminderRaw = await prisma.booking.findMany({
      where: {
        status: { in: ["pending", "inquiry"] },
        lastEmailSentAt: {
          lte: threeDaysAgo,
        },
      },
      take: 100, // Process in batches
    });

    // Filter in code to check JSON field paths
    const bookingsNeedingReminder = bookingsNeedingReminderRaw.filter((booking) => {
      const emailsSent = booking.emailsSent as any;
      return emailsSent?.enquiryAutoresponder && !emailsSent?.threeDayReminder;
    });

    // 2. Find bookings needing 4-week check-in (event date is 28-29 days away)
    const fourWeeksFromNow = new Date(now);
    fourWeeksFromNow.setDate(fourWeeksFromNow.getDate() + 28);
    const fourWeeksStart = new Date(fourWeeksFromNow);
    fourWeeksStart.setHours(0, 0, 0, 0);
    const fourWeeksEnd = new Date(fourWeeksFromNow);
    fourWeeksEnd.setHours(23, 59, 59, 999);

    const bookingsNeeding4WeekCheckinRaw = await prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "pending"] },
        eventDate: {
          gte: fourWeeksStart,
          lte: fourWeeksEnd,
        },
      },
      take: 100,
    });

    const bookingsNeeding4WeekCheckin = bookingsNeeding4WeekCheckinRaw.filter((booking) => {
      const emailsSent = booking.emailsSent as any;
      return emailsSent?.bookingConfirmation && !emailsSent?.fourWeekCheckin;
    });

    // 3. Find bookings needing week-of excitement (event date is 6-7 days away)
    const oneWeekFromNow = new Date(now);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const oneWeekStart = new Date(oneWeekFromNow);
    oneWeekStart.setHours(0, 0, 0, 0);
    const oneWeekEnd = new Date(oneWeekFromNow);
    oneWeekEnd.setHours(23, 59, 59, 999);

    const bookingsNeedingWeekOfRaw = await prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "pending"] },
        eventDate: {
          gte: oneWeekStart,
          lte: oneWeekEnd,
        },
      },
      take: 100,
    });

    const bookingsNeedingWeekOf = bookingsNeedingWeekOfRaw.filter((booking) => {
      const emailsSent = booking.emailsSent as any;
      return !emailsSent?.weekOfExcitement;
    });

    // 3b. Find bookings needing FINAL_CHASE (event in 2–3 days; tokenized magic link)
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const finalChaseStart = new Date(twoDaysFromNow);
    finalChaseStart.setHours(0, 0, 0, 0);
    const finalChaseEnd = new Date(threeDaysFromNow);
    finalChaseEnd.setHours(23, 59, 59, 999);

    const bookingsNeedingFinalChaseRaw = await prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "pending"] },
        eventDate: {
          gte: finalChaseStart,
          lte: finalChaseEnd,
        },
      },
      take: 100,
    });

    const bookingsNeedingFinalChase = bookingsNeedingFinalChaseRaw.filter((booking) => {
      const emailsSent = booking.emailsSent as any;
      return !emailsSent?.finalChase;
    });

    // 4. Find bookings needing post-wedding magic (event date was 3 days ago, status is completed or past)
    const threeDaysAgoEvent = new Date(now);
    threeDaysAgoEvent.setDate(threeDaysAgoEvent.getDate() - 3);
    const threeDaysAgoStart = new Date(threeDaysAgoEvent);
    threeDaysAgoStart.setHours(0, 0, 0, 0);
    const threeDaysAgoEnd = new Date(threeDaysAgoEvent);
    threeDaysAgoEnd.setHours(23, 59, 59, 999);

    const bookingsNeedingPostWeddingRaw = await prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "completed"] },
        eventDate: {
          gte: threeDaysAgoStart,
          lte: threeDaysAgoEnd,
        },
      },
      take: 100,
    });

    const bookingsNeedingPostWedding = bookingsNeedingPostWeddingRaw.filter((booking) => {
      const emailsSent = booking.emailsSent as any;
      return !emailsSent?.postWeddingMagic;
    });

    // Portal reminder: invite sent 3+ days ago, no reminder yet
    const threeDaysAgoPortal = new Date(now);
    threeDaysAgoPortal.setDate(threeDaysAgoPortal.getDate() - 3);

    const portalReminderRaw = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        portalToken: { not: null },
        email: { not: "" },
      },
      take: 100,
    });

    const bookingsNeedingPortalReminder = portalReminderRaw.filter((booking) => {
      const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
      const sentAt = emailsSent?.portalInvite?.sentAt;
      if (!sentAt || emailsSent?.portalReminder) return false;
      const sent = new Date(sentAt);
      return sent.getTime() <= threeDaysAgoPortal.getTime();
    });

    // Process 3-day reminders
    for (const booking of bookingsNeedingReminder) {
      results.processed++;
      try {
        const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
        
        const emailData = {
          clientName: getGreetingName(deduplicateName(booking.name)) || booking.name,
          eventType: booking.eventType || "your event",
          eventDate: booking.eventDate
            ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : undefined,
          venueName: booking.venueName,
          clientAdminUrl: `https://stylishentertainment.co.uk/client/dashboard`,
        };

        // Use the dedicated gentle reminder template
        const emailContent = getJourneyEmail("gentle-reminder", emailData);
        const emailConfig = getResendConfig("booking");

        const emailResult = await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [booking.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        const messageId = 'data' in emailResult ? (emailResult as any).data?.id : undefined;

        // Update booking emailsSent
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: {
              ...emailsSent,
              threeDayReminder: {
                sentAt: now.toISOString(),
                messageId,
              },
            },
            lastEmailSentAt: now,
          },
        });

        results.sent++;
      } catch (error: any) {
        results.errors.push(`Booking ${booking.id}: ${error.message}`);
        results.skipped++;
      }
    }

    // Process 4-week check-ins
    for (const booking of bookingsNeeding4WeekCheckin) {
      results.processed++;
      try {
        const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
        
        const emailData = {
          clientName: getGreetingName(deduplicateName(booking.name)) || booking.name,
          eventType: booking.eventType || "your event",
          eventDate: new Date(booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          venueName: booking.venueName,
          clientAdminUrl: `https://stylishentertainment.co.uk/client/dashboard`,
        };

        const emailContent = getJourneyEmail("4-week-checkin", emailData);
        const emailConfig = getResendConfig("booking");

        const emailResult = await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [booking.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        const messageId = 'data' in emailResult ? (emailResult as any).data?.id : undefined;

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: {
              ...emailsSent,
              fourWeekCheckin: {
                sentAt: now.toISOString(),
                messageId,
              },
            },
            lastEmailSentAt: now,
          },
        });

        results.sent++;
      } catch (error: any) {
        results.errors.push(`Booking ${booking.id}: ${error.message}`);
        results.skipped++;
      }
    }

    // Process week-of excitement
    for (const booking of bookingsNeedingWeekOf) {
      results.processed++;
      try {
        const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
        
        const emailData = {
          clientName: getGreetingName(deduplicateName(booking.name)) || booking.name,
          eventType: booking.eventType || "your event",
          eventDate: new Date(booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          venueName: booking.venueName,
          clientAdminUrl: `https://stylishentertainment.co.uk/client/dashboard`,
        };

        const emailContent = getJourneyEmail("week-of-excitement", emailData);
        const emailConfig = getResendConfig("booking");

        const emailResult = await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [booking.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        const messageId = 'data' in emailResult ? (emailResult as any).data?.id : undefined;

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: {
              ...emailsSent,
              weekOfExcitement: {
                sentAt: now.toISOString(),
                messageId,
              },
            },
            lastEmailSentAt: now,
          },
        });

        results.sent++;
      } catch (error: any) {
        results.errors.push(`Booking ${booking.id}: ${error.message}`);
        results.skipped++;
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://stylishentertainment.co.uk";

    // Process FINAL_CHASE (3-day chase; tokenized magic link)
    for (const booking of bookingsNeedingFinalChase) {
      results.processed++;
      try {
        const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
        let portalToken = (booking as any).portalToken as string | null | undefined;

        if (!portalToken) {
          portalToken = randomBytes(32).toString("hex");
          await prisma.booking.update({
            where: { id: booking.id },
            data: { portalToken },
          });
        }

        const portalMagicUrl = `${baseUrl}/client/bookings/${booking.id}?token=${encodeURIComponent(portalToken)}`;

        const emailData = {
          clientName: getGreetingName(deduplicateName(booking.name)) || booking.name,
          eventType: booking.eventType || "your event",
          eventDate: new Date(booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          venueName: booking.venueName,
          clientAdminUrl: `${baseUrl}/client/dashboard`,
          portalMagicUrl,
        };

        const emailContent = getJourneyEmail("final-chase", emailData);
        const emailConfig = getResendConfig("booking");

        const emailResult = await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [booking.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        const messageId = "data" in emailResult ? (emailResult as any).data?.id : undefined;

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: {
              ...emailsSent,
              finalChase: {
                sentAt: now.toISOString(),
                messageId,
              },
            },
            lastEmailSentAt: now,
          },
        });

        results.sent++;
      } catch (error: any) {
        results.errors.push(`Booking ${booking.id}: ${error.message}`);
        results.skipped++;
      }
    }

    // Process post-wedding magic
    for (const booking of bookingsNeedingPostWedding) {
      results.processed++;
      try {
        const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
        
        const emailData = {
          clientName: getGreetingName(deduplicateName(booking.name)) || booking.name,
          eventType: booking.eventType || "your event",
          eventDate: new Date(booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          venueName: booking.venueName,
          clientAdminUrl: `https://stylishentertainment.co.uk/client/dashboard`,
        };

        const emailContent = getJourneyEmail("post-wedding-magic", emailData);
        const emailConfig = getResendConfig("booking");

        const emailResult = await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [booking.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        const messageId = 'data' in emailResult ? (emailResult as any).data?.id : undefined;

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: {
              ...emailsSent,
              postWeddingMagic: {
                sentAt: now.toISOString(),
                messageId,
              },
            },
            lastEmailSentAt: now,
          },
        });

        results.sent++;
      } catch (error: any) {
        results.errors.push(`Booking ${booking.id}: ${error.message}`);
        results.skipped++;
      }
    }

    // Process portal reminders (invite sent 3+ days ago, no reminder yet)
    for (const booking of bookingsNeedingPortalReminder) {
      results.processed++;
      try {
        const emailsSent = (booking.emailsSent as EmailJourneyStatus) || {};
        const portalToken = (booking as any).portalToken as string | null | undefined;
        if (!portalToken) {
          results.skipped++;
          continue;
        }
        const portalUrl = `${baseUrl}/client/bookings/${booking.id}?token=${encodeURIComponent(portalToken)}`;
        const emailContent = PORTAL_REMINDER({
          name: booking.name,
          venueName: booking.venueName || "your venue",
          portalUrl,
          eventType: (booking as any).eventType ?? undefined,
        });
        const emailConfig = getResendConfig("booking");

        const emailResult = await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [booking.email],
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        const messageId = "data" in emailResult ? (emailResult as any).data?.id : undefined;

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: {
              ...emailsSent,
              portalReminder: {
                sentAt: now.toISOString(),
                messageId,
              },
            },
            lastEmailSentAt: now,
          },
        });

        results.sent++;
      } catch (error: any) {
        results.errors.push(`Booking ${booking.id}: ${error.message}`);
        results.skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
      summary: {
        "3-day-reminders": bookingsNeedingReminder.length,
        "4-week-checkins": bookingsNeeding4WeekCheckin.length,
        "week-of-excitement": bookingsNeedingWeekOf.length,
        "final-chase": bookingsNeedingFinalChase.length,
        "post-wedding": bookingsNeedingPostWedding.length,
        "portal-reminders": bookingsNeedingPortalReminder.length,
      },
    });
  } catch (error: any) {
    console.error("Error in email journey automation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        results,
      },
      { status: 500 }
    );
  }
}
