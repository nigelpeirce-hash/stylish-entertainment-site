import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { staticVenueAssets, GENERAL_BROCHURE } from "@/lib/venue-assets";
import { getResourceById } from "@/lib/master-resources";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Track PDF brochure downloads and redirect to actual PDF URL
 * Format: /api/track-download?id={bookingId}&file={trackingFileId}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id") || "unknown";
    const fileId = searchParams.get("file") || "general";

    // Get user IP for tracking
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Find the actual PDF URL from venue assets or master resources
    let pdfUrl = GENERAL_BROCHURE.pdfUrl;
    if (fileId && fileId !== "general") {
      // First, check static venue assets by matching fileId to venue name
      const matchingVenue = Object.keys(staticVenueAssets).find((venue) => 
        venue.toLowerCase().replace(/\s+/g, '') === fileId.toLowerCase()
      );
      if (matchingVenue && staticVenueAssets[matchingVenue]) {
        pdfUrl = staticVenueAssets[matchingVenue];
      } else {
        // If not found in venue assets, check master resources
        const masterResource = getResourceById(fileId);
        if (masterResource) {
          pdfUrl = masterResource.pdfUrl;
        }
      }
    }

    // Log the download to database (store in booking metadata if booking exists)
    try {
      if (bookingId && bookingId !== "unknown") {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { emailsSent: true },
        });

        if (booking) {
          const existingMetadata = (booking.emailsSent as any) || {};
          const downloads = existingMetadata.pdfDownloads || [];
          
          downloads.push({
            fileId,
            downloadedAt: new Date().toISOString(),
            clientIp,
            userAgent,
          });

          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              emailsSent: {
                ...existingMetadata,
                pdfDownloads: downloads,
                lastPdfDownload: {
                  fileId,
                  downloadedAt: new Date().toISOString(),
                },
              } as any,
            },
          });
        }
      }
      
      // Also log to console for tracking (can be viewed in server logs)
      console.log(`[PDF_DOWNLOAD] Booking: ${bookingId}, File: ${fileId}, IP: ${clientIp}`);
    } catch (dbError) {
      // Don't fail the redirect if logging fails
      console.error("Error logging PDF download:", dbError);
    }

    // Redirect to the actual PDF URL
    return NextResponse.redirect(pdfUrl, { status: 302 });
  } catch (error: any) {
    console.error("Error tracking PDF download:", error);
    
    // Fallback to general brochure if there's an error
    return NextResponse.redirect(GENERAL_BROCHURE.pdfUrl, { status: 302 });
  }
}
