# Client Login System - Setup Guide

## ✅ What's Been Implemented

1. **Authentication System** (NextAuth.js)
   - Login page (`/login`)
   - Registration page (`/register`)
   - Protected routes middleware
   - Session management

2. **Database Schema** (Prisma)
   - Users (with roles: client/admin)
   - Bookings
   - Form Submissions
   - NextAuth.js required tables

3. **Client Dashboard** (`/client/dashboard`)
   - View bookings
   - Quick actions
   - Profile access

4. **Booking Form** (`/client/bookings/new`)
   - Full booking inquiry form
   - Service selection
   - Event details

5. **Navigation Updates**
   - Login/Account button in header
   - Mobile-responsive auth access

## 🔧 Required Setup Steps

### 1. Database Setup

You need to set up a PostgreSQL database. Options:
- **Local**: Install PostgreSQL locally
- **Cloud**: Use services like:
  - [Supabase](https://supabase.com) (Free tier available)
  - [Railway](https://railway.app) (Free tier available)
  - [Vercel Postgres](https://vercel.com/storage/postgres)
  - [Neon](https://neon.tech) (Free tier available)

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stylish_entertainment?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Email (for notifications - optional for now)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@stylishentertainment.co.uk"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 4. Create Admin User (Optional)

You can create an admin user directly in the database or create a script:

```typescript
// scripts/create-admin.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin-password", 12);
  
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@stylishentertainment.co.uk",
      password: hashedPassword,
      role: "admin",
    },
  });
  
  console.log("Admin user created!");
}

createAdmin();
```

## 📝 Next Steps (Optional Enhancements)

### Email Notifications
1. Install email service (Resend, SendGrid, or Nodemailer)
2. Update booking API to send emails on submission
3. Add email templates

### Password Reset
1. Create `/forgot-password` page
2. Create `/reset-password` page
3. Add password reset API routes
4. Implement email sending for reset links

### Profile Management
1. Create `/client/profile` page
2. Allow users to update name, email, password
3. Add profile picture upload

### Admin Panel (Future)
1. Create `/admin` routes
2. View all bookings
3. Manage users
4. Update booking statuses

## 🚀 Testing

1. Start development server: `npm run dev`
2. Visit `/register` to create an account
3. Login at `/login`
4. Access dashboard at `/client/dashboard`
5. Create a booking at `/client/bookings/new`

## 📚 Documentation

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🔒 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- Sessions are JWT-based
- Protected routes use middleware
- All user input is validated with Zod
- CSRF protection via NextAuth.js
