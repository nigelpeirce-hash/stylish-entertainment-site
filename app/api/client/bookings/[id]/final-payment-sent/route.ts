import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";
import { SIGNATURE_BLOCK_HTML } from "@/lib/email-signature";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_DAYS = 21;

/**
 * Client confirms "I have sent the final payment". Updates booking and notifies DJ(s).
 * Only allowed within 3-week window.
 */
export async function POST(
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
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        venueName: true,
        eventType: true,
      },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const now = new Date();
    const eventDate = new Date(booking.eventDate);
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil > WINDOW_DAYS || daysUntil < 0) {
      return NextResponse.json(
        { error: "Final payment confirmation is only available within 21 days of your event" },
        { status: 403 }
      );
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        finalDetailsConfirmed: true,
        finalDetailsConfirmedManual: true,
        updatedAt: now,
      },
    });

    await logActivity({
      bookingId,
      action: "final_payment_sent",
      description: "Client confirmed final payment sent",
      actor: "client",
      performedBy: booking.name ?? undefined,
      metadata: { venueName: booking.venueName ?? undefined },
    });

    const assignments = await prisma.bookingStaffAssignment.findMany({
      where: {
        bookingId,
        status: { not: "cancelled" },
        OR: [
          { role: { in: ["DJ", "dj", "Musician", "musician", "Band", "band", "Performer", "performer", "Host", "host"] } },
          { role: { contains: "dj", mode: "insensitive" } },
          { role: { contains: "saxophonist", mode: "insensitive" } },
          { role: { contains: "pianist", mode: "insensitive" } },
          { role: { contains: "guitarist", mode: "insensitive" } },
          { role: { contains: "harpist", mode: "insensitive" } },
          { role: { contains: "violinist", mode: "insensitive" } },
        ],
      },
      select: {
        staff: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const dateStr = eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const venue = booking.venueName || "TBC";
    const subject = `Final payment received – ${booking.name} @ ${venue}`;
    const html = `
      <p>Good news — the client has confirmed they have sent the final payment.</p>
      <p><strong>Booking:</strong> ${booking.name}</p>
      <p><strong>Event:</strong> ${booking.eventType || "Event"} at ${venue}</p>
      <p><strong>Date:</strong> ${dateStr}</p>
      <p>If you have any questions, please check in with the office.</p>
      ${SIGNATURE_BLOCK_HTML}
    `;
    const text = `Final payment received – ${booking.name} @ ${venue}\n\nEvent: ${booking.eventType || "Event"} at ${venue}\nDate: ${dateStr}\n\nThe client has confirmed they have sent the final payment.\n\nKind Regards,\nAli & Nige\n\n07970 793177  |  info@stylishentertainment.co.uk  |  stylishentertainment.co.uk\nFacebook · Instagram · YouTube\nEvery gathering deserves to be extraordinary\nStylish Entertainment Ltd | West Country · London · Nationwide`;

    for (const a of assignments) {
      const email = a.staff.email;
      if (email) {
        try {
          await sendEmail({ to: email, subject, html, text });
        } catch (err) {
          console.error(`[final-payment-sent] Failed to notify artist ${email}:`, err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[final-payment-sent]", e);
    return NextResponse.json(
      { error: "Failed to confirm final payment" },
      { status: 500 }
    );
  }
}
