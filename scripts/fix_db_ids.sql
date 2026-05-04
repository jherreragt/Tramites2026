-- SQL FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO RESTORE INTEGER IDs

-- 1. Create temporary tables to hold data
CREATE TEMP TABLE temp_procedures AS SELECT * FROM procedures;
CREATE TEMP TABLE temp_institutions AS SELECT * FROM institutions;

-- 2. Drop existing tables (WARNING: this deletes all data in these tables)
DROP TABLE IF EXISTS procedure_comments CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS procedures CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;

-- 3. Re-create institutions with integer ID
CREATE TABLE institutions (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,
  name TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  website TEXT DEFAULT '',
  full_name TEXT DEFAULT '',
  category TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  working_hours TEXT DEFAULT '',
  services TEXT DEFAULT '',
  is_digital_enabled BOOLEAN DEFAULT false,
  social_media TEXT DEFAULT '',
  contact_info JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Re-create procedures with integer ID
CREATE TABLE procedures (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT DEFAULT '',
  institution_id INT REFERENCES institutions(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  is_digital BOOLEAN DEFAULT false,
  user_type TEXT NOT NULL,
  requirements TEXT DEFAULT '',
  steps TEXT DEFAULT '',
  respaldo_legal TEXT DEFAULT '',
  enlace_respaldo_legal TEXT DEFAULT '',
  unidad_direccion TEXT DEFAULT '',
  fecha_actualizado DATE DEFAULT CURRENT_DATE,
  fecha_revision DATE DEFAULT CURRENT_DATE,
  codigo_moneda TEXT,
  costo TEXT,
  documento_obtenible TEXT,
  enlace TEXT,
  deleted_at TIMESTAMPTZ,
  fts TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Re-enable RLS and Policies (Omitted for brevity, but they are in your migrations)
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view institutions" ON institutions FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can view procedures" ON procedures FOR SELECT TO public USING (true);

-- 6. RE-RUN SEED DATA
-- (Copy and paste the contents of 99_seed_data.sql here)
