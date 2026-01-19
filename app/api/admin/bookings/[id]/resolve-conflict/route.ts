import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
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

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const body = await request.json();
    const { action } = body; // "keep_separate"

    if (action !== "keep_separate") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'keep_separate'" },
        { status: 400 }
      );
    }

    // Update booking to mark conflict as resolved
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        conflictStatus: "kept_separate",
        conflictResolvedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Conflict resolved - booking kept separate",
    });
  } catch (error: any) {
    console.error("Error resolving conflict:", error);
    return NextResponse.json(
      {
        error: "Failed to resolve conflict",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
