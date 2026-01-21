import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import imap from "imap-simple";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15: params is now a Promise - await it before accessing
    const resolvedParams = await params;
    const inboxId = resolvedParams.id;

    // Verify prisma is available
    if (!prisma) {
      console.error("Prisma client is not initialized");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Fetch the inbox to get IMAP credentials
    const inbox = await prisma.emailInbox.findUnique({
      where: { id: inboxId },
    });

    if (!inbox) {
      return NextResponse.json({ error: "Inbox not found" }, { status: 404 });
    }

    // Fetch folders from database first - using EmailFolder (capitalized) to match schema
    let folders = await prisma.emailFolder.findMany({
      where: { inboxId },
      orderBy: { fullPath: "asc" },
    });

    // If no folders in database, try to discover them via IMAP
    if (folders.length === 0 && inbox.syncEnabled) {
      try {
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
        const boxes = await connection.getBoxes();
        
        // Discover and store folders (this will be handled by email-sync, but we can trigger it here)
        // For now, just return empty array and let the sync process handle folder discovery
        connection.end();
      } catch (error) {
        console.error("Error connecting to IMAP for folder discovery:", error);
        // Continue with empty folders - sync will discover them later
      }
    }

    // Build folder tree structure
    const folderMap = new Map<string, any>();
    const rootFolders: any[] = [];

    // First pass: create folder objects
    for (const folder of folders) {
      folderMap.set(folder.id, {
        ...folder,
        children: [],
        unreadCount: folder.unreadCount,
      });
    }

    // Second pass: build tree
    for (const folder of folders) {
      const folderObj = folderMap.get(folder.id)!;
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderObj);
        } else {
          rootFolders.push(folderObj);
        }
      } else {
        rootFolders.push(folderObj);
      }
    }

    // Calculate unread counts from threads
    for (const folder of folders) {
      const unreadCount = await prisma.emailThread.count({
        where: {
          inboxId,
          folderId: folder.id,
          isRead: false,
          isArchived: false,
        },
      });

      const folderObj = folderMap.get(folder.id)!;
      folderObj.unreadCount = unreadCount;

      // Update in database
      await prisma.emailFolder.update({
        where: { id: folder.id },
        data: { unreadCount, lastSyncedAt: new Date() },
      });
    }

    return NextResponse.json({ folders: rootFolders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
