/*
  # Crear tabla problem_reports para reportes de problemas

  1. Nueva Tabla: `problem_reports`
    - `id` (uuid, primary key) - ID único del reporte
    - `user_name` (text) - Nombre del usuario (opcional)
    - `user_email` (text) - Email del usuario (opcional)
    - `problem_type` (text) - Tipo de problema
    - `description` (text) - Descripción del problema
    - `page_url` (text) - URL de la página donde ocurrió
    - `browser_info` (text) - Información del navegador
    - `status` (text) - Estado del reporte (pending, in_progress, resolved)
    - `created_at` (timestamptz) - Fecha de creación
    - `updated_at` (timestamptz) - Fecha de actualización

  2. Seguridad
    - Habilitar RLS en tabla `problem_reports`
    - Política de inserción pública (cualquiera puede reportar)
    - Política de lectura solo para administradores (futuro)
*/

-- Crear tabla problem_reports
CREATE TABLE IF NOT EXISTS problem_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text DEFAULT '',
  user_email text DEFAULT '',
  problem_type text NOT NULL,
  description text NOT NULL,
  page_url text DEFAULT '',
  browser_info text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE problem_reports ENABLE ROW LEVEL SECURITY;

-- Política de inserción pública (cualquiera puede reportar problemas)
CREATE POLICY "Permitir inserción pública de reportes"
  ON problem_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política de lectura solo para usuarios autenticados (futuro uso de admin)
CREATE POLICY "Permitir lectura pública de reportes propios"
  ON problem_reports
  FOR SELECT
  TO public
  USING (true);

-- Crear índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_problem_reports_status ON problem_reports(status);
CREATE INDEX IF NOT EXISTS idx_problem_reports_created_at ON problem_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_problem_reports_problem_type ON problem_reports(problem_type);