/*
  # Mejorar función de búsqueda de trámites

  1. Extensiones requeridas:
    - `pg_trgm`: Búsqueda por similitud (fuzzy matching / tolerancia a typos)
    - `unaccent`: Ignorar acentos en las búsquedas

  2. Índices nuevos:
    - `procedures_name_trgm_idx`: Índice trigram sobre el nombre del trámite
    - `procedures_description_trgm_idx`: Índice trigram sobre la descripción

  3. Función `search_procedures(query text)`:
    - Búsqueda multi-criterio con ranking inteligente:
      - Coincidencia exacta de nombre (score 100)
      - Coincidencia por prefijo (score 80)
      - Coincidencia exacta sin acentos (score 100)
      - Prefijo sin acentos (score 75)
      - Full-text search con ts_rank (score 50+)
      - Similitud trigram en nombre (hasta 45)
      - Similitud trigram en descripción (hasta 25)
    - Retorna hasta 8 resultados ordenados por relevancia
    - Incluye trámites relacionados de la misma institución
*/

-- Eliminar función anterior si existe
DROP FUNCTION IF EXISTS public.search_procedures(text);

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Índices trigram para búsqueda difusa
CREATE INDEX IF NOT EXISTS procedures_name_trgm_idx
  ON public.procedures
  USING gin (lower(name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS procedures_description_trgm_idx
  ON public.procedures
  USING gin (lower(coalesce(description, '')) gin_trgm_ops);

-- Función de búsqueda mejorada
CREATE OR REPLACE FUNCTION public.search_procedures(query text)
RETURNS TABLE (
  id integer,
  procedure_name text,
  procedure_description text,
  full_description text,
  category text,
  subcategory text,
  institution_id integer,
  institution_name text,
  related_procedures jsonb
)
LANGUAGE sql
STABLE
AS $$
  WITH q AS (
    SELECT
      lower(coalesce(query, '')) AS raw,
      unaccent(lower(coalesce(query, ''))) AS normalized,
      plainto_tsquery('spanish', coalesce(query, '')) AS tsq
  ),
  ranked AS (
    SELECT
      p.*,
      greatest(
        CASE WHEN lower(p.name) = q.raw THEN 100 ELSE 0 END,
        CASE WHEN lower(p.name) LIKE q.raw || '%' THEN 80 ELSE 0 END,
        CASE WHEN unaccent(lower(p.name)) = q.normalized THEN 100 ELSE 0 END,
        CASE WHEN unaccent(lower(p.name)) LIKE q.normalized || '%' THEN 75 ELSE 0 END,
        CASE WHEN p.search_vector @@ q.tsq THEN 50 + ts_rank(p.search_vector, q.tsq) ELSE 0 END,
        similarity(unaccent(lower(p.name)), q.normalized) * 45,
        similarity(unaccent(lower(coalesce(p.description, ''))), q.normalized) * 25
      ) AS score
    FROM public.procedures p
    CROSS JOIN q
    WHERE
         p.name ILIKE '%' || q.raw || '%'
      OR coalesce(p.description, '') ILIKE '%' || q.raw || '%'
      OR p.search_vector @@ q.tsq
      OR unaccent(lower(p.name)) % q.normalized
      OR unaccent(lower(coalesce(p.description, ''))) % q.normalized
  )
  SELECT
    p.id,
    p.name AS procedure_name,
    p.description AS procedure_description,
    p.full_description,
    p.category,
    p.subcategory,
    p.institution_id,
    i.name AS institution_name,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p2.id,
          'name', p2.name
        )
      )
      FROM public.procedures p2
      WHERE
        p2.institution_id = p.institution_id
        AND p2.id <> p.id
    ) AS related_procedures
  FROM ranked p
  LEFT JOIN public.institutions i
    ON i.id = p.institution_id
  WHERE p.score > 0
  ORDER BY p.score DESC, p.name ASC
  LIMIT 8;
$$;
