UPDATE public.ai_settings
SET model = 'gemini-3.6-flash',
    fallback_models = ARRAY['gemini-3.5-flash','gemini-flash-latest','gemini-2.0-flash']
WHERE mode = 'student';