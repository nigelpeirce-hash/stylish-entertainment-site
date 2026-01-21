// Test Supabase connection with different methods
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...\n');

// Test 1: Direct connection with SSL
console.log('Test 1: Direct connection with SSL...');
const pool1 = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

pool1.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed:', err.message);
    console.log('\n💡 Possible solutions:');
    console.log('   1. Check Supabase Dashboard → Settings → Database → Network Restrictions');
    console.log('   2. Make sure "Restrict all access" is NOT enabled');
    console.log('   3. Or add your IP address to allowed list');
    console.log('   4. Try using connection pooler instead (port 6543)');
    pool1.end();
    process.exit(1);
  }
  
  console.log('✅ Connection successful!');
  console.log('Database time:', res.rows[0].now);
  pool1.end();
  process.exit(0);
});
