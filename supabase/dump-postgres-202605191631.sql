--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.0

-- Started on 2026-05-19 16:31:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 38 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3944 (class 0 OID 0)
-- Dependencies: 38
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 461 (class 1255 OID 18476)
-- Name: get_procedure_details(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_procedure_details(proc_id bigint) RETURNS TABLE(id bigint, name text, description text, institution_name text, category text, steps jsonb, requirements jsonb)
    LANGUAGE sql
    AS $$
SELECT
    p.id,
    p.name,
    p.description,
    i.name,
    p.category,
    to_jsonb(p.steps),
    to_jsonb(p.requirements)

FROM procedures p
LEFT JOIN institutions i
ON i.id = p.institution_id

WHERE p.id = proc_id;
$$;


ALTER FUNCTION public.get_procedure_details(proc_id bigint) OWNER TO postgres;

--
-- TOC entry 463 (class 1255 OID 17170)
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION public.rls_auto_enable() OWNER TO postgres;

--
-- TOC entry 491 (class 1255 OID 18447)
-- Name: search_experiences(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_experiences(query text) RETURNS TABLE(id bigint, nombre text, descripcion text, categoria text, duracion_estimada text, ids_procedures jsonb, pasos_adicionales jsonb, related_procedures jsonb)
    LANGUAGE sql
    AS $$
SELECT
  e.id,
  e.nombre,
  e.descripcion,
  e.categoria,
  e.duracion_estimada,
  to_jsonb(e.ids_procedures),
  to_jsonb(e.pasos_adicionales),

  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'name', p.name
      )
    )
    FROM procedures p
    WHERE p.id::text = ANY(e.ids_procedures)
  ) AS related_procedures

FROM experiences e

WHERE
to_tsvector(
    'spanish',
    coalesce(e.nombre,'') || ' ' ||
    coalesce(e.descripcion,'') || ' ' ||
    coalesce(e.categoria,'')
)
@@ plainto_tsquery('spanish', query)

OR e.nombre ILIKE '%' || query || '%'
OR e.descripcion ILIKE '%' || query || '%'

ORDER BY ts_rank(
    to_tsvector(
        'spanish',
        coalesce(e.nombre,'') || ' ' ||
        coalesce(e.descripcion,'')
    ),
    plainto_tsquery('spanish', query)
) DESC;

$$;


ALTER FUNCTION public.search_experiences(query text) OWNER TO postgres;

--
-- TOC entry 417 (class 1255 OID 18446)
-- Name: search_institutions(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_institutions(query text) RETURNS TABLE(id bigint, name text, description text, address text, phone text, website text)
    LANGUAGE sql
    AS $$
SELECT
  i.id,
  i.name,
  i.description,
  i.address,
  i.phone,
  i.website
FROM institutions i
WHERE
  i.name ILIKE '%' || query || '%'
  OR i.description ILIKE '%' || query || '%';
$$;


ALTER FUNCTION public.search_institutions(query text) OWNER TO postgres;

--
-- TOC entry 458 (class 1255 OID 18458)
-- Name: search_procedures(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_procedures(query text) RETURNS TABLE(id bigint, procedure_name text, procedure_description text, full_description text, category text, subcategory text, institution_id bigint, institution_name text, related_procedures jsonb)
    LANGUAGE sql
    AS $$

WITH principal AS (

SELECT
    p.*
FROM procedures p

WHERE
      p.name ILIKE '%'||query||'%'
   OR p.description ILIKE '%'||query||'%'
   OR p.search_vector @@ plainto_tsquery('spanish',query)

ORDER BY
CASE
    WHEN lower(p.name)=lower(query) THEN 100
    WHEN p.name ILIKE query||'%' THEN 50
    ELSE ts_rank(
        p.search_vector,
        plainto_tsquery('spanish',query)
    )
END DESC

LIMIT 1

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
'id',p2.id,
'name',p2.name
)
)
FROM procedures p2
WHERE
p2.institution_id=p.institution_id
AND p2.id<>p.id
) AS related_procedures

FROM principal p

LEFT JOIN institutions i
ON i.id=p.institution_id;

$$;


ALTER FUNCTION public.search_procedures(query text) OWNER TO postgres;

