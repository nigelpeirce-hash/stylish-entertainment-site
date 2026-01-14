import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle both Promise and direct params (for Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Fetch email threads separately if booking exists
    // Using the same pattern as /api/admin/threads/route.ts
    let emailThreads: any[] = [];
    if (booking) {
      try {
        emailThreads = await prisma.emailThread.findMany({
          where: { bookingId: booking.id },
          take: 5,
          orderBy: { lastMessageAt: "desc" },
          select: {
            id: true,
            subject: true,
            fromEmail: true,
            lastMessageAt: true,
            isRead: true,
          },
        });
      } catch (threadError: any) {
        // If emailThread model isn't available, continue without it
        // This can happen if the dev server needs a restart after Prisma regeneration
        console.log("Note: Email threads not available. If you just regenerated Prisma, restart your dev server.");
        emailThreads = [];
      }
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      booking: {
        ...booking,
        emailThreads,
      }
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
