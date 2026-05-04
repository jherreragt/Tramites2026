-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    google_analytics_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "Allow public read for settings"
ON public.site_settings FOR SELECT
TO public
USING (true);

-- Create policy for authenticated update
CREATE POLICY "Allow authenticated update for settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated insert (to initialize)
CREATE POLICY "Allow authenticated insert for settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Initialize with null value if not exists
INSERT INTO public.site_settings (id, google_analytics_id)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;
