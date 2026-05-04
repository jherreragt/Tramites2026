/*
  # Mobile Scalability and Synchronization Update

  1. Primary Key Migration: INT to UUID
    - Adds UUIDs to institutions, procedures, observatory, problem_reports
    - Re-links Foreign Keys
    - Preserves all existing data

  2. Mobile Sync Support
    - Adds `deleted_at` for soft deletes
    - Adds auto-update triggers for `updated_at`

  3. Search Optimization
    - Adds Full Text Search (FTS) indexes

  4. Interactive Features
    - Creates `user_favorites` table
    - Creates `procedure_comments` table
*/

-- ==============================================================================
-- 1. UUID ENHANCEMENT (Keep INT ID + Add UUID)
-- ==============================================================================

-- Add UUID columns without dropping the INT IDs
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid() UNIQUE;
ALTER TABLE procedures ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid() UNIQUE;

-- Add temporary foreign key columns using UUID
ALTER TABLE procedures ADD COLUMN IF NOT EXISTS institution_uuid UUID REFERENCES institutions(uuid) ON DELETE SET NULL;

-- Map the relationships (Optional but good for future UUID use)
UPDATE procedures p SET institution_uuid = i.uuid FROM institutions i WHERE p.institution_id = i.id;

-- We KEEP the original 'id' (INT) as the Primary Key to maintain compatibility 
-- with experiences.json and legacy links.
-- We do NOT drop the id column.


-- Omitido observatorio y reportes


-- ==============================================================================
-- 2. MOBILE SYNC & SOFT DELETES
-- ==============================================================================

-- Add deleted_at columns
ALTER TABLE institutions ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE procedures ADD COLUMN deleted_at TIMESTAMPTZ;

-- Create function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach triggers to existing tables
DROP TRIGGER IF EXISTS update_institutions_updated_at ON institutions;
CREATE TRIGGER update_institutions_updated_at
    BEFORE UPDATE ON institutions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procedures_updated_at ON procedures;
CREATE TRIGGER update_procedures_updated_at
    BEFORE UPDATE ON procedures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. SEARCH OPTIMIZATION
-- ==============================================================================

-- Create a generated column for full text search on procedures
ALTER TABLE procedures ADD COLUMN fts tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('spanish', coalesce(category, '')), 'C')
) STORED;

CREATE INDEX procedures_fts_idx ON procedures USING GIN (fts);

-- ==============================================================================
-- 4. INTERACTIVE FEATURES (COMMENTS & FAVORITES)
-- ==============================================================================

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- references auth.users in Supabase
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, procedure_id)
);

-- Create procedure_comments table
CREATE TABLE IF NOT EXISTS procedure_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  user_id UUID, -- references auth.users, nullable for anonymous comments if allowed
  author_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add trigger for updated_at on comments
CREATE TRIGGER update_procedure_comments_updated_at
    BEFORE UPDATE ON procedure_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_comments ENABLE ROW LEVEL SECURITY;

-- Policies for favorites
CREATE POLICY "Users can manage their own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Anyone can view active comments"
  ON procedure_comments
  FOR SELECT
  TO public
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert comments"
  ON procedure_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own comments"
  ON procedure_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
