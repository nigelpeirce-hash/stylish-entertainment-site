-- Service quote items for Lighting & Venue Styling quote generator
CREATE TABLE IF NOT EXISTS "ServiceQuoteItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "unit" TEXT NOT NULL,
  "pricePerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "category" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "ServiceQuoteItem_category_idx" ON "ServiceQuoteItem"("category");
CREATE INDEX IF NOT EXISTS "ServiceQuoteItem_isActive_idx" ON "ServiceQuoteItem"("isActive");
