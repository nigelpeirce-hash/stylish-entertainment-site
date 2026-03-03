import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const enquiryId = resolvedParams.id;

    if (!enquiryId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    // Fetch enquiry
    const enquiry = await prisma.newEnquiry.findUnique({
      where: { id: enquiryId },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Prevent converting an already-converted enquiry
    if (enquiry.status === "converted") {
      const existingBooking = enquiry.originalBookingId
        ? await prisma.booking.findUnique({
            where: { id: enquiry.originalBookingId },
            select: { id: true },
          })
        : null;
      
      return NextResponse.json({ 
        error: "Enquiry already converted",
        bookingId: enquiry.originalBookingId || null,
        existing: true,
        message: existingBooking 
          ? "This enquiry has already been converted to a booking"
          : "This enquiry has already been converted",
      }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: enquiry.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: enquiry.email,
          name: enquiry.name,
          phone: enquiry.phoneAreaCode && enquiry.phoneNumber 
            ? `${enquiry.phoneAreaCode}${enquiry.phoneNumber}` 
            : null,
          role: "client",
        },
      });
    }

    // Check if booking already exists (safe select: omit columns that may not exist in DB)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        email: enquiry.email,
        eventDate: {
          gte: new Date(new Date(enquiry.eventDate).getTime() - 24 * 60 * 60 * 1000),
          lte: new Date(new Date(enquiry.eventDate).getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    if (existingBooking) {
      // Update enquiry status even if booking exists (wrapped in transaction for safety)
      await prisma.$transaction(async (tx) => {
        await tx.newEnquiry.update({
          where: { id: enquiryId },
          data: {
            status: "converted",
            reviewedAt: new Date(),
            reviewedBy: admin?.id || null,
            originalBookingId: existingBooking.id,
          },
        });
      });

      return NextResponse.json({ 
        bookingId: existingBooking.id,
        message: "Booking already exists for this enquiry",
        existing: true,
      });
    }

    // Create booking from enquiry (wrapped in transaction for data integrity)
    // Field Mapping:
    // ✅ Automatic: name, email, eventDate, venueName, venuePostcode, eventType
    // 🛠️ Manual: ceremonyTime (not in enquiry form, must be added via booking detail page)
    // ❌ Not Mapped: services, numberOfGuests, message, budget (not in NewEnquiry model)
    
    // Normalize eventType: map form values to booking values
    const normalizeEventType = (type: string | null): string => {
      if (!type) return "wedding";
      const lower = type.toLowerCase();
      if (lower === "wedding") return "wedding";
      if (lower === "corporate") return "corporate";
      if (lower === "private party" || lower === "party") return "party";
      return "party"; // Default "Other" to party (non-wedding content)
    };
    
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          id: randomUUID(),
          updatedAt: new Date(),
          userId: user.id,
          name: enquiry.name, // ✅ Automatic: Client Names
          email: enquiry.email,
          phoneAreaCode: enquiry.phoneAreaCode,
          phoneNumber: enquiry.phoneNumber,
          message: enquiry.message || null, // What they want – for building quote
          eventType: normalizeEventType(enquiry.eventType), // ✅ Automatic: From enquiry form
          eventDate: enquiry.eventDate, // ✅ Automatic: Event Date
          venueName: enquiry.venueName || "TBD", // ✅ Automatic: Venue
          venuePostcode: enquiry.venuePostcode,
          // 🛠️ ceremonyTime: Not available in enquiry - must be added manually via booking detail page
          status: "pending",
          priority: "medium",
          conflictStatus: enquiry.isConflict ? "pending" : null,
        },
      });

      // Update enquiry status (atomic with booking creation)
      await tx.newEnquiry.update({
        where: { id: enquiryId },
        data: {
          status: "converted",
          reviewedAt: new Date(),
          reviewedBy: admin?.id || null,
          originalBookingId: newBooking.id,
        },
      });

      return newBooking;
    });

    try {
      const eventDateLabel = new Date(enquiry.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      await logActivity({
        bookingId: booking.id,
        action: "enquiry_converted",
        description: `Enquiry converted to new booking – ${enquiry.name}`,
        actor: "admin",
        performedBy: admin?.name ?? admin?.email ?? undefined,
        metadata: { enquiryId },
      });
      await notifyAdminSignificantEvent({
        type: "enquiry_converted",
        bookingId: booking.id,
        title: "Enquiry converted",
        description: `New booking created from enquiry for ${enquiry.name}`,
        actor: "admin",
        performedBy: admin?.name ?? admin?.email ?? undefined,
        bookingName: enquiry.name ?? undefined,
        venueName: enquiry.venueName ?? undefined,
        eventDate: eventDateLabel,
      });
    } catch (e) {
      console.warn("[new-enquiries/convert] Admin notification failed:", e);
    }

    return NextResponse.json({ 
      bookingId: booking.id,
      message: "Enquiry converted to booking successfully" 
    });
  } catch (error: any) {
    console.error("Error converting enquiry:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "Duplicate booking detected. A booking with this email and date already exists.",
        code: "DUPLICATE_BOOKING"
      }, { status: 409 });
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: "Record not found. The enquiry may have been deleted.",
        code: "NOT_FOUND"
      }, { status: 404 });
    }

    // Generic error fallback
    return NextResponse.json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
