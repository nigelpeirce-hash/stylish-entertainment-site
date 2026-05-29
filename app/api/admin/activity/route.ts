import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/activity
 * Returns recent activity (AuditLog) for dashboard – all meaningful actions.
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
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 50);
    const days = Math.min(parseInt(searchParams.get("days") || "14", 10), 30);

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const logs = await prisma.auditLog.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        bookingId: true,
        enquiryId: true,
        action: true,
        description: true,
        performedBy: true,
        actor: true,
        metadata: true,
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
        NewEnquiry: {
          select: {
            id: true,
            name: true,
            venueName: true,
            venuePostcode: true,
            eventDate: true,
            enquiryType: true,
          },
        },
      },
    });

    const activity = logs.map((log) => ({
      id: log.id,
      bookingId: log.bookingId,
      enquiryId: log.enquiryId,
      action: log.action,
      description: log.description,
      performedBy: log.performedBy,
      actor: log.actor ?? "system",
      metadata: log.metadata as Record<string, unknown> | null,
      createdAt: log.createdAt,
      bookingName: log.Booking?.name ?? log.NewEnquiry?.name ?? null,
      venueName: log.Booking?.venueName ?? log.NewEnquiry?.venueName ?? log.NewEnquiry?.venuePostcode ?? null,
      eventDate: log.Booking?.eventDate ?? log.NewEnquiry?.eventDate ?? null,
      eventType: log.Booking?.eventType ?? log.NewEnquiry?.enquiryType ?? null,
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
