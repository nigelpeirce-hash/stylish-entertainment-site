import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { checkForBookingConflicts } from "@/lib/booking-integrity";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, name, eventDate, venuePostcode } = body;

    if (!email || !eventDate) {
      return NextResponse.json(
        { error: "email and eventDate are required" },
        { status: 400 }
      );
    }

    // Check for conflicts (with name for fuzzy matching)
    const conflictResult = await checkForBookingConflicts(
      email,
      name || email, // Use name if provided, otherwise use email
      eventDate,
      venuePostcode
    );

    return NextResponse.json({
      success: true,
      ...conflictResult,
    });
  } catch (error: any) {
    console.error("Error checking booking conflicts:", error);
    return NextResponse.json(
      {
        error: "Failed to check booking conflicts",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const eventDate = searchParams.get("eventDate");
    const venuePostcode = searchParams.get("venuePostcode");

    if (!email || !eventDate) {
      return NextResponse.json(
        { error: "email and eventDate query parameters are required" },
        { status: 400 }
      );
    }

    // Check for conflicts (with name for fuzzy matching)
    const conflictResult = await checkForBookingConflicts(
      email,
      name || email, // Use name if provided, otherwise use email
      eventDate,
      venuePostcode || null
    );

    return NextResponse.json({
      success: true,
      ...conflictResult,
    });
  } catch (error: any) {
    console.error("Error checking booking conflicts:", error);
    return NextResponse.json(
      {
        error: "Failed to check booking conflicts",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
