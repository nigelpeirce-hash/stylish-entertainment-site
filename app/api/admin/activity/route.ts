import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Significant event types shown in dashboard activity feed */
const SIGNIFICANT_ACTIONS = new Set([
  "booking_request_received",
  "quote_sent",
  "deposit_paid",
  "artist_assigned",
  "handoff",
  "dispatched",
  "portal_message",
  "final_details_confirmed",
  "brief_sent",
]);

/**
 * GET /api/admin/activity
 * Returns recent significant events (AuditLog) for dashboard notifications.
 */
export async function GET(request: NextRequest) {
  try {
    const hostname = request.headers.get("host") || "";
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development";

    const admin = await requireAdmin(request);
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "25", 10), 50);
    const days = Math.min(parseInt(searchParams.get("days") || "7", 10), 30);

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const logs = await prisma.auditLog.findMany({
      where: {
        action: { in: Array.from(SIGNIFICANT_ACTIONS) },
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        bookingId: true,
        action: true,
        description: true,
        performedBy: true,
        createdAt: true,
        Booking: {
          select: {
            id: true,
            name: true,
            venueName: true,
            eventDate: true,
            eventType: true,
          },
        },
      },
    });

    const activity = logs.map((log) => ({
      id: log.id,
      bookingId: log.bookingId,
      action: log.action,
      description: log.description,
      performedBy: log.performedBy,
      createdAt: log.createdAt,
      bookingName: log.Booking?.name ?? null,
      venueName: log.Booking?.venueName ?? null,
      eventDate: log.Booking?.eventDate ?? null,
      eventType: log.Booking?.eventType ?? null,
    }));

    return NextResponse.json({
      activity,
      since: since.toISOString(),
    });
  } catch (error: any) {
    console.error("[admin/activity]", error);
    return NextResponse.json(
      { error: "Failed to fetch activity", details: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}
