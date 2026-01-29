import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyQuoteToken } from "@/lib/quote-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/book-from-quote?token=...
 * Validates quote token, returns prefill data for the Book-from-Quote form.
 * Public – no auth. Token is the auth.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const payload = verifyQuoteToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired link. Please contact us or request a new quote." },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: payload.bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneAreaCode: true,
        phoneNumber: true,
        clientAddress: true,
        clientAddress2: true,
        clientTown: true,
        clientCounty: true,
        clientPostcode: true,
        eventType: true,
        eventDate: true,
        venueName: true,
        venueAddress: true,
        venuePostcode: true,
        archivedAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.archivedAt) {
      return NextResponse.json(
        { error: "This booking is no longer active." },
        { status: 410 }
      );
    }
    if (booking.email.toLowerCase() !== payload.clientEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "This link was sent to a different email address." },
        { status: 403 }
      );
    }

    const eventDate =
      booking.eventDate instanceof Date
        ? booking.eventDate
        : new Date(booking.eventDate as unknown as string);
    const eventDateIso = eventDate.toISOString().slice(0, 10);

    let artistName: string | null = null;
    if (payload.staffId) {
      const staff = await prisma.freelanceCrew.findUnique({
        where: { id: payload.staffId },
        select: { name: true },
      });
      artistName = staff?.name ?? null;
    }
    if (!artistName && payload.artistName) artistName = payload.artistName;

    const phone = [booking.phoneAreaCode, booking.phoneNumber].filter(Boolean).join(" ").trim() || "";
    const prefill = {
      bookingId: booking.id,
      name: booking.name,
      email: booking.email,
      phone,
      clientAddress: booking.clientAddress ?? "",
      clientAddress2: booking.clientAddress2 ?? "",
      clientTown: booking.clientTown ?? "",
      clientCounty: booking.clientCounty ?? "",
      clientPostcode: booking.clientPostcode ?? "",
      eventType: booking.eventType ?? "wedding",
      eventDate: eventDateIso,
      venueName: booking.venueName ?? "",
      venueAddress: booking.venueAddress ?? "",
      venuePostcode: booking.venuePostcode ?? "",
      artistType: payload.artistType,
      staffId: payload.staffId ?? null,
      artistName,
      fee: payload.fee ?? null,
    };

    return NextResponse.json(prefill);
  } catch (e) {
    console.error("[book-from-quote] GET error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us." },
      { status: 500 }
    );
  }
}
