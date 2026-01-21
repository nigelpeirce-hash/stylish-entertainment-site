// Quick test script to verify database connection
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('🔍 Testing database connection...');
console.log('Connection string (masked):', connectionString.replace(/:[^:@]+@/, ':****@'));

// Parse connection string and add SSL config
// Use a temporary protocol for URL parsing (not a hardcoded connection string)
const url = new URL(connectionString.replace(/^postgresql:\/\//, 'https://'));
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Supabase uses self-signed certs
  },
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('\n💡 Possible issues:');
    console.error('   1. Password is incorrect');
    console.error('   2. Password contains special characters that need URL encoding');
    console.error('   3. Database is paused or not accessible');
    console.error('\n🔧 Try:');
    console.error('   1. Reset database password in Supabase Dashboard');
    console.error('   2. Update .env.local with the new password');
    console.error('   3. If password has special characters, URL encode them (e.g., @ becomes %40)');
    process.exit(1);
  }
  
  console.log('✅ Connection successful!');
  console.log('Database time:', res.rows[0].now);
  pool.end();
});
