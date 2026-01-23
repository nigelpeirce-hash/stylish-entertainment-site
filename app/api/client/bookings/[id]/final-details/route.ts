import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_DAYS = 21;

/**
 * PATCH final details (e.g. notes) for the booking. Only allowed within 3-week window.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, eventDate: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const now = new Date();
    const eventDate = new Date(booking.eventDate);
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil > WINDOW_DAYS || daysUntil < 0) {
      return NextResponse.json(
        { error: "Final details can only be updated within 21 days of your event" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;
    const musicRequests = typeof body.musicRequests === "string" ? body.musicRequests.trim() : null;

    const updateData: { message?: string; musicRequests?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (notes !== null) updateData.message = notes;
    if (musicRequests !== null) updateData.musicRequests = musicRequests;

    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[final-details]", e);
    return NextResponse.json(
      { error: "Failed to update final details" },
      { status: 500 }
    );
  }
}
