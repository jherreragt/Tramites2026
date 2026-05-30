/*
  # Agregar columna deleted_at a tabla observatory

  Permite el soft-delete de registros del observatorio, consistente
  con el patrón usado en la tabla procedures.

  1. Cambios:
    - Agrega columna deleted_at (timestamptz, default NULL) a observatory
    - Crea índice idx_observatory_deleted_at para filtrado eficiente
*/

ALTER TABLE observatory
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_observatory_deleted_at ON observatory(deleted_at);
