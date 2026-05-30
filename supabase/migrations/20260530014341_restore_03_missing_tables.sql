/*
  # Restauración - Paso 3: Crear tablas faltantes

  Crea: experiences, site_settings, user_favorites, procedure_comments
*/

-- =====================
-- EXPERIENCES
-- =====================
CREATE TABLE IF NOT EXISTS public.experiences (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL,
    icon text DEFAULT 'Target',
    color text DEFAULT 'from-blue-500 to-blue-700',
    categoria text NOT NULL,
    duracion_estimada text,
    ids_procedures text[],
    pasos_adicionales text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE SEQUENCE IF NOT EXISTS public.experiences_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE ONLY public.experiences ALTER COLUMN id SET DEFAULT nextval('public.experiences_id_seq'::regclass);
DO $$ BEGIN ALTER TABLE ONLY public.experiences ADD CONSTRAINT experiences_pkey PRIMARY KEY (id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================
-- SITE_SETTINGS
-- =====================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id bigint DEFAULT 1 NOT NULL,
    google_analytics_id text,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK ((id = 1))
);
DO $$ BEGIN ALTER TABLE ONLY public.site_settings ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================
-- USER_FAVORITES
-- =====================
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    procedure_id integer,
    created_at timestamptz DEFAULT now()
);
CREATE SEQUENCE IF NOT EXISTS public.user_favorites_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE ONLY public.user_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_favorites_id_seq'::regclass);
DO $$ BEGIN ALTER TABLE ONLY public.user_favorites ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE ONLY public.user_favorites ADD CONSTRAINT user_favorites_user_id_procedure_id_key UNIQUE (user_id, procedure_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================
-- PROCEDURE_COMMENTS
-- =====================
CREATE TABLE IF NOT EXISTS public.procedure_comments (
    id integer NOT NULL,
    procedure_id integer,
    user_id uuid NOT NULL,
    user_name text,
    comment text NOT NULL,
    rating integer,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT procedure_comments_rating_check CHECK ((rating >= 1 AND rating <= 5))
);
CREATE SEQUENCE IF NOT EXISTS public.procedure_comments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE ONLY public.procedure_comments ALTER COLUMN id SET DEFAULT nextval('public.procedure_comments_id_seq'::regclass);
DO $$ BEGIN ALTER TABLE ONLY public.procedure_comments ADD CONSTRAINT procedure_comments_pkey PRIMARY KEY (id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================
-- RLS
-- =====================
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Public read comments" ON public.procedure_comments FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert comments" ON public.procedure_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth select favorites" ON public.user_favorites FOR SELECT TO authenticated USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert favorites" ON public.user_favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth delete favorites" ON public.user_favorites FOR DELETE TO authenticated USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth all experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth update settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
