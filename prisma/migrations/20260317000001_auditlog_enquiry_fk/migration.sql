-- Step 9: Allow AuditLog entries to reference NewEnquiry records
-- Previously bookingId was required; now either bookingId or enquiryId must be set.

-- Make bookingId optional
ALTER TABLE "AuditLog" ALTER COLUMN "bookingId" DROP NOT NULL;

-- Add enquiryId FK column
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "enquiryId" TEXT;

-- Add foreign key constraint to NewEnquiry
ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_enquiryId_fkey"
  FOREIGN KEY ("enquiryId") REFERENCES "NewEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Index for lookups by enquiry
CREATE INDEX IF NOT EXISTS "AuditLog_enquiryId_idx" ON "AuditLog"("enquiryId");
