DROP FUNCTION IF EXISTS generate_booking_fingerprint();

CREATE OR REPLACE FUNCTION generate_booking_fingerprint()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN NULL;
END;
$$;
