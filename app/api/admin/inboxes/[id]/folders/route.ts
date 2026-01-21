import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: inboxId } = await params;
    
    // Use the local prisma variable defined above
    const folders = await prisma.emailFolder.findMany({
      where: { inboxId },
      orderBy: { fullPath: "asc" },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
