import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import imap from "imap-simple";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface AuditResult {
  inboxId: string;
  inboxName: string;
  email: string;
  configuration: {
    hasImapHost: boolean;
    hasImapUsername: boolean;
    hasImapPassword: boolean;
    hasImapPort: boolean;
    imapHost: string | null;
    imapPort: number | null;
    imapSecure: boolean | null;
    imapUsername: string | null;
  };
  connection: {
    status: "success" | "error" | "not_configured";
    message: string;
    error?: string;
  };
  serverStats: {
    totalMessages: number | null;
    unreadMessages: number | null;
    recentMessages: number | null;
  };
  databaseStats: {
    totalEmails: number;
    totalThreads: number;
    lastSyncedAt: string | null;
  };
  syncStatus: {
    enabled: boolean;
    interval: number;
    isActive: boolean;
  };
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inboxes = await prisma.emailInbox.findMany({
      orderBy: { createdAt: "desc" },
    });

    const auditResults: AuditResult[] = [];

    for (const inbox of inboxes) {
      const result: AuditResult = {
        inboxId: inbox.id,
        inboxName: inbox.name,
        email: inbox.email,
        configuration: {
          hasImapHost: !!inbox.imapHost,
          hasImapUsername: !!inbox.imapUsername,
          hasImapPassword: !!inbox.imapPassword,
          hasImapPort: !!inbox.imapPort,
          imapHost: inbox.imapHost,
          imapPort: inbox.imapPort,
          imapSecure: inbox.imapSecure,
          imapUsername: inbox.imapUsername,
        },
        connection: {
          status: "not_configured",
          message: "",
        },
        serverStats: {
          totalMessages: null,
          unreadMessages: null,
          recentMessages: null,
        },
        databaseStats: {
          totalEmails: 0,
          totalThreads: 0,
          lastSyncedAt: inbox.lastSyncedAt?.toISOString() || null,
        },
        syncStatus: {
          enabled: inbox.syncEnabled,
          interval: inbox.syncInterval,
          isActive: inbox.isActive,
        },
      };

      // Check configuration
      if (!inbox.imapHost || !inbox.imapUsername || !inbox.imapPassword) {
        result.connection.status = "not_configured";
        result.connection.message = "IMAP settings incomplete. Missing: " + [
          !inbox.imapHost && "Host",
          !inbox.imapUsername && "Username",
          !inbox.imapPassword && "Password",
        ].filter(Boolean).join(", ");
      } else {
        // Test connection and get server stats
        try {
          const config = {
            imap: {
              user: inbox.imapUsername,
              password: inbox.imapPassword,
              host: inbox.imapHost,
              port: inbox.imapPort || 993,
              tls: inbox.imapSecure ?? true,
              tlsOptions: { rejectUnauthorized: false },
              authTimeout: 10000,
            },
          };

          const connection = await imap.connect(config);
          await connection.openBox("INBOX");

          // Get mailbox stats
          const status = await connection.status("INBOX", { messages: true, recent: true, unseen: true });
          
          result.connection.status = "success";
          result.connection.message = "Successfully connected to IMAP server";
          result.serverStats = {
            totalMessages: status.messages || 0,
            unreadMessages: status.unseen || 0,
            recentMessages: status.recent || 0,
          };

          await connection.closeBox(true);
          connection.end();
        } catch (error: any) {
          result.connection.status = "error";
          result.connection.message = "Failed to connect to IMAP server";
          result.connection.error = error?.message || String(error);
        }
      }

      // Get database stats
      const emailCount = await prisma.email.count({
        where: { inboxId: inbox.id },
      });

      const threadCount = await prisma.emailThread.count({
        where: { inboxId: inbox.id },
      });

      result.databaseStats = {
        totalEmails: emailCount,
        totalThreads: threadCount,
        lastSyncedAt: inbox.lastSyncedAt?.toISOString() || null,
      };

      auditResults.push(result);
    }

    return NextResponse.json({
      success: true,
      audit: auditResults,
      summary: {
        totalInboxes: auditResults.length,
        configured: auditResults.filter(r => r.connection.status !== "not_configured").length,
        connected: auditResults.filter(r => r.connection.status === "success").length,
        totalServerEmails: auditResults.reduce((sum, r) => sum + (r.serverStats.totalMessages || 0), 0),
        totalDatabaseEmails: auditResults.reduce((sum, r) => sum + r.databaseStats.totalEmails, 0),
      },
    });
  } catch (error: any) {
    console.error("Email audit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to audit email setup",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
