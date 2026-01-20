-- Add assignedUsers field to EmailInbox table
-- This field stores an array of user email addresses that should see messages from this inbox

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'EmailInbox' 
        AND column_name = 'assignedUsers'
    ) THEN
        ALTER TABLE "EmailInbox" ADD COLUMN "assignedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_email_inbox_assigned_users" ON "EmailInbox" USING GIN ("assignedUsers");
