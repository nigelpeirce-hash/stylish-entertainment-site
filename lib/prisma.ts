import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;

// Prisma 7 with adapter requires adapter to be provided to PrismaClient
// We MUST create the adapter synchronously if DATABASE_URL exists
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
    // If adapter creation fails, log error but continue
    // Will retry when creating PrismaClient
    console.warn("Prisma adapter initialization warning:", error);
  }
}

// Create Prisma client with adapter
// Prisma 7 requires adapter when using client engine type
function createPrismaClient() {
  // Ensure we have an adapter - Prisma 7 requires it
  let clientAdapter = adapter;
  
  if (!clientAdapter) {
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is required. " +
        "Please set it in your Vercel environment variables."
      );
    }
    
    // Retry adapter creation if initial attempt failed
    try {
      const retryPool = new Pool({ 
        connectionString,
        connectionTimeoutMillis: 5000,
        max: 10,
        idleTimeoutMillis: 30000,
      });
      clientAdapter = new PrismaPg(retryPool);
    } catch (error) {
      throw new Error(
        `Failed to create Prisma adapter: ${error instanceof Error ? error.message : String(error)}. ` +
        "Please check your DATABASE_URL environment variable in Vercel."
      );
    }
  }

  // Prisma 7 requires adapter when using client engine type
  return new PrismaClient({
    adapter: clientAdapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Lazy initialization - only create PrismaClient when first accessed
// This prevents initialization during build when DATABASE_URL might not be available
let prismaInstance: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    if (globalForPrisma.prisma) {
      prismaInstance = globalForPrisma.prisma;
    } else {
      prismaInstance = createPrismaClient();
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prismaInstance;
      }
    }
  }
  return prismaInstance;
}

// Export prisma as a Proxy to lazily initialize on first access
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const instance = getPrisma();
    const value = instance[prop as keyof PrismaClient];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  has(_target, prop) {
    const instance = getPrisma();
    return prop in instance;
  },
  ownKeys(_target) {
    const instance = getPrisma();
    return Object.keys(instance);
  },
  getOwnPropertyDescriptor(_target, prop) {
    const instance = getPrisma();
    const descriptor = Object.getOwnPropertyDescriptor(instance, prop);
    return descriptor || undefined;
  },
}) as PrismaClient;
