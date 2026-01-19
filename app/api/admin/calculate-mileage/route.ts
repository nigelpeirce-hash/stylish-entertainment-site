import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Calculate mileage/distance between two addresses using Google Maps Distance Matrix API
 */
export async function POST(request: NextRequest) {
  try {
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { origin, destination } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    // Call Google Maps Distance Matrix API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: `Google Maps API error: ${data.status}` },
        { status: 500 }
      );
    }

    if (!data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
      return NextResponse.json(
        { error: "No route found between the addresses" },
        { status: 404 }
      );
    }

    const element = data.rows[0].elements[0];
    if (element.status !== "OK") {
      return NextResponse.json(
        { error: `Route error: ${element.status}` },
        { status: 404 }
      );
    }

    // Get distance in miles (already in miles since we used units=imperial)
    const distanceText = element.distance.text; // e.g., "45.2 mi"
    const distanceValue = element.distance.value / 1609.34; // Convert meters to miles (just in case)

    // Calculate return journey (double the distance)
    const returnDistance = distanceValue * 2;

    return NextResponse.json({
      success: true,
      distanceText,
      distanceMiles: returnDistance.toFixed(1),
      duration: element.duration.text,
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
    });
  } catch (error: any) {
    console.error("Error calculating mileage:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate mileage" },
      { status: 500 }
    );
  }
}
