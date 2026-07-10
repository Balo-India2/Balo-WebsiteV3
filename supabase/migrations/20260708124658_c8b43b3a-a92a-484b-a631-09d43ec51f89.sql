
-- Admin approval requests: stores hashed one-time codes emailed to owner
CREATE TABLE public.admin_approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_approval_requests TO authenticated;
GRANT ALL ON public.admin_approval_requests TO service_role;

ALTER TABLE public.admin_approval_requests ENABLE ROW LEVEL SECURITY;

-- Only the requester can read their own request (to know it's pending). No client-side writes.
CREATE POLICY "Users read own approval requests"
ON public.admin_approval_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER admin_approval_requests_updated_at
BEFORE UPDATE ON public.admin_approval_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_admin_approval_requests_user ON public.admin_approval_requests(user_id);
CREATE INDEX idx_admin_approval_requests_email ON public.admin_approval_requests(email);
