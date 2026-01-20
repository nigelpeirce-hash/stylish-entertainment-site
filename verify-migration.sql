-- Verify that the BookingStaffAssignment table exists and has the required columns
-- Run this to check if the migration was successful

-- Check if table exists
SELECT 
    table_name,
    'Table exists' as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('BookingStaffAssignment', 'Booking_Staff_Assignment', 'booking_staff_assignment', 'bookingstaffassignment')
LIMIT 1;

-- Check if columns exist (replace 'BookingStaffAssignment' with actual table name if different)
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'BookingStaffAssignment'
AND column_name IN ('briefStatus', 'acknowledgedAt', 'briefToken')
ORDER BY column_name;
