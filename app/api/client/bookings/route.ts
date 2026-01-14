import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

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

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        
        // Client Information
        name: body.name,
        email: body.email,
        phoneAreaCode: body.phoneAreaCode,
        phoneNumber: body.phoneNumber,
        
        // Event Details
        eventType: body.eventType || "wedding",
        eventDate: new Date(body.eventDate),
        
        // Venue Information
        venueName: body.venueName,
        venueContact: body.venueContact,
        venueAddress: body.venueAddress,
        venueAddress2: body.venueAddress2,
        venueTown: body.venueTown,
        venueCounty: body.venueCounty,
        venuePostcode: body.venuePostcode,
        venuePhoneAreaCode: body.venuePhoneAreaCode,
        venuePhoneNumber: body.venuePhoneNumber,
        
        // DJ Details
        djArrivalTime: body.djArrivalTime,
        djStartTime: body.djStartTime,
        djFinishTime: body.djFinishTime,
        djSetupLocation: body.djSetupLocation,
        djParking: body.djParking,
        soundLimiter: body.soundLimiter === "Yes" ? true : body.soundLimiter === "No" ? false : null,
        numberOfGuests: body.numberOfGuests ? parseInt(body.numberOfGuests) : null,
        services: body.services || [],
        upsellItems: body.upsellItems || [],
        message: body.message,
        budget: body.budget,
        contactPreference: body.contactPreference,
        preferredDJ: body.preferredDJ || null,
        
        // Payment
        finalBalance: body.finalBalance,
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

    // TODO: Send email notification here

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
