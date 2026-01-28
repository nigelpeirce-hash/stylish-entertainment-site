import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Audit endpoint to check contact form email status
 * GET /api/contact/audit?limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Get recent bookings (contact form submissions)
    const recentBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        bookingReference: true,
        emailsSent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Check environment variables
    const envCheck = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      CONTACT_FORM_EMAIL: process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk",
      NODE_ENV: process.env.NODE_ENV,
    };

    // Parse email details from bookings
    const emailAudit = recentBookings.map((booking) => {
      const emailsSent = booking.emailsSent as any;
      return {
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        clientName: booking.name,
        clientEmail: booking.email,
        submittedAt: booking.createdAt,
        emailStatus: {
          businessEmailSent: emailsSent?.businessEmailSent || false,
          businessEmailMessageId: emailsSent?.businessEmailMessageId || null,
          businessEmailError: emailsSent?.businessEmailError || null,
          businessEmailTo: emailsSent?.businessEmailTo || envCheck.CONTACT_FORM_EMAIL,
          confirmationEmailSent: emailsSent?.confirmationEmailSent || false,
          confirmationEmailMessageId: emailsSent?.confirmationEmailMessageId || null,
        },
      };
    });

    return NextResponse.json({
      success: true,
      environment: envCheck,
      recentSubmissions: emailAudit,
      summary: {
        total: emailAudit.length,
        businessEmailsSent: emailAudit.filter(e => e.emailStatus.businessEmailSent).length,
        businessEmailsFailed: emailAudit.filter(e => !e.emailStatus.businessEmailSent && e.emailStatus.businessEmailError).length,
        confirmationEmailsSent: emailAudit.filter(e => e.emailStatus.confirmationEmailSent).length,
      },
    });
  } catch (error: any) {
    console.error("❌ Audit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
