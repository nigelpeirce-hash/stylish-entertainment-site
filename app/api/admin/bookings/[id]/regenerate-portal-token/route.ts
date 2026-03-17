import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { generatePortalToken, newPortalTokenExpiry } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/regenerate-portal-token
 *
 * Generates a brand-new portalToken with a fresh 12-month expiry.
 * The old token is immediately invalidated — any client still holding
 * the old link will see "Invalid or expired link" and must request a new one.
 *
 * Use this when:
 * - A client has forwarded their portal link to a third party
 * - A client needs a fresh link after the previous one expired
 * - Admin wants to revoke access temporarily
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
      select: { id: true, name: true, email: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const portalToken = generatePortalToken();
    const portalTokenExpiresAt = newPortalTokenExpiry();

    await prisma.booking.update({
      where: { id: bookingId },
      data: { portalToken, portalTokenExpiresAt, updatedAt: new Date() },
    });

    await logActivity({
      bookingId,
      action: "portal_token_regenerated",
      description: "Portal token regenerated — previous link invalidated",
      actor: "admin",
      performedBy: admin.name ?? admin.email ?? "Admin",
      metadata: { expiresAt: portalTokenExpiresAt.toISOString() },
    });

    return NextResponse.json({
      success: true,
      message: "Portal token regenerated. Previous link is now invalid.",
      portalTokenExpiresAt: portalTokenExpiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("[regenerate-portal-token]", error);
    return NextResponse.json(
      { error: "Failed to regenerate portal token", message: error.message },
      { status: 500 }
    );
  }
}
