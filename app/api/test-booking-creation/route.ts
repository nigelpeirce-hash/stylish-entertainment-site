import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Test endpoint to verify booking creation works
 * This will help diagnose why bookings aren't being created
 */
export async function POST(request: NextRequest) {
  try {
    // Test data
    const testData = {
      userId: null, // Will create a test user
      name: "Test Booking",
      email: `test-${Date.now()}@example.com`,
      phoneAreaCode: null,
      phoneNumber: null,
      eventType: "wedding",
      eventDate: new Date("2026-06-15"),
      venueName: "Test Venue",
      venuePostcode: null,
      preferredDJ: null,
      services: [],
      upsellItems: [],
      message: "This is a test booking",
      status: "pending",
      priority: "medium",
      contactPreference: "Email",
      emailsSent: {
        enquiry: true,
        "enquiry-sent-at": new Date().toISOString(),
      },
      lastEmailSentAt: new Date(),
    };

    // First create a test user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: testData.email,
          name: testData.name,
          role: "client",
        },
      });
      console.log("✅ Test user created:", user.id);
    } catch (userError) {
      return NextResponse.json({
        success: false,
        error: "Failed to create test user",
        details: String(userError),
      }, { status: 500 });
    }

    // Now try to create the booking
    try {
      const booking = await prisma.booking.create({
        data: {
          ...testData,
          userId: user.id,
        },
      });
      
      console.log("✅ Test booking created successfully:", booking.id);
      
      // Verify we can read it back
      const verification = await prisma.booking.findUnique({
        where: { id: booking.id },
      });

      return NextResponse.json({
        success: true,
        message: "Test booking created and verified successfully",
        booking: {
          id: booking.id,
          name: booking.name,
          email: booking.email,
          status: booking.status,
          createdAt: booking.createdAt,
        },
        verified: verification !== null,
        databaseConnected: true,
      });
    } catch (bookingError: any) {
      console.error("❌ Failed to create test booking:", bookingError);
      console.error("Error code:", bookingError.code);
      console.error("Error message:", bookingError.message);
      console.error("Error meta:", bookingError.meta);

      return NextResponse.json({
        success: false,
        error: "Failed to create test booking",
        errorCode: bookingError.code,
        errorMessage: bookingError.message,
        errorMeta: bookingError.meta,
        details: String(bookingError),
        testData: testData,
      }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Test booking creation failed:", error);
    return NextResponse.json({
      success: false,
      error: "Unexpected error",
      details: String(error),
    }, { status: 500 });
  }
}
