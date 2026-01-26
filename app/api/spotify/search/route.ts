import { NextRequest, NextResponse } from "next/server";
import { searchTracks, isSpotifyConfigured } from "@/lib/spotify";

// Rate limiting: track requests per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * GET /api/spotify/search?q=dancing+queen
 * 
 * Public endpoint for searching Spotify tracks
 * - Filters out explicit content by default
 * - Rate limited to prevent abuse
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Spotify is configured
    if (!isSpotifyConfigured()) {
      return NextResponse.json(
        { error: "Spotify integration not configured" },
        { status: 503 }
      );
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // Get search query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 20) : 10;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Search tracks (explicit content filtered by default)
    const tracks = await searchTracks(query, limit, true);

    return NextResponse.json({
      tracks,
      query: query.trim(),
    });
  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Failed to search for tracks. Please try again." },
      { status: 500 }
    );
  }
}
