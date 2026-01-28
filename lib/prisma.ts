import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Ensure environment variables are loaded
// Next.js loads .env automatically, but we'll try dotenv as a fallback
// IMPORTANT: System environment variables override .env files, so we need to
// explicitly load .env.local AFTER checking process.env to ensure it takes precedence
if (typeof window === 'undefined') {
  // Always reload from .env.local to override any system env vars
  try {
    require('dotenv').config({ path: '.env.local', override: true })
  } catch (e) {
    // dotenv might not be available
  }
  
  // If still not set, try .env
  if (!process.env.DATABASE_URL) {
    try {
      require('dotenv').config()
    } catch (e) {
      // dotenv might not be available
    }
  }
  
}

// 1. Setup the connection - ensure DATABASE_URL is loaded
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set!');
  console.error('   Checked process.env.DATABASE_URL:', !!process.env.DATABASE_URL);
  console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')).join(', '));
  throw new Error('DATABASE_URL environment variable is required. Make sure your .env file is loaded.')
}

// Always validate placeholders and format
const hasPlaceholders = connectionString.includes('[id]') || connectionString.includes('[pass]') || connectionString.includes('[YOUR-PASSWORD]');
if (hasPlaceholders) {
  console.error('❌ CRITICAL: Connection string contains placeholders!');
  throw new Error('DATABASE_URL contains placeholders - please update .env file with actual password');
}
const urlMatch = connectionString.match(/^(postgresql?):\/\/([^:]+):([^@]+)@(.+)$/);
if (!urlMatch) {
  console.error('❌ Could not parse connection string format');
  throw new Error('Invalid DATABASE_URL format');
}
if (connectionString.includes('pooler') && !urlMatch[2].includes('.')) {
  console.error('❌ Username format wrong for pooler!');
  throw new Error('Pooler connection must use postgres.[PROJECT_REF] format');
}

// Log DB config once per process in dev (reduces noise when prisma is re-imported)
const _g = typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : {});
const _gl = _g as { __dbStartupLogged?: boolean };
if (process.env.NODE_ENV === 'development' && !_gl.__dbStartupLogged) {
  const masked = connectionString.replace(/:([^@]+)@/, ':***@');
  const un = urlMatch[2];
  console.log('📋 DATABASE_URL loaded');
  console.log('   Structure:', masked.substring(0, 100));
  console.log('   Length:', connectionString.length);
  console.log('   ✅ Username:', un);
  console.log('   ✅ Password length:', urlMatch[3].length);
  if (connectionString.includes('pooler.supabase.com')) {
    const host = connectionString.match(/@([^:]+):/)?.[1] || 'unknown';
    const port = connectionString.match(/:(\d+)\//)?.[1] || 'unknown';
    console.log('🔗 Supabase pooler connection');
    console.log('   Host:', host);
    console.log('   Port:', port);
    console.log('   Username:', un);
  }
  _gl.__dbStartupLogged = true;
}

// Create pool with connection string
// Test connection once per process in development (don't re-run on every prisma import)
const _gt = typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : {});
const _gtest = _gt as { __dbConnectionTestRun?: boolean };
if (process.env.NODE_ENV === 'development' && !_gtest.__dbConnectionTestRun) {
  _gtest.__dbConnectionTestRun = true;
  const testPool = new pg.Pool({ connectionString, connectionTimeoutMillis: 5000, max: 1 });
  testPool.query('SELECT 1')
    .then(() => {
      console.log('✅ Database connection test successful');
      testPool.end();
    })
    .catch((err: Error) => {
      console.error('❌ Database connection test failed:', err.message);
      if (err.message.includes('Tenant or user not found')) {
        console.error('   Username format, password, or project ref may be wrong.');
      }
      testPool.end();
    });
}

// Add timeout parameters to connection string if not already present
let enhancedConnectionString = connectionString;
if (!enhancedConnectionString.includes('connect_timeout')) {
  const separator = enhancedConnectionString.includes('?') ? '&' : '?';
  enhancedConnectionString = `${connectionString}${separator}connect_timeout=30&statement_timeout=25000`;
}

const pool = new pg.Pool({ 
  connectionString: enhancedConnectionString,
  // Connection timeout - increased for Supabase and Vercel serverless
  // Vercel serverless functions need longer timeouts due to cold starts
  connectionTimeoutMillis: 30000, // 30 seconds (increased from 20s)
  // Query timeout - prevent queries from hanging indefinitely
  query_timeout: 25000, // 25 seconds
  // Statement timeout - PostgreSQL-level timeout
  statement_timeout: 25000, // 25 seconds
  // Limit pool size - smaller for serverless (each function instance has its own pool)
  max: 5, // Reduced from 10 for serverless (Vercel functions are stateless)
  // Idle timeout - shorter for serverless
  idleTimeoutMillis: 20000, // 20 seconds
  // Keep connections alive for better connection reuse
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
})

const adapter = new PrismaPg(pool)

// 2. The Global Pattern (Essential for Next.js dev mode)
// This ensures only one PrismaClient instance exists across all module loads
// Critical for preventing build worker crashes during "Collecting page data"
const globalForPrisma = global as unknown as { prisma: PrismaClient }

if (!globalForPrisma.prisma) {
  // Verify adapter is initialized before creating PrismaClient
  if (!adapter) {
    throw new Error('PrismaPg adapter not initialized - cannot create PrismaClient');
  }
  
  // Verify pool is initialized
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized - cannot create PrismaClient');
  }
  
  try {
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      // Connection is handled by PrismaPg adapter via the pool
      // Do NOT include datasources when using Driver Adapters
    });
    
    // Log successful initialization in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.log('✅ PrismaClient initialized successfully with PrismaPg adapter');
    }
  } catch (initError: any) {
    console.error('❌ Failed to initialize PrismaClient:', initError);
    console.error('   Error message:', initError?.message);
    console.error('   Error code:', initError?.code);
    throw initError;
  }
  
  // Add connection error handling for production
  if (process.env.NODE_ENV === 'production') {
    // Log connection issues but don't crash
    process.on('unhandledRejection', (reason: any) => {
      if (reason?.code === 'ETIMEDOUT' || reason?.code === 'ECONNREFUSED') {
        console.error('❌ Database connection error:', reason.code, reason.message);
      }
    });
  }
}

export const prisma = globalForPrisma.prisma
