import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // <--- THIS IS THE MISSING PLUG
import { auth } from "@/auth";
import imap from "imap-simple";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: inboxId } = await params; // <--- NEXT.JS 15 AWAIT

    // Fetch the inbox to get IMAP credentials
    const inbox = await prisma.emailInbox.findUnique({
      where: { id: inboxId },
    });

    if (!inbox) {
      return NextResponse.json({ error: "Inbox not found" }, { status: 404 });
    }

    // Now prisma will actually work
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
    // Note: IMAP \Flagged/\Starred flags are mapped to isStarred field by email-sync.ts
    // The threads API includes isStarred in the response, so gold stars appear automatically
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
  } catch (error: any) {
    console.error("Error fetching folders:", error);
    
    // Provide helpful error message if Prisma model is missing
    if (error?.message?.includes("emailFolder") || error?.message?.includes("Cannot read properties of undefined")) {
      console.error("Prisma emailFolder model may not be available. Run: npx prisma generate");
      return NextResponse.json(
        { 
          error: "Database model not available. Please run: npx prisma generate",
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch folders", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
