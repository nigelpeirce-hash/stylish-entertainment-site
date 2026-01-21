import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get all inboxes to see IDs
    const inboxes = await prisma.emailInbox.findMany({
      select: { id: true, email: true }
    });

    // 2. Get EVERY folder in the table to see what sync has actually found
    const allFolders = await prisma.emailFolder.findMany({
      orderBy: { fullPath: "asc" }
    });

    return NextResponse.json({
      inboxes,
      totalFoldersFound: allFolders.length,
      allFolders
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
