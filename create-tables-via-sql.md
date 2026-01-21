# Alternative: Create Tables via Supabase SQL Editor

Since the direct connection isn't IPv4 compatible and Prisma `db push` requires a direct connection, we can create the tables manually via Supabase SQL Editor instead.

## Steps

1. **Go to Supabase Dashboard → SQL Editor**

2. **Run this command to generate the SQL from Prisma schema:**
   ```bash
   npx prisma migrate dev --create-only --name init
   ```
   This creates a migration file without applying it.

3. **Or, we can use Prisma to generate the SQL:**
   ```bash
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > create-tables.sql
   ```

4. **Copy the generated SQL and run it in Supabase SQL Editor**

## Quick Alternative: Use Supabase's Table Editor

You can also create tables manually using Supabase's Table Editor:
1. Go to Supabase Dashboard → Table Editor
2. Create tables one by one matching your Prisma schema

## Or: Enable IPv4 Add-on

If you're on a paid plan, you can purchase the IPv4 add-on in Supabase to make the direct connection work.
