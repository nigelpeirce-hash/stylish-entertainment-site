-- Migration: Add new fields to FreelanceCrew for Team Directory
-- Run this in Supabase SQL Editor

-- Add new columns
ALTER TABLE "FreelanceCrew" 
ADD COLUMN IF NOT EXISTS "professionalTitle" TEXT,
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "technicalSkills" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Make email required (set default for existing null values, then add constraint)
UPDATE "FreelanceCrew" 
SET "email" = 'pending@stylishentertainment.co.uk' 
WHERE "email" IS NULL;

ALTER TABLE "FreelanceCrew" 
ALTER COLUMN "email" SET NOT NULL;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS "FreelanceCrew_email_idx" ON "FreelanceCrew"("email");

-- Note: After running this migration, you should:
-- 1. Update any staff members with 'pending@stylishentertainment.co.uk' to their actual email
-- 2. Run: npx prisma generate (to update Prisma client)
-- 3. Restart your Next.js dev server
