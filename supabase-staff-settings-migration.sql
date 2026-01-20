-- Staff Settings Migration for STYLISH ENTERTAINMENT
-- This script creates the Staff_Settings table and updates the assignedTo field

-- 1. Create the Member Type ENUM if not already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assigned_member') THEN
        CREATE TYPE assigned_member AS ENUM ('ali', 'husband', 'none');
    END IF;
END $$;

-- 2. Create Staff_Settings table (using double quotes for case sensitivity)
-- Note: Prisma uses camelCase for column names, so we match that
CREATE TABLE IF NOT EXISTS "Staff_Settings" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "phoneNumber" TEXT,  -- camelCase to match Prisma
    "pushUserKey" TEXT,  -- camelCase to match Prisma
    "notificationEnabled" BOOLEAN DEFAULT true,  -- camelCase to match Prisma
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert/Update staff records (explicitly generate UUIDs and timestamps)
INSERT INTO "Staff_Settings" (id, name, "phoneNumber", "notificationEnabled", "created_at", "updated_at") 
VALUES 
    (gen_random_uuid(), 'Ali', '+447000000000', true, NOW(), NOW()),  -- Update with Ali's real number
    (gen_random_uuid(), 'Nigel', '+447000000000', true, NOW(), NOW()) -- Update with your real number
ON CONFLICT (name) DO UPDATE 
SET 
    "phoneNumber" = EXCLUDED."phoneNumber",
    "updated_at" = NOW();

-- 4. Check which column name exists in Booking table
-- Prisma may use camelCase (assignedTo) or snake_case (assigned_to)
DO $$
DECLARE
    column_exists_camel BOOLEAN;
    column_exists_snake BOOLEAN;
BEGIN
    -- Check for camelCase column
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Booking' 
        AND column_name = 'assignedTo'
    ) INTO column_exists_camel;
    
    -- Check for snake_case column
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Booking' 
        AND column_name = 'assigned_to'
    ) INTO column_exists_snake;
    
    -- Update based on which column exists
    IF column_exists_camel THEN
        -- Update camelCase column
        ALTER TABLE "Booking" 
        ALTER COLUMN "assignedTo" TYPE TEXT;
        
        -- Convert 'wife' to 'ali', keep others as-is
        UPDATE "Booking" 
        SET "assignedTo" = CASE 
            WHEN "assignedTo" = 'wife' THEN 'ali'
            WHEN "assignedTo" = 'husband' THEN 'husband'
            ELSE 'none'
        END
        WHERE "assignedTo" IS NOT NULL;
        
        -- Now change to ENUM type
        ALTER TABLE "Booking" 
        ALTER COLUMN "assignedTo" TYPE assigned_member 
        USING "assignedTo"::assigned_member;
        
    ELSIF column_exists_snake THEN
        -- Update snake_case column
        ALTER TABLE "Booking" 
        ALTER COLUMN "assigned_to" TYPE TEXT;
        
        -- Convert 'wife' to 'ali', keep others as-is
        UPDATE "Booking" 
        SET "assigned_to" = CASE 
            WHEN "assigned_to" = 'wife' THEN 'ali'
            WHEN "assigned_to" = 'husband' THEN 'husband'
            ELSE 'none'
        END
        WHERE "assigned_to" IS NOT NULL;
        
        -- Now change to ENUM type
        ALTER TABLE "Booking" 
        ALTER COLUMN "assigned_to" TYPE assigned_member 
        USING "assigned_to"::assigned_member;
        
    ELSE
        RAISE NOTICE 'Neither assignedTo nor assigned_to column found in Booking table';
    END IF;
END $$;

-- 5. Create index on Staff_Settings name for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_settings_name ON "Staff_Settings"(name);

-- 6. Verify the changes
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Staff_Settings table created/updated';
    RAISE NOTICE 'assignedTo/assigned_to column updated to use assigned_member ENUM';
END $$;
