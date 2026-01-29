import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/bulk-delete
 * Body: { ids?: string[], deleteAll?: boolean }
 * - ids: delete only these booking IDs (removes email threads + bookings + cascaded relations).
 * - deleteAll: true → delete all bookings. Use for "clean slate".
 * Admin only. Does not touch User accounts (e.g. nigel@stylishentertainment.co.uk).
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { ids = [], deleteAll = false } = body as { ids?: string[]; deleteAll?: boolean };

    let toDelete: string[] = [];

    if (deleteAll) {
      const all = await prisma.booking.findMany({ select: { id: true } });
      toDelete = all.map((b) => b.id);
    } else if (Array.isArray(ids) && ids.length > 0) {
      toDelete = ids.filter((id) => typeof id === "string");
    } else {
      return NextResponse.json(
        { error: "Provide ids[] or deleteAll: true" },
        { status: 400 }
      );
    }

    if (toDelete.length === 0) {
      return NextResponse.json({ deleted: 0, message: "Nothing to delete" });
    }

    // 1. Delete email threads for these bookings (no DB cascade from Booking → EmailThread)
    const threadResult = await prisma.emailThread.deleteMany({
      where: { bookingId: { in: toDelete } },
    });

    // 2. Delete bookings; cascades handle AuditLog, StaffAssignment, Items, GuestRequests, etc.
    const bookingResult = await prisma.booking.deleteMany({
      where: { id: { in: toDelete } },
    });

    return NextResponse.json({
      deleted: bookingResult.count,
      threadsDeleted: threadResult.count,
      message:
        bookingResult.count === 1
          ? "1 booking permanently deleted"
          : `${bookingResult.count} bookings permanently deleted`,
    });
  } catch (e) {
    console.error("Bulk delete bookings error:", e);
    return NextResponse.json(
      { error: (e as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
