import { NextRequest, NextResponse } from "next/server";
import { verifyBookDJQuoteToken } from "@/lib/book-dj-quote-token";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/book-dj/quote?token=xxx
 * Returns artist names from the quote and optional prefill from the booking.
 * Used when the user lands on /book-dj?quote=xxx from a quote/DJ reply email.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") ?? searchParams.get("quote") ?? "";

    if (!token) {
      return NextResponse.json(
        { error: "Missing quote token. Use the link from your quote email." },
        { status: 400 }
      );
    }

    const payload = verifyBookDJQuoteToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired link. Please contact us or request a new quote." },
        { status: 400 }
      );
    }

    const { bookingId, artistNames } = payload;
    const names = Array.isArray(artistNames) ? artistNames : [];

    // Map DB eventType to form option values (Book Your DJ form uses "Wedding", "Private Party", etc.)
    function eventTypeForForm(dbEventType: string | null | undefined): string | undefined {
      if (!dbEventType) return undefined;
      const lower = dbEventType.toLowerCase();
      if (lower === "wedding") return "Wedding";
      if (lower === "party") return "Private Party";
      if (lower === "corporate") return "Corporate Event";
      if (lower === "christmas" || lower.includes("christmas")) return "Christmas Party";
      if (lower === "other") return "Other";
      return "Wedding";
    }

    let prefill: {
      name?: string;
      email?: string;
      phone?: string;
      clientAddress?: string;
      clientAddress2?: string;
      clientTown?: string;
      clientPostcode?: string;
      eventType?: string;
      eventDate?: string;
      eventStartTime?: string;
      eventEndTime?: string;
      venueName?: string;
      venueAddress?: string;
      venueAddress2?: string;
      venueTown?: string;
      venueCounty?: string;
      venuePostcode?: string;
      numberOfGuests?: string;
      agreedFee?: string;
    } | null = null;

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
          name: true,
          email: true,
          phoneAreaCode: true,
          phoneNumber: true,
          clientAddress: true,
          clientAddress2: true,
          clientTown: true,
          clientPostcode: true,
          eventType: true,
          eventDate: true,
          djStartTime: true,
          djFinishTime: true,
          venueName: true,
          venueAddress: true,
          venueAddress2: true,
          venueTown: true,
          venueCounty: true,
          venuePostcode: true,
          numberOfGuests: true,
          finalBalance: true,
        },
      });

      if (booking) {
        const phone =
          [booking.phoneAreaCode, booking.phoneNumber].filter(Boolean).join("") || undefined;
        prefill = {
          name: booking.name ?? undefined,
          email: booking.email ?? undefined,
          phone: phone || undefined,
          clientAddress: booking.clientAddress ?? undefined,
          clientAddress2: booking.clientAddress2 ?? undefined,
          clientTown: booking.clientTown ?? undefined,
          clientPostcode: booking.clientPostcode ?? undefined,
          eventType: eventTypeForForm(booking.eventType),
          eventDate: booking.eventDate
            ? new Date(booking.eventDate).toISOString().slice(0, 10)
            : undefined,
          eventStartTime: booking.djStartTime ?? undefined,
          eventEndTime: booking.djFinishTime ?? undefined,
          venueName: booking.venueName ?? undefined,
          venueAddress: booking.venueAddress ?? undefined,
          venueAddress2: booking.venueAddress2 ?? undefined,
          venueTown: booking.venueTown ?? undefined,
          venueCounty: booking.venueCounty ?? undefined,
          venuePostcode: booking.venuePostcode ?? undefined,
          numberOfGuests: booking.numberOfGuests != null ? String(booking.numberOfGuests) : undefined,
          agreedFee: booking.finalBalance ?? undefined,
        };
      }
    }

    return NextResponse.json(
      { artistNames: names, prefill },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (e) {
    console.error("[book-dj/quote]", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us." },
      { status: 500 }
    );
  }
}
