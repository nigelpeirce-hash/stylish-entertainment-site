import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// This endpoint creates a test booking for the logged-in user
// Only works in development mode
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  try {
    // Try to get session using the request directly (works better with NextAuth v5)
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    if (!token) {
      // Fallback to getServerSession
      const session = await getServerSession();
      if (!session?.user) {
        return NextResponse.json(
          { error: "You must be logged in to create a test booking" },
          { status: 401 }
        );
      }
      
      // Create a test booking 3 months in the future
      const eventDate = new Date();
      eventDate.setMonth(eventDate.getMonth() + 3);

      const booking = await prisma.booking.create({
        data: {
          userId: (session.user as any).id,
          name: session.user?.name || "Test User",
          email: session.user?.email || "test@example.com",
          eventType: "Wedding",
          eventDate: eventDate,
          venueName: "Test Venue",
          venueAddress: "123 Test Street",
          venueTown: "Bath",
          venueCounty: "Somerset",
          venuePostcode: "BA1 1AA",
          numberOfGuests: 100,
          services: ["DJs", "Lighting Design"],
          status: "confirmed",
          budget: "5000",
          message: "This is a test booking for testing dashboard features",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Test booking created successfully!",
        booking,
      });
    }

    // Use token if available
    const userId = (token.id as string) || (token.sub as string);
    const userName = (token.name as string) || "Test User";
    const userEmail = (token.email as string) || "test@example.com";

    // Create a test booking 3 months in the future
    const eventDate = new Date();
    eventDate.setMonth(eventDate.getMonth() + 3);

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        name: userName,
        email: userEmail,
        eventType: "Wedding",
        eventDate: eventDate,
        venueName: "Test Venue",
        venueAddress: "123 Test Street",
        venueTown: "Bath",
        venueCounty: "Somerset",
        venuePostcode: "BA1 1AA",
        numberOfGuests: 100,
        services: ["DJs", "Lighting Design"],
        status: "confirmed",
        budget: "5000",
        message: "This is a test booking for testing dashboard features",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test booking created successfully!",
      booking,
    });
  } catch (error: any) {
    console.error("Error creating test booking:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
