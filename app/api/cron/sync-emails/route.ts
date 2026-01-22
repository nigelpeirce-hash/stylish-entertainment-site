import { NextRequest, NextResponse } from "next/server";
import { syncAllInboxes } from "@/lib/email-sync";

// Force dynamic rendering for cron jobs
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Cron job endpoint for automatic email syncing
// DISABLED: Manual sync only - use /api/admin/sync-emails instead
// This endpoint is kept for backward compatibility but is no longer used
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false,
      message: "Automatic email sync is disabled. Please use the manual 'Sync Emails' button in the admin dashboard.",
      endpoint: "/api/admin/sync-emails"
    },
    { status: 410 } // 410 Gone - indicates the resource is no longer available
  );
}
