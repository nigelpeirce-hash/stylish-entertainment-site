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
// Skip connection test in dev to avoid extra pool (reduces "MaxClientsInSessionMode" when using Session mode)
// To test: node -e "require('dotenv').config({path:'.env.local'}); const {Pool}=require('pg'); const p=new Pool({connectionString:process.env.DATABASE_URL}); p.query('SELECT 1').then(()=>{console.log('✅ Connected');p.end()}).catch(e=>{console.error('❌ Failed',e.message);p.end()})"

// Add timeout parameters to connection string if not already present
let enhancedConnectionString = connectionString;
if (!enhancedConnectionString.includes('connect_timeout')) {
  const separator = enhancedConnectionString.includes('?') ? '&' : '?';
  enhancedConnectionString = `${connectionString}${separator}connect_timeout=30&statement_timeout=25000`;
}
// Supabase Transaction mode (port 6543): Prisma needs pgbouncer=true for compatibility
if (enhancedConnectionString.includes('pooler.supabase.com') && enhancedConnectionString.includes(':6543/') && !enhancedConnectionString.includes('pgbouncer=true')) {
  enhancedConnectionString += enhancedConnectionString.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
}

// Pool size: use 1 in dev to avoid "MaxClientsInSessionMode" (Supabase session pool is small).
// In production, keep low (2) so we don't exhaust Supabase pool when using Session mode (port 5432).
const poolSize = process.env.NODE_ENV === 'development' ? 1 : 2;
const isSessionModePooler = enhancedConnectionString.includes('pooler.supabase.com') && /:5432\//.test(enhancedConnectionString);
const _gw = _g as { __sessionModeWarned?: boolean };
if (process.env.NODE_ENV === 'development' && isSessionModePooler && !_gw.__sessionModeWarned) {
  _gw.__sessionModeWarned = true;
  console.warn('⚠️  Using Supabase Session mode (port 5432) – limited connections. To fix "max clients reached", use Transaction mode: change port to 6543 and add ?pgbouncer=true');
}

// Supabase (and most managed Postgres hosts) use SSL with a certificate chain that
// Node.js's built-in trust store cannot verify, causing "self-signed certificate in
// certificate chain". pg-connection-string parses sslmode=require/verify-full from
// the URL and sets rejectUnauthorized:true, overriding any ssl option on the Pool.
// Fix: strip sslmode from the URL for non-local connections so our explicit
// ssl: { rejectUnauthorized: false } pool option is the sole SSL authority.
const isLocalDb = /localhost|127\.0\.0\.1/.test(enhancedConnectionString);

let poolConnectionString = enhancedConnectionString;
if (!isLocalDb) {
  // Remove sslmode=<value> query param (handles both ?sslmode=x and &sslmode=x)
  poolConnectionString = enhancedConnectionString
    .replace(/([?&])sslmode=[^&]*/g, (_, sep) => sep === '?' ? '?' : '')
    .replace(/\?&/g, '?')   // fix ?& artifact left by leading-param removal
    .replace(/[?&]$/g, ''); // strip trailing ? or &
}

const sslOptions = isLocalDb ? undefined : { rejectUnauthorized: false };

const pool = new pg.Pool({ 
  connectionString: poolConnectionString,
  connectionTimeoutMillis: 30000,
  query_timeout: 25000,
  statement_timeout: 25000,
  max: poolSize,
  idleTimeoutMillis: 20000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ...(sslOptions && { ssl: sslOptions }),
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
