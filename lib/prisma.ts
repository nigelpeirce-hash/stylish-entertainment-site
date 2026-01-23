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
  
  // Debug: Log what we're actually reading
  if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 Environment check:');
    console.log('   DATABASE_URL length:', dbUrl.length);
    console.log('   First 80 chars:', dbUrl.substring(0, 80));
    console.log('   Source: .env.local (forced override)');
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

// Debug: Log the connection string structure (masked) in development
if (process.env.NODE_ENV === 'development') {
  const masked = connectionString.replace(/:([^@]+)@/, ':***@');
  console.log('📋 DATABASE_URL loaded');
  console.log('   Structure:', masked.substring(0, 100));
  console.log('   Length:', connectionString.length);
  
  // Check if connection string has placeholders (this would be a problem)
  const hasPlaceholders = connectionString.includes('[id]') || connectionString.includes('[pass]') || connectionString.includes('[YOUR-PASSWORD]');
  if (hasPlaceholders) {
    console.error('❌ CRITICAL: Connection string contains placeholders!');
    console.error('   This means the .env file has not been updated with actual values.');
    console.error('   Please replace [YOUR-PASSWORD] with your actual Supabase password.');
    console.error('   Connection string length:', connectionString.length);
    console.error('   First 150 chars:', connectionString.substring(0, 150));
    console.error('   Contains [id]:', connectionString.includes('[id]'));
    console.error('   Contains [pass]:', connectionString.includes('[pass]'));
    console.error('   Contains [YOUR-PASSWORD]:', connectionString.includes('[YOUR-PASSWORD]'));
    throw new Error('DATABASE_URL contains placeholders - please update .env file with actual password');
  }
  
  // Extract and verify username immediately
  const urlMatch = connectionString.match(/^(postgresql?):\/\/([^:]+):([^@]+)@(.+)$/);
  if (urlMatch) {
    const username = urlMatch[2];
    console.log('   ✅ Username extracted:', username);
    console.log('   ✅ Password length:', urlMatch[3].length);
    if (connectionString.includes('pooler') && !username.includes('.')) {
      console.error('❌ Username format wrong for pooler!');
      throw new Error('Pooler connection must use postgres.[PROJECT_REF] format');
    }
  } else {
    console.error('❌ Could not parse connection string format');
    console.error('   First 100 chars:', connectionString.substring(0, 100));
  }
}

// Validate connection string format for Supabase pooler
if (connectionString.includes('pooler.supabase.com')) {
  // Extract username using robust parsing
  let username = '';
  
  // Parse the connection string using URL parsing
  try {
    // Method 1: Use URL parsing (most reliable)
    const url = new URL(connectionString.replace(/^postgresql?/, 'http'));
    username = url.username;
  } catch (e) {
    // Method 2: Regex fallback
    try {
      const urlMatch = connectionString.match(/^(postgresql?):\/\/([^:]+):([^@]+)@(.+)$/);
      if (urlMatch) {
        username = urlMatch[2];
      }
    } catch (e2) {
      // Method 3: Simple regex
      const match = connectionString.match(/postgresql?:\/\/([^:]+):/);
      if (match) username = match[1];
    }
  }
  
  if (username && !username.includes('.')) {
    console.error('❌ ERROR: DATABASE_URL for pooler must use postgres.[PROJECT_REF] format, not just "postgres"');
    console.error('Current username:', username);
    throw new Error('Invalid DATABASE_URL format for Supabase pooler. Username must include project reference.');
  }
  
  // Log connection details in development for debugging
  if (process.env.NODE_ENV === 'development') {
    const host = connectionString.match(/@([^:]+):/)?.[1] || 'unknown';
    const port = connectionString.match(/:(\d+)\//)?.[1] || 'unknown';
    const maskedUrl = connectionString.replace(/:([^@]+)@/, ':***@');
    
    console.log('🔗 Supabase pooler connection');
    console.log('   Host:', host);
    console.log('   Port:', port);
    console.log('   Username:', username || '⚠️  Could not extract - check connection string');
    
    if (!username) {
      console.error('❌ Could not parse username from connection string');
      console.error('   First 100 chars:', connectionString.substring(0, 100));
    } else if (host.includes('pooler') && !username.includes('.')) {
      console.error('❌ Username format wrong for pooler!');
      console.error('   Expected: postgres.qraijuzzktertoujrwat');
      console.error('   Got:', username);
    }
  }
}

// Create pool with connection string
// Test connection on initialization in development
if (process.env.NODE_ENV === 'development') {
  const testPool = new pg.Pool({ 
    connectionString,
    connectionTimeoutMillis: 5000,
    max: 1,
  });
  
  // Test connection asynchronously (don't block initialization)
  testPool.query('SELECT 1')
    .then(() => {
      console.log('✅ Database connection test successful');
      testPool.end();
    })
    .catch((err: Error) => {
      console.error('❌ Database connection test failed:', err.message);
      if (err.message.includes('Tenant or user not found')) {
        console.error('   This usually means:');
        console.error('   1. Username format is wrong (should be postgres.[PROJECT_REF])');
        console.error('   2. Password is incorrect');
        console.error('   3. Project reference in username is wrong');
        const username = connectionString.match(/postgresql:\/\/([^:]+):/)?.[1];
        console.error('   Current username:', username);
      }
      testPool.end();
    });
}

const pool = new pg.Pool({ 
  connectionString,
  // Connection timeout - increased for Supabase
  connectionTimeoutMillis: 20000,
  // Limit pool size to prevent too many connections
  max: 10,
  // Idle timeout
  idleTimeoutMillis: 30000,
})

const adapter = new PrismaPg(pool)

// 2. The Global Pattern (Essential for Next.js dev mode)
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
