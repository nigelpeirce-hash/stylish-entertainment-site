# Admin User Management Setup Guide

This guide explains how to set up and use the Admin User Management system for STYLISH Entertainment.

## Features

✅ **User Invitations** - Invite users via email without manual sign-up  
✅ **Role Management** - Assign and update user roles (admin, user, client)  
✅ **Invite Status Tracking** - Track invite acceptance status  
✅ **Admin UI** - Beautiful table view for managing all users  
✅ **Security** - Admin-only access with Row Level Security policies  

## Prerequisites

### Option 1: Using Supabase Auth (Recommended)

1. **Set up Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a project
   - Get your project URL and Service Role Key from Settings → API

2. **Environment Variables**
   Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Run SQL Migration**
   - Go to your Supabase project → SQL Editor
   - Run the SQL in `supabase-user-management-migration.sql`
   - This creates the `profiles` table and RLS policies

### Option 2: Using Prisma Only (Fallback)

If you don't want to use Supabase Auth, the system will fall back to:
- Creating users in Prisma User table
- Sending manual invite emails via Resend
- Users set up accounts via NextAuth

## Setup Steps

### 1. Database Migration

Run the SQL migration in Supabase:

```sql
-- See supabase-user-management-migration.sql for full migration
```

This creates:
- `profiles` table with role enum
- RLS policies for admin access
- Indexes for performance

### 2. Environment Variables

Add to `.env.local`:

```env
# Supabase (if using Supabase Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required (for invite emails)
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or https://stylishentertainment.co.uk
```

### 3. Install Dependencies

Already installed:
```bash
npm install @supabase/supabase-js @radix-ui/react-select @radix-ui/react-dropdown-menu
```

### 4. Access User Management

1. Log in as an admin
2. Go to Admin Dashboard (`/admin`)
3. Click "User Management" card
4. Or navigate directly to `/admin/users`

## Usage

### Inviting a New User

1. Click "Invite New User" button
2. Enter email address
3. Select role:
   - **Admin**: Full access to admin panel and user management
   - **User**: Access to admin panel with limited permissions
   - **Client**: Client access only
4. Click "Send Invitation"
5. User receives email with invite link

### Managing User Roles

1. Find user in the table
2. Click the role dropdown
3. Select new role
4. Role is updated immediately

### Viewing Invite Status

The table shows invite status:
- **Active** (Green): User has accepted invite and is active
- **Pending** (Yellow): Invite sent but not yet accepted
- **Not Invited** (Gray): User exists but no invite sent

## Security

### Admin Authentication

- All API routes check for admin role using `requireAdmin()`
- Only users with `role: "admin"` can:
  - Invite users
  - View all users
  - Update user roles

### Row Level Security (RLS)

If using Supabase Auth, the RLS policies ensure:

1. **Admins can view all profiles**
   ```sql
   CREATE POLICY "Admins can view all profiles"
     ON profiles FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
       )
     );
   ```

2. **Admins can update all profiles**
   ```sql
   CREATE POLICY "Admins can update all profiles"
     ON profiles FOR UPDATE
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
       )
     );
   ```

3. **Users can view their own profile**
   ```sql
   CREATE POLICY "Users can view own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);
   ```

## API Routes

### POST `/api/admin/users/invite`

Invite a new user by email.

**Request:**
```json
{
  "email": "user@example.com",
  "role": "admin" | "user" | "client"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User invited successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "admin"
  },
  "inviteUrl": "https://..."
}
```

### GET `/api/admin/users`

Fetch all users with roles and invite status.

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin",
      "inviteStatus": "accepted",
      "createdAt": "...",
      ...
    }
  ],
  "total": 10
}
```

### PATCH `/api/admin/users`

Update user role.

**Request:**
```json
{
  "userId": "...",
  "role": "admin" | "user" | "client"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "admin",
    ...
  }
}
```

## Invite Email Template

When a user is invited, they receive a beautiful HTML email with:
- STYLISH Entertainment branding
- Invitation message from admin
- Role information
- Invite link
- 7-day expiration notice

## Validation

When a user accepts an invite:

1. If using Supabase Auth:
   - User account is created in Supabase Auth
   - Profile is synced to `profiles` table
   - Role is set from invite metadata

2. If using Prisma only:
   - User signs up via NextAuth
   - Role is set from User table
   - Account is verified

## Troubleshooting

### Supabase Not Configured

If Supabase credentials are missing:
- System falls back to Prisma-only mode
- Invites still work via email
- Users sign up via NextAuth

### Email Not Sending

Check:
- `RESEND_API_KEY` is set correctly
- Email domain is verified in Resend
- Check server logs for errors

### RLS Policy Errors

If you see RLS errors:
- Ensure you're logged in as an admin
- Check that `profiles` table exists
- Verify RLS policies are enabled
- Run the migration SQL again

## Next Steps

1. **Set up Supabase Auth** (recommended for production)
2. **Run the SQL migration** in Supabase
3. **Add environment variables**
4. **Test invite flow** with your email
5. **Review RLS policies** for your security needs

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review NextAuth docs: https://next-auth.js.org
- Check server logs for detailed error messages
