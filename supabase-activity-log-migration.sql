-- Add actor and metadata columns to AuditLog for enhanced Activity Feed
-- Run this in Supabase SQL editor or via migration tool

ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "actor" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "metadata" JSONB;

COMMENT ON COLUMN "AuditLog"."actor" IS 'Who performed: client, guest, admin, system';
COMMENT ON COLUMN "AuditLog"."metadata" IS 'Extra context: emailSubject, amount, songTitle, etc';
