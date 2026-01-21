import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Helper function to get connection string with proper SSL mode for Supabase
function getConnectionString(): string | undefined {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return undefined;
  
  // For Supabase, use sslmode=no-verify which is equivalent to rejectUnauthorized: false
  if (dbUrl.includes('supabase.com')) {
    // Remove any existing sslmode and add no-verify
    let cleanUrl = dbUrl.replace(/[?&]sslmode=[^&]*/g, '');
    cleanUrl = cleanUrl.replace(/\?$/, '');
    // Add sslmode=no-verify
    return cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + 'sslmode=no-verify';
  }
  
  // For other databases, remove sslmode to use Pool SSL config
  if (dbUrl.includes('sslmode=')) {
    return dbUrl.replace(/[?&]sslmode=[^&]*/g, '').replace(/\?$/, '');
  }
  return dbUrl;
}

// Prisma 7 with adapter requires adapter to be provided to PrismaClient
// We create the adapter lazily to ensure connection string is properly configured
let pool: Pool | undefined;
let adapter: PrismaPg | undefined;

function createAdapter() {
  const connectionString = getConnectionString();
  if (!connectionString) return undefined;
  
  try {
    // Determine SSL configuration based on connection string
    const isSupabase = connectionString.includes('supabase.com');
    
    // For Supabase, we need to configure SSL to accept self-signed certificates
    // The Pool's ssl config takes precedence over connection string sslmode
    const poolConfig: any = {
      connectionString,
      // Add connection timeout to prevent hangs
      connectionTimeoutMillis: 10000,
      // Limit pool size
      max: 10,
      // Don't try to connect immediately during build
      idleTimeoutMillis: 30000,
    };
    
    // SSL configuration for Supabase
    // Note: We use sslmode=no-verify in the connection string for Supabase
    // This is equivalent to rejectUnauthorized: false
    // We also set it in Pool config as a backup
    if (isSupabase) {
      poolConfig.ssl = {
        rejectUnauthorized: false, // Required for Supabase's self-signed certificates
      };
      if (process.env.NODE_ENV === "development") {
        console.log("🔒 SSL configured for Supabase connection");
      }
    }
    
    const newPool = new Pool(poolConfig);
    return new PrismaPg(newPool);
  } catch (error) {
    // If adapter creation fails, log error but continue
    console.warn("Prisma adapter initialization warning:", error);
    return undefined;
  }
}

// Initialize adapter if DATABASE_URL exists
const connectionString = getConnectionString();
if (connectionString) {
  adapter = createAdapter();
  if (adapter) {
    // Get the pool from the adapter for cleanup if needed
    // Note: PrismaPg doesn't expose the pool directly, so we track it separately
  }
}

// Create Prisma client with adapter
// Prisma 7 requires adapter when using client engine type
function createPrismaClient() {
  // Ensure we have an adapter - Prisma 7 requires it
  let clientAdapter = adapter;
  
  if (!clientAdapter) {
    const connString = getConnectionString();
    if (!connString) {
      throw new Error(
        "DATABASE_URL environment variable is required. " +
        "Please set it in your Vercel environment variables."
      );
    }
    
    // Retry adapter creation if initial attempt failed
    clientAdapter = createAdapter();
    if (!clientAdapter) {
      throw new Error(
        "Failed to create Prisma adapter. " +
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
