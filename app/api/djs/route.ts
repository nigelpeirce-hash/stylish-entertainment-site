import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeMixcloudUrl } from "@/lib/mixcloud-utils";

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
        strapLine: true,
        fullBio: true,
        imageUrl: true,
        seoTitle: true,
        seoDescription: true,
        mixcloudUrl: true,
        mixcloudEmbeds: true,
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

    // Return active DJs with mixcloudEmbeds array (from mixcloudEmbeds or [mixcloudUrl])
    // Normalize page URLs to widget URLs - www.mixcloud.com cannot be iframed (X-Frame-Options)
    const djs = activeDJs.map(({ isActive, mixcloudUrl, mixcloudEmbeds, ...dj }) => {
      const raw = Array.isArray(mixcloudEmbeds) && (mixcloudEmbeds as string[]).length > 0
        ? (mixcloudEmbeds as string[])
        : (mixcloudUrl ? [mixcloudUrl] : []);
      const embeds = raw
        .map((u) => (u && typeof u === "string" ? normalizeMixcloudUrl(u) : null))
        .filter((u): u is string => !!u);
      return { ...dj, mixcloudEmbeds: embeds };
    });

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
