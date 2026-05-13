-- 1. Eliminar la columna fts si existe previamente para evitar conflictos
ALTER TABLE procedures DROP COLUMN IF EXISTS fts;
ALTER TABLE procedures DROP COLUMN IF EXISTS search_vector;

-- 2. Agregar la nueva columna search_vector que se actualiza automáticamente
-- Incluye nombre, descripción, categoría y subcategoría
ALTER TABLE procedures ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('spanish',
    coalesce(name, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(category, '') || ' ' ||
    coalesce(subcategory, '')
  )
) STORED;

-- 3. Crear un índice GIN para búsquedas de texto completo rápidas
CREATE INDEX IF NOT EXISTS procedures_search_vector_idx ON procedures USING GIN (search_vector);
