# Supabase Connection Troubleshooting

## Current Issue
Connection to Supabase database is being refused. Error: `Can't reach database server`

## Possible Causes & Solutions

### 1. Banned IP Address
**Problem:** Your IPv6 address might be banned in Supabase.

**Solution:**
1. Go to Supabase Dashboard → Settings → Database → Network Bans
2. Click **"Unban IP"** next to the banned IPv6 address: `2a02:c7c:882d:7a00:ac6e:22a2:6309:9daa`
3. Try connecting again

### 2. IPv6 Connection Issues
**Problem:** Your system is trying to connect via IPv6, which might be blocked.

**Solution:** Try using the connection pooler instead (port 6543):

Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres.qraijuzzktertoujrwat:pu2yhJbZwqPaRUBy@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
```

**Note:** You'll need to get the correct pooler hostname from:
- Supabase Dashboard → Settings → Database → Connection string
- Look for "Connection pooling" section

### 3. Get Connection String from Supabase Dashboard
**Best Solution:** Get the exact connection string from Supabase:

1. Go to Supabase Dashboard → Settings → Database
2. Look for **"Connection string"** or **"Connection info"** section
3. It might be under a tab like "URI" or "Connection pooling"
4. Copy the exact string shown there
5. Update `.env.local` with that exact string

### 4. Check Database Status
**Problem:** Database might be paused or restarting.

**Solution:**
1. Go to Supabase Dashboard
2. Check if project shows as "Active" (not "Paused")
3. If paused, click "Restore" or "Resume"
4. Wait 1-2 minutes for it to start

### 5. Try Direct IP Connection
If hostname resolution is the issue, you can try:

1. Get the IP address:
   ```bash
   nslookup db.qraijuzzktertoujrwat.supabase.co
   ```

2. Use IP directly in connection string (temporary, for testing only)

## Next Steps

1. **First, try unbanning the IP** in Supabase Dashboard
2. **Get the connection string directly from Supabase Dashboard** (most reliable)
3. If still failing, try the connection pooler (port 6543)

## Test Connection

After updating, test with:
```bash
npx prisma db push
```

Or use the test script:
```bash
node test-supabase-connection.js
```
