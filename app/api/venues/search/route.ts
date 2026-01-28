import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Search venues by name and/or postcode from existing bookings
 * Returns unique venue names with postcodes that match the search query
 * Priority: Free text entry (primary), postcode matching (secondary)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // If no query, return empty array
    if (!query || query.length < 2) {
      return NextResponse.json({ venues: [] });
    }

    // Check if query contains a postcode pattern (UK postcode: A1 1AA or A11AA)
    const postcodePattern = /[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i;
    const hasPostcode = postcodePattern.test(query);
    
    // Extract postcode if present (normalize: remove spaces, uppercase)
    let extractedPostcode: string | null = null;
    if (hasPostcode) {
      const postcodeMatch = query.match(postcodePattern);
      if (postcodeMatch) {
        extractedPostcode = postcodeMatch[0].replace(/\s+/g, "").toUpperCase();
      }
    }

    // Extract venue name part (everything except postcode)
    const venueNamePart = hasPostcode && extractedPostcode
      ? query.replace(postcodePattern, "").trim()
      : query.trim();

    // Search for venues by name (primary search)
    let nameMatches: Array<{ venueName: string; venuePostcode: string | null }> = [];
    if (venueNamePart.length >= 2) {
      const bookings = await prisma.booking.findMany({
        where: {
          venueName: {
            startsWith: venueNamePart,
            mode: "insensitive",
          },
        },
        select: {
          venueName: true,
          venuePostcode: true,
        },
        distinct: ["venueName"],
        take: 15,
        orderBy: {
          venueName: "asc",
        },
      });
      nameMatches = bookings.map((b) => ({
        venueName: b.venueName,
        venuePostcode: b.venuePostcode || null,
      }));
    }

    // Search by postcode if postcode is present (secondary matching)
    let postcodeMatches: Array<{ venueName: string; venuePostcode: string | null }> = [];
    if (extractedPostcode) {
      // Normalize postcode for matching (handle variations)
      const normalizedPostcode = extractedPostcode.replace(/\s+/g, "").toUpperCase();
      // Create spaced version (e.g., BA33RW -> BA3 3RW)
      const spacedPostcode = normalizedPostcode.length > 3
        ? normalizedPostcode.substring(0, normalizedPostcode.length - 3) + " " + normalizedPostcode.substring(normalizedPostcode.length - 3)
        : normalizedPostcode;
      
      const bookingsByPostcode = await prisma.booking.findMany({
        where: {
          OR: [
            {
              venuePostcode: {
                contains: normalizedPostcode,
                mode: "insensitive" as const,
              },
            },
            {
              venuePostcode: {
                contains: spacedPostcode,
                mode: "insensitive" as const,
              },
            },
            {
              venuePostcode: {
                contains: normalizedPostcode.replace(/\s+/g, ""),
                mode: "insensitive" as const,
              },
            },
          ],
        },
        select: {
          venueName: true,
          venuePostcode: true,
        },
        take: 10,
        orderBy: {
          venueName: "asc",
        },
      });
      
      // Deduplicate by venue name + postcode
      const seenPostcode = new Set<string>();
      postcodeMatches = bookingsByPostcode
        .filter((b) => {
          const key = `${b.venueName.toLowerCase()}_${(b.venuePostcode || "").toUpperCase().replace(/\s+/g, "")}`;
          if (seenPostcode.has(key)) return false;
          seenPostcode.add(key);
          return true;
        })
        .map((b) => ({
          venueName: b.venueName,
          venuePostcode: b.venuePostcode || null,
        }));
    }

    // Also search venue assets for additional venues
    let venueAssetVenues: Array<{ venueName: string; venuePostcode: string | null }> = [];
    try {
      const venueAssets = await prisma.venueAsset.findMany({
        where: {
          OR: [
            {
              venueName: {
                startsWith: venueNamePart || query,
                mode: "insensitive" as const,
              },
            },
            ...(extractedPostcode ? [{
              venueName: {
                startsWith: venueNamePart,
                mode: "insensitive" as const,
              },
            }] : []),
          ],
        },
        select: {
          venueName: true,
        },
        distinct: ["venueName"],
        take: 5,
      });
      venueAssetVenues = venueAssets.map((v) => ({
        venueName: v.venueName,
        venuePostcode: null, // Venue assets don't have postcodes in schema
      }));
    } catch (error) {
      // VenueAsset table might not exist yet, ignore
      console.log("VenueAsset table not available for search");
    }

    // Combine all matches
    // Priority: Name matches first, then postcode matches, then venue assets
    const allVenues = [
      ...nameMatches,
      ...postcodeMatches.filter(
        (pm) => !nameMatches.some(
          (nm) => nm.venueName.toLowerCase() === pm.venueName.toLowerCase() &&
                  nm.venuePostcode?.toUpperCase().replace(/\s+/g, "") === pm.venuePostcode?.toUpperCase().replace(/\s+/g, "")
        )
      ),
      ...venueAssetVenues.filter(
        (va) => !nameMatches.some((nm) => nm.venueName.toLowerCase() === va.venueName.toLowerCase()) &&
                 !postcodeMatches.some((pm) => pm.venueName.toLowerCase() === va.venueName.toLowerCase())
      ),
    ];

    // Remove duplicates (case-insensitive, considering name + postcode)
    const uniqueVenues: Array<{ venueName: string; venuePostcode: string | null }> = [];
    const seen = new Set<string>();

    for (const venue of allVenues) {
      const key = `${venue.venueName.toLowerCase()}_${(venue.venuePostcode || "").toUpperCase().replace(/\s+/g, "")}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVenues.push(venue);
      }
    }

    // Format venues for display (with postcode if available)
    const formattedVenues = uniqueVenues.map((v) => {
      if (v.venuePostcode) {
        // Format postcode with space (e.g., BA1 1AA)
        const formattedPostcode = v.venuePostcode.length > 3
          ? v.venuePostcode.substring(0, v.venuePostcode.length - 3) + " " + v.venuePostcode.substring(v.venuePostcode.length - 3)
          : v.venuePostcode;
        return `${v.venueName}, ${formattedPostcode}`;
      }
      return v.venueName;
    });

    // Sort alphabetically and limit to 10
    const venues = formattedVenues
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 10);

    return NextResponse.json({ venues });
  } catch (error) {
    console.error("❌ Error searching venues:", error);
    console.error("❌ Error details:", error instanceof Error ? error.message : String(error));
    console.error("❌ Error stack:", error instanceof Error ? error.stack : undefined);
    
    // Return empty array with 200 status to prevent frontend errors
    // The frontend can handle empty results gracefully
    return NextResponse.json({ venues: [] }, { status: 200 });
  }
}
