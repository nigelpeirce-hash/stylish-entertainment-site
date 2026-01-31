-- Add mixcloudEmbeds (JSONB array of Mixcloud embed URLs) to DJ table
ALTER TABLE "DJ"
ADD COLUMN IF NOT EXISTS "mixcloudEmbeds" JSONB;
