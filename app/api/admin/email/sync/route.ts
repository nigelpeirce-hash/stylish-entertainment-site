import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { syncAllInboxes, syncEmailInbox } from "@/lib/email-sync";

// Manual email sync endpoint (for admins)
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    if (!token || (token.role as string) !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      // Handle empty or malformed JSON
      body = {};
    }
    const inboxId = body?.inboxId;
    const deepSync = body?.deepSync === true; // 6-month historical backfill

    if (inboxId) {
      // Sync specific inbox
      const count = await syncEmailInbox(inboxId, { deepSync });
      return NextResponse.json({
        success: true,
        message: deepSync 
          ? `Deep synced ${count} emails (6 months of history)` 
          : `Synced ${count} emails`,
        count,
        deepSync,
      });
    } else {
      // Sync all inboxes
      const result = await syncAllInboxes({ deepSync });
      return NextResponse.json({
        success: true,
        message: deepSync
          ? `Deep synced ${result.successful} inboxes (6 months of history)`
          : `Synced ${result.successful} inboxes`,
        ...result,
        deepSync,
      });
    }
  } catch (error: any) {
    console.error("Email sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync emails", details: error.message },
      { status: 500 }
    );
  }
}
