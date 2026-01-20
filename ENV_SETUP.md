# Environment Variables Setup

## Quick Reference

### Required for Production

```env
# Domain Configuration
NEXT_PUBLIC_SITE_URL=https://stylishentertainment.co.uk
NEXTAUTH_URL=https://stylishentertainment.co.uk

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Full Environment Variables List

See `PRODUCTION_MIGRATION_GUIDE.md` for complete list and setup instructions.
