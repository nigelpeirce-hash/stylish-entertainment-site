import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { 
  fetchLockedEventData, 
  populateEmailTemplate,
  validateEventStatus 
} from "@/lib/email-template-utils";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import { Resend } from "resend";
import { 
  ensureBookingReference, 
  getThreadingHeaders,
  generateMessageId,
  generateThreadIdFooter
} from "@/lib/booking-integrity";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy Resend initialization
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const templateId = resolvedParams.id;
    const body = await request.json();
    const { bookingId, recipientEmail, overrideSubject, overrideHtml } = body;

    if (!bookingId || !recipientEmail) {
      return NextResponse.json(
        { error: "bookingId and recipientEmail are required" },
        { status: 400 }
      );
    }

    // Fetch template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Fetch locked event data
    const eventData = await fetchLockedEventData(bookingId);

    // Validate event status
    const validation = validateEventStatus(eventData.status);
    if (!validation.isValid) {
      // Return warning but don't block - let admin decide
      return NextResponse.json({
        success: false,
        warning: validation.warning,
        eventStatus: eventData.status,
        requiresConfirmation: true,
      });
    }

    // Ensure booking has a reference for email threading
    const bookingReference = await ensureBookingReference(bookingId);
    
    // Populate template with event data (include booking reference for Thread-ID)
    const populated = populateEmailTemplate(
      overrideHtml || template.bodyHtml,
      overrideSubject || template.subject,
      {
        ...eventData,
        bookingReference: bookingReference || undefined, // Add to template variables
      } as any // Type assertion to allow bookingReference
    );

    // Add Thread-ID footer to email HTML for threading (invisible in email clients)
    const finalHtml = bookingReference
      ? populated.html + generateThreadIdFooter(bookingReference)
      : populated.html;
    
    // Get threading headers for email threading
    const threadingHeaders = bookingReference 
      ? getThreadingHeaders(bookingReference)
      : {};

    // Send email
    const emailConfig = getResendConfig("general");
    
    try {
      const result = await getResend().emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [recipientEmail],
        subject: populated.subject,
        html: finalHtml, // Include Thread-ID footer
        headers: threadingHeaders, // Add In-Reply-To and References headers
      });

      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.data?.id,
        populatedSubject: populated.subject,
        eventStatus: eventData.status,
        contractData: eventData.contractData,
      });
    } catch (emailError: any) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: process.env.NODE_ENV === "development" ? emailError.message : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error sending template email:", error);
    return NextResponse.json(
      {
        error: "Failed to send template email",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
