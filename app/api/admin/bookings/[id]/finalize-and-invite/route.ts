import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { generatePortalToken, newPortalTokenExpiry } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/finalize-and-invite
 *
 * Finalize a booking: set status to 'confirmed' and mint a fresh portal token so the
 * portal can be opened from admin or shared manually. No email is sent to the client —
 * client-facing emails no longer reference the portal.
 */
export async function POST(
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
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        portalToken: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const now = new Date();
    const portalToken = booking.portalToken || generatePortalToken();

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "confirmed",
        portalToken,
        portalTokenExpiresAt: newPortalTokenExpiry(),
        updatedAt: now,
      },
    });

    await logActivity({
      bookingId,
      action: "booking_finalized",
      description: "Booking marked as confirmed",
      actor: "admin",
      performedBy: admin?.name ?? admin?.email ?? undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Booking confirmed",
    });
  } catch (e: any) {
    console.error("[finalize-and-invite]", e);
    return NextResponse.json(
      { error: e?.message || "Failed to finalize booking" },
      { status: 500 }
    );
  }
}
