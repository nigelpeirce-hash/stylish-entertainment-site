import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/bookings/[id]/internal-brief
 * Returns a Master Internal Brief for riggers/crew with warehouse pick list
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        warehouseItems: {
          include: {
            WarehouseItem: true,
          },
          orderBy: [
            { WarehouseItem: { category: "asc" } },
            { WarehouseItem: { name: "asc" } },
          ],
        },
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        guestRequests: {
          where: {
            status: { in: ["pending", "approved", "moved_to_official"] },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Top 10 requests
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Fetch venue data if venueName exists
    let venueData = null;
    if (booking.venueName) {
      try {
        venueData = await prisma.venue.findUnique({
          where: { venueName: booking.venueName },
          select: {
            venueNotes: true,
            defaultCeremonyTime: true,
            defaultFinishTime: true,
          },
        });
      } catch (e) {
        console.log("Venue lookup failed:", e);
      }
    }

    // Format warehouse items by category
    const itemsByCategory = booking.warehouseItems.reduce((acc, item) => {
      const cat = item.WarehouseItem.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, typeof booking.warehouseItems>);

    // Separate talent (DJ, Musician, Band) from crew (Rigger, Technician, etc.)
    const talent = booking.staffAssignments.filter((assignment) => {
      const role = assignment.role?.toLowerCase() || "";
      return ["dj", "musician", "band", "performer", "host"].includes(role);
    });

    const crew = booking.staffAssignments.filter((assignment) => {
      const role = assignment.role?.toLowerCase() || "";
      return ["rigger", "technician", "crew", "sound tech"].includes(role);
    });

    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not set";

    // Format guest requests
    const guestRequests = booking.guestRequests.map((req) => ({
      songTitle: req.songTitle,
      artist: req.artist,
      guestName: req.guestName,
      status: req.status,
    }));

    return NextResponse.json({
      booking: {
        id: booking.id,
        name: booking.name,
        eventDate,
        venueName: booking.venueName,
        venueAddress: booking.venueAddress,
        venuePostcode: booking.venuePostcode,
        ceremonyTime: booking.ceremonyTime,
        finishTime: booking.djFinishTime,
      },
      venue: venueData,
      warehouseItems: itemsByCategory,
      totalItems: booking.warehouseItems.reduce((sum, item) => sum + item.quantity, 0),
      talent,
      assignedCrew: crew,
      guestRequests,
    });
  } catch (error) {
    console.error("Error generating internal brief:", error);
    return NextResponse.json(
      { error: "Failed to generate internal brief" },
      { status: 500 }
    );
  }
}
