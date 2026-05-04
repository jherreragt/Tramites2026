/*
  # Update Institutions Table Structure

  ## Changes
  1. Add new columns to institutions table:
    - `full_name` (text) - Full official name of the institution
    - `category` (text) - Category classification
    - `phone` (text) - Contact phone number
    - `email` (text) - Contact email address
    - `address` (text) - Physical address
    - `working_hours` (text) - Operating hours
    - `services` (text) - Description of services provided
    - `is_digital_enabled` (boolean) - Whether digital services are available
    - `social_media` (text) - Social media links
  
  2. Update existing columns:
    - Modify `name` to be the short acronym
    - Keep `description` for brief description
    - Keep `website` for official website

  ## Notes
  - All new columns use IF NOT EXISTS to prevent errors on re-run
  - Default values provided where appropriate
  - Maintains backward compatibility
*/

-- Add full_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE institutions ADD COLUMN full_name TEXT DEFAULT '';
  END IF;
END $$;

-- Add category column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'category'
  ) THEN
    ALTER TABLE institutions ADD COLUMN category TEXT DEFAULT '';
  END IF;
END $$;

-- Add phone column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'phone'
  ) THEN
    ALTER TABLE institutions ADD COLUMN phone TEXT DEFAULT '';
  END IF;
END $$;

-- Add email column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'email'
  ) THEN
    ALTER TABLE institutions ADD COLUMN email TEXT DEFAULT '';
  END IF;
END $$;

-- Add address column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'address'
  ) THEN
    ALTER TABLE institutions ADD COLUMN address TEXT DEFAULT '';
  END IF;
END $$;

-- Add working_hours column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'working_hours'
  ) THEN
    ALTER TABLE institutions ADD COLUMN working_hours TEXT DEFAULT '';
  END IF;
END $$;

-- Add services column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'services'
  ) THEN
    ALTER TABLE institutions ADD COLUMN services TEXT DEFAULT '';
  END IF;
END $$;

-- Add is_digital_enabled column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'is_digital_enabled'
  ) THEN
    ALTER TABLE institutions ADD COLUMN is_digital_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add social_media column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutions' AND column_name = 'social_media'
  ) THEN
    ALTER TABLE institutions ADD COLUMN social_media TEXT DEFAULT '';
  END IF;
END $$;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_institutions_full_name ON institutions(full_name);
CREATE INDEX IF NOT EXISTS idx_institutions_category ON institutions(category);
