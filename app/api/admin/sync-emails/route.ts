import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { syncAllInboxes } from "@/lib/email-sync";

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Manual email sync endpoint
 * Triggers a one-time sync of all enabled inboxes
 * Closes IMAP connections immediately after finishing
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Manual Sync] Starting email sync...");
    const startTime = Date.now();

    // Trigger sync for all enabled inboxes
    const result = await syncAllInboxes();

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`[Manual Sync] Completed in ${duration}ms`, result);

    return NextResponse.json({
      success: true,
      message: "Email sync completed",
      ...result,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  } catch (error: any) {
    console.error("[Manual Sync] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync emails",
        message: error.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
