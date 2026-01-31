-- Add quoteRequestData for unified "Request a quote" flow (Option 6)
ALTER TABLE "NewEnquiry"
ADD COLUMN IF NOT EXISTS "quoteRequestData" JSONB;

COMMENT ON COLUMN "NewEnquiry"."quoteRequestData" IS 'For enquiryType quote_request: { services: string[], message?: string }';
