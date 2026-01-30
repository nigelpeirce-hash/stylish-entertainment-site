-- Add client message to NewEnquiry so admin can see what they want before building quote
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "message" TEXT;
