#!/usr/bin/env node

/**
 * Quick debugging script to check for common issues
 * Run with: node scripts/debug-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running debug checks...\n');

const issues = [];

// Check 1: Environment variables
console.log('1. Checking environment variables...');
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  issues.push('⚠️  .env.local file not found');
  console.log('   ⚠️  .env.local file not found');
} else {
  console.log('   ✅ .env.local exists');
}

// Check 2: Node modules
console.log('\n2. Checking dependencies...');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  issues.push('❌ node_modules not found - run npm install');
  console.log('   ❌ node_modules not found');
} else {
  console.log('   ✅ node_modules exists');
}

// Check 3: TypeScript config
console.log('\n3. Checking TypeScript config...');
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (!fs.existsSync(tsConfigPath)) {
  issues.push('⚠️  tsconfig.json not found');
  console.log('   ⚠️  tsconfig.json not found');
} else {
  console.log('   ✅ tsconfig.json exists');
}

// Check 4: Next.js config
console.log('\n4. Checking Next.js config...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  issues.push('⚠️  next.config.js not found');
  console.log('   ⚠️  next.config.js not found');
} else {
  console.log('   ✅ next.config.js exists');
  
  // Check if errors are being ignored
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfig.includes('ignoreBuildErrors: true')) {
    issues.push('⚠️  TypeScript errors are being ignored in builds');
    console.log('   ⚠️  TypeScript errors are being ignored');
  }
  if (nextConfig.includes('ignoreDuringBuilds: true')) {
    issues.push('⚠️  ESLint errors are being ignored in builds');
    console.log('   ⚠️  ESLint errors are being ignored');
  }
}

// Check 5: Prisma
console.log('\n5. Checking Prisma setup...');
const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(prismaSchemaPath)) {
  issues.push('⚠️  Prisma schema not found');
  console.log('   ⚠️  Prisma schema not found');
} else {
  console.log('   ✅ Prisma schema exists');
}

// Summary
console.log('\n' + '='.repeat(50));
if (issues.length === 0) {
  console.log('✅ All checks passed!');
} else {
  console.log(`⚠️  Found ${issues.length} potential issue(s):\n`);
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('\n💡 Tips:');
  console.log('   - Check browser console for runtime errors');
  console.log('   - Check server logs (terminal) for API errors');
  console.log('   - Use React DevTools to inspect components');
  console.log('   - See DEBUGGING_GUIDE.md for more help');
}

console.log('\n' + '='.repeat(50));
