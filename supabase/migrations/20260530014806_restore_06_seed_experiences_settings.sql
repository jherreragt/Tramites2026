/*
  # Restauración - Paso 6: Insertar experiences y site_settings
*/

-- Experiences (8 registros del dump)
INSERT INTO public.experiences (id, nombre, descripcion, icon, color, categoria, duracion_estimada, ids_procedures, pasos_adicionales, created_at, updated_at) VALUES
(2, 'Quiero Abrir una Panadería', 'Todos los trámites necesarios para abrir y operar legalmente una panadería en Guatemala', 'Store', 'from-blue-500 to-blue-700', 'Emprendimiento', '35-45 días', '{1,2,3,5}', '{"Buscar y evaluar local comercial adecuado","Elaborar plan de negocios y presupuesto","Adquirir equipo de panadería","Contratar personal capacitado","Realizar pruebas de productos antes de apertura"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(3, 'Quiero Formalizar mi Negocio', 'Pasos para constituir legalmente tu empresa y empezar a operar de forma formal', 'Briefcase', 'from-blue-500 to-blue-700', 'Negocios', '10-15 días', '{7,8,9}', '{"Definir el tipo de empresa (individual o sociedad)","Preparar documentación legal requerida","Abrir cuenta bancaria empresarial","Establecer sistema contable","Consultar con contador para obligaciones fiscales"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(4, 'Quiero Exportar mis Productos', 'Proceso completo para obtener permisos y certificaciones necesarias para exportar', 'Plane', 'from-blue-500 to-blue-700', 'Comercio Exterior', '5-10 días', '{14,15,16}', '{"Investigar mercados objetivo y requisitos del país destino","Identificar productos a exportar","Contratar agente aduanal certificado","Establecer logística de transporte","Preparar empaque y etiquetado"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(5, 'Quiero Contratar Empleados', 'Trámites laborales necesarios para contratar personal de manera formal y legal', 'Users', 'from-blue-500 to-blue-700', 'Recursos Humanos', '7-10 días', '{10,18,19}', '{"Definir perfiles de puesto y salarios","Elaborar contratos de trabajo","Establecer políticas internas","Implementar sistema de registro de asistencia"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(6, 'Quiero Construir mi Casa', 'Permisos y licencias necesarias para construir tu vivienda de forma legal', 'Home', 'from-blue-500 to-blue-700', 'Construcción', '35-40 días', '{11,12,13}', '{"Contratar arquitecto o ingeniero colegiado","Elaborar diseño arquitectónico","Verificar uso de suelo permitido","Obtener presupuesto de construcción"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(7, 'Quiero Estudiar en la USAC', 'Proceso completo de admisión para ingresar a la Universidad de San Carlos', 'GraduationCap', 'from-blue-500 to-blue-700', 'Educación', 'Variable', '{20,21,22}', '{"Revisar oferta académica","Verificar fechas de admisión","Prepararse para las pruebas de conocimiento","Reunir documentación académica"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(8, 'Quiero Proteger mi Marca', 'Registro de marca para proteger el nombre o logo de tu negocio', 'Award', 'from-blue-500 to-blue-700', 'Propiedad Intelectual', '30 días', '{6}', '{"Realizar búsqueda de antecedentes","Diseñar logo profesional","Definir clases de productos","Monitorear publicación en diario oficial"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00'),
(9, 'Iniciar Negocio con Empleados', 'Ruta completa para establecer un negocio formal con personal contratado', 'Building2', 'from-blue-500 to-blue-700', 'Emprendimiento Formal', '20-30 días', '{1,2,7,8,9,10,18}', '{"Elaborar plan de negocios completo","Definir estructura organizacional","Establecer políticas de RRHH","Implementar sistema de nómina"}', '2026-04-28 03:22:55.048983+00', '2026-04-28 03:22:55.048983+00')
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.experiences_id_seq', COALESCE((SELECT MAX(id) FROM public.experiences), 1));

-- Site settings (fila única)
INSERT INTO public.site_settings (id, google_analytics_id, updated_at)
VALUES (1, NULL, '2026-04-24 17:08:35.974063+00')
ON CONFLICT (id) DO NOTHING;
