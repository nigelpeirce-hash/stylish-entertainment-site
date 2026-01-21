import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inboxId = params.id;

    // Fetch all folders for this inbox
    const folders = await prisma.emailFolder.findMany({
      where: { inboxId },
      orderBy: { fullPath: "asc" },
    });

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
