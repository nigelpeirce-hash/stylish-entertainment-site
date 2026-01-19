import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for API routes that interact with the database
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Fetch all bookings within the next 90 days for the Command Centre
 * Sorted by eventDate (closest first)
 */
export async function GET(request: NextRequest) {
  try {
    // In development, allow access even if admin check fails (for dev bypass)
    let admin = await requireAdmin(request);
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (!admin && !isDevelopment) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(now.getDate() + 90);

    // Fetch bookings where eventDate is within next 90 days
    const bookings = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: now, // Greater than or equal to today
          lte: ninetyDaysFromNow, // Less than or equal to 90 days from now
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        venueName: true,
        eventDate: true,
        eventType: true,
        status: true,
        priority: true,
        emailsSent: true, // Contains status toggles
        createdAt: true,
      },
      orderBy: {
        eventDate: "asc", // Closest first
      },
    });

    // Calculate days remaining and extract status toggles from emailsSent
    const bookingsWithMetadata = bookings.map((booking) => {
      const eventDate = new Date(booking.eventDate);
      const daysRemaining = Math.ceil(
        (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const emailsSent = (booking.emailsSent as any) || {};
      const commandCentreStatus = emailsSent.commandCentre || {};

      return {
        ...booking,
        daysRemaining,
        statusToggles: {
          depositVerified: commandCentreStatus.depositVerified || false,
          djWorksheetDispatched: commandCentreStatus.djWorksheetDispatched || commandCentreStatus.djBriefDispatched || false, // Support old field name for backward compatibility
          finalPaymentReceived: commandCentreStatus.finalPaymentReceived || false,
          siteVisitDone: commandCentreStatus.siteVisitDone || false,
        },
      };
    });

    // Add demo data in development mode - always show demo data for testing
    const demoData: any[] = [];
    if (process.env.NODE_ENV === "development" || process.env.DEMO_MODE === "true") {
      const baseDate = new Date();
      const demoBookings = [
        {
          id: "demo-booking-1",
          name: "Sarah & Tom",
          email: "sarah.tom@example.com",
          venueName: "Babington House",
          eventDate: new Date(baseDate.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days
          eventType: "Wedding",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 22,
          statusToggles: {
            depositVerified: true,
            djWorksheetDispatched: false,
            finalPaymentReceived: false,
            siteVisitDone: false,
          },
        },
        {
          id: "demo-booking-2",
          name: "Emma & James",
          email: "emma.james@example.com",
          venueName: "Kin House",
          eventDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days
          eventType: "Wedding",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 45,
          statusToggles: {
            depositVerified: true,
            djWorksheetDispatched: true,
            finalPaymentReceived: false,
            siteVisitDone: true,
          },
        },
        {
          id: "demo-booking-3",
          name: "Lighting Hire - Countryside Manor",
          email: "events@countrysidemanor.co.uk",
          venueName: "Countryside Manor, Somerset",
          eventDate: new Date(baseDate.getTime() + 38 * 24 * 60 * 60 * 1000).toISOString(), // 38 days
          eventType: "Wedding",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 38,
          statusToggles: {
            depositVerified: true,
            djWorksheetDispatched: false,
            finalPaymentReceived: true,
            siteVisitDone: true,
          },
        },
        {
          id: "demo-booking-4",
          name: "Lucy & Mike",
          email: "lucy.mike@example.com",
          venueName: "Mells Barn",
          eventDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days - should trigger alert
          eventType: "Wedding",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 15,
          statusToggles: {
            depositVerified: true,
            djWorksheetDispatched: true,
            finalPaymentReceived: false, // Should trigger red alert
            siteVisitDone: false,
          },
        },
        {
          id: "demo-booking-5",
          name: "Sophie & Daniel",
          email: "sophie.daniel@example.com",
          venueName: "Dene Farm, Hampshire",
          eventDate: new Date(baseDate.getTime() + 89 * 24 * 60 * 60 * 1000).toISOString(), // 89 days
          eventType: "Wedding",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 89,
          statusToggles: {
            depositVerified: false,
            djWorksheetDispatched: false,
            finalPaymentReceived: false,
            siteVisitDone: false,
          },
        },
        {
          id: "demo-booking-6",
          name: "DJ Booking - Private Party",
          email: "party@example.com",
          venueName: "The Warehouse, Bristol",
          eventDate: new Date(baseDate.getTime() + 52 * 24 * 60 * 60 * 1000).toISOString(), // 52 days
          eventType: "Private Party",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 52,
          statusToggles: {
            depositVerified: true,
            djWorksheetDispatched: false,
            finalPaymentReceived: false,
            siteVisitDone: false,
          },
        },
        {
          id: "demo-booking-7",
          name: "Full Package - Charlotte & Rob",
          email: "charlotte.rob@example.com",
          venueName: "Penarth Pier Pavilion, Wales",
          eventDate: new Date(baseDate.getTime() + 73 * 24 * 60 * 60 * 1000).toISOString(), // 73 days
          eventType: "Wedding",
          status: "pending",
          createdAt: new Date().toISOString(),
          daysRemaining: 73,
          statusToggles: {
            depositVerified: true,
            djWorksheetDispatched: true,
            finalPaymentReceived: false,
            siteVisitDone: false,
          },
        },
      ];

      // Merge demo data with real bookings, filtering out any duplicates by ID
      const existingIds = new Set(bookingsWithMetadata.map((b) => b.id));
      demoData.push(...demoBookings.filter((demo) => !existingIds.has(demo.id)));
    }

    // Combine real bookings with demo data
    const allBookings = [...bookingsWithMetadata, ...demoData];

    // Sort by days remaining (closest first)
    allBookings.sort((a, b) => a.daysRemaining - b.daysRemaining);

    return NextResponse.json({
      success: true,
      bookings: allBookings,
      count: allBookings.length,
      demoDataIncluded: demoData.length > 0,
    });
  } catch (error: any) {
    console.error("Error fetching 90-day command centre bookings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Update status toggles for a booking
 */
export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, statusToggles } = body;

    if (!bookingId || !statusToggles) {
      return NextResponse.json(
        { error: "bookingId and statusToggles are required" },
        { status: 400 }
      );
    }

    // Fetch current booking to preserve existing emailsSent data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { emailsSent: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Merge new status toggles with existing emailsSent data
    const existingEmailsSent = (booking.emailsSent as any) || {};
    const updatedEmailsSent = {
      ...existingEmailsSent,
      commandCentre: {
        ...existingEmailsSent.commandCentre,
        ...statusToggles,
        updatedAt: new Date().toISOString(),
        updatedBy: admin.name || admin.email,
      },
    };

    // Update booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        emailsSent: updatedEmailsSent,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status toggles updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating status toggles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
