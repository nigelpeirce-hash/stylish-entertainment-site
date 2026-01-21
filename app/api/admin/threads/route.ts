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

    const userEmail = (admin as any)?.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const inboxId = searchParams.get("inboxId");
    const bookingId = searchParams.get("bookingId");
    const isArchived = searchParams.get("isArchived") === "true";
    const isRead = searchParams.get("isRead");
    const search = searchParams.get("search");

    const where: any = {};

    if (inboxId) {
      where.inboxId = inboxId;
    } else {
      // Filter by assignedUsers if no specific inboxId provided
      // Get all inboxes where user is assigned (or inbox has no assignedUsers = shared)
      const inboxes = await prisma.emailInbox.findMany({
        where: {
          OR: [
            { assignedUsers: { isEmpty: true } }, // Shared inboxes
            { assignedUsers: { has: userEmail } }, // User is assigned
          ],
        },
        select: { id: true },
      });
      
      const inboxIds = inboxes.map(i => i.id);
      if (inboxIds.length > 0) {
        where.inboxId = { in: inboxIds };
      } else {
        // No accessible inboxes, return empty
        return NextResponse.json({ threads: [] });
      }
    }
    
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
        EmailInbox: {
          select: { id: true, name: true, email: true },
        },
        Booking: {
          select: { id: true, name: true, eventType: true, eventDate: true, status: true },
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
