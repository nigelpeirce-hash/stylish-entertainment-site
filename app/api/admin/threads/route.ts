import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const inboxId = searchParams.get("inboxId");
    const bookingId = searchParams.get("bookingId");
    const isArchived = searchParams.get("isArchived") === "true";
    const isRead = searchParams.get("isRead");
    const search = searchParams.get("search");

    const where: any = {};

    if (inboxId) where.inboxId = inboxId;
    if (bookingId) where.bookingId = bookingId;
    if (searchParams.has("isArchived")) {
      where.isArchived = isArchived;
    }
    if (searchParams.has("isRead")) {
      where.isRead = isRead === "true";
    }
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { fromEmail: { contains: search, mode: "insensitive" } },
        { fromName: { contains: search, mode: "insensitive" } },
      ];
    }

    const threads = await prisma.emailThread.findMany({
      where,
      include: {
        inbox: {
          select: { id: true, name: true, email: true },
        },
        booking: {
          select: { id: true, name: true, eventType: true, eventDate: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        emails: {
          orderBy: { receivedAt: "asc" },
          take: 1, // Just get count, we'll load full emails separately
        },
        _count: {
          select: { emails: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
