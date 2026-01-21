import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    const { id: inboxId } = await params;

    // Debug: Log available Prisma delegates (only in development)
    if (process.env.NODE_ENV === "development") {
      const delegates = Object.keys(prisma).filter(
        (key) => !key.startsWith("$") && typeof (prisma as any)[key] === "object"
      );
      console.log("Available Prisma delegates:", delegates);
      console.log("emailFolder exists:", "emailFolder" in prisma);
    }

    // Access the emailFolder delegate through the Proxy
    const folders = await prisma.emailFolder.findMany({
      where: { inboxId },
      orderBy: { fullPath: "asc" },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: errorDetails })
      }, 
      { status: 500 }
    );
  }
}
