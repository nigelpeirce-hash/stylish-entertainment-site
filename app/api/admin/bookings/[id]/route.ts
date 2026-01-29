import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { deduplicateName } from "@/lib/utils/name-helpers";
import { transformBooking } from "@/lib/transformers/booking-transformer";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Include config aligned with schema to avoid P2022.
 * - Booking has no direct `staff` relation; it's many-to-many via staffAssignments.
 * - staffAssignments -> BookingStaffAssignment; staff -> FreelanceCrew (staff: true, no select).
 * - Booking.User (User.id, name, email).
 * - Booking.bookingItems -> BookingItem (status); HireItem (id, name, price, category).
 * No role filtering: admin sees all talent + crew.
 */
const BOOKING_INCLUDE = {
  User: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  staffAssignments: {
    include: {
      staff: true,
    },
  },
  bookingItems: {
    where: { status: "pending_approval" as const },
    include: {
      HireItem: {
        select: { id: true, name: true, price: true, category: true },
      },
    },
  },
  warehouseItems: {
    include: {
      WarehouseItem: true,
    },
    orderBy: [
      { WarehouseItem: { category: "asc" } },
      { WarehouseItem: { name: "asc" } },
    ],
  },
} as const;

function prismaErrorPayload(error: unknown): { error: string; prismaCode?: string; prismaMessage?: string; prismaMeta?: unknown } {
  const e = error as { code?: string; message?: string; meta?: unknown };
  return {
    error: "Database error",
    prismaCode: e?.code,
    prismaMessage: e?.message,
    prismaMeta: e?.meta,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    let booking: Awaited<ReturnType<typeof prisma.booking.findUnique<{ include: typeof BOOKING_INCLUDE }>>> | null = null;

    try {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: BOOKING_INCLUDE,
      });
    } catch (dbError) {
      console.error("Booking GET Prisma error (full query):", dbError);
      try {
        const safeBooking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: {
            id: true,
            name: true,
            venueName: true,
            eventDate: true,
          },
        });
        if (!safeBooking) {
          return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        // Transform fallback booking data
        const fallbackBooking = {
          ...safeBooking,
          name: deduplicateName(safeBooking.name),
          staffAssignments: [],
        };
        const sanitized = transformBooking(fallbackBooking, []);
        return NextResponse.json(
          { booking: sanitized, fallback: true },
          { status: 200 }
        );
      } catch (safeError) {
        console.error("Booking GET safe fallback also failed:", safeError);
        return NextResponse.json(
          prismaErrorPayload(safeError),
          { status: 500 }
        );
      }
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let emailThreads: { id: string; subject: string; fromEmail: string; lastMessageAt: Date; isRead: boolean }[] = [];
    try {
      emailThreads = await prisma.emailThread.findMany({
        where: { bookingId: booking.id },
        take: 5,
        orderBy: { lastMessageAt: "desc" },
        select: {
          id: true,
          subject: true,
          fromEmail: true,
          lastMessageAt: true,
          isRead: true,
        },
      });
    } catch (threadError) {
      console.log("Note: Email threads not available.", threadError);
    }

    // Transform booking data to sanitized format
    const bookingWithDeduplicatedName = {
      ...booking,
      name: deduplicateName(booking.name),
    };
    const sanitized = transformBooking(bookingWithDeduplicatedName, emailThreads);
    return NextResponse.json({ booking: sanitized }, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    const payload = prismaErrorPayload(error);
    return NextResponse.json(
      { ...payload, error: (error as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/** Whitelist of Booking scalar fields allowed in PATCH. Excludes relations (User, staffAssignments, etc.) to avoid P2022. */
const PATCH_ALLOWED_KEYS = new Set([
  "userId", "name", "displayName", "email", "phoneAreaCode", "phoneNumber",
  "clientAddress", "clientAddress2", "clientTown", "clientCounty", "clientPostcode",
  "eventType", "eventDate",
  "venueName", "venueContact", "venueAddress", "venueAddress2", "venueTown", "venueCounty", "venuePostcode",
  "venuePhoneAreaCode", "venuePhoneNumber", "ceremonyTime", "djArrivalTime", "djStartTime", "djFinishTime",
  "djSetupLocation", "djParking", "soundLimiter", "venueIsPrivateHouse", "venueWhat3Words", "venueLoadInNotes",
  "numberOfGuests", "services", "message", "budget", "status",
  "contactPreference", "finalBalance", "paymentMethod", "paymentPayerName", "termsAccepted", "termsAcceptedAt",
  "completedTasks", "emailsSent", "lastEmailSentAt", "musicNotesToDJ", "musicNotesToStylish", "firstDance",
  "lastSong", "musicDislikes", "musicRequests", "musicFileUrl", "preferredDJ", "upsellItems", "priority",
  "adminNotes", "authorizedSenders", "bookingReference", "conflictResolvedAt", "conflictStatus",
  "depositReceived", "depositReceivedManual", "djWorksheetApproved", "djWorksheetApprovedManual",
  "feeBreakdown", "finalDetailsConfirmed", "finalDetailsConfirmedManual", "flaggedFor", "handoffNote",
  "handoffStatus", "isTechReady", "overrideReason", "purgeAt", "rescuedAt", "selectedTemplate",
  "talentStatus", "taxInclusive", "taxRate", "venueFingerprint", "assignedTo",
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const body = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (PATCH_ALLOWED_KEYS.has(key)) data[key] = body[key];
    }

    if (data.eventDate) {
      const parsed = new Date(data.eventDate as string);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
      }
      data.eventDate = parsed;
    }
    if (data.ceremonyTime !== undefined && data.ceremonyTime !== null) {
      const parsed = new Date(data.ceremonyTime as string);
      data.ceremonyTime = isNaN(parsed.getTime()) ? null : parsed;
    }

    let updatedBooking;
    try {
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data,
        include: BOOKING_INCLUDE,
      });
    } catch (dbError) {
      console.error("Booking PATCH Prisma error:", dbError);
      return NextResponse.json(
        prismaErrorPayload(dbError),
        { status: 500 }
      );
    }

    // Transform updated booking data to sanitized format
    const updatedBookingWithDeduplicatedName = {
      ...updatedBooking,
      name: deduplicateName(updatedBooking.name),
    };
    const sanitized = transformBooking(updatedBookingWithDeduplicatedName);
    return NextResponse.json({ booking: sanitized });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { ...prismaErrorPayload(error), error: (error as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    
    // Check for permanent delete flag (default is soft delete/archive)
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    let booking: { id: string; name: string; email: string; archivedAt: Date | null } | null;
    try {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, name: true, email: true, archivedAt: true },
      });
    } catch (dbError) {
      console.error("Booking DELETE findUnique Prisma error:", dbError);
      return NextResponse.json(
        prismaErrorPayload(dbError),
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // SOFT DELETE (Archive) - Default behavior
    if (!permanent) {
      try {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            archivedAt: new Date(),
            archivedBy: admin?.id || "system",
            status: "archived",
          },
        });
        
        return NextResponse.json({ 
          success: true, 
          message: "Booking archived successfully",
          archived: true,
          booking: { id: booking.id, name: booking.name },
        });
      } catch (dbError) {
        console.error("Booking ARCHIVE Prisma error:", dbError);
        return NextResponse.json(
          prismaErrorPayload(dbError),
          { status: 500 }
        );
      }
    }

    // HARD DELETE - Only with ?permanent=true
    try {
      await prisma.emailThread.deleteMany({ where: { bookingId } });
      await prisma.bookingStaffAssignment.deleteMany({ where: { bookingId } });
      await prisma.booking.delete({ where: { id: bookingId } });
    } catch (dbError) {
      console.error("Booking DELETE Prisma error:", dbError);
      return NextResponse.json(
        prismaErrorPayload(dbError),
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Booking permanently deleted", permanent: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { ...prismaErrorPayload(error), error: (error as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
