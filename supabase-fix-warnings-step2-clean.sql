DROP POLICY IF EXISTS "Allow public insert to form submissions" ON "FormSubmission";

CREATE POLICY "Allow public insert to form submissions"
  ON "FormSubmission"
  FOR INSERT
  WITH CHECK (
    LENGTH(TRIM(COALESCE(name, ''))) > 0
    AND LENGTH(TRIM(COALESCE(email, ''))) > 0
    AND email LIKE '%@%.%'
    AND LENGTH(TRIM(COALESCE(message, ''))) > 0
  );
