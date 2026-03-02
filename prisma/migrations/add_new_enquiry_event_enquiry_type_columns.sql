-- Add eventType, enquiryType, selectedHireItems to NewEnquiry (schema was ahead of DB)
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "eventType" TEXT;
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "enquiryType" TEXT;
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "selectedHireItems" JSONB;
