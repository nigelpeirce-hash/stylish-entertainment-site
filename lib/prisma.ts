import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;

// Always try to create adapter if DATABASE_URL exists
// Prisma 7 with adapter requires adapter to be provided
let pool: Pool | undefined;
let adapter: PrismaPg | undefined;

if (connectionString) {
  try {
    pool = new Pool({ 
      connectionString,
      // Add connection timeout to prevent hangs
      connectionTimeoutMillis: 5000,
      // Limit pool size
      max: 10,
      // Don't try to connect immediately during build
      idleTimeoutMillis: 30000,
    });
    adapter = new PrismaPg(pool);
  } catch (error) {
    // Log warning but continue - adapter might still work
    console.warn("Prisma pool initialization warning:", error);
  }
}

// Create Prisma client with adapter
// Prisma 7 with adapter requires adapter to be provided
function createPrismaClient() {
  // Prisma 7 requires adapter when using client engine type
  if (!adapter) {
    // During build on Vercel, DATABASE_URL should be available
    // If it's not, we need to fail gracefully or provide a fallback
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is required. " +
        "Please set it in your Vercel environment variables."
      );
    }
    
    // If we have connectionString but adapter creation failed,
    // try to create adapter again (might fail during build)
    try {
      const fallbackPool = new Pool({
        connectionString,
        connectionTimeoutMillis: 5000,
        max: 10,
      });
      const fallbackAdapter = new PrismaPg(fallbackPool);
      return new PrismaClient({
        adapter: fallbackAdapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
    } catch (error) {
      // If adapter creation still fails, throw descriptive error
      throw new Error(
        `Failed to create Prisma adapter: ${error instanceof Error ? error.message : String(error)}. ` +
        "Please check your DATABASE_URL environment variable."
      );
    }
  }

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
