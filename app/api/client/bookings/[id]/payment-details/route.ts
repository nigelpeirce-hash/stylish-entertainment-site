import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_DAYS = 21;

/**
 * Returns assigned staff accountNumber and sortCode only when within 3-week (21-day) window.
 * Used by PortalView for the Artist Payment card.
 * Auth: session (user owns booking or admin) OR ?token= matching portalToken.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, eventDate: true, userId: true, email: true, portalToken: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin") allowed = true;
      else if (u.id && booking.userId === u.id) allowed = true;
      else if (session.user.email && booking.email === session.user.email) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const eventDate = new Date(booking.eventDate);
    const diffMs = eventDate.getTime() - now.getTime();
    const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysUntil > WINDOW_DAYS || daysUntil < 0) {
      return NextResponse.json({
        withinWindow: false,
        daysUntil,
        staff: [],
      });
    }

    const assignments = await prisma.bookingStaffAssignment.findMany({
      where: {
        bookingId,
        status: { not: "cancelled" },
        OR: [
          { role: { in: ["DJ", "dj", "Musician", "musician", "Host", "host", "Performer", "performer"] } },
          { role: { contains: "saxophonist", mode: "insensitive" } },
          { role: { contains: "pianist", mode: "insensitive" } },
          { role: { contains: "guitarist", mode: "insensitive" } },
          { role: { contains: "harpist", mode: "insensitive" } },
          { role: { contains: "violinist", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        role: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            accountNumber: true,
            sortCode: true,
          },
        },
      },
    });

    const staff = assignments
      .filter((a) => a.staff.accountNumber || a.staff.sortCode)
      .map((a) => ({
        id: a.staff.id,
        name: a.staff.name,
        email: a.staff.email,
        role: a.role,
        accountNumber: a.staff.accountNumber,
        sortCode: a.staff.sortCode,
      }));

    return NextResponse.json({
      withinWindow: true,
      daysUntil,
      staff,
    });
  } catch (e: any) {
    console.error("[payment-details]", e);
    return NextResponse.json(
      { error: "Failed to fetch payment details" },
      { status: 500 }
    );
  }
}