--
-- TOC entry 489 (class 1255 OID 17700)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 397 (class 1259 OID 18279)
-- Name: experiences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.experiences (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL,
    icon text DEFAULT 'Target'::text,
    color text DEFAULT 'from-blue-500 to-blue-700'::text,
    categoria text NOT NULL,
    duracion_estimada text,
    ids_procedures text[],
    pasos_adicionales text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.experiences OWNER TO postgres;

--
-- TOC entry 396 (class 1259 OID 18278)
-- Name: experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.experiences_id_seq OWNER TO postgres;

--
-- TOC entry 3953 (class 0 OID 0)
-- Dependencies: 396
-- Name: experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.experiences_id_seq OWNED BY public.experiences.id;


--
-- TOC entry 393 (class 1259 OID 18220)
-- Name: institutions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.institutions (
    id integer NOT NULL,
    name text NOT NULL,
    full_name text DEFAULT ''::text,
    description text DEFAULT ''::text,
    website text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    email text DEFAULT ''::text,
    address text DEFAULT ''::text,
    working_hours text DEFAULT ''::text,
    services text DEFAULT ''::text,
    is_digital_enabled boolean DEFAULT false,
    social_media text DEFAULT ''::text,
    contact_info jsonb DEFAULT '{}'::jsonb,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    category text
);


ALTER TABLE public.institutions OWNER TO postgres;

--
-- TOC entry 3955 (class 0 OID 0)
-- Dependencies: 393
-- Name: COLUMN institutions.category; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.institutions.category IS 'Categorias';


--
-- TOC entry 392 (class 1259 OID 18219)
-- Name: institutions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.institutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.institutions_id_seq OWNER TO postgres;

--
-- TOC entry 3957 (class 0 OID 0)
-- Dependencies: 392
-- Name: institutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.institutions_id_seq OWNED BY public.institutions.id;


--
-- TOC entry 386 (class 1259 OID 17842)
-- Name: observatory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observatory (
    id integer NOT NULL,
    tramite text NOT NULL,
    completamente_en_linea integer NOT NULL,
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
    evaluation_score integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT observatory_completamente_en_linea_check CHECK ((completamente_en_linea = ANY (ARRAY[0, 50, 100]))),
    CONSTRAINT observatory_evaluation_score_check CHECK (((evaluation_score >= 0) AND (evaluation_score <= 100)))
);


ALTER TABLE public.observatory OWNER TO postgres;

--
-- TOC entry 391 (class 1259 OID 18186)
-- Name: procedure_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedure_comments (
    id integer NOT NULL,
    procedure_id integer,
    user_id uuid NOT NULL,
    user_name text,
    comment text NOT NULL,
    rating integer,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT procedure_comments_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.procedure_comments OWNER TO postgres;

--
-- TOC entry 390 (class 1259 OID 18185)
-- Name: procedure_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procedure_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procedure_comments_id_seq OWNER TO postgres;

--
-- TOC entry 3961 (class 0 OID 0)
-- Dependencies: 390
-- Name: procedure_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procedure_comments_id_seq OWNED BY public.procedure_comments.id;


--
-- TOC entry 395 (class 1259 OID 18244)
-- Name: procedures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedures (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    full_description text DEFAULT ''::text,
    institution_id integer,
    category text NOT NULL,
    subcategory text DEFAULT ''::text,
    duration text NOT NULL,
    type text NOT NULL,
    is_digital boolean DEFAULT false,
    user_type text NOT NULL,
    requirements text DEFAULT ''::text,
    steps text DEFAULT ''::text,
    respaldo_legal text DEFAULT ''::text,
    enlace_respaldo_legal text DEFAULT ''::text,
    unidad_direccion text DEFAULT ''::text,
    fecha_actualizado date DEFAULT CURRENT_DATE,
    fecha_revision date DEFAULT CURRENT_DATE,
    codigo_moneda text,
    costo text,
    documento_obtenible text,
    enlace text,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    search_vector tsvector GENERATED ALWAYS AS (to_tsvector('spanish'::regconfig, ((((((COALESCE(name, ''::text) || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(category, ''::text)) || ' '::text) || COALESCE(subcategory, ''::text)))) STORED
);


ALTER TABLE public.procedures OWNER TO postgres;

--
-- TOC entry 394 (class 1259 OID 18243)
-- Name: procedures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procedures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procedures_id_seq OWNER TO postgres;

--
-- TOC entry 3964 (class 0 OID 0)
-- Dependencies: 394
-- Name: procedures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procedures_id_seq OWNED BY public.procedures.id;


--
-- TOC entry 387 (class 1259 OID 17976)
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id bigint DEFAULT 1 NOT NULL,
    google_analytics_id text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK ((id = 1))
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- TOC entry 389 (class 1259 OID 18171)
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    procedure_id integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_favorites OWNER TO postgres;

--
-- TOC entry 388 (class 1259 OID 18170)
-- Name: user_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorites_id_seq OWNER TO postgres;

--
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 388
-- Name: user_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_favorites_id_seq OWNED BY public.user_favorites.id;


--
-- TOC entry 3728 (class 2604 OID 18282)
-- Name: experiences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experiences ALTER COLUMN id SET DEFAULT nextval('public.experiences_id_seq'::regclass);


--
-- TOC entry 3700 (class 2604 OID 18223)
-- Name: institutions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institutions ALTER COLUMN id SET DEFAULT nextval('public.institutions_id_seq'::regclass);


--
-- TOC entry 3698 (class 2604 OID 18189)
-- Name: procedure_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_comments ALTER COLUMN id SET DEFAULT nextval('public.procedure_comments_id_seq'::regclass);


--
-- TOC entry 3714 (class 2604 OID 18247)
-- Name: procedures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures ALTER COLUMN id SET DEFAULT nextval('public.procedures_id_seq'::regclass);


--
-- TOC entry 3696 (class 2604 OID 18174)
-- Name: user_favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_favorites_id_seq'::regclass);


--
-- TOC entry 3938 (class 0 OID 18279)
-- Dependencies: 397
-- Data for Name: experiences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.experiences VALUES (2, 'Quiero Abrir una Panadería', 'Todos los trámites necesarios para abrir y operar legalmente una panadería en Guatemala', 'Store', 'from-blue-500 to-blue-700', 'Emprendimiento', '35-45 días', '{1,2,3,5}', '{"Buscar y evaluar local comercial adecuado","Elaborar plan de negocios y presupuesto","Adquirir equipo de panadería","Contratar personal capacitado","Realizar pruebas de productos antes de apertura"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (3, 'Quiero Formalizar mi Negocio', 'Pasos para constituir legalmente tu empresa y empezar a operar de forma formal', 'Briefcase', 'from-blue-500 to-blue-700', 'Negocios', '10-15 días', '{7,8,9}', '{"Definir el tipo de empresa (individual o sociedad)","Preparar documentación legal requerida","Abrir cuenta bancaria empresarial","Establecer sistema contable","Consultar con contador para obligaciones fiscales"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (4, 'Quiero Exportar mis Productos', 'Proceso completo para obtener permisos y certificaciones necesarias para exportar', 'Plane', 'from-blue-500 to-blue-700', 'Comercio Exterior', '5-10 días', '{14,15,16}', '{"Investigar mercados objetivo y requisitos del país destino","Identificar productos a exportar","Contratar agente aduanal certificado","Establecer logística de transporte","Preparar empaque y etiquetado"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (5, 'Quiero Contratar Empleados', 'Trámites laborales necesarios para contratar personal de manera formal y legal', 'Users', 'from-blue-500 to-blue-700', 'Recursos Humanos', '7-10 días', '{10,18,19}', '{"Definir perfiles de puesto y salarios","Elaborar contratos de trabajo","Establecer políticas internas","Implementar sistema de registro de asistencia"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (6, 'Quiero Construir mi Casa', 'Permisos y licencias necesarias para construir tu vivienda de forma legal', 'Home', 'from-blue-500 to-blue-700', 'Construcción', '35-40 días', '{11,12,13}', '{"Contratar arquitecto o ingeniero colegiado","Elaborar diseño arquitectónico","Verificar uso de suelo permitido","Obtener presupuesto de construcción"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (7, 'Quiero Estudiar en la USAC', 'Proceso completo de admisión para ingresar a la Universidad de San Carlos', 'GraduationCap', 'from-blue-500 to-blue-700', 'Educación', 'Variable', '{20,21,22}', '{"Revisar oferta académica","Verificar fechas de admisión","Prepararse para las pruebas de conocimiento","Reunir documentación académica"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (8, 'Quiero Proteger mi Marca', 'Registro de marca para proteger el nombre o logo de tu negocio', 'Award', 'from-blue-500 to-blue-700', 'Propiedad Intelectual', '30 días', '{6}', '{"Realizar búsqueda de antecedentes","Diseñar logo profesional","Definir clases de productos","Monitorear publicación en diario oficial"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');
INSERT INTO public.experiences VALUES (9, 'Iniciar Negocio con Empleados', 'Ruta completa para establecer un negocio formal con personal contratado', 'Building2', 'from-blue-500 to-blue-700', 'Emprendimiento Formal', '20-30 días', '{1,2,7,8,9,10,18}', '{"Elaborar plan de negocios completo","Definir estructura organizacional","Establecer políticas de RRHH","Implementar sistema de nómina"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00');


--
-- TOC entry 3934 (class 0 OID 18220)
-- Dependencies: 393
-- Data for Name: institutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.institutions VALUES (1, 'Registro Mercantil', '', 'Registro Mercantil de Guatemala - Inscripción de empresas y comerciantes', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (2, 'SAT', '', 'Superintendencia de Administración Tributaria - Administración de impuestos', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (3, 'MSPAS', 'Ministerio de Salud Pública y Asistencia Social', 'Insitución encargada formular las políticas y hacer cumplir la salud preventiva y curativa y a las acciones de protección, promoción, recuperación y rehabilitación de la salud física y mental de los habitantes del país y a la preservación higiénica de medio ambiente', 'https://www.mspas.gob.gt/index.php/servicios', '2444 7474', '', '6ta. Av. 3-45 zona 11, Guatemala', '8:00 hrs a 17:00 hrs', 'Ejercer la rectoría del Sector Salud con la participación social, para proveer servicios de atención integral a la población, con equidad y calidad mediante el funcionamiento de redes integradas de salud en sus tres niveles, con el uso eficiente y transparente de los recursos, para garantizar el derecho a la salud.', true, 'https://www.facebook.com/MinisteriodeSaludPublicayAsistenciaSocial/', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (4, 'MARN', 'Ministerio de Ambiente y Recursos Naturales', 'Institución encargada de proteger y fomentar los recursos, bienes y servicios naturales públicos. Tambien regula la gestion ambiental y el desarrollo sostenible.', 'http://www.marn.gob.gt', '24230500', 'rpublicas@marn.gob.gt', '7 avenida 03-67, zona 13, Ciudad Guatemala', '8:00 hrs a 16:30 hrs', 'Somos la institución que regula la gestión ambiental y promueve el desarrollo sostenible en Guatemala, de forma participativa.', true, 'https://www.facebook.com/marngtambiente/', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (5, 'Municipalidad de Guatemala', '', 'Municipalidad de Guatemala - Permisos y licencias municipales', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (6, 'Registro de la Propiedad Intelectual', '', 'Registro de la Propiedad Intelectual - Protección de marcas y patentes', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (7, 'IGSS', '', 'Instituto Guatemalteco de Seguridad Social - Seguridad social y salud', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (8, 'Municipalidad', '', 'Municipalidades de Guatemala - Permisos y licencias locales', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (9, 'Colegio de Ingenieros / Arquitectos', '', 'Colegio de Ingenieros y Arquitectos - Visado de planos profesionales', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (10, 'MINECO / VUPE', '', 'Ministerio de Economía - Ventanilla Única para las Exportaciones', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (11, 'SAT / Aduanas', '', 'SAT Aduanas - Declaraciones aduaneras y exportaciones', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (12, 'MAGA', 'Ministerio de Agricultura, Ganadería y Alimentación', 'Institución encargada de fomentar el desarrollo rural del sector agropecuario, forestal e hidrobiológico, a traves de la transformación y modernización de los medios productivos, organizactivos y comerciales.', 'http://web.maga.gob.gt', '24137000', '', '7a. Avenida 12-90 zona 13, edificio Monja Blanca', '8:00 hrs a 16:30 hrs', 'Somos una Institución del Estado, que fomenta el desarrollo rural integral a través de la transformación y modernización del sector agropecuario, forestal e hidrobiológico, desarrollando capacidades productivas, organizativas y comerciales para lograr la seguridad y soberanía alimentaria y competitividad con normas y regulaciones claras para el manejo de productos en el mercado nacional e internacional, garantizando la sostenibilidad de los recursos naturales.', true, 'https://www.facebook.com/maga.gt', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (13, 'MINTRAB', 'Ministerio de Trabajo y Previsión Social', 'Insitución que constituye la planificación, orientación, dirección y ejecución de la política laboral del país, con la colaboración de los distintos servicios y funcionarios de la rama administrativa de trabajo.', 'https://www.mintrabajo.gob.gt/', '24222501', '', '7 avenida 3-33 Zona 9 - Edificio Torre Empresarial', '9:00 hrs a 17:00 hrs', 'Ser un Ministerio Fortalecido, competente, moderno y confiable que promueva la cultura de respeto a la legislación laboral y el bienestar de la sociedad.', true, 'https://www.facebook.com/Mintrabajoguatemala/', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (14, 'USAC', '', 'Universidad de San Carlos de Guatemala - Educación superior pública', '', '', '', '', '', '', false, '', '{}', NULL, '2025-10-22 03:12:23.842422+00', '2025-10-22 03:12:23.842422+00', NULL);
INSERT INTO public.institutions VALUES (17, 'MICIVI', 'Ministerio de Comunicaciones, Infraestructura y Vivienda', 'Institución encargada de direccionar, reglamentar y representar los sectores de comunicaciones, insfraestructura y vivienda. Al giaul que el mantenimiento y desarrollo del sistema de transporte.', 'http://www.civ.gob.gt', '2223 4000', '', '8a Avenida y 15 calle zona 13, Guatemala', '9:00 hrs a 17:00 hrs', 'Ser el ente rector que direcciona, reglamenta y representa en el ámbito nacional a los sectores de comunicaciones, infraestructura y vivienda; ejecutando políticas y estrategias para integrar al país con servicios acorde al desarrollo social y económico de la nación, contribuyendo a mejorar la competitividad a través del ejercicio de una administración y control eficientes.', true, 'https://www.facebook.com/civguate/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (18, 'MCD', 'Ministerio de Cultura y Deportes', 'Institución encargada a la conservación y desarrollo de la cultura guatemalteca, y el cuidado de la autenticidad de sus diversas manifestaciones; la protección de los monumentos y de los edificios, instituciones y áreas de interés histórico o cultural y el impulso de la recreación y del deporte no federado ni escolar.', 'https://mcd.gob.gt/', '22395000', 'info@mcd.gob.gt', '6 calle y 6 avenida zona 1 Palacio Nacional', '9:00 hrs a 17:00 hrs', 'Fortalecemos y promovemos la identidad guatemalteca y la cultura de paz, en el marco de la diversidad cultural y el fomento de la interculturalidad, mediante la protección, promoción y divulgación de los valores y manifestaciones culturales de los pueblos que conforman la nación guatemalteca, a través de una institucionalidad solida y mediante mecanismos de desconcentración, descentralización, transparencia y participación ciudadana, a efecto de contribuir a lograr un mejor nivel de vida para la población guatemalteca.', true, 'https://www.facebook.com/CulturayDeportesGT/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (19, 'MINDEF', 'Ministerio de la Defensa Nacional', 'Institución encargada de formular politicas para el cumplimiento de la defensa de la soberanía nacional. Actua como ógano intermediario entre el ejercito y las demas instituciones del estado.', 'http://www.mindef.mil.gt', '44974051', 'dideprensa@gmail.com', 'Ave. Reforma 1-45 zona 10.', '---', 'La Dirección General Administrativa del Ministerio de la Defensa Nacional, tiene como misión: planificar, coordinar, dirigir y controlar las actividades administrativas del Ministerio de la Defensa Nacional. Recibir, analizar, sintetizar, tramitar, resolver, notificar, e informar sobre la correspondencia emitida y recibida del Estado Mayor de la Defensa Nacional y las diversas instituciones públicas y privadas. Llevar el control de las audiencias públicas y privadas del Señor Ministro de la Defensa Nacional. Efectuar el proceso de archivo de la correspondencia en general del Ministerio de la Defensa Nacional.', true, 'https://www.facebook.com/EjercitoGT/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (20, 'MIDES', 'Ministerio de Desarrollo Social', 'Institución encargada de generar políticas públicas para mejorar el nivel de vida de los grupos y personas vulnerables.', 'http://mides.gob.gt/webtwo/', '2300 5400', 'INFO@MIDES.GOB.GT', '5a. AV. 8-78 ZONA 9 GUATEMALA EDIFICIO PLAZA LAUDERDALE', '8:00 hrs a 16:30 hrs', 'El Ministerio de Desarrollo Social -Mides- es la entidad rectora que promueve y articula políticas y acciones para el desarrollo social sostenible de la población excluida de sus oportunidades básicas, con el fin de contribuir a mejorar sus condiciones de vida y reducir la pobreza.', true, 'https://www.facebook.com/Mides-Guatemala-1936605733288082/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (21, 'MINECO', 'Ministerio de Economía', 'Institución encargada de promover el desarrollo económico, creando empleos y oportunidades de inversión.', 'http://www.mineco.gob.gt/', '2412-0200', 'comunicacionsocial@mineco.gob.gt', '8a. Avenida 10-43 Zona 1 Ciudad de Guatemala', '8:00 hrs a 16:00 hrs', 'Ser la Dirección de apoyo al Viceministerio de Integración y Comercio Exterior en el diseño y negociación de acuerdos comerciales, así como en la promoción del adecuado desarrollo de la integración económica centroamericana y promover la expansión de la base exportable, para insertar a Guatemala en el contexto internacional y de la región centroamericana.', true, 'https://www.facebook.com/GUATEMINECO/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (22, 'MINEDUC', 'Ministerio de Educación', 'Institución encargada de generar oportunidades de enseñansa y aprendizaje.', 'http://www.mineduc.gob.gt/portal/index.asp', '24119595', 'info@mineduc.gob.gt', '6a. Calle 1-87 Zona 10', '9:00 hrs a 17:30 hrs', 'Somos una institución evolutiva, organizada, eficiente y eficaz, generadora de oportunidades de enseñanza-aprendizaje, orientada a resultados, que aprovecha diligentemente las oportunidades que el siglo XXI le brinda y comprometida con una Guatemala mejor.', true, 'https://www.facebook.com/MineducGuate/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (23, 'MEM', 'Ministerio de Energía y Minas', 'Institución encarga de regular los sectores de energía y minas, y fomentar el aprovechamiento adecuado de los recursos naturales', 'http://www.mem.gob.gt/', '2419 6464', '', 'Diagonal 17, 29-78 zona 11, Las Charcas', '8:00 hrs a 16:00 hrs', 'Propiciar y ejecutar las acciones que permitan la inversión destinada al aprovechamiento integral de los recursos naturales, que proveen bienes y servicios energéticos y mineros velando por los derechos de sus usuarios y de la sociedad en general.', true, 'https://www.facebook.com/MEMguatemala/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (24, 'MINFIN', 'Ministerio de Finanzas Públicas', 'Institución encarga de administrar los recursos financieros y patrimoniales del estado.', 'http://www.minfin.gob.gt/', '23743000', '', '8a. Avenida 20-59 Zona 1, Centro Cívico, Guatemala', '8:00 hrs a 16:30 hrs', 'Somos una institución que contribuye a la implementación de una política fiscal sostenible, mediante la gestión eficiente y transparente de los ingresos, los egresos y la deuda pública, para fortalecer el desarrollo social y el crecimiento económico nacional.', true, 'https://www.facebook.com/MinfinGT/', '{}', NULL, '2025-10-22 03:18:49.702422+00', '2025-10-22 03:18:49.702422+00', NULL);
INSERT INTO public.institutions VALUES (25, 'MINGOB', 'Ministerio de Gobernación', 'Institución encarga de generar polítcas relacionadas con el mantenimiento de la paz y orden público, al igual que la administración de los regímenes migratorios, penitenciares y los cuerpo de seguridad interna.', 'http://mingob.gob.gt/', '24138888', '', '6 avenida 13-71 zona 1, Guatemala, Guatemala', '9:00 hrs a 17:30 hrs', 'Institución rectora de las políticas relativas al mantenimiento de la paz, el orden público y la seguridad interior, que ejecuta las órdenes y resoluciones judiciales, administra los regímenes migratorio y penitenciario, conduce y regula los cuerpos de seguridad y cumple las funciones de gobernabilidad asignadas por la ley.', true, 'https://www.facebook.com/mingobguate/', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (26, 'MINEX', 'Ministerio de Relaciones Exteriores', 'Es el ente encargado de la formulación de las políticas y aplicación del régimen jurídico a las relaciones internacionales del Estado de Guatemala con otros Estados, siendo dependencia del Organismo Ejecutivo', 'https://www.minex.gob.gt/', '24100000', '', '2a Av. 4-17 zona 10, Ciudad de Guatemala', '8:00 hrs a 16:00 hrs', 'Es la institución del Estado a quien le corresponde bajo la dirección del Presidente de la República, la formulación de las políticas y la aplicación del régimen jurídico relativo a las relaciones del Estado de Guatemala con otros Estados y personas o instituciones jurídicas de derecho internacional, así como la representación diplomática del Estado, la nacionalidad guatemalteca y los asuntos diplomáticos y consulares.', true, 'https://www.facebook.com/minex.guatemala.9', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (29, 'SGP', 'Secretaría General de la Presidencia', 'Es el órgano responsable del apoyo jurídico y administrativo de carácter inmediato y constante del Presidente de la República.', 'https://sgp.gob.gt/', '23184600', 'libreacceso@sgp.gob.gt', '6av. 5-34 zona 1, Guatemala, Guatemala.', '9:00 hrs a 17:00 hrs', 'Somos un equipo de ciudadanos competentes y comprometidos, que brinda – el apoyo Jurídico y Administrativo al Despacho de la Presidencia de la República de Guatemala.', true, 'https://www.facebook.com/Secretar%C3%ADa-General-de-la-Presidencia-de-la-Rep%C3%BAblica-de-Guatemala-349783331764602/', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (30, 'SPP', 'Secretaría Privada de la Presidencia', 'Órgano que sirve de enlace en los asuntos que se dirijan al Presidente de la República de Guatemala, orientándolos conforme a su naturaleza, hacia distintas dependencias del Estado, cuya competencia les permite conocer los mismos.', 'http://www.secretariaprivada.gob.gt/index.html', '25026363', 'Informacion@secretariaprivada.gob.gt', '6ta avenida 4-46 zona 1', '9:00 hrs a 17:30 hrs', 'Somos la institución pública de apoyo directo a las funciones del Presidente Constitucional de la República, a través de la asistencia en asuntos privados y oficiales, los cuales trabajamos con eficiencia, discrecionalidad, transparencia, innovación, dinamismo y comunicación fluída, para la oportuna y precisa atención a los planteamientos presentados por la población y diversas instancias.', true, '', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (31, 'SCEP', 'Secretaría de Coordinación Ejecutiva de la Presidencia', 'Entidad pública comprometida con el desarrollo nacional, responsable de colaborar con el Presidente de la República en la coordinación, dirección y fortalecimiento del Sistema de Consejos de Desarrollo; y de la Descentralización del Organismo Ejecutivo, por medio de estrategias y métodos de trabajo para el cumplimento de sus objetivos.', 'https://www.scep.gob.gt/', '2210 4141', 'info@scep.gob.gt', '5ta. Avenida 6-06 Zona 1, Edificio IPM, 3er. y 4to. nivel Guatemala', '7:00 hrs a 15:30 hrs', 'Colaborar con el Presidente de la República de manera eficiente, eficaz y transparente en la coordinación del Sistema de Consejos de Desarrollo, la Descentralización del Organismo Ejecutivo y los mandatos Presidenciales, así como el seguimiento a las políticas públicas de desarrollo urbano y rural.', true, 'https://www.facebook.com/secretariaejecutiva.scep', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (32, 'SCSPR', 'Secretaría de Comunicación Social de la Presidencia', 'Órgano que tiene la función de servir como vínculo de información con los medios de comunicación social, y de formular, coordinar y ejecutar la política de comunicación del Gobierno de la República.', 'https://www.scspr.gob.gt/', '2339 2501', '', '6 Avenida y 6 Calle - Palacio Nacional de Ia Cultura, Patio de Ia Paz, 1', '9:00 hrs a 17:30 hrs', '', true, 'https://www.facebook.com/scsprgt/', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (33, 'SIE', 'Secretaría de Inteligencia Estratégica del Estado', 'Institución responsable de producir inteligencia en los campos estratégicos, respetando el ámbito de competencia de las demás instituciones del Sistema Nacional de Inteligencia.', 'https://www.sie.gob.gt/portal/', '22227500', 'contactos@sie.gob.gt', '7a. Ave. 3-54, Zona 1 Ciudad de Guatemala', '8:00 hrs a 16:30 hrs', 'Somos la institución civil responsable de producir inteligencia estratégica, para identificar y prevenir riesgos, amenazas y vulnerabilidades que afecten la consecución de los objetivos nacionales.', true, 'https://www.facebook.com/sie.gob.gt/', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (34, 'SEGEPLAN', 'Secretaría de Planificación y Programación de la Presidencia', 'Ente de planificación del Estado, que asesora y asiste técnicamente a las instituciones públicas y al Sistema de Consejos de Desarrollo, para vincular los procesos de políticas públicas, planificación y programación con el Plan y la Política Nacional de Desarrollo, así como de su debido seguimiento y evaluación.', 'https://www.segeplan.gob.gt/nportal/', '2504 4444', '', '9a. calle 10-44 zona 1, Guatemala, Guatemala.', '', '', true, 'https://www.facebook.com/SegeplanGT/', '{}', NULL, '2025-10-22 03:19:43.871983+00', '2025-10-22 03:19:43.871983+00', NULL);
INSERT INTO public.institutions VALUES (35, 'SAAS', 'Secretaría de Asuntos Administrativos y de Seguridad de la Presidencia de la República', 'Entidad permanente, con organización jerárquica y profesional, con especialidad en seguridad, y de naturaleza civil, cuyo régimen jurídico se determina su propia Ley Orgánica.', 'https://www.saas.gob.gt/', '23276000', 'reclutamiento@saas.gob.gt', '6 AV. "A" 4-18 ZONA 1 CALLEJÓN "DEL MANCHEN"', '--', 'Resguardar la legitimidad e institucionalidad democráticas del Estado de Guatemala, representadas por la Presidencia de la República, garantizando permanentemente la seguridad y el apoyo logístico y administrativo al Presidente y al Vicepresidente de la República y sus respectivas familias y la seguridad a los Ex presidentes y Ex vicepresidentes de la República.', true, '', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (36, 'SEPAZ', 'Secretaría de la Paz de la Presidencia de la República', 'Entidad desde su creación tiene como responsabilidad el apoyo, asesoría y coordinación para el cumplimiento de los compromisos gubernamentales de los Acuerdos de Paz de la Presidencia de la República.', 'https://sepaz.gob.gt/', '23224500', 'sepaz@sepaz.gob.gt', '17 Calle 8-36 zona 1, Ciudad de Guatemala', '8:30 hrs a 16:30 hrs', 'Somos la institución que coordina, asesora e incide en la formulación de políticas, planes y proyectos de la institucionalidad del Estado para el cumplimiento de los compromisos de los Acuerdos de Paz.', true, 'https://www.facebook.com/sepazgt', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (37, 'SBS', 'Secretaría de Bienestar Social de la Presidencia', 'Órgano administrativo que tiene a su cargo la formulación, coordinación y ejecución de las Políticas Públicas de Protección Integral de la Niñez y Adolescencia guatemalteca, contribuyendo al bienestar familiar y comunitario.', 'https://www.sbs.gob.gt/', '24143535', '', '32 calle 9-34 zona 11 las Charcas', '8:00 hrs a 16:30 hrs', 'Somos una institución especializada en la atención a la niñez y adolescencia vulnerada y amenazada en sus derechos, mediante programas y servicios de prevención, protección  integral, reinserción y resocialización a nivel nacional con equidad e igualdad.', true, 'https://www.facebook.com/somossbs/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (38, 'SEPREM', 'Secretaría Presidencial de la Mujer', 'Entidad asesora y coordinadora de políticas públicas para promover el desarrollo integral de las mujeres guatemaltecas y el fomento de una cultura democrática.', 'https://seprem.gob.gt/', '22079400', 'informacion@seprem.gob.gt', '4a. Calle 7-37 zona 1, Ciudad de Guatemala', '8:00 a 16:30 hrs', 'Institución gubernamental responsable de asesorar y coordinar acciones de política pública para institucionalizar en el Estado, la equidad entre hombres y mujeres.', true, 'https://www.facebook.com/SEPREM/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (39, 'SAA', 'Secretaría de Asuntos Agrarios de la Presidencia de la República', 'Entidad que define y conduce estrategias que faciliten la resolución de conflictos derivados de la propiedad, posesión o tenencia de la tierra, por la vía del diálogo, negociación y arbitraje.', 'http://portal.saa.gob.gt/', '23121200', 'info@saa.gob.gt', 'Avenida La Reforma 8-50, Guatemala', '08:00 AM a 16:30 hrs', 'Somos la institución del Organismo Ejecutivo rectora del tema agrario. Con énfasis en la articulación de la política agraria, así como la resolución y transformación de conflictos relativos a la tierra; contribuyendo con ello al desarrollo rural integral con pertinencia cultural y equidad de género.', true, 'https://www.facebook.com/SecretariaSAA/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (40, 'SESAN', 'Secretaría de Seguridad Alimentaria y Nutricional', 'órgano de coordinación del SINASAN, tiene la responsabilidad como dicho órgano, de concertar la operación interministerial del Plan Estratégico de Seguridad Alimentaria y Nutricional. Asimismo tiene que organizar aquellos programas y proyectos que realizan otras instituciones gubernamentales en dicha materia. La SESAN obedece y ejecuta las directrices y  lineamientos trazados por el Consejo Nacional de Seguridad Alimentaria y Nutricional (CONASAN), también tiene la demanda de presentar las políticas concernientes a su materia a dicho rector del SINASAN, para su aprobación.', 'http://www.sesan.gob.gt/', '24111900', '', '8A Avenida 13-06, Zona 1', '8:00 a 16:30 hrs', 'Ser  la institución responsable de la  coordinación, integración y monitoreo de intervenciones de seguridad alimentaria y nutricional entre sector público, sociedad y organismos de cooperación internacional para optimizar los esfuerzos y recursos, con el fin de lograr un mayor impacto en el país.', true, 'https://www.facebook.com/Sesangt/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (41, 'SENACYT', 'Secretaría Nacional de Ciencia y Tecnología', 'Órgano que constituye el marco general para la orientación de las actividades científicas y tecnológicas en la República de Guatemala.', 'https://www.senacyt.gob.gt/portal/', '23172600', 'infosenacyt@senacyt.gob.gt', '3av. 13-28 Zona 1,', '8:00 a 16:30 hrs', '', true, 'https://www.facebook.com/senacyt/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (42, 'SOSEP', 'Secretaría de Obras Sociales de la Esposa del Presidente de la República', 'Organismo encargado de impulsar e implementar programas de carácter social que beneficien a los niños, las niñas, las familias y la comunidad en general.', 'http://www.sosep.gob.gt/', '23276000', 'uip@sosep.gob.gt', '6TA. AVENIDA 4-65 ZONA 1, PUERTA NO. 1 CASA PRESIDENCIAL GUATEMALA', '8:00 a 16:30 hrs', 'Contribuir a desarrollo integral de las familias en condición de pobreza y pobreza extrema, especialmente del área rural, mediante la implementación de acciones en salud, educación, promoción del desarrollo económico comunitario y seguridad alimentaria y nutricional, para lograr una nueva generación de guatemaltecas y guatemaltecos sanos, con mayores oportunidades para alcanzar mejor calidad de vida.', true, 'https://www.facebook.com/sosepguatemala', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (43, 'SENABED', 'Secretaría Nacional de Administración de Bienes en Extinción', 'Entidad guatemalteca adscrita y dependiente de la Vicepresidencia de la República, la cual vela por la correcta administración de todos los bienes que tenga bajo su responsabilidad y los declarados en extinción del dominio en aplicación con el Decreto 55-2010 del Congreso de la República, Ley de Extinción de Dominio.', 'https://www.senabed.gob.gt/', '24950600', '', 'Diagonal 6, 10-26 Zona 10', '8:00 a 16:30 hrs', 'Administrar los bienes de interés económico para el Estado, sujetos a la acción de extinción de dominio y los declarados en extinción de dominio por los órganos jurisdiccionales competentes.', true, 'https://www.facebook.com/senabedguatemala/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (44, 'SVET', 'Secretaría contra la Violencia sexual Explotación y Trata de Personas', 'Institución referente en la reducción de los delitos contra la violencia sexual, explotación y trata de personas. Ente rector, articulador y asesor en Guatemala para la prevención, atención, persecución y sanción de los delitos de violencia sexual, explotación y trata de personas.', 'http://www.svet.gob.gt/', '25048888', 'svet@vicepresidencia.gob.gt', '4a. Calle 5-51, zona 1', '8:00 a 16:30 hrs', 'Somos el ente rector, articulador y asesor en Guatemala para la prevención, atención persecución y sanación de los delitos de violencia sexual, explotación y trata de personas.', true, 'https://www.facebook.com/secretariasvet/', '{}', NULL, '2025-10-22 03:20:35.555422+00', '2025-10-22 03:20:35.555422+00', NULL);
INSERT INTO public.institutions VALUES (45, 'PRUEBA 2', 'PRUEBA 2', 'PRUEBA 2', 'https://tramites.redciudadana.org/catalogo', '55831667', 'ptzulr@miumg.edu.gt', '11 AV 8 83, Zona 19', '8:00 a 17:00', 'PRUEBA 2', true, '[{"platform":"Facebook","url":"https://www.linkedin.com/in/pablo-daniel-tzul-raxhon-576357229/"}]', '{}', '2026-05-05 05:58:10.796+00', '2026-05-05 04:01:43.693479+00', '2026-05-05 04:01:43.693479+00', 'PRUEBA');


--
-- TOC entry 3927 (class 0 OID 17842)
-- Dependencies: 386
-- Data for Name: observatory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.observatory VALUES (1, 'Registro de Nombre Comercial (RPI)', 50, 'Sí (portal acepta adjuntos)', 'Parcial (firma opcional)', 'Parcial (solicitud en línea, certificado físico)', 4, '1 formulario + pagos', 'No (no solicita docs propios)', 'No (no exige juramentos)', 'No (usuario aporta info)', 'No (portal RPI propio)', 'No (no indica uso)', 'Sí (eConsulta RPI)', 'Sí (notificación electrónica)', 'Sí (guías en web)', 'Sí (oficinas RPI)', 'No (solo español)', 'N/D (No hay datos)', 'Sí (requisitos ley PI)', 'Sí (Ley PI vigente)', 'Parcial (requiere copias legalizadas)', 2.8, 56, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (2, 'Inscripción al NIT (SAT)', 100, 'Sí (posible cargar DPI)', 'No (sin FEA)', 'Sí (NIT asignado en portal)', 3, '2 (DPI, email)', 'No (no pide docs SAT previos)', 'No (sin juramentos)', 'No (usuario provee datos)', 'No (portal SAT propio)', 'No (no se menciona)', 'N/A (asignación inmediata)', 'Sí (email confirmación)', 'Sí (SAT detalla en web)', 'Sí (agencias SAT físicas)', 'No (solo español)', 'N/D (No medido)', 'Sí (DPI según ley)', 'Sí (RTU digital vigente)', 'Sí (trámite simplificado)', 4.2, 84, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (3, 'Licencia Sanitaria (MAGA)', 0, 'No (se presenta físico)', 'No', 'No (licencia física)', 5, '5 docs (empresa)', 'No (no pide doc MAGA previo)', 'No', 'No (sin integración)', 'No (portal MAGA propio)', 'No', 'No (sin consulta web)', 'No (seguimiento manual)', 'Sí (detalles en catálogo)', 'Sí (oficinas MAGA)', 'No', 'N/D', 'Sí (basado en leyes)', 'Sí (reglamentos vigentes)', 'No (copias legalizadas requeridas)', 1.5, 30, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (4, 'Permiso Ambiental (MARN)', 50, 'Sí (SAGA adjunta EIA)', 'No (firma no integrada)', 'Parcial (resolución PDF)', 5, '~15 docs', 'Sí (pide licencias previas MARN)', 'No (sin juramentos extras)', 'Parcial (solicita opiniones)', 'Sí (VAC integra inst.)', 'No (plataforma propia)', 'Sí (seguimiento en SAGA)', 'Sí (alertas vía portal)', 'Sí (guías SAGA)', 'Parcial (ventanillas aún)', 'No', 'N/D', 'Sí (req. según ley ambiental)', 'Sí (RECSA reformado)', 'Parcial (acepta copias simples, pero trámites complejos)', 2.9, 58, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (5, 'Permiso Municipal Funcionamiento', 0, 'No (requiere gestión física)', 'No', 'No (licencia en papel)', 4, '~5 (DPI, patente, NIT, etc)', 'Sí (pide solvencia IUSI)', 'No', 'No (usuario lleva docs)', 'No (cada muni aparte)', 'No', 'No', 'No', 'Parcial (gral. info disponible)', 'Sí (oficinas municipales)', 'No', 'N/D', 'Sí (según ordenanzas locales)', 'Parcial (regs varían, actualizados)', 'No (pide docs ya emitidos por muni)', 1.3, 26, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (6, 'Registro de Marca (RPI)', 50, 'Sí (formularios en línea)', 'Parcial (firma opcional)', 'Parcial (certificado suele ser físico)', 4, '2 (solicitud, muestra marca)', 'No', 'No', 'No', 'No', 'No', 'Sí (eConsulta expedientes)', 'Sí (notif. electrónica)', 'Sí (portal RPI)', 'Sí (oficinas RPI)', 'No', 'N/D', 'Sí (Ley PI art. registro)', 'Sí (Ley PI vigente)', 'Parcial (procesos modernizándose)', 2.7, 54, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (7, 'Constitución de Empresa/Comerciante (Registro Mercantil)', 50, 'Sí (Sede Virtual permite PDF)', 'No (firma notarial física)', 'Parcial (patente descargable)', 5, '3 (Escritura, DPI, RTU)', 'No', 'No', 'No', 'No', 'No', 'Sí (estado en Sede Virtual)', 'Sí (email portal)', 'Sí (guías asisehace)', 'Sí (ventanilla física opcional)', 'No', 'N/D', 'Sí (Código Comercio)', 'Sí (Acuerdos actualizados)', 'Parcial (requiere entrega escritura)', 2.8, 56, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (8, 'Inscripción al RTU (SAT)', 100, 'Sí (adjunta escritura p/jurídicas)', 'No', 'Sí (NIT activo inmediato)', 3, '3-5 (depende tipo)', 'No', 'No', 'No', 'No', 'No', 'N/A (aprobación instantánea)', 'Sí (confirm. email)', 'Sí (guías SAT)', 'Sí (agencias SAT)', 'No', 'N/D', 'Sí (Código Tributario)', 'Sí (reglamento RTU digital)', 'Sí (simplificado en línea)', 4.1, 82, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (9, 'Licencia Municipal Funcionamiento', 0, 'No', 'No', 'No', 4, '~5 (DPI, patente, solvencias)', 'Sí (ej. solvencia IUSI)', 'No', 'No', 'No', 'No', 'No', 'No', 'Parcial (info general disponible)', 'Sí (oficinas muni)', 'No', 'N/D', 'Sí (según normativa muni)', 'Parcial (munis actualizan ordenanzas)', 'No (trámite burocrático tradicional)', 1.2, 24, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (10, 'Registro Patronal IGSS', 50, 'Sí (carga docs escaneados)', 'No', 'Parcial (número vía correo)', 3, '4 (DPI, escritura, RTU, form)', 'No', 'No', 'No', 'No', 'No', 'Parcial (consulta vía portal)', 'Sí (email confirmación)', 'Sí (PDF instructivo)', 'Sí (ventanillas IGSS)', 'No', 'N/D', 'Sí (Acuerdo JD IGSS)', 'Sí (reglamento vigente)', 'No (requiere copias legales)', 2.5, 50, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (11, 'Licencia de Construcción (Municipal)', 50, 'Sí (VAC permite planos digitales)', 'No (firmas planas físicas)', 'Parcial (resolución final en portal VAC)', 11, '≥10 (planos, título, dictámenes)', 'Sí (solvencia muni exigida)', 'No', 'Sí (VAC integra entes)', 'Sí (VAC opcional)', 'No (plataforma propia)', 'Sí (seguimiento en VAC)', 'Sí (alertas VAC)', 'Sí (portal VAC)', 'Parcial (canal físico previo)', 'No', 'N/D', 'Sí (Código construcción)', 'Sí (regl. actualizándose)', 'Parcial (ventanilla única agiliza)', 2.9, 58, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (12, 'Visado de Planos (Municipal)', 0, 'No', 'No', 'No', 5, '~3 (planos arq/estruc, título)', 'No (no docs muni previos)', 'No', 'No', 'No', 'No', 'No', 'No', 'Sí (requisitos publicados)', 'Sí (oficinas de planificación)', 'No', 'N/D', 'Sí (por código edilicio)', 'Parcial (normas locales vigentes)', 'No (proceso manual)', 1.4, 28, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (13, 'Solvencia IUSI (Municipal)', 0, 'No', 'No', 'No', 3, '2 (DPI, recibo pago)', 'N/A (es doc final)', 'No', 'No', 'No', 'No', 'N/A (se entrega al instante)', 'No (entrega física)', 'Parcial (info básica)', 'Sí (municipalidad)', 'No', 'N/D', 'Sí (req. por ordenanza)', 'Sí (normas vigentes)', 'No (usuario tramita certificado muni)', 1.3, 26, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (14, 'Registro de Exportador (VUPE)', 100, 'Sí (carga escrituras, etc)', 'No', 'Sí (código exportador vía web)', 5, '~3 (según tipo)', 'No', 'No', 'Sí (código a Aduanas SAT)', 'Sí (VUPE integra inst.)', 'No (sistema propio)', 'Sí (estado En revisión/Autorizado)', 'Sí (correo + llamada)', 'Sí (portal VUPE)', 'Parcial (asesoría presencial opcional)', 'No', 'N/D', 'Sí (base legal export)', 'Sí (normativa vigente)', 'Sí (trámite ágil en línea)', 4.0, 80, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (15, 'Declaración Aduanera (DUCA)', 100, 'Sí (adjunta docs según caso)', 'No', 'Sí (DUCA electrónica)', 3, '3 (factura, packing list, permisos)', 'No', 'No', 'Sí (info a aduana destino)', 'Sí (Sistema regional)', 'Parcial (SIECA integraciones)', 'Sí (tracking en sistema)', 'Sí (alertas Notifícame)', 'Sí (guías VUPE)', 'No (obligatorio online)', 'No', 'N/D', 'Sí (CAUCA/RECAUCA)', 'Sí (normativa 2019)', 'Sí (proceso unificado CA)', 4.3, 86, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (16, 'Certificado Fitosanitario (MAGA)', 50, 'Parcial (vía SEADEX/VUPE)', 'No', 'Parcial (e-Cert en sistema)', 6, '≤7 (form, insp., labs)', 'Sí (copia certif. MAGA)', 'No', 'Parcial (e-phyto intercambio)', 'Sí (SEADEX vía VUPE)', 'No', 'Sí (estados: En revisión, etc.)', 'Sí (notifica aprobación)', 'Sí (catálogo, MAGA anuncia)', 'Sí (ventanilla usuario MAGA)', 'No', 'N/D', 'Sí (según normas fitosanitarias)', 'Sí (IPPC eCert implementado)', 'No (tramite aún con pasos físicos)', 2.8, 56, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (17, 'Inscripción Patronal IGSS', 50, 'Sí (carga docs escaneados)', 'No', 'Parcial (número vía correo)', 3, '4 (DPI, escritura, RTU, form)', 'No', 'No', 'No', 'No', 'No', 'Parcial (consulta vía portal)', 'Sí (email confirmación)', 'Sí (PDF instructivo)', 'Sí (ventanillas IGSS)', 'No', 'N/D', 'Sí (Acuerdo JD IGSS)', 'Sí (reglamento vigente)', 'No (requiere copias legales)', 2.5, 50, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (18, 'Registro de Contratos (RECIT) (Mintrab)', 100, 'Sí (sube contrato escaneado)', 'No', 'Sí (constancia digital)', 6, '3 (nombramiento/RTU/contrato)', 'No', 'No', 'No', 'No', 'No', 'Sí (estatus en plataforma)', 'Sí (correo del sistema)', 'Sí (manuales y FAQ)', 'No (solo vía web)', 'No', 'N/D', 'Sí (art. 28-38 CT)', 'Sí (Acdo. 324-2019)', 'Sí (simplifica registro)', 4.0, 80, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (19, 'Libro de Salarios (Mintrab)', 100, 'N/A (carga solo RTU)', 'No', 'Sí (sello electrónico QR)', 8, '1 (RTU vigente)', 'No', 'No', 'Parcial (verif. RTU SAT)', 'No', 'No', 'Sí (estado en sistema)', 'Sí (notif. en sistema)', 'Sí (preguntas frecuentes)', 'No (solo en línea)', 'No', 'N/D', 'Sí (Art.102 CT)', 'Sí (Acdo. 124-2019)', 'Sí (elimina trámite físico)', 4.1, 82, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (20, 'Prueba Orientación Vocacional (USAC)', 50, 'N/A (form web sin adjuntos)', 'No', 'Parcial (cita impresa, resultado en portal)', 3, '0 (datos personales)', 'No', 'No', 'No', 'No', 'No', 'Sí (consulta asignación)', 'Sí (correo constancia)', 'Sí (pasos publicados)', 'No (proceso virtual obligatorio)', 'No', 'N/D', 'Sí (requisito académico)', 'Sí (normas USAC vigentes)', 'Sí (facilita asignación)', 3.2, 64, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (21, 'Pruebas Básicas de Admisión (USAC)', 50, 'N/A (registro en portal)', 'No', 'Parcial (resultado vía web)', 3, '0 (datos personales)', 'No', 'No', 'No', 'No', 'No', 'Sí (consulta notas en portal)', 'Sí (email convocatoria)', 'Sí (cronogramas en línea)', 'No (virtual obligatorio)', 'No', 'N/D', 'Sí (normas académicas)', 'Sí (reglamento admisión)', 'Sí (proceso centralizado)', 3.2, 64, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');
INSERT INTO public.observatory VALUES (22, 'Inscripción Académica (Universidad)', 50, 'Parcial (carga documentos escaneados)', 'No', 'Parcial (asignación carné por correo)', 4, '2 (Título bachiller, DPI)', 'No', 'No', 'No', 'No', 'No', 'Sí (estado de solicitud en portal)', 'Sí (correo de aceptación)', 'Sí (instructivos en web)', 'Parcial (soporte en campus)', 'No', 'N/D', 'Sí (requisitos legales: título)', 'Sí (normas actualizadas)', 'Parcial (acepta copias digitales temporales)', 2.9, 58, '2026-04-18 04:40:48.395721+00', '2026-04-18 04:40:48.395721+00');


--
-- TOC entry 3932 (class 0 OID 18186)
-- Dependencies: 391
-- Data for Name: procedure_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3936 (class 0 OID 18244)
-- Dependencies: 395
-- Data for Name: procedures; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.procedures VALUES (1, 'Registro de nombre comercial', 'Reserva de nombre y constitución del negocio', 'Reserva de nombre y constitución del negocio', 1, 'Negocios', 'Constitución de empresas', '3 días', 'Presencial', false, 'Emprendedor', 'DPI, formulario de inscripción', 'Llenar formulario, pagar arancel, esperar aprobación', 'Código de Comercio', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (2, 'Inscripción al NIT', 'Obtención del Número de Identificación Tributaria', 'Obtención del Número de Identificación Tributaria', 2, 'Negocios', 'Registro fiscal', '1 día', 'Digital', true, 'Emprendedor', 'DPI, constancia de domicilio', 'Ingresar a portal SAT, llenar formulario, descargar constancia', 'Código Tributario', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (3, 'Licencia sanitaria', 'Permiso para operar un establecimiento de alimentos', 'Permiso para operar un establecimiento de alimentos', 3, 'Salud', 'Licencias sanitarias', '10 días', 'Presencial', false, 'Emprendedor', 'Planos del local, constancia de fumigación, formulario', 'Solicitar inspección, presentar documentos, recibir licencia', 'Reglamento de Control Sanitario', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (4, 'Permiso ambiental', 'Evaluación ambiental para panaderías con impacto', 'Evaluación ambiental para panaderías con impacto', 4, 'Ambiente', 'Permisos ambientales', '15 días', 'Presencial', false, 'Emprendedor', 'Formulario ambiental, estudio técnico', 'Presentar estudio, esperar revisión, obtener resolución', 'Ley de Protección y Mejoramiento del Medio Ambiente', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (5, 'Permiso municipal de funcionamiento', 'Autorización para operar en el inmueble', 'Autorización para operar en el inmueble', 8, 'Municipal', 'Permisos comerciales', '5 días', 'Presencial', false, 'Emprendedor', 'Recibo de agua y luz, croquis, DPI', 'Presentar solicitud, pagar tasas, obtener permiso', 'Código Municipal', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (6, 'Registro de marca', 'Protección de nombre o logo comercial', 'Protección de nombre o logo comercial', 6, 'Propiedad Intelectual', 'Registro de marca', '30 días', 'Presencial', false, 'Emprendedor', 'Formulario, logotipo, comprobante de pago', 'Llenar solicitud, pagar, esperar publicación y resolución', 'Ley de Propiedad Industrial', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (7, 'Constitución de empresa o comerciante individual', 'Formalización del negocio en el Registro Mercantil', 'Formalización del negocio en el Registro Mercantil', 1, 'Negocios', 'Constitución', '5 días', 'Mixto', true, 'Emprendedor', 'Formulario, DPI, escritura de constitución, pago de arancel', 'Llenar formulario, pagar arancel, presentar documentación, obtener patente', 'Código de Comercio', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (8, 'Inscripción al RTU', 'Registro Tributario Unificado para obtener NIT', 'Registro Tributario Unificado para obtener NIT', 2, 'Fiscal', 'Registro', '1 día', 'Digital', true, 'Emprendedor', 'DPI, patente, constancia de domicilio', 'Ingresar al portal SAT, llenar formulario, descargar constancia', 'Código Tributario', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (9, 'Licencia municipal de funcionamiento', 'Permiso municipal para operar un negocio', 'Permiso municipal para operar un negocio', 5, 'Municipal', 'Licencias', '1 semana', 'Presencial', false, 'Emprendedor', 'Patente, NIT, uso de suelo, recibo de IUSI, DPI', 'Presentar solicitud, pagar tasa, inspección, obtener licencia', 'Código Municipal', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (10, 'Registro patronal IGSS', 'Inscripción del empleador en el IGSS', 'Inscripción del empleador en el IGSS', 7, 'Laboral', 'Afiliación patronal', '3 días', 'Digital', true, 'Empleador', 'Patente, NIT, DPI, lista de empleados', 'Ingresar al portal IGSS, llenar solicitud, adjuntar documentos, recibir número patronal', 'Ley Orgánica del IGSS', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (11, 'Licencia de construcción', 'Permiso para construir una vivienda', 'Permiso para construir una vivienda', 8, 'Construcción', 'Licencias', '30 días', 'Presencial', false, 'Propietario', 'Título de propiedad, planos aprobados, solvencia IUSI, DPI', 'Presentar solicitud, revisión técnica, inspección, pago de derechos, obtener licencia', 'Reglamento de Construcción y Urbanismo', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (12, 'Visado de planos', 'Revisión de planos por colegio profesional', 'Revisión de planos por colegio profesional', 9, 'Construcción', 'Planos', '2 días', 'Presencial', false, 'Propietario / Profesional', 'Planos firmados, timbres profesionales, DPI del responsable', 'Presentar planos, pagar timbres, obtener sello de visto bueno', 'Ley de Colegiación Profesional Obligatoria', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (13, 'Solvencia IUSI', 'Comprobante de estar al día con el impuesto inmobiliario', 'Comprobante de estar al día con el impuesto inmobiliario', 5, 'Fiscal', 'Solvencias', '1 día', 'Presencial', false, 'Propietario', 'Número de catastro, recibos de pago', 'Solicitar solvencia, pagar tasa, obtener certificado', 'Código Municipal', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (14, 'Registro de exportador', 'Obtención del código de exportador ante VUPE', 'Obtención del código de exportador ante VUPE', 10, 'Comercio exterior', 'Registro', '1 día', 'Digital', true, 'Exportador', 'RTU activo, DPI, pago Q92, formulario VUPE', 'Llenar solicitud en portal VUPE, pagar arancel, obtener código', 'Acuerdo Gubernativo 790-86', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (15, 'Declaración aduanera (DUCA)', 'Declaración de exportación ante SAT', 'Declaración de exportación ante SAT', 11, 'Aduanas', 'Exportaciones', 'Horas', 'Digital', true, 'Exportador', 'Factura comercial, contrato transporte, registro VUPE', 'Ingresar a SEADEX, llenar declaración, transmitir DUCA, obtener número de exportación', 'CAUCA y RECAUCA', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (16, 'Certificado fitosanitario', 'Certificación de productos agrícolas para exportación', 'Certificación de productos agrícolas para exportación', 12, 'Sanidad vegetal', 'Certificaciones', '3 días', 'Presencial', false, 'Exportador agrícola', 'Formulario, factura, inspección del producto', 'Solicitar inspección, pagar tarifa, obtener certificado', 'Ley de Sanidad Vegetal y Animal', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (17, 'Inscripción patronal IGSS', 'Registro de empleador ante el IGSS', 'Registro de empleador ante el IGSS', 7, 'Laboral', 'Afiliación patronal', '2 días', 'Digital', true, 'Empleador', 'RTU, patente, DPI, lista empleados', 'Ingresar al portal IGSS, llenar solicitud, adjuntar documentos', 'Ley Orgánica del IGSS', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (18, 'Registro de contratos RECIT', 'Registro de contratos laborales en el Ministerio de Trabajo', 'Registro de contratos laborales en el Ministerio de Trabajo', 13, 'Laboral', 'Contratos', '3 días', 'Digital', true, 'Empleador', 'Contrato firmado, DPI empleador y empleado', 'Ingresar a RECIT, cargar contrato, enviar solicitud, descargar constancia', 'Código de Trabajo y Acuerdo Ministerial 324-2019', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (19, 'Libro de salarios', 'Autorización del libro de salarios ante el Ministerio de Trabajo', 'Autorización del libro de salarios ante el Ministerio de Trabajo', 13, 'Laboral', 'Registros', '1 semana', 'Presencial', false, 'Empleador', 'Libro físico o electrónico, DPI, listado de empleados', 'Presentar libro, pagar tasa, recibir autorización', 'Código de Trabajo Art. 134', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (20, 'Prueba de orientación vocacional', 'Evaluación inicial de intereses y aptitudes', 'Evaluación inicial de intereses y aptitudes', 14, 'Educación', 'Admisión', '2 días', 'Digital', true, 'Estudiante', 'Nivel medio completo, pago boleta Q70', 'Inscribirse en portal USAC, pagar boleta, realizar prueba en línea', 'Reglamento de Admisión USAC', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (21, 'Pruebas básicas de admisión', 'Evaluación de conocimientos fundamentales', 'Evaluación de conocimientos fundamentales', 14, 'Educación', 'Admisión', 'Variable', 'Mixto', true, 'Estudiante', 'Tarjeta de orientación vocacional, inscripción en SUN', 'Registrarse en SUN, asignarse pruebas, presentarlas en fechas oficiales', 'Reglamento de Evaluaciones Académicas USAC', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (22, 'Inscripción académica', 'Registro formal del estudiante en la carrera', 'Registro formal del estudiante en la carrera', 14, 'Educación', 'Inscripción', '2 días', 'Presencial', false, 'Estudiante', 'Título de diversificado, certificado de notas, DPI, boletas de pago', 'Presentar documentos, llenar formularios, recibir número de carné', 'Reglamento de Inscripción USAC', '', '', '2025-10-21', '2025-10-21', NULL, NULL, NULL, NULL, NULL, '2025-10-22 03:13:14.827874+00', '2025-10-22 03:13:14.827874+00', DEFAULT);
INSERT INTO public.procedures VALUES (23, 'Prueba Pablo', 'Prueba Pablo', 'Prueba Pablo', 20, 'Educación', '', '3 dias', 'presencial', true, 'persona', '["DPI","NIT","PASAPORTE"]', '[{"title":"","description":"Presentar DPI"},{"title":"","description":"NIT Portal SAT"}]', 'Reglamento de Control Sanitario', 'https://comercioeinversionguate.gob.gt/detalle-documento-publico/2509/Acuerdo%20Gubernativo%20712-99.%20Reglamento%20para%20el%20Control%20Sanitario%20de%20los%20Medicamentos%20y%20Productos%20Afines./', 'Ministerio de Educación', '2026-05-05', '2026-05-05', 'GTQ', '25', NULL, 'https://tramites.gob.gt/servicio/1452/', '2026-05-05 05:52:35.471+00', '2026-05-05 03:43:41.446871+00', '2026-05-05 03:43:41.446871+00', DEFAULT);


--
-- TOC entry 3928 (class 0 OID 17976)
-- Dependencies: 387
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.site_settings VALUES (1, NULL, '2026-04-24 17:08:35.974063+00');


--
-- TOC entry 3930 (class 0 OID 18171)
-- Dependencies: 389
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 396
-- Name: experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.experiences_id_seq', 9, true);


--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 392
-- Name: institutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.institutions_id_seq', 45, true);


--
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 390
-- Name: procedure_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procedure_comments_id_seq', 1, false);


--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 394
-- Name: procedures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procedures_id_seq', 23, true);


--
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 388
-- Name: user_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_favorites_id_seq', 1, false);


--
-- TOC entry 3755 (class 2606 OID 18290)
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- TOC entry 3748 (class 2606 OID 18242)
-- Name: institutions institutions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_name_key UNIQUE (name);


--
-- TOC entry 3750 (class 2606 OID 18240)
-- Name: institutions institutions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (id);


--
-- TOC entry 3738 (class 2606 OID 17852)
-- Name: observatory observatory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observatory
    ADD CONSTRAINT observatory_pkey PRIMARY KEY (id);


--
-- TOC entry 3746 (class 2606 OID 18195)
-- Name: procedure_comments procedure_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_comments
    ADD CONSTRAINT procedure_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3752 (class 2606 OID 18263)
-- Name: procedures procedures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT procedures_pkey PRIMARY KEY (id);


--
-- TOC entry 3740 (class 2606 OID 17985)
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3742 (class 2606 OID 18177)
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 3744 (class 2606 OID 18179)
-- Name: user_favorites user_favorites_user_id_procedure_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_procedure_id_key UNIQUE (user_id, procedure_id);


--
-- TOC entry 3753 (class 1259 OID 18428)
-- Name: procedures_search_vector_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procedures_search_vector_idx ON public.procedures USING gin (search_vector);


--
-- TOC entry 3756 (class 2606 OID 18264)
-- Name: procedures procedures_institution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT procedures_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE SET NULL;


--
-- TOC entry 3917 (class 3256 OID 17988)
-- Name: site_settings Allow authenticated insert for settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated insert for settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 3916 (class 3256 OID 17987)
-- Name: site_settings Allow authenticated update for settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated update for settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- TOC entry 3925 (class 3256 OID 18330)
-- Name: institutions Allow public read access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access" ON public.institutions FOR SELECT USING (true);


--
-- TOC entry 3924 (class 3256 OID 18329)
-- Name: procedures Allow public read access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access" ON public.procedures FOR SELECT USING (true);


--
-- TOC entry 3915 (class 3256 OID 17986)
-- Name: site_settings Allow public read for settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read for settings" ON public.site_settings FOR SELECT USING (true);


--
-- TOC entry 3919 (class 3256 OID 18202)
-- Name: procedure_comments Anyone can view comments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view comments" ON public.procedure_comments FOR SELECT USING (true);


--
-- TOC entry 3920 (class 3256 OID 18203)
-- Name: procedure_comments Authenticated users can comment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can comment" ON public.procedure_comments FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 3923 (class 3256 OID 18291)
-- Name: experiences Enable all for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all for everyone" ON public.experiences USING (true);


--
-- TOC entry 3921 (class 3256 OID 18269)
-- Name: institutions Enable all for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all for everyone" ON public.institutions USING (true);


--
-- TOC entry 3922 (class 3256 OID 18270)
-- Name: procedures Enable all for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all for everyone" ON public.procedures USING (true);


--
-- TOC entry 3913 (class 3256 OID 17889)
-- Name: observatory Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.observatory FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 3914 (class 3256 OID 17890)
-- Name: observatory Enable update for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for authenticated users only" ON public.observatory FOR UPDATE TO authenticated USING (true);


--
-- TOC entry 3912 (class 3256 OID 17853)
-- Name: observatory Permitir lectura pública; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir lectura pública" ON public.observatory FOR SELECT USING (true);


--
-- TOC entry 3918 (class 3256 OID 18201)
-- Name: user_favorites Users can manage their own favorites; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their own favorites" ON public.user_favorites TO authenticated USING ((auth.uid() = user_id));


--
-- TOC entry 3911 (class 0 OID 18279)
-- Dependencies: 397
-- Name: experiences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3909 (class 0 OID 18220)
-- Dependencies: 393
-- Name: institutions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3905 (class 0 OID 17842)
-- Dependencies: 386
-- Name: observatory; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.observatory ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3908 (class 0 OID 18186)
-- Dependencies: 391
-- Name: procedure_comments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.procedure_comments ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3910 (class 0 OID 18244)
-- Dependencies: 395
-- Name: procedures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3906 (class 0 OID 17976)
-- Dependencies: 387
-- Name: site_settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3907 (class 0 OID 18171)
-- Dependencies: 389
-- Name: user_favorites; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3945 (class 0 OID 0)
-- Dependencies: 38
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 3946 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION get_procedure_details(proc_id bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_procedure_details(proc_id bigint) TO anon;
GRANT ALL ON FUNCTION public.get_procedure_details(proc_id bigint) TO authenticated;
GRANT ALL ON FUNCTION public.get_procedure_details(proc_id bigint) TO service_role;


--
-- TOC entry 3947 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION rls_auto_enable(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.rls_auto_enable() TO anon;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO authenticated;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO service_role;


--
-- TOC entry 3948 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION search_experiences(query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_experiences(query text) TO anon;
GRANT ALL ON FUNCTION public.search_experiences(query text) TO authenticated;
GRANT ALL ON FUNCTION public.search_experiences(query text) TO service_role;


--
-- TOC entry 3949 (class 0 OID 0)
-- Dependencies: 417
-- Name: FUNCTION search_institutions(query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_institutions(query text) TO anon;
GRANT ALL ON FUNCTION public.search_institutions(query text) TO authenticated;
GRANT ALL ON FUNCTION public.search_institutions(query text) TO service_role;


--
-- TOC entry 3950 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION search_procedures(query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_procedures(query text) TO anon;
GRANT ALL ON FUNCTION public.search_procedures(query text) TO authenticated;
GRANT ALL ON FUNCTION public.search_procedures(query text) TO service_role;


--
-- TOC entry 3951 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- TOC entry 3952 (class 0 OID 0)
-- Dependencies: 397
-- Name: TABLE experiences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.experiences TO anon;
GRANT ALL ON TABLE public.experiences TO authenticated;
GRANT ALL ON TABLE public.experiences TO service_role;


--
-- TOC entry 3954 (class 0 OID 0)
-- Dependencies: 396
-- Name: SEQUENCE experiences_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.experiences_id_seq TO anon;
GRANT ALL ON SEQUENCE public.experiences_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.experiences_id_seq TO service_role;


--
-- TOC entry 3956 (class 0 OID 0)
-- Dependencies: 393
-- Name: TABLE institutions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.institutions TO anon;
GRANT ALL ON TABLE public.institutions TO authenticated;
GRANT ALL ON TABLE public.institutions TO service_role;


--
-- TOC entry 3958 (class 0 OID 0)
-- Dependencies: 392
-- Name: SEQUENCE institutions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.institutions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.institutions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.institutions_id_seq TO service_role;


--
-- TOC entry 3959 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE observatory; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.observatory TO anon;
GRANT ALL ON TABLE public.observatory TO authenticated;
GRANT ALL ON TABLE public.observatory TO service_role;


--
-- TOC entry 3960 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE procedure_comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.procedure_comments TO anon;
GRANT ALL ON TABLE public.procedure_comments TO authenticated;
GRANT ALL ON TABLE public.procedure_comments TO service_role;


--
-- TOC entry 3962 (class 0 OID 0)
-- Dependencies: 390
-- Name: SEQUENCE procedure_comments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.procedure_comments_id_seq TO anon;
GRANT ALL ON SEQUENCE public.procedure_comments_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.procedure_comments_id_seq TO service_role;


--
-- TOC entry 3963 (class 0 OID 0)
-- Dependencies: 395
-- Name: TABLE procedures; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.procedures TO anon;
GRANT ALL ON TABLE public.procedures TO authenticated;
GRANT ALL ON TABLE public.procedures TO service_role;


--
-- TOC entry 3965 (class 0 OID 0)
-- Dependencies: 394
-- Name: SEQUENCE procedures_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.procedures_id_seq TO anon;
GRANT ALL ON SEQUENCE public.procedures_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.procedures_id_seq TO service_role;


--
-- TOC entry 3966 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE site_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.site_settings TO anon;
GRANT ALL ON TABLE public.site_settings TO authenticated;
GRANT ALL ON TABLE public.site_settings TO service_role;


--
-- TOC entry 3967 (class 0 OID 0)
-- Dependencies: 389
-- Name: TABLE user_favorites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_favorites TO anon;
GRANT ALL ON TABLE public.user_favorites TO authenticated;
GRANT ALL ON TABLE public.user_favorites TO service_role;


--
-- TOC entry 3969 (class 0 OID 0)
-- Dependencies: 388
-- Name: SEQUENCE user_favorites_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_favorites_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_favorites_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_favorites_id_seq TO service_role;


--
-- TOC entry 2451 (class 826 OID 16494)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2452 (class 826 OID 16495)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2450 (class 826 OID 16493)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2454 (class 826 OID 16497)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2449 (class 826 OID 16492)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2453 (class 826 OID 16496)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


-- Completed on 2026-05-19 16:31:42

--
-- PostgreSQL database dump complete
--

