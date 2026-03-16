import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    // Check if DATABASE_URL exists (show first 10 chars for security)
    const dbUrl = process.env.DATABASE_URL;
    const dbUrlPreview = dbUrl 
      ? `${dbUrl.substring(0, 10)}...${dbUrl.substring(dbUrl.length - 10)}` 
      : "NOT SET";

    // Check NODE_ENV
    const nodeEnv = process.env.NODE_ENV || "NOT SET";

    // Test Prisma connection
    let prismaConnectionTest = "NOT TESTED";
    let prismaError = null;
    
    try {
      // Test connection with a simple query
      await prisma.$queryRaw`SELECT 1`;
      prismaConnectionTest = "SUCCESS ✅";
    } catch (error: any) {
      prismaConnectionTest = "FAILED ❌";
      prismaError = error.message || String(error);
    }

    // Check if emailFolder delegate exists
    const emailFolderExists = "emailFolder" in prisma;
    const prismaDelegates = Object.keys(prisma)
      .filter(k => !k.startsWith('$'))
      .slice(0, 20); // First 20 delegates

    return NextResponse.json({
      environment: {
        NODE_ENV: nodeEnv,
        DATABASE_URL_EXISTS: !!dbUrl,
        DATABASE_URL_PREVIEW: dbUrlPreview,
      },
      prisma: {
        connectionTest: prismaConnectionTest,
        error: prismaError,
        emailFolderExists: emailFolderExists,
        delegates: prismaDelegates,
        totalDelegates: prismaDelegates.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Debug route failed",
        message: error.message || String(error),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
