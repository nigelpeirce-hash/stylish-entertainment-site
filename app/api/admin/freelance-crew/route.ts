import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET - Fetch all crew members
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const crew = await prisma.freelanceCrew.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ crew });
  } catch (error: any) {
    console.error("Error fetching crew:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch crew" },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new crew member
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, roles, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if crew member already exists
    const existing = await prisma.freelanceCrew.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Crew member "${name.trim()}" already exists` },
        { status: 409 }
      );
    }

    const crew = await prisma.freelanceCrew.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        roles: roles || [],
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ crew });
  } catch (error: any) {
    console.error("Error creating crew member:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Crew member with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create crew member" },
      { status: 500 }
    );
  }
}
