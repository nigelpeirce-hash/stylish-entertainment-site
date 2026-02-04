-- Add enquiry reply audit fields to NewEnquiry
-- enquiryRepliedAt: when admin sent human reply
-- enquiryRepliedByUserId: which admin sent it (for audit trail)

ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "enquiryRepliedAt" TIMESTAMP(3);
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "enquiryRepliedByUserId" TEXT;

-- Add foreign key for enquiryRepliedByUserId -> User(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'NewEnquiry_enquiryRepliedByUserId_fkey'
    AND table_name = 'NewEnquiry'
  ) THEN
    ALTER TABLE "NewEnquiry" ADD CONSTRAINT "NewEnquiry_enquiryRepliedByUserId_fkey"
      FOREIGN KEY ("enquiryRepliedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
