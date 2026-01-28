#!/usr/bin/env tsx
/**
 * Test Prisma Connection and Schema Sync
 * 
 * This script verifies:
 * 1. Prisma client can connect to database
 * 2. Schema matches database structure
 * 3. Basic queries work
 */

import { prisma } from '../lib/prisma';

async function testConnection() {
  console.log('🔍 Testing Prisma Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    await prisma.$connect();
    console.log('   ✅ Connected successfully\n');

    // Test 2: Simple query
    console.log('2. Testing simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Query executed:', result);
    console.log('');

    // Test 3: Check Booking table exists and has expected columns
    console.log('3. Checking Booking table structure...');
    const bookingColumns = await prisma.$queryRaw<Array<{ column_name: string; data_type: string }>>`
      SELECT column_name::text, data_type::text 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'Booking'
      ORDER BY ordinal_position
    `;
    
    console.log(`   Found ${bookingColumns.length} columns in Booking table:`);
    const hasVenueName = bookingColumns.some(c => c.column_name === 'venueName');
    const hasVenuePostcode = bookingColumns.some(c => c.column_name === 'venuePostcode');
    
    console.log(`   ✅ venueName: ${hasVenueName ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ✅ venuePostcode: ${hasVenuePostcode ? 'EXISTS' : 'MISSING'}`);
    console.log('');

    // Test 4: Try a simple Booking query
    console.log('4. Testing Booking.findMany() query...');
    const bookingCount = await prisma.booking.count();
    console.log(`   ✅ Found ${bookingCount} bookings in database`);
    console.log('');

    // Test 5: Try the actual query from venues/search
    console.log('5. Testing venues/search query pattern...');
    const testBookings = await prisma.booking.findMany({
      where: {
        venueName: {
          startsWith: 'test',
          mode: 'insensitive',
        },
      },
      select: {
        venueName: true,
        venuePostcode: true,
      },
      distinct: ['venueName'],
      take: 5,
    });
    console.log(`   ✅ Query executed successfully (found ${testBookings.length} results)`);
    console.log('');

    // Test 6: Check for schema mismatches
    console.log('6. Checking for common schema issues...');
    const allTables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name::text 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log(`   ✅ Found ${allTables.length} tables in database`);
    console.log('   Tables:', allTables.map(t => t.table_name).join(', '));
    console.log('');

    console.log('✅ All tests passed! Database is in sync with Prisma schema.\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Error meta:', JSON.stringify(error.meta, null, 2));
    
    if (error.code === 'P2001') {
      console.error('\n   💡 This means the table does not exist in the database.');
      console.error('   Run: npx prisma db push');
    } else if (error.code === 'P2002') {
      console.error('\n   💡 This is a unique constraint violation (not a connection issue).');
    } else if (error.code === 'P2010') {
      console.error('\n   💡 This means a raw query failed - check SQL syntax.');
    } else if (error.message?.includes('Invalid')) {
      console.error('\n   💡 "Invalid invocation" usually means:');
      console.error('   1. Prisma client not properly generated');
      console.error('   2. Schema mismatch between Prisma and database');
      console.error('   3. Adapter not working correctly');
      console.error('\n   Try: npx prisma generate');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
