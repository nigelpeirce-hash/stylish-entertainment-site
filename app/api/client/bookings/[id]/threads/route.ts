import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPortalTokenValid } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/client/bookings/[id]/threads
 * Returns email threads (and emails) for this booking. Client record of all comms.
 * Auth: ?token= (portalToken) OR session (user owns booking or admin).
 * Used by PortalView "Communication history" section.
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
      select: {
        id: true,
        userId: true,
        email: true,
        portalToken: true,
        portalTokenExpiresAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && isPortalTokenValid(booking, token)) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id)) allowed = true;
    }

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threads = await prisma.emailThread.findMany({
      where: { bookingId: booking.id },
      orderBy: { lastMessageAt: "desc" },
      select: {
        id: true,
        subject: true,
        fromEmail: true,
        fromName: true,
        lastMessageAt: true,
        Email: {
          orderBy: { receivedAt: "asc" },
          select: {
            id: true,
            subject: true,
            fromEmail: true,
            fromName: true,
            toEmail: true,
            toName: true,
            textContent: true,
            htmlContent: true,
            direction: true,
            receivedAt: true,
          },
        },
      },
    });

    const normalized = threads.map(({ Email, ...t }) => ({
      ...t,
      emails: Email,
    }));
    return NextResponse.json({ threads: normalized });
  } catch (e) {
    console.error("[GET /api/client/bookings/[id]/threads]", e);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}
