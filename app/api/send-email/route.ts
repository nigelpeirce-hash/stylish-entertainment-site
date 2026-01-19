import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getJourneyEmail, type JourneyStage, type JourneyEmailData } from "@/lib/email-journey-templates";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { getResendConfig } from "@/lib/email-config";
import { getBrochureLink, getVenueAsset, getTrackingUrl } from "@/lib/venue-assets";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy initialization to prevent build-time errors
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication (admin or authorized user)
    const session = await getServerSession();
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { stage, clientEmail, bookingId, clientData } = body;

    // Validate required fields
    if (!stage || !clientEmail) {
      return NextResponse.json(
        { error: "Missing required fields: stage and clientEmail" },
        { status: 400 }
      );
    }

    // Validate stage
    const validStages: JourneyStage[] = [
      "inquiry-autoresponder",
      "booking-confirmation",
      "4-week-checkin",
      "week-of-excitement",
      "post-wedding-magic",
    ];

    if (!validStages.includes(stage as JourneyStage)) {
      return NextResponse.json(
        { error: `Invalid stage. Must be one of: ${validStages.join(", ")}` },
        { status: 400 }
      );
    }

    // Get booking data if bookingId provided
    let emailData: JourneyEmailData = {
      clientName: clientData?.clientName || "Valued Client",
      eventType: clientData?.eventType,
      eventDate: clientData?.eventDate,
      venueName: clientData?.venueName,
      clientAdminUrl: clientData?.clientAdminUrl || `https://stylishentertainment.co.uk/client/dashboard`,
      brochureUrl: clientData?.brochureUrl, // Will be set below if not provided
    };

    // If bookingId provided, fetch booking data
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (booking) {
        emailData = {
          clientName: booking.name,
          eventType: booking.eventType,
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
          brochureUrl: undefined, // Will be set below
        };
      }
    }

    // Generate venue-specific brochure URL (for inquiry-autoresponder only)
    if (stage === "inquiry-autoresponder") {
      // Get brochure link using simple mapping: venueAssets[venueName] || venueAssets["General"]
      const brochureLink = await getBrochureLink(emailData.venueName);
      
      // For tracking, we can optionally wrap it in a tracking URL
      // For now, use direct link (can add tracking later if needed)
      emailData.brochureUrl = brochureLink;
    } else if (!emailData.brochureUrl) {
      // Fallback for other email types if brochureUrl not provided
      const generalBrochure = await getBrochureLink(null);
      emailData.brochureUrl = generalBrochure || `https://stylishentertainment.co.uk/brochure.pdf`;
    }

    // Generate email content
    const emailContent = getJourneyEmail(stage as JourneyStage, emailData);

    // Use centralised email config with dynamic sender name based on email type (booking emails)
    const emailConfig = getResendConfig("booking");

    // Send email via Resend
    const result = await getResend().emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [clientEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Log email send (optional - save to database if needed)
    if (bookingId) {
      try {
        // You could save email history to database here
        // await prisma.emailLog.create({...})
      } catch (dbError) {
        console.error("Error logging email to database:", dbError);
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
