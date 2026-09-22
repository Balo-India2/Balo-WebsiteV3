ALTER TABLE public.ai_settings
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS fallback_models text[] NOT NULL DEFAULT '{}';

UPDATE public.ai_settings
SET provider = 'gemini',
    model = COALESCE(model, 'gemini-2.5-flash'),
    fallback_models = CASE WHEN cardinality(fallback_models) = 0
      THEN ARRAY['gemini-2.5-flash','gemini-2.5-flash-lite','gemini-2.0-flash']
      ELSE fallback_models END
WHERE mode = 'student';

UPDATE public.ai_settings
SET provider = 'local', model = NULL
WHERE mode = 'assistant';