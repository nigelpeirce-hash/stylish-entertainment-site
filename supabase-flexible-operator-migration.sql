-- Flexible Operator Sidebar Migration
-- Adds fields for flexible fee builder, override mode, templates, and admin notes

-- Add adminNotes column (private admin notes - never shown to client)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;

-- Add feeBreakdown JSON column (flexible fee line items array)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "feeBreakdown" JSONB;

-- Add taxInclusive boolean column (tax-inclusive or tax-exclusive pricing)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "taxInclusive" BOOLEAN DEFAULT true;

-- Add taxRate float column (VAT rate percentage)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "taxRate" DOUBLE PRECISION DEFAULT 20.0;

-- Add overrideReason text column (reason for manual override)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "overrideReason" TEXT;

-- Add selectedTemplate text column (selected email template ID)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "selectedTemplate" TEXT;

-- Create index on selectedTemplate for faster template lookups
CREATE INDEX IF NOT EXISTS "Booking_selectedTemplate_idx" 
ON "Booking"("selectedTemplate");

COMMENT ON COLUMN "Booking"."adminNotes" IS 'Private admin notes that are never shown to the client';
COMMENT ON COLUMN "Booking"."feeBreakdown" IS 'Flexible fee line items array (JSON)';
COMMENT ON COLUMN "Booking"."taxInclusive" IS 'Tax-inclusive (true) or tax-exclusive (false) pricing';
COMMENT ON COLUMN "Booking"."taxRate" IS 'VAT rate percentage (default 20%)';
COMMENT ON COLUMN "Booking"."overrideReason" IS 'Reason for manual override of locked fields';
COMMENT ON COLUMN "Booking"."selectedTemplate" IS 'Selected email template ID for quick-fire templates';
