import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDepositPaidNotification } from "@/lib/pushover-notifications";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Verify signed "I've paid" link (same secret as send-email). */
function verifySignature(bookingId: string, sig: string): boolean {
  const secret = process.env.DEPOSIT_PAID_LINK_SECRET || process.env.NEXTAUTH_SECRET || "deposit-paid-fallback";
  const expected = createHmac("sha256", secret).update(bookingId).digest("hex");
  if (expected.length !== sig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}

/**
 * GET /api/client/bookings/[id]/marked-deposit-paid?sig=...
 * Client clicked "I've paid" in booking confirmation email.
 * Verifies signature, sets depositPaidClickedAt (flashes Paid in admin), sends Pushover, redirects to thank-you.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const sig = searchParams.get("sig");

    if (!sig) {
      return NextResponse.redirect(
        new URL("/client/deposit-paid-thank-you?error=missing", request.url)
      );
    }

    if (!verifySignature(bookingId, sig)) {
      return NextResponse.redirect(
        new URL("/client/deposit-paid-thank-you?error=invalid", request.url)
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, name: true, bookingReference: true, depositPaidClickedAt: true, venueName: true, eventDate: true },
    });

    if (!booking) {
      return NextResponse.redirect(
        new URL("/client/deposit-paid-thank-you?error=notfound", request.url)
      );
    }

    // Set depositPaidClickedAt so booking flashes "Paid" in admin until they confirm deposit received
    if (!booking.depositPaidClickedAt) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { depositPaidClickedAt: new Date(), updatedAt: new Date() },
      });
    }

    // Notify admin (uses latest Staff_Settings push keys)
    await sendDepositPaidNotification({
      id: booking.id,
      name: booking.name,
      bookingReference: booking.bookingReference,
    });

    try {
      await notifyAdminSignificantEvent({
        type: "deposit_paid",
        bookingId: booking.id,
        title: "Deposit marked paid (client)",
        description: `${booking.name} clicked "I've paid" – ref ${booking.bookingReference ?? "—"}`,
        bookingName: booking.name,
        venueName: booking.venueName ?? undefined,
        eventDate: booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : undefined,
      });
    } catch (e) {
      console.warn("Admin notification (deposit_paid) failed:", e);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
    return NextResponse.redirect(new URL("/client/deposit-paid-thank-you", baseUrl));
  } catch (error) {
    console.error("[marked-deposit-paid]", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
    return NextResponse.redirect(new URL("/client/deposit-paid-thank-you?error=server", baseUrl));
  }
}
