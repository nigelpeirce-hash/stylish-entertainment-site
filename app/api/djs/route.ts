import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Public API route to fetch active DJs for the website
export async function GET(request: NextRequest) {
  try {
    // Fetch all DJs (including inactive ones for debugging)
    const allDJs = await prisma.dJ.findMany({
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
        isActive: true,
      },
    });

    // Filter to only active DJs
    const activeDJs = allDJs.filter(dj => dj.isActive === true);

    // Log for debugging in production
    if (process.env.NODE_ENV === "production") {
      console.log(`[DJs API] Total DJs: ${allDJs.length}, Active: ${activeDJs.length}`);
    }

    // Return active DJs (remove isActive from response as it's not needed)
    const djs = activeDJs.map(({ isActive, ...dj }) => dj);

    return NextResponse.json(
      { djs },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error("[DJs API] Error fetching DJs:", error);
    
    // Return empty array instead of error to prevent page crash
    // This allows the page to still render with "No DJs available" message
    return NextResponse.json(
      { 
        djs: [],
        error: process.env.NODE_ENV === "development" 
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { 
        status: 200, // Return 200 with empty array so page doesn't crash
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}
