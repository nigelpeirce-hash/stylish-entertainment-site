import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

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

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    // Fetch audit logs for this booking
    const auditLogs = await prisma.auditLog.findMany({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to 50 most recent entries
      select: {
        id: true,
        action: true,
        description: true,
        performedBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      auditLogs,
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch audit logs",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
