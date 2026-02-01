import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = "hello@stylishambience.co.uk";

/**
 * POST /api/client/bookings/[id]/confirm-hire-request
 * Sends email to admin with requested hire items. No payment. Client sees "Request Sent! Nigel will update your final invoice shortly."
 * Auth: session (user owns booking or admin) OR ?token= matching portalToken.
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

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        venueName: true,
        userId: true,
        portalToken: true,
      },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin") allowed = true;
      else if (u.id && booking.userId === u.id) allowed = true;
      else if (session.user.email && booking.email === session.user.email) allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.bookingItem.findMany({
      where: { bookingId, status: "pending_approval" },
      include: {
        HireItem: {
          select: { id: true, name: true, price: true, category: true },
        },
      },
    });

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No hire items to confirm. Add items first." },
        { status: 400 }
      );
    }

    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "TBC";
    const clientName = booking.name || "Client";
    const venue = booking.venueName || "TBC";

    const rows = items
      .map(
        (i) =>
          `• ${i.HireItem.name} × ${i.quantity} — £${(i.HireItem.price * i.quantity).toFixed(2)}`
      )
      .join("\n");
    const total = items.reduce(
      (sum, i) => sum + i.HireItem.price * i.quantity,
      0
    );

    const subject = `Hire request: ${clientName} @ ${venue} — ${eventDate}`;
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1A1A;">Hire Request from Client Portal</h2>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Event:</strong> ${eventDate}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p><strong>Requested items:</strong></p>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${rows}</pre>
        <p><strong>Total:</strong> £${total.toFixed(2)}</p>
        <p style="color: #666; font-size: 14px;">Please update the final invoice and confirm with the client.</p>
      </div>
    `;
    const text = `Hire Request from Client Portal\n\nClient: ${clientName}\nEmail: ${booking.email}\nEvent: ${eventDate}\nVenue: ${venue}\n\nRequested items:\n${rows}\n\nTotal: £${total.toFixed(2)}\n\nPlease update the final invoice and confirm with the client.`;

    await sendEmail({
      to: ADMIN_EMAIL,
      subject,
      html,
      text,
    });

    await logActivity({
      bookingId,
      action: "hire_request_confirmed",
      description: "Client confirmed hire request from portal",
      actor: "client",
      performedBy: booking.name ?? undefined,
      metadata: { amount: `£${total.toFixed(2)}`, itemCount: items.length },
    });

    return NextResponse.json({
      success: true,
      message: "Request sent. Nigel will update your final invoice shortly.",
    });
  } catch (e: any) {
    console.error("[confirm-hire-request]", e);
    return NextResponse.json(
      { error: "Failed to send hire request" },
      { status: 500 }
    );
  }
}
