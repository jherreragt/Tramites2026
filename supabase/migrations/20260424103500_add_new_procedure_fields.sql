/*
  # Add new fields to procedures table

  1. New Columns
    - `unidad_direccion` (text): The administrative unit or direction responsible for the procedure.
    - `enlace_respaldo_legal` (text): URL to the legal support document.
  
  2. Notes
    - Using IF NOT EXISTS checks for safety.
    - The `steps` column will now store a JSON array of objects, but no schema change is needed as it's already text/jsonb.
*/

DO $$ 
BEGIN
  -- Add unidad_direccion column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'unidad_direccion'
  ) THEN
    ALTER TABLE procedures ADD COLUMN unidad_direccion text;
  END IF;

  -- Add enlace_respaldo_legal column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'procedures' AND column_name = 'enlace_respaldo_legal'
  ) THEN
    ALTER TABLE procedures ADD COLUMN enlace_respaldo_legal text;
  END IF;
END $$;
