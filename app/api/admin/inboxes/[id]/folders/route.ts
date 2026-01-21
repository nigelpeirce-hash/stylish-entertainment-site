import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Go back to the shared plug

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15 requires awaiting params
    const resolvedParams = await params;
    const inboxId = resolvedParams.id;

    // Safety Check: If prisma is somehow undefined, we throw a clear error
    if (!prisma) {
      throw new Error("Prisma client failed to initialize globally.");
    }

    const folders = await prisma.emailFolder.findMany({
      where: { inboxId },
      orderBy: { fullPath: "asc" },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}
