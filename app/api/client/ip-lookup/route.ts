import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering for API routes that interact with the database
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * IP Lookup API Route
 * 
 * Takes an IP address as a parameter and returns the associated Client Name and Venue
 * if a match is found in booking metadata (emailsSent JSON field).
 * 
 * @param request - Next.js request object containing IP address in JSON body
 * @returns JSON response with clientName and venueName if match found, or not found message
 */
export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json();

    // Validate IP parameter
    if (!ip || ip === "Unknown" || typeof ip !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Valid IP address parameter is required",
        },
        { status: 400 }
      );
    }

    // Get client IP from request headers if not provided in body
    const clientIp = ip || 
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    if (!clientIp) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not determine IP address",
        },
        { status: 400 }
      );
    }

    // Query all bookings with pending status (provisional bookings)
    // Limit to recent bookings for performance
    const bookings = await prisma.booking.findMany({
      where: {
        status: "pending", // Provisional bookings
      },
      select: {
        id: true,
        name: true, // Client Name
        venueName: true, // Venue Name
        emailsSent: true, // Metadata JSON field
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Increased limit for better coverage
    });

    // Helper function to recursively search for IP in nested JSON structure
    const checkNestedIp = (obj: any, targetIp: string): boolean => {
      if (!obj || typeof obj !== "object") return false;
      
      for (const key in obj) {
        // Check if this key contains the IP we're looking for
        if (key === "acceptance_ip" || key === "visitor_ip") {
          if (obj[key] === targetIp) return true;
        }
        // Recursively check nested objects
        if (typeof obj[key] === "object" && checkNestedIp(obj[key], targetIp)) {
          return true;
        }
      }
      return false;
    };

    // Search through bookings for IP match
    let matchedBooking = null;

    for (const booking of bookings) {
      if (!booking.emailsSent) continue;

      const emailsSent = booking.emailsSent as any;

      // Check multiple possible IP storage locations
      // 1. Top-level fields
      if (
        emailsSent?.acceptance_ip === clientIp ||
        emailsSent?.visitor_ip === clientIp
      ) {
        matchedBooking = booking;
        break;
      }

      // 2. Nested in termsAcceptance
      if (
        emailsSent?.termsAcceptance?.acceptance_ip === clientIp ||
        emailsSent?.termsAcceptance?.visitor_ip === clientIp
      ) {
        matchedBooking = booking;
        break;
      }

      // 3. Nested in metadata
      if (
        emailsSent?.metadata?.acceptance_ip === clientIp ||
        emailsSent?.metadata?.visitor_ip === clientIp
      ) {
        matchedBooking = booking;
        break;
      }

      // 4. Deep recursive search as fallback
      if (checkNestedIp(emailsSent, clientIp)) {
        matchedBooking = booking;
        break;
      }
    }

    // Return match if found
    if (matchedBooking) {
      return NextResponse.json(
        {
          success: true,
          found: true,
          clientName: matchedBooking.name,
          venueName: matchedBooking.venueName,
          bookingId: matchedBooking.id,
          message: "Match found in booking metadata",
        },
        { status: 200 }
      );
    }

    // No match found
    return NextResponse.json(
      {
        success: true,
        found: false,
        message: "No matching booking found for this IP address",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in IP lookup API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message || "An error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for IP lookup (alternative method)
 * Accepts IP as query parameter
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip || ip === "Unknown") {
      return NextResponse.json(
        {
          success: false,
          message: "IP address query parameter is required (e.g., ?ip=123.456.789.0)",
        },
        { status: 400 }
      );
    }

    // Use POST handler logic by creating a mock request body
    const mockRequest = new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify({ ip }),
    });

    return POST(mockRequest as NextRequest);
  } catch (error: any) {
    console.error("Error in IP lookup GET:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message || "An error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}
