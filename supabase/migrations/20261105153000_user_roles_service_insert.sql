-- Allow the service role to grant admin after a verified login.
-- Authenticated users may only read their own role; they cannot insert one.
DROP POLICY IF EXISTS "Service role manages roles" ON public.user_roles;
CREATE POLICY "Service role manages roles"
  ON public.user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
