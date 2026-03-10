-- Add client message to NewEnquiry
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "message" TEXT;

-- Add event/enquiry type classification
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "eventType" TEXT;
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "enquiryType" TEXT;

-- Add hire item selections (array of { hireItemId, quantity })
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "selectedHireItems" JSONB;

-- Add quote request data for unified quote flow ({ services: string[], message?: string })
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "quoteRequestData" JSONB;
