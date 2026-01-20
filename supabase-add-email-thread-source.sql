ALTER TABLE "EmailThread"
ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'imap';

UPDATE "EmailThread"
SET "source" = 'imap'
WHERE "source" IS NULL;
