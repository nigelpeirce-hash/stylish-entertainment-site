import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Search for freelance crew by name
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ crew: [] });
    }

    const crew = await prisma.freelanceCrew.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10, // Limit results
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ crew });
  } catch (error: any) {
    console.error("Error searching freelance crew:", error);
    return NextResponse.json(
      { error: "Failed to search crew", crew: [] },
      { status: 500 }
    );
  }
}
