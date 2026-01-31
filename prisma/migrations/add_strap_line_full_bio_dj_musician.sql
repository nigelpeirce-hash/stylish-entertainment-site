-- Add strapLine and fullBio to DJ and Musician for admin-editable card tagline and long bio
ALTER TABLE "DJ"
ADD COLUMN IF NOT EXISTS "strapLine" TEXT,
ADD COLUMN IF NOT EXISTS "fullBio" TEXT;

ALTER TABLE "Musician"
ADD COLUMN IF NOT EXISTS "strapLine" TEXT,
ADD COLUMN IF NOT EXISTS "fullBio" TEXT;
