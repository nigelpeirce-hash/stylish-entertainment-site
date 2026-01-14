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

    const body = await request.json();
    const inboxId = body.inboxId;

    if (inboxId) {
      // Sync specific inbox
      const count = await syncEmailInbox(inboxId);
      return NextResponse.json({
        success: true,
        message: `Synced ${count} emails`,
        count,
      });
    } else {
      // Sync all inboxes
      const result = await syncAllInboxes();
      return NextResponse.json({
        success: true,
        message: `Synced ${result.successful} inboxes`,
        ...result,
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
