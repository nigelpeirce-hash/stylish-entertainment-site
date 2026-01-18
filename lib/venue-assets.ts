/**
 * Venue Asset Manager
 * Maps venue names to their specific PDF brochure URLs
 * Used for conditional injection in automated emails
 * 
 * Simple mapping structure: { "Venue Name": "PDF_URL" }
 * Usage: const brochureLink = venueAssets[clientSelectedVenue] || venueAssets["General"];
 */

import { prisma } from "@/lib/prisma";

/**
 * Static venue assets mapping (fallback if database is unavailable)
 * These can be overridden by database entries
 */
export const staticVenueAssets: Record<string, string> = {
  "Babington House": "https://res.cloudinary.com/stylish/brochures/babington-2026.pdf",
  "Kin House": "https://res.cloudinary.com/stylish/brochures/kin-house-2026.pdf",
  "The Lost Orangery": "https://res.cloudinary.com/stylish/brochures/lost-orangery-2026.pdf",
  "General": "https://res.cloudinary.com/stylish/brochures/general-stylish-brochure.pdf",
};

/**
 * Legacy VenueAsset interface (for backward compatibility with tracking system)
 */
export interface VenueAsset {
  venueName: string;
  pdfUrl: string;
  trackingFileId: string;
}

/**
 * Get all venue assets from database (latest year for each venue)
 * Returns a simple Record<string, string> mapping
 */
export async function getVenueAssetsFromDatabase(): Promise<Record<string, string>> {
  try {
    const assets = await prisma.venueAsset.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        year: "desc", // Get most recent year first
      },
    });

    // Build mapping: venueName -> pdfUrl (latest year only)
    const mapping: Record<string, string> = {};
    assets.forEach((asset) => {
      // Only add if not already added (to keep latest year)
      if (!mapping[asset.venueName]) {
        mapping[asset.venueName] = asset.pdfUrl;
      }
    });

    return mapping;
  } catch (error) {
    console.error("Error fetching venue assets from database:", error);
    return {}; // Return empty object on error
  }
}

/**
 * Get complete venue assets mapping (database + static fallback)
 * Merges database entries with static fallbacks
 * Returns: { "Venue Name": "PDF_URL" }
 */
export async function getVenueAssets(): Promise<Record<string, string>> {
  const dbAssets = await getVenueAssetsFromDatabase();
  
  // Merge: database assets override static assets
  return {
    ...staticVenueAssets,
    ...dbAssets,
  };
}

/**
 * Get brochure link for a specific venue
 * Returns the PDF URL for the venue, or General brochure if not found
 * Usage: const brochureLink = await getBrochureLink(clientSelectedVenue) || venueAssets["General"];
 */
export async function getBrochureLink(clientSelectedVenue: string | null | undefined): Promise<string> {
  const venueAssets = await getVenueAssets();
  
  if (!clientSelectedVenue || clientSelectedVenue.trim() === "" || clientSelectedVenue.toLowerCase() === "other") {
    return venueAssets["General"] || staticVenueAssets["General"];
  }

  // Try exact match first
  if (venueAssets[clientSelectedVenue]) {
    return venueAssets[clientSelectedVenue];
  }

  // Try case-insensitive match
  const normalizedVenue = clientSelectedVenue.trim();
  for (const [venueName, url] of Object.entries(venueAssets)) {
    if (venueName.toLowerCase() === normalizedVenue.toLowerCase()) {
      return url;
    }
  }

  // Fallback to General
  return venueAssets["General"] || staticVenueAssets["General"];
}

/**
 * Legacy function: Get venue asset object (for tracking system)
 * @deprecated Use getBrochureLink() for simple URL mapping
 */
export function getVenueAsset(venueName: string | null | undefined): VenueAsset {
  // This is a sync version for backward compatibility
  // It uses static assets only
  if (!venueName || venueName.trim() === "" || venueName.toLowerCase() === "other") {
    return {
      venueName: "STYLISH Entertainment",
      pdfUrl: staticVenueAssets["General"] || "",
      trackingFileId: "general",
    };
  }

  const url = staticVenueAssets[venueName] || staticVenueAssets["General"];
  const trackingId = venueName.toLowerCase().replace(/\s+/g, "");

  return {
    venueName,
    pdfUrl: url || "",
    trackingFileId: trackingId,
  };
}

/**
 * General brochure (fallback)
 */
export const GENERAL_BROCHURE: VenueAsset = {
  venueName: "STYLISH Entertainment",
  pdfUrl: staticVenueAssets["General"] || "",
  trackingFileId: "general",
};

/**
 * Generate tracking URL for PDF download
 * Format: /api/track-download?id={bookingId}&file={trackingFileId}
 */
export function getTrackingUrl(bookingId: string, asset: VenueAsset): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk";
  return `${baseUrl}/api/track-download?id=${bookingId}&file=${asset.trackingFileId}`;
}
