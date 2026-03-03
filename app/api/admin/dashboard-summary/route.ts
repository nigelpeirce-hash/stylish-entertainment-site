import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getUnresolvedConflictsCount } from "@/lib/booking-integrity";
import { SAFE_BOOKING_SCALARS, addBookingFallbacks } from "@/lib/safe-booking-query";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const THREAD_INCLUDE = {
  EmailInbox: { select: { id: true, name: true, email: true } },
  Booking: { select: { id: true, name: true, eventType: true, eventDate: true, status: true } },
  User: { select: { id: true, name: true, email: true } },
  EmailFolder: { select: { id: true, name: true, fullPath: true } },
  Email: {
    orderBy: { receivedAt: "desc" as const },
    take: 1,
    select: {
      id: true,
      textContent: true,
      subject: true,
      fromName: true,
      fromEmail: true,
      receivedAt: true,
    },
  },
  _count: { select: { Email: true } },
};

const THREAD_INCLUDE_WITHOUT_FOLDER = {
  EmailInbox: { select: { id: true, name: true, email: true } },
  Booking: { select: { id: true, name: true, eventType: true, eventDate: true, status: true } },
  User: { select: { id: true, name: true, email: true } },
  Email: {
    orderBy: { receivedAt: "desc" as const },
    take: 1,
    select: {
      id: true,
      textContent: true,
      subject: true,
      fromName: true,
      fromEmail: true,
      receivedAt: true,
    },
  },
  _count: { select: { Email: true } },
};

/** Safe select: omits services, upsellItems, termsAcceptedVersion (columns may not exist in DB). */
const PENDING_BOOKINGS_SELECT = {
  ...SAFE_BOOKING_SCALARS,
  staffAssignments: {
    include: {
      staff: {
        select: { id: true, name: true, email: true, phone: true, roles: true, isActive: true },
      },
    },
  },
  User: { select: { id: true, name: true, email: true } },
};

async function fetchThreads(
  where: Record<string, unknown>,
  take: number,
  useFolder: boolean
): Promise<unknown[]> {
  const include = useFolder ? THREAD_INCLUDE : THREAD_INCLUDE_WITHOUT_FOLDER;
  return prisma.emailThread.findMany({
    where,
    include,
    orderBy: { lastMessageAt: "desc" },
    take,
  });
}

/**
 * GET /api/admin/dashboard-summary
 * Returns unread threads, recent threads, pending bookings, and conflict count in one response.
 * Used by the admin dashboard to avoid multiple round-trips.
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

    const userEmail = (admin as any)?.email;
    if (!userEmail && !isLocalhost) {
      return NextResponse.json({ error: "User email not found" }, { status: 401 });
    }

    const oneHundredEightyDaysAgo = new Date();
    oneHundredEightyDaysAgo.setDate(oneHundredEightyDaysAgo.getDate() - 180);

    let inboxIds: string[] = [];
    if (userEmail) {
      const inboxes = await prisma.emailInbox.findMany({
        where: {
          OR: [
            { assignedUsers: { isEmpty: true } },
            { assignedUsers: { has: userEmail } },
          ],
        },
        select: { id: true },
      });
      inboxIds = inboxes.map((i) => i.id);
    }

    const threadWhereBase: Record<string, unknown> = {
      lastMessageAt: { gte: oneHundredEightyDaysAgo },
    };
    if (inboxIds.length > 0) {
      threadWhereBase.inboxId = { in: inboxIds };
    }

    const unreadWhere = { ...threadWhereBase, isRead: false };
    const recentWhere = { ...threadWhereBase };

    const bookingsWhere = {
      status: "pending",
      archivedAt: null,
    };

    let unreadThreads: unknown[] = [];
    let recentThreads: unknown[] = [];

    const [unreadRaw, pendingBookingsRaw, recentRaw, conflictCount] = await Promise.all([
      inboxIds.length > 0
        ? fetchThreads(unreadWhere, 5, true).catch((e) => {
            if ((e as any)?.code === "P2022") {
              return fetchThreads(unreadWhere, 5, false);
            }
            throw e;
          })
        : Promise.resolve([]),
      prisma.booking.findMany({
        where: bookingsWhere,
        select: PENDING_BOOKINGS_SELECT,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 100,
      }),
      inboxIds.length > 0
        ? fetchThreads(recentWhere, 5, true).catch((e) => {
            if ((e as any)?.code === "P2022") {
              return fetchThreads(recentWhere, 5, false);
            }
            throw e;
          })
        : Promise.resolve([]),
      getUnresolvedConflictsCount(),
    ]);

    unreadThreads = Array.isArray(unreadRaw) ? unreadRaw : [];
    recentThreads = Array.isArray(recentRaw) ? recentRaw : [];

    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const pendingBookings = (pendingBookingsRaw as any[]).map(addBookingFallbacks).sort((a, b) => {
      const aIsNew = !a.lastEmailSentAt;
      const bIsNew = !b.lastEmailSentAt;
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(
      {
        unreadThreads,
        recentThreads,
        pendingBookings,
        conflictCount,
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: any) {
    console.error("[dashboard-summary]", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard summary",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
