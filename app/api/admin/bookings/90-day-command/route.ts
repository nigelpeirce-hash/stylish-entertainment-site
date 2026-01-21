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
    // Check if request is from localhost (development only)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    let admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
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
        depositReceived: true,
        depositReceivedManual: true,
        djWorksheetApproved: true,
        djWorksheetApprovedManual: true,
        finalDetailsConfirmed: true,
        finalDetailsConfirmedManual: true,
        services: true,
        createdAt: true,
        staffAssignments: {
          select: {
            id: true,
            role: true,
            status: true,
            briefStatus: true,
            acknowledgedAt: true,
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        emailThreads: {
          where: {
            source: "portal",
            isRead: false,
            EmailInbox: {
              OR: [
                { assignedUsers: { isEmpty: true } }, // Shared inboxes
                { assignedUsers: { has: (admin as any)?.email || "" } }, // User is assigned
              ],
            },
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        eventDate: "asc", // Closest first
      },
    });

    // Calculate days remaining and check for unread portal messages and staff pending actions
    const bookingsWithMetadata = bookings.map((booking) => {
      const eventDate = new Date(booking.eventDate);
      const daysRemaining = Math.ceil(
        (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if there are unread portal messages
      const unreadPortalMessages = booking.emailThreads && booking.emailThreads.length > 0;

      // Check if there are staff assignments that need action
      // Staff has responded (status is "held" or "dispatched") but isn't yet "confirmed"
      const staffPendingAction = booking.staffAssignments && booking.staffAssignments.some(
        (assignment) => 
          (assignment.status === "held" || assignment.status === "dispatched") && 
          assignment.status !== "confirmed" &&
          assignment.status !== "cancelled"
      );

      // Remove emailThreads from the response (we only needed it for the check)
      const { emailThreads, ...bookingWithoutThreads } = booking;

      return {
        ...bookingWithoutThreads,
        daysRemaining,
        unreadPortalMessages,
        staffPendingAction: staffPendingAction || false,
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
          depositReceived: true,
          depositReceivedManual: false,
          djWorksheetApproved: false,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: false,
          finalDetailsConfirmedManual: false,
          services: ["DJs"],
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
          depositReceived: true,
          depositReceivedManual: false,
          djWorksheetApproved: true,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: false,
          finalDetailsConfirmedManual: false,
          services: ["DJs"],
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
          depositReceived: true,
          depositReceivedManual: false,
          djWorksheetApproved: false,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: true,
          finalDetailsConfirmedManual: false,
          services: ["Lighting Design"],
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
          depositReceived: true,
          depositReceivedManual: false,
          djWorksheetApproved: true,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: false, // Should trigger red alert
          finalDetailsConfirmedManual: false,
          services: ["DJs"],
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
          depositReceived: false,
          depositReceivedManual: false,
          djWorksheetApproved: false,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: false,
          finalDetailsConfirmedManual: false,
          services: ["DJs"],
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
          depositReceived: true,
          depositReceivedManual: false,
          djWorksheetApproved: false,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: false,
          finalDetailsConfirmedManual: false,
          services: ["DJs"],
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
          depositReceived: true,
          depositReceivedManual: false,
          djWorksheetApproved: true,
          djWorksheetApprovedManual: false,
          finalDetailsConfirmed: false,
          finalDetailsConfirmedManual: false,
          services: ["DJs", "Musicians"],
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
 * Note: This endpoint is kept for backward compatibility but is no longer used.
 * The frontend now uses /api/admin/bookings/[id]/manual-override instead.
 */
export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Please use /api/admin/bookings/[id]/manual-override instead." },
    { status: 410 }
  );
}
