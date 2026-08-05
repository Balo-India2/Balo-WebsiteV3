ALTER TABLE public.admin_approval_requests
  ALTER COLUMN code_hash DROP NOT NULL,
  ALTER COLUMN expires_at DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

CREATE OR REPLACE FUNCTION public.admin_approval_status_check()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('pending','approved','rejected') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS admin_approval_status_check_trg ON public.admin_approval_requests;
CREATE TRIGGER admin_approval_status_check_trg
  BEFORE INSERT OR UPDATE ON public.admin_approval_requests
  FOR EACH ROW EXECUTE FUNCTION public.admin_approval_status_check();

DROP POLICY IF EXISTS "Admins read approval requests" ON public.admin_approval_requests;
CREATE POLICY "Admins read approval requests"
  ON public.admin_approval_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.admin_approval_requests TO authenticated;
GRANT ALL ON public.admin_approval_requests TO service_role;