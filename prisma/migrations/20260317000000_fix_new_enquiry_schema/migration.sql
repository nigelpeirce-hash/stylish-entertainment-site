-- Fix NewEnquiry.id: add uuid() default so Prisma can auto-generate IDs
ALTER TABLE "NewEnquiry" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Fix NewEnquiry.updatedAt: ensure column is NOT NULL (Prisma @updatedAt requires non-nullable)
-- Backfill any NULL values before adding constraint
UPDATE "NewEnquiry" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
