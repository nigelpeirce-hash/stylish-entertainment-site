import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Public API route to fetch active musicians for the website
export async function GET(request: NextRequest) {
  try {
    const musicians = await prisma.musician.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        strapLine: true,
        fullBio: true,
        imageUrl: true,
        instrument: true,
        seoTitle: true,
        seoDescription: true,
        youtubeEmbed: true,
        displayOrder: true,
      },
    });

    return NextResponse.json({ musicians });
  } catch (error) {
    console.error("Error fetching musicians:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
