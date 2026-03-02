import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Try to get token directly from request (works better with NextAuth v5)
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    let userId: string | null = null;

    if (token) {
      userId = (token.id as string) || (token.sub as string);
    } else {
      // Fallback to getServerSession
      const session = await getServerSession();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = (session.user as any).id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        venueName: true,
        eventDate: true,
        eventType: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        portalHeroImageUrl: true,
        musicRequests: true,
        musicDislikes: true,
        firstDance: true,
        lastSong: true,
        musicNotesToDJ: true,
        musicFileUrl: true,
        budget: true,
        numberOfGuests: true,
        ceremonyTime: true,
        termsAccepted: true,
        termsAcceptedAt: true,
        preferredDJ: true,
        finalBalance: true,
        bookingFee: true,
        services: true,
        upsellItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to get token directly from request (works better with NextAuth v5)
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    let userId: string | null = null;

    if (token) {
      userId = (token.id as string) || (token.sub as string);
    } else {
      // Fallback to getServerSession
      const session = await getServerSession();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = (session.user as any).id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Map single "phone" from form to phoneNumber (phoneAreaCode optional for UK split later)
    const phoneNumber = body.phoneNumber ?? (body.phone && String(body.phone).trim() ? String(body.phone).trim() : null);
    const phoneAreaCode = body.phoneAreaCode ?? null;

    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        userId: userId,
        
        // Client Information
        name: body.name,
        email: body.email,
        phoneAreaCode: phoneAreaCode || null,
        phoneNumber: phoneNumber || null,
        clientAddress: body.clientAddress && String(body.clientAddress).trim() ? String(body.clientAddress).trim() : null,
        clientAddress2: body.clientAddress2 && String(body.clientAddress2).trim() ? String(body.clientAddress2).trim() : null,
        clientTown: body.clientTown && String(body.clientTown).trim() ? String(body.clientTown).trim() : null,
        clientCounty: body.clientCounty && String(body.clientCounty).trim() ? String(body.clientCounty).trim() : null,
        clientPostcode: body.clientPostcode && String(body.clientPostcode).trim() ? String(body.clientPostcode).trim() : null,
        
        // Event Details
        eventType: body.eventType || "wedding",
        eventDate: new Date(body.eventDate),
        djStartTime: body.djStartTime && String(body.djStartTime).trim() ? String(body.djStartTime).trim() : null,
        djFinishTime: body.djFinishTime && String(body.djFinishTime).trim() ? String(body.djFinishTime).trim() : null,
        
        // Venue Information
        venueName: body.venueName,
        venueContact: body.venueContact,
        venueAddress: body.venueAddress && String(body.venueAddress).trim() ? String(body.venueAddress).trim() : null,
        venueAddress2: body.venueAddress2 && String(body.venueAddress2).trim() ? String(body.venueAddress2).trim() : null,
        venueTown: body.venueTown && String(body.venueTown).trim() ? String(body.venueTown).trim() : null,
        venueCounty: body.venueCounty && String(body.venueCounty).trim() ? String(body.venueCounty).trim() : null,
        venuePostcode: body.venuePostcode && String(body.venuePostcode).trim() ? String(body.venuePostcode).trim() : null,
        venuePhoneAreaCode: body.venuePhoneAreaCode,
        venuePhoneNumber: body.venuePhoneNumber,
        
        // DJ Details (djStartTime/djFinishTime set above in Event Details)
        djArrivalTime: body.djArrivalTime,
        djSetupLocation: body.djSetupLocation,
        djParking: body.djParking,
        soundLimiter: body.soundLimiter === "Yes" ? true : body.soundLimiter === "No" ? false : null,
        numberOfGuests: body.numberOfGuests ? parseInt(body.numberOfGuests) : null,
        services: body.services || [],
        upsellItems: body.upsellItems || [],
        message: body.message,
        budget: null,
        contactPreference: null,
        preferredDJ: body.preferredDJ || null,

        // Payment (agreed fee from form as finalBalance)
        finalBalance: body.finalBalance ?? (body.agreedFee && String(body.agreedFee).trim() ? String(body.agreedFee).trim() : null),
        paymentPayerName: body.paymentPayerName,
        
        // Music Details
        musicNotesToDJ: body.musicNotesToDJ,
        musicNotesToStylish: body.musicNotesToStylish,
        firstDance: body.firstDance,
        lastSong: body.lastSong,
        musicDislikes: body.musicDislikes,
        musicRequests: body.musicRequests,
        musicFileUrl: body.musicFileUrl,
      },
    });

    try {
      const eventDateLabel = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : undefined;
      await notifyAdminSignificantEvent({
        type: "booking_request_received",
        bookingId: booking.id,
        actor: "client",
        title: "Booking request received",
        description: `${body.name} – ${(body.venueName || "Venue TBC").trim()}${eventDateLabel ? ` – ${eventDateLabel}` : ""}. From Booking Request Form (client portal).`,
        bookingName: body.name ?? undefined,
        venueName: (body.venueName && String(body.venueName).trim()) || undefined,
        eventDate: eventDateLabel,
        linkText: "View booking",
      });
    } catch (e) {
      console.warn("Admin notification (booking_request_received) failed:", e);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
