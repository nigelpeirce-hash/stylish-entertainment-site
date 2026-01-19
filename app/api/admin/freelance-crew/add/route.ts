import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Add a basic staff member to the database
 * Simple entry with just a name - more details can be added later
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
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Staff name is required" },
        { status: 400 }
      );
    }

    // Check if staff member already exists
    const existingStaff = await prisma.freelanceCrew.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: `Staff member "${name.trim()}" already exists`, existingStaff: true },
        { status: 409 }
      );
    }

    // Create basic staff entry
    const staff = await prisma.freelanceCrew.create({
      data: {
        name: name.trim(),
        roles: [], // Empty roles array - can be updated later
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        roles: staff.roles,
        isActive: staff.isActive,
      },
    });
  } catch (error: any) {
    console.error("Error adding staff member:", error);
    
    // Handle unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Staff member with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to add staff member" },
      { status: 500 }
    );
  }
}
