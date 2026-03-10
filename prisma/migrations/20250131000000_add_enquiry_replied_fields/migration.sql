-- Add enquiry reply audit fields: when and by whom admin sent a human reply
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "enquiryRepliedAt" TIMESTAMP(3);
ALTER TABLE "NewEnquiry" ADD COLUMN IF NOT EXISTS "enquiryRepliedByUserId" TEXT;

-- Foreign key: enquiryRepliedByUserId -> User(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'NewEnquiry_enquiryRepliedByUserId_fkey'
    AND table_name = 'NewEnquiry'
  ) THEN
    ALTER TABLE "NewEnquiry"
      ADD CONSTRAINT "NewEnquiry_enquiryRepliedByUserId_fkey"
      FOREIGN KEY ("enquiryRepliedByUserId") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
