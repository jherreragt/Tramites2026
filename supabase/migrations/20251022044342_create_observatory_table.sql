/*
  # Crear tabla observatory con datos de evaluación de trámites

  1. Nueva Tabla: `observatory`
    - `id` (integer, primary key) - ID único del registro
    - `tramite` (text) - Nombre del trámite
    - `completamente_en_linea` (integer) - Porcentaje de digitalización (0, 50, 100)
    - Campos adicionales de evaluación

  2. Seguridad
    - Habilitar RLS en tabla `observatory`
    - Política de lectura pública (datos del observatorio son públicos)
*/

-- Crear tabla observatory
CREATE TABLE IF NOT EXISTS observatory (
  id integer PRIMARY KEY,
  tramite text NOT NULL,
  completamente_en_linea integer NOT NULL CHECK (completamente_en_linea IN (0, 50, 100)),
  adjunta_docs_digitalmente text NOT NULL,
  firma_electronica_avanzada text NOT NULL,
  resultado_electronico text NOT NULL,
  num_pasos integer NOT NULL,
  num_requisitos text NOT NULL,
  docs_misma_entidad text NOT NULL,
  decl_jurada_innec text NOT NULL,
  intercambia_datos text NOT NULL,
  portal_interinst text NOT NULL,
  usa_xroad_api text NOT NULL,
  consulta_estado text NOT NULL,
  notificacion_electronica text NOT NULL,
  info_en_linea text NOT NULL,
  atencion_alterna text NOT NULL,
  multi_idioma text NOT NULL,
  calif_usuarios text NOT NULL,
  req_solo_por_ley text NOT NULL,
  normativa_vigente text NOT NULL,
  presuncion_buena_fe text NOT NULL,
  maturity_level numeric(3,1) NOT NULL,
  evaluation_score integer NOT NULL CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE observatory ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública para todos los usuarios
CREATE POLICY "Permitir lectura pública de datos del observatorio"
  ON observatory
  FOR SELECT
  TO public
  USING (true);

-- Crear índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_observatory_tramite ON observatory(tramite);
CREATE INDEX IF NOT EXISTS idx_observatory_score ON observatory(evaluation_score DESC);
CREATE INDEX IF NOT EXISTS idx_observatory_maturity ON observatory(maturity_level DESC);