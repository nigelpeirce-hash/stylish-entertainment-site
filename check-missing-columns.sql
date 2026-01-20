SELECT 'briefStatus' AS column_name,
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'BookingStaffAssignment'
        AND column_name = 'briefStatus'
    ) AS exists
UNION ALL
SELECT 'acknowledgedAt',
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'BookingStaffAssignment'
        AND column_name = 'acknowledgedAt'
    )
UNION ALL
SELECT 'briefToken',
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'BookingStaffAssignment'
        AND column_name = 'briefToken'
    );
