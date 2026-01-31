-- Consolidated DJ migration: youtubeEmbed, mixcloudEmbeds, strapLine, fullBio
-- Run this in Supabase SQL Editor if Read More modal shows empty YouTube/Mixcloud

-- youtubeEmbed (TEXT)
ALTER TABLE "DJ" ADD COLUMN IF NOT EXISTS "youtubeEmbed" TEXT;

-- mixcloudEmbeds (JSONB array)
ALTER TABLE "DJ" ADD COLUMN IF NOT EXISTS "mixcloudEmbeds" JSONB;

-- strapLine, fullBio (TEXT)
ALTER TABLE "DJ" ADD COLUMN IF NOT EXISTS "strapLine" TEXT;
ALTER TABLE "DJ" ADD COLUMN IF NOT EXISTS "fullBio" TEXT;
