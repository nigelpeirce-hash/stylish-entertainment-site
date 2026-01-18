import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for API routes that interact with the database
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Checks if a user's IP matches any provisional (pending) bookings
 * Used for recognizing returning clients without requiring login
 */
export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json();

    if (!ip || ip === "Unknown") {
      return NextResponse.json({
        recognized: false,
        message: "IP address not provided",
      });
    }

    // Get client IP from request headers if not provided
    const clientIp = ip || 
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown";

    // Find provisional bookings (status: "pending")
    // Note: IP matching requires storing IP when bookings are created/accessed
    // For now, we'll check for the most recent pending booking
    // In production, you may want to add an acceptance_ip or visitor_ip field to Booking model
    
    const provisionalBookings = await prisma.booking.findMany({
      where: {
        status: "pending", // Provisional bookings
      },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        venueName: true,
        emailsSent: true,
        createdAt: true,
        // If acceptance_ip is added to schema, include it here
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to recent bookings for performance
    });

    // Check if any booking matches the IP
    // Check emailsSent JSON for stored IP in multiple possible locations
    let matchingBooking = null;

    for (const booking of provisionalBookings) {
      if (!booking.emailsSent) continue;
      
      const emailsSent = booking.emailsSent as any;
      
      // Check multiple possible IP storage locations in emailsSent JSON
      // 1. Top-level acceptance_ip or visitor_ip
      if (emailsSent?.acceptance_ip === clientIp || emailsSent?.visitor_ip === clientIp) {
        matchingBooking = booking;
        break;
      }
      
      // 2. Check nested in termsAcceptance object (if it exists)
      if (emailsSent?.termsAcceptance?.acceptance_ip === clientIp || 
          emailsSent?.termsAcceptance?.visitor_ip === clientIp) {
        matchingBooking = booking;
        break;
      }
      
      // 3. Check nested in any email metadata
      if (emailsSent?.metadata?.acceptance_ip === clientIp || 
          emailsSent?.metadata?.visitor_ip === clientIp) {
        matchingBooking = booking;
        break;
      }
      
      // 4. Deep search in all nested objects (fallback)
      const checkNestedIp = (obj: any, targetIp: string): boolean => {
        if (!obj || typeof obj !== 'object') return false;
        for (const key in obj) {
          if (key === 'acceptance_ip' || key === 'visitor_ip') {
            if (obj[key] === targetIp) return true;
          }
          if (typeof obj[key] === 'object' && checkNestedIp(obj[key], targetIp)) {
            return true;
          }
        }
        return false;
      };
      
      if (checkNestedIp(emailsSent, clientIp)) {
        matchingBooking = booking;
        break;
      }
    }

    // If no IP match found but we have pending bookings, 
    // you could optionally match on other criteria (e.g., recent visit, browser fingerprint)
    // For now, we'll only match on exact IP to be conservative

    if (matchingBooking) {
      return NextResponse.json({
        recognized: true,
        clientName: matchingBooking.name,
        bookingId: matchingBooking.id,
        email: matchingBooking.email,
        venueName: matchingBooking.venueName,
        eventDate: matchingBooking.eventDate,
      });
    }

    return NextResponse.json({
      recognized: false,
      message: "No matching provisional booking found for this IP",
    });
  } catch (error: any) {
    console.error("Error checking IP recognition:", error);
    return NextResponse.json(
      {
        recognized: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
