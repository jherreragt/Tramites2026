/*
  # Agregar columna deleted_at a tabla observatory

  Permite el soft-delete de registros del observatorio, consistente
  con el patrón usado en la tabla procedures.
*/

ALTER TABLE observatory
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Índice para filtrar rápidamente los no eliminados
CREATE INDEX IF NOT EXISTS idx_observatory_deleted_at ON observatory(deleted_at);
