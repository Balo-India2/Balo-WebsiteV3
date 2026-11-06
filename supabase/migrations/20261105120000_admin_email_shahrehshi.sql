-- Switch the authorised admin inbox so verification codes go to the new owner.
DELETE FROM public.admin_emails WHERE lower(email) = 'baloindia2015@gmail.com';
INSERT INTO public.admin_emails(email) VALUES ('shahrehshi@gmail.com')
ON CONFLICT (email) DO NOTHING;
