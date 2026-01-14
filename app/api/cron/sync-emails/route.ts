import { NextRequest, NextResponse } from "next/server";
import { syncAllInboxes } from "@/lib/email-sync";

// Cron job endpoint for automatic email syncing
// Can be called by Vercel Cron or external cron service
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication header check
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await syncAllInboxes();

    return NextResponse.json({
      success: true,
      message: "Email sync completed",
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron email sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync emails", details: error.message },
      { status: 500 }
    );
  }
}
