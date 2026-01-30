import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force module re-resolution

// Force dynamic rendering for API routes that interact with the database
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Fetch all bookings within the next 90 days for the Command Centre
 * Sorted by eventDate (closest first)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("[90-Day Command] API request started");
    
    // Check if request is from localhost (development only)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    console.log("[90-Day Command] Checking admin authorization...");
    let admin = await requireAdmin(request);
    console.log("[90-Day Command] Admin check complete:", admin ? "authorized" : "unauthorized");
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(now.getDate() + 90);

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("[90-Day Command] Database connection verified");
    } catch (connError: any) {
      console.error("[90-Day Command] Database connection failed:", connError);
      throw new Error(`Database connection error: ${connError.message || "Unable to connect to database"}`);
    }

    // Fetch bookings where eventDate is within next 90 days
    console.log("[90-Day Command] Fetching bookings from database...");
    
    // Simplified query to avoid complex nested relations that might timeout
    // Split into two queries if needed for better performance
    let bookings;
    try {
      bookings = await prisma.booking.findMany({
        where: {
          eventDate: {
            gte: now, // Greater than or equal to today
            lte: ninetyDaysFromNow, // Less than or equal to 90 days from now
          },
        },
        include: {
          staffAssignments: {
            include: {
              staff: true
            }
          },
          // Simplified emailThreads query - just check for unread portal messages
          emailThreads: {
            where: {
              source: "portal",
              isRead: false,
            },
            select: {
              id: true,
            },
            take: 1, // Only need to know if any exist, not all of them
          },
          NewEnquiry: { select: { id: true } },
        },
        orderBy: {
          eventDate: 'asc'
        },
        // Add timeout protection
        take: 500, // Limit results to prevent huge queries
      });
    } catch (dbError: any) {
      console.error("[90-Day Command] Database query error:", dbError);
      // If the complex query fails, try a simpler version without emailThreads
      console.log("[90-Day Command] Retrying with simplified query...");
      bookings = await prisma.booking.findMany({
        where: {
          eventDate: {
            gte: now,
            lte: ninetyDaysFromNow,
          },
        },
        include: {
          staffAssignments: {
            include: {
              staff: true
            }
          },
          NewEnquiry: { select: { id: true } },
        },
        orderBy: {
          eventDate: 'asc'
        },
        take: 500,
      });
      
      // Manually set unreadPortalMessages to false for all bookings
      // (we'll skip the emailThreads check if the query fails)
      bookings = bookings.map(b => ({ ...b, emailThreads: [] }));
    }

    console.log(`[90-Day Command] Found ${bookings.length} bookings`);

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

    // No demo data needed - seed script creates all test bookings
    const allBookings = bookingsWithMetadata;

    // Sort by days remaining (closest first)
    allBookings.sort((a, b) => a.daysRemaining - b.daysRemaining);

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`[90-Day Command] Request completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      bookings: allBookings,
      count: allBookings.length,
    });
  } catch (error: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.error(`[90-Day Command] Error after ${duration}ms:`, error);
    console.error("[90-Day Command] Error stack:", error.stack);
    console.error("[90-Day Command] Error name:", error.name);
    console.error("[90-Day Command] Error code:", error.code);
    
    // Provide more specific error messages
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error.message?.includes("connection") || error.message?.includes("timeout") || error.code === "P1001") {
      errorMessage = "Database connection timeout. Please try again.";
      statusCode = 503; // Service Unavailable
    } else if (error.message?.includes("P2002") || error.code === "P2002") {
      errorMessage = "Database constraint error. Please contact support.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: error.message || "Unknown error occurred",
        details: process.env.NODE_ENV === "development" ? {
          stack: error.stack,
          name: error.name,
          code: error.code,
          duration: `${duration}ms`,
        } : undefined,
      },
      { status: statusCode }
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
