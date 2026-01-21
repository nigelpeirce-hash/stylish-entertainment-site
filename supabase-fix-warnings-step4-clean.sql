DROP FUNCTION IF EXISTS log_booking_change();

CREATE OR REPLACE FUNCTION log_booking_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN NEW;
END;
$$;
