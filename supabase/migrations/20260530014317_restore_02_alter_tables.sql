/*
  # Restauración - Paso 2: Agregar columnas faltantes a tablas existentes

  - institutions: deleted_at
  - procedures: full_description, enlace_respaldo_legal, unidad_direccion,
                codigo_moneda, costo, documento_obtenible, enlace, deleted_at,
                search_vector (columna generada)
*/

-- institutions: columnas faltantes
ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- procedures: columnas faltantes
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS full_description text DEFAULT '';
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS enlace_respaldo_legal text DEFAULT '';
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS unidad_direccion text DEFAULT '';
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS codigo_moneda text;
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS costo text;
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS documento_obtenible text;
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS enlace text;
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- search_vector: columna generada (solo si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'procedures'
      AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE public.procedures
      ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('spanish'::regconfig,
          (COALESCE(name,'')||' '||COALESCE(description,'')||' '||COALESCE(category,'')||' '||COALESCE(subcategory,''))
        )
      ) STORED;
  END IF;
END $$;

-- Índice GIN para full-text search
CREATE INDEX IF NOT EXISTS procedures_search_vector_idx ON public.procedures USING gin(search_vector);
