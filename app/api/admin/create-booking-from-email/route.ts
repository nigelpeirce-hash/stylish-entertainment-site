import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Manually create a booking from email data
 * Use this to recover missing bookings from email notifications
 */
export async function POST(request: NextRequest) {
  try {
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    let admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, eventDate, venueName, message, eventType, preferredDJ } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          phone: phone || null,
          role: "client",
        },
      });
    }

    // Parse phone
    let phoneAreaCode: string | null = null;
    let phoneNumber: string | null = null;
    if (phone) {
      const cleaned = phone.replace(/\s+/g, "");
      if (cleaned.startsWith("0")) {
        if (cleaned.startsWith("07")) {
          phoneAreaCode = cleaned.substring(0, 4);
          phoneNumber = cleaned.substring(4);
        } else {
          phoneAreaCode = cleaned.substring(0, 3);
          phoneNumber = cleaned.substring(3);
        }
      } else {
        phoneNumber = phone;
      }
    }

    // Parse venue
    let parsedVenueName = venueName || "TBC";
    let parsedVenuePostcode: string | null = null;
    if (venueName) {
      const parts = venueName.trim().split(/\s+(?=[A-Z]{1,2}\d)/);
      if (parts.length > 1 && /[A-Z]{1,2}\d/.test(parts[parts.length - 1])) {
        parsedVenuePostcode = parts[parts.length - 1];
        parsedVenueName = parts.slice(0, -1).join(" ");
      }
    }

    // Calculate priority
    let priority = "medium";
    if (eventDate) {
      const eventDateObj = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDateObj.setHours(0, 0, 0, 0);
      const daysUntilEvent = Math.floor((eventDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilEvent >= 0 && daysUntilEvent <= 14) {
        priority = "urgent";
      }
    }

    // Default event date
    const bookingEventDate = eventDate ? new Date(eventDate) : new Date("2099-12-31");

    // Check if booking already exists (safe select: omit columns that may not exist in DB)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        email: email,
        eventDate: {
          gte: new Date(bookingEventDate.getTime() - 24 * 60 * 60 * 1000),
          lte: new Date(bookingEventDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    });

    if (existingBooking) {
      return NextResponse.json({
        success: false,
        error: "Booking already exists",
        booking: {
          id: existingBooking.id,
          name: existingBooking.name,
          email: existingBooking.email,
          status: existingBooking.status,
          createdAt: existingBooking.createdAt,
        },
        message: "Booking with this email and event date already exists",
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        userId: user.id,
        name,
        email,
        phoneAreaCode,
        phoneNumber,
        eventType: eventType || "wedding",
        eventDate: bookingEventDate,
        venueName: parsedVenueName,
        venuePostcode: parsedVenuePostcode,
        preferredDJ: preferredDJ || null,
        services: [],
        upsellItems: [],
        message: message || "",
        status: "pending",
        // @ts-ignore
        priority,
        contactPreference: "Email",
        emailsSent: {
          enquiry: true,
          "enquiry-sent-at": new Date().toISOString(),
        },
        lastEmailSentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        status: booking.status,
        createdAt: booking.createdAt,
      },
      message: "Booking created successfully from email data",
    });
  } catch (error) {
    console.error("Error creating booking from email:", error);
    return NextResponse.json(
      { 
        error: "Failed to create booking",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
