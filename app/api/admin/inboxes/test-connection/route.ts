import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import imap from "imap-simple";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inboxId } = body || {};

    if (!inboxId || typeof inboxId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid inboxId" },
        { status: 400 }
      );
    }

    const inbox = await prisma.emailInbox.findUnique({
      where: { id: inboxId },
    });

    if (!inbox) {
      return NextResponse.json(
        { error: "Inbox not found" },
        { status: 404 }
      );
    }

    if (!inbox.imapHost || !inbox.imapUsername || !inbox.imapPassword) {
      return NextResponse.json(
        {
          error:
            "IMAP settings are incomplete. Please check host, username and password.",
        },
        { status: 400 }
      );
    }

    const config = {
      imap: {
        user: inbox.imapUsername,
        password: inbox.imapPassword,
        host: inbox.imapHost,
        port: inbox.imapPort,
        tls: inbox.imapSecure,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 5000,
      },
    };

    try {
      // Measure connection latency
      const startTime = Date.now();
      const connection = await imap.connect(config as any);
      const connectTime = Date.now() - startTime;
      
      const openStartTime = Date.now();
      await connection.openBox("INBOX");
      const openTime = Date.now() - openStartTime;
      
      await connection.closeBox(true);
      connection.end();

      const totalLatency = Date.now() - startTime;

      return NextResponse.json({
        success: true,
        message:
          "Successfully connected to the IMAP server and opened the INBOX.",
        details: {
          host: inbox.imapHost,
          port: inbox.imapPort,
          secure: inbox.imapSecure,
        },
        latency: {
          connect: connectTime,
          openBox: openTime,
          total: totalLatency,
        },
      });
    } catch (error: any) {
      // Enhanced error logging for debugging
      const errorMessage = error?.message || "Unknown error";
      const errorCode = error?.code || "NO_CODE";
      const errorType = error?.type || "UNKNOWN";
      
      // Determine error category
      let errorCategory = "Connection";
      if (errorMessage.toLowerCase().includes("password") || 
          errorMessage.toLowerCase().includes("authentication") ||
          errorMessage.toLowerCase().includes("auth") ||
          errorCode === "EAUTH") {
        errorCategory = "Password/Authentication";
      } else if (errorMessage.toLowerCase().includes("host") ||
                 errorMessage.toLowerCase().includes("dns") ||
                 errorMessage.toLowerCase().includes("resolve") ||
                 errorCode === "ENOTFOUND" || errorCode === "ECONNREFUSED") {
        errorCategory = "Host/Network";
      } else if (errorMessage.toLowerCase().includes("timeout") ||
                 errorCode === "ETIMEDOUT") {
        errorCategory = "Timeout";
      }
      
      console.error(`[IMAP Test Connection] ${errorCategory} Error:`, {
        category: errorCategory,
        message: errorMessage,
        code: errorCode,
        type: errorType,
        host: inbox.imapHost,
        port: inbox.imapPort,
        username: inbox.imapUsername,
        secure: inbox.imapSecure,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorCategory,
          details: {
            code: errorCode,
            type: errorType,
            category: errorCategory,
          },
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Test inbox connection error:", error);
    return NextResponse.json(
      {
        error: "Internal server error while testing inbox connection",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

