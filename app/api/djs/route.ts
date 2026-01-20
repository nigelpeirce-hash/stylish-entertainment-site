import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Public API route to fetch active DJs for the website
export async function GET(request: NextRequest) {
  try {
    const djs = await prisma.dJ.findMany({
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
        imageUrl: true,
        seoTitle: true,
        seoDescription: true,
        mixcloudUrl: true,
        youtubeEmbed: true,
        displayOrder: true,
      },
    });

    return NextResponse.json({ djs });
  } catch (error) {
    console.error("Error fetching DJs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
