#!/bin/bash
# Script to help create .env.local with Supabase connection string

echo "=========================================="
echo "Supabase Connection String Setup"
echo "=========================================="
echo ""
echo "Your Supabase project reference: qraijuzzktertoujrwat"
echo ""
echo "Connection string format:"
echo "postgresql://postgres:[PASSWORD]@db.qraijuzzktertoujrwat.supabase.co:5432/postgres?sslmode=require"
echo ""
read -sp "Enter your Supabase database password: " PASSWORD
echo ""
echo ""
echo "Creating .env.local file..."

cat > .env.local << EOF
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:${PASSWORD}@db.qraijuzzktertoujrwat.supabase.co:5432/postgres?sslmode=require"

# NextAuth Configuration (update these if needed)
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
EOF

echo "✅ Created .env.local file!"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Set NEXTAUTH_SECRET (run: openssl rand -base64 32)"
echo "   2. Add DATABASE_URL to Vercel environment variables for production"
echo ""
