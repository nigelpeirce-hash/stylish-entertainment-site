-- Add youtubeEmbed field to DJ table
ALTER TABLE "DJ" 
ADD COLUMN IF NOT EXISTS "youtubeEmbed" TEXT;

-- Add youtubeEmbed field to Musician table
ALTER TABLE "Musician" 
ADD COLUMN IF NOT EXISTS "youtubeEmbed" TEXT;
