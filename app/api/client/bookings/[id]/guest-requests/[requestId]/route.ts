import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { isPortalTokenValid } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * PATCH /api/client/bookings/[id]/guest-requests/[requestId]
 * Toggle guest request status: pending <-> approved
 * Auth: session or ?token= (portalToken)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const { id: bookingId, requestId } = await params;
    const token = request.nextUrl.searchParams.get("token");
    const session = await getServerSession(request);
    const body = await request.json();
    const { status } = body;

    if (status !== "pending" && status !== "approved") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, email: true, portalToken: true, portalTokenExpiresAt: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && isPortalTokenValid(booking, token)) allowed = true;
    else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin") allowed = true;
      else if (u.id && booking.userId === u.id) allowed = true;
      else if (session.user.email && booking.email === session.user.email) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gr = await prisma.guestRequest.findFirst({
      where: { id: requestId, bookingId },
    });
    if (!gr) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await prisma.guestRequest.update({
      where: { id: requestId },
      data: { status, updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error toggling guest request status:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
