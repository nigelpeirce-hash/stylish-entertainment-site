import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Move the initialization INSIDE the function so it cannot be undefined
  const prisma = new PrismaClient();
  
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: inboxId } = await params;
    
    const folders = await prisma.emailFolder.findMany({
      where: { inboxId },
      orderBy: { fullPath: "asc" },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    // IMPORTANT: Disconnect to prevent memory leaks since we are init-ing inside the function
    await prisma.$disconnect();
  }
}
