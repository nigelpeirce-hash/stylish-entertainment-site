import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: (session.user as any).id,
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
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const booking = await prisma.booking.create({
      data: {
        userId: session?.user ? (session.user as any).id : null,
        
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
        message: body.message,
        budget: body.budget,
        contactPreference: body.contactPreference,
        
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
