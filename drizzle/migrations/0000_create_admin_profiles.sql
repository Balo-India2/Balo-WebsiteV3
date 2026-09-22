CREATE TABLE public.admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  username text NOT NULL,
  normalized_username text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_profiles TO authenticated;
GRANT ALL ON public.admin_profiles TO service_role;

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own admin profile"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_admin_profiles_normalized_username ON public.admin_profiles(normalized_username);