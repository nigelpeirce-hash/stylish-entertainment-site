import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;

// Only initialize pool if connection string exists (prevents build-time errors)
let pool: Pool | undefined;
let adapter: PrismaPg | undefined;

if (connectionString) {
  pool = new Pool({ 
    connectionString,
    // Add connection timeout to prevent hangs
    connectionTimeoutMillis: 5000,
    // Limit pool size
    max: 10,
  });
  adapter = new PrismaPg(pool);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(adapter && { adapter }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
