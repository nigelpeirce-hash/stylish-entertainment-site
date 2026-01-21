import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import imap from "imap-simple";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15: params is now a Promise
    const resolvedParams = await params;
    const threadId = resolvedParams.id;
    const { folderId } = await request.json();

    if (!folderId) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    // Get thread with inbox info
    const thread = await prisma.emailThread.findUnique({
      where: { id: threadId },
      include: {
        EmailInbox: true,
        Email: {
          where: { messageId: { not: null } },
          take: 1, // Get first email with messageId for IMAP move
        },
      },
    });

    if (!thread || !thread.EmailInbox) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Get folder info
    const folder = await prisma.emailFolder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    // Connect to IMAP and move email
    const inbox = thread.EmailInbox;
    const config = {
      imap: {
        user: inbox.imapUsername,
        password: inbox.imapPassword,
        host: inbox.imapHost,
        port: inbox.imapPort,
        tls: inbox.imapSecure,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000,
      },
    };

    const connection = await imap.connect(config);

    try {
      // Find the email in the current folder and move it
      // We need to search for the email by messageId
      const email = thread.Email[0];
      if (email?.messageId) {
        // Open the source folder (try common folders)
        const sourceFolders = ["INBOX", folder.fullPath];
        let moved = false;

        for (const sourceFolder of sourceFolders) {
          try {
            await connection.openBox(sourceFolder, { readOnly: false });
            
            // Search for email by messageId
            const searchCriteria = [["HEADER", "Message-ID", email.messageId]];
            const results = await connection.search(searchCriteria, { bodies: "" });

            if (results.length > 0) {
              // Move email to target folder
              await connection.move(results[0].attributes.uid, folder.fullPath);
              moved = true;
              break;
            }
          } catch (err) {
            // Try next folder
            continue;
          }
        }

        if (!moved) {
          console.warn(`Could not find email ${email.messageId} in IMAP to move`);
        }
      }
    } finally {
      connection.end();
    }

    // Update thread folder in database
    await prisma.emailThread.update({
      where: { id: threadId },
      data: { folderId: folderId },
    });

    return NextResponse.json({ success: true, folderId });
  } catch (error) {
    console.error("Error moving thread:", error);
    return NextResponse.json(
      { error: "Failed to move thread" },
      { status: 500 }
    );
  }
}
