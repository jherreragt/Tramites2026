/*
  # Add missing columns to procedures table

  1. Changes
    - Add full_description column for detailed procedure information
    - Add codigo_moneda column for currency code
    - Add costo column for procedure cost
    - Add documento_obtenible column for obtainable document
    - Add enlace column for external links

  2. Notes
    - All columns are nullable to maintain existing data
    - Uses IF NOT EXISTS checks to prevent errors on re-run
*/

DO $$ 
BEGIN
  -- Add full_description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'full_description'
  ) THEN
    ALTER TABLE procedures ADD COLUMN full_description text;
  END IF;

  -- Add codigo_moneda column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'codigo_moneda'
  ) THEN
    ALTER TABLE procedures ADD COLUMN codigo_moneda text;
  END IF;

  -- Add costo column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'costo'
  ) THEN
    ALTER TABLE procedures ADD COLUMN costo text;
  END IF;

  -- Add documento_obtenible column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'documento_obtenible'
  ) THEN
    ALTER TABLE procedures ADD COLUMN documento_obtenible text;
  END IF;

  -- Add enlace column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'enlace'
  ) THEN
    ALTER TABLE procedures ADD COLUMN enlace text;
  END IF;
END $$;

-- Update full_description with description for existing records
UPDATE procedures 
SET full_description = description 
WHERE full_description IS NULL;
