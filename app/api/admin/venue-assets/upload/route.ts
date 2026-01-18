import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Save uploaded venue asset to database
 * Called after Cloudinary upload completes
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { venueName, year, pdfUrl, cloudinaryPublicId, fileName } = body;

    if (!venueName || !year || !pdfUrl || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields: venueName, year, pdfUrl, fileName" },
        { status: 400 }
      );
    }

    const yearInt = parseInt(String(year), 10);
    if (isNaN(yearInt)) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }

    // Upsert: Update if exists, create if new
    const venueAsset = await prisma.venueAsset.upsert({
      where: {
        venueName_year: {
          venueName,
          year: yearInt,
        },
      },
      update: {
        pdfUrl,
        cloudinaryPublicId: cloudinaryPublicId || null,
        fileName,
        updatedAt: new Date(),
      },
      create: {
        venueName,
        year: yearInt,
        pdfUrl,
        cloudinaryPublicId: cloudinaryPublicId || null,
        fileName,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Venue asset saved successfully",
      asset: {
        id: venueAsset.id,
        venueName: venueAsset.venueName,
        year: venueAsset.year,
        pdfUrl: venueAsset.pdfUrl,
        fileName: venueAsset.fileName,
      },
    });
  } catch (error: any) {
    console.error("Error saving venue asset:", error);
    return NextResponse.json(
      {
        error: "Failed to save venue asset",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
