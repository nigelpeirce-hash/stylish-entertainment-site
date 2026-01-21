# Update Connection String to Session Pooler

## The Issue
The direct connection (`db.qraijuzzktertoujrwat.supabase.co:5432`) is **not IPv4 compatible**. Your network is IPv4-only, so you need to use the **Session Pooler** instead.

## Solution: Use Session Pooler

1. **In Supabase Dashboard**, on the same "Connect to your project" page:
   - Look for **"Session Pooler"** or **"Connection Pooling"** section
   - It should show a connection string with port **6543** (not 5432)
   - The hostname will be different (usually something like `aws-0-[region].pooler.supabase.com`)

2. **Copy the Session Pooler connection string** - it should look like:
   ```
   postgresql://postgres.qraijuzzktertoujrwat:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
   ```

3. **Update `.env.local`** with the Session Pooler connection string

## Alternative: If you can't find Session Pooler

You can construct it manually:
- Host: `aws-0-eu-west-2.pooler.supabase.com` (or your region)
- Port: `6543`
- Username: `postgres.qraijuzzktertoujrwat` (note the project ref after the dot)
- Password: `pu2yhJbZwqPaRUBy`
- Database: `postgres`
- Add: `?sslmode=require&pgbouncer=true`

Full string:
```
postgresql://postgres.qraijuzzktertoujrwat:pu2yhJbZwqPaRUBy@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

## After Updating

Run:
```bash
npx prisma db push
```

This should work with IPv4 networks!
