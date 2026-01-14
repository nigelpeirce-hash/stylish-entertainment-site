import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Get single thread with all emails
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const thread = await prisma.emailThread.findUnique({
      where: { id },
      include: {
        inbox: {
          select: { id: true, name: true, email: true },
        },
        booking: {
          select: {
            id: true,
            name: true,
            email: true,
            eventType: true,
            eventDate: true,
            venueName: true,
            status: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        emails: {
          include: {
            sentByUser: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { receivedAt: "asc" },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Mark thread as read
    await prisma.emailThread.update({
      where: { id },
      data: { isRead: true },
    });

    // Mark all emails in thread as read
    await prisma.email.updateMany({
      where: { threadId: id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update thread (star, archive, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isRead, isStarred, isArchived, bookingId } = body;

    const updateData: any = {};
    if (isRead !== undefined) updateData.isRead = isRead;
    if (isStarred !== undefined) updateData.isStarred = isStarred;
    if (isArchived !== undefined) updateData.isArchived = isArchived;
    if (bookingId !== undefined) updateData.bookingId = bookingId;

    const thread = await prisma.emailThread.update({
      where: { id },
      data: updateData,
      include: {
        inbox: {
          select: { id: true, name: true, email: true },
        },
        booking: {
          select: {
            id: true,
            name: true,
            eventType: true,
            eventDate: true,
          },
        },
      },
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
