import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all bookings
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          not: "cancelled", // Exclude cancelled
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Map bookings to enquiries with new status structure
    const bookingEnquiries = bookings.map((booking) => {
      // Determine status based on booking state
      let status = "pending"; // Default to "New"
      
      if (booking.status === "confirmed" || booking.status === "locked") {
        // Check if contract sent (final details confirmed)
        if ((booking as any).finalDetailsConfirmed) {
          status = "contract_sent";
        } else {
          status = "quoted";
        }
      } else if (booking.assignedTo && booking.handoffStatus === "tech_review") {
        status = "checking_availability";
      }

      return {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        eventType: booking.eventType,
        eventDate: booking.eventDate.toISOString(),
        venueName: booking.venueName,
        venueAddress: booking.venueAddress,
        venueTown: booking.venueTown,
        venuePostcode: booking.venuePostcode,
        status,
        priority: booking.priority || "medium",
        conflictStatus: booking.conflictStatus,
        createdAt: booking.createdAt.toISOString(),
        numberOfGuests: booking.numberOfGuests,
        services: booking.services || [],
        budget: booking.budget,
        message: booking.message,
        user: booking.user,
        source: "booking", // Track source
      };
    });

    // Fetch all NewEnquiry records (not yet converted to bookings)
    const newEnquiries = await prisma.newEnquiry.findMany({
      where: {
        status: {
          in: ["new", "reviewed"], // Only show new and reviewed, not converted
        },
      },
      include: {
        originalBooking: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            venueName: true,
            venuePostcode: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map NewEnquiry to enquiry format
    const newEnquiryMapped = newEnquiries.map((enquiry) => ({
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      eventType: "wedding", // Default for new enquiries
      eventDate: enquiry.eventDate.toISOString(),
      venueName: enquiry.venueName || "TBD",
      venueAddress: null,
      venueTown: null,
      venuePostcode: enquiry.venuePostcode,
      status: enquiry.status === "reviewed" ? "checking_availability" : "pending",
      priority: enquiry.isConflict ? "urgent" : "medium",
      conflictStatus: enquiry.isConflict ? "pending" : null,
      createdAt: enquiry.createdAt.toISOString(),
      numberOfGuests: null,
      services: [],
      budget: null,
      message: null,
      user: null,
      source: "new_enquiry", // Track source
      isConflict: enquiry.isConflict,
      originalBooking: enquiry.originalBooking,
    }));

    // Combine both sources
    const allEnquiries = [...newEnquiryMapped, ...bookingEnquiries];

    // Sort by creation date (newest first) for default ordering
    allEnquiries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ enquiries: allEnquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
