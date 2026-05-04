/*
  # Create Institutions and Procedures Tables

  ## New Tables
  
  ### `institutions`
  - `id` (serial, primary key) - Auto-incrementing ID
  - `name` (text, unique, not null) - Institution name
  - `description` (text) - Institution description
  - `website` (text) - Official website URL
  - `contact_info` (jsonb) - Contact information (phone, email, address)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `procedures`
  - `id` (serial, primary key) - Auto-incrementing ID
  - `name` (text, not null) - Procedure name
  - `description` (text, not null) - Procedure description
  - `institution_id` (int, foreign key) - Reference to institution
  - `category` (text, not null) - Main category
  - `subcategory` (text) - Subcategory
  - `duration` (text, not null) - Estimated duration
  - `type` (text, not null) - Procedure type (Presencial, Digital, Mixto)
  - `is_digital` (boolean, default false) - Whether it's digital
  - `user_type` (text, not null) - Target user type
  - `requirements` (text) - Requirements text
  - `steps` (text) - Steps text
  - `respaldo_legal` (text) - Legal framework
  - `fecha_actualizado` (date) - Last updated date
  - `fecha_revision` (date) - Last review date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on both tables
  - Add policies for public read access
  - Add policies for authenticated users to manage data
*/

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  website TEXT DEFAULT '',
  contact_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
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
  fecha_actualizado DATE DEFAULT CURRENT_DATE,
  fecha_revision DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_procedures_institution ON procedures(institution_id);
CREATE INDEX IF NOT EXISTS idx_procedures_category ON procedures(category);
CREATE INDEX IF NOT EXISTS idx_procedures_is_digital ON procedures(is_digital);
CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(name);

-- Enable Row Level Security
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;

-- Policies for institutions table
CREATE POLICY "Anyone can view institutions"
  ON institutions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert institutions"
  ON institutions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update institutions"
  ON institutions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete institutions"
  ON institutions
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for procedures table
CREATE POLICY "Anyone can view procedures"
  ON procedures
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert procedures"
  ON procedures
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update procedures"
  ON procedures
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete procedures"
  ON procedures
  FOR DELETE
  TO authenticated
  USING (true);
