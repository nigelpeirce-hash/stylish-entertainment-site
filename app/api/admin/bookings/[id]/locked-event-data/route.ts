import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchLockedEventData } from "@/lib/email-template-utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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

    // Handle both Promise and direct params (for Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Fetch locked event data
    const eventData = await fetchLockedEventData(bookingId);

    return NextResponse.json({
      success: true,
      ...eventData,
    });
  } catch (error: any) {
    console.error("Error fetching locked event data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch locked event data",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
