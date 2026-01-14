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
      const connection = await imap.connect(config as any);
      await connection.openBox("INBOX");
      await connection.closeBox(true);
      connection.end();

      return NextResponse.json({
        success: true,
        message:
          "Successfully connected to the IMAP server and opened the INBOX.",
        details: {
          host: inbox.imapHost,
          port: inbox.imapPort,
          secure: inbox.imapSecure,
        },
      });
    } catch (error: any) {
      console.error("IMAP test connection error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            error?.message ||
            "Failed to connect to IMAP server. Please check your settings.",
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

