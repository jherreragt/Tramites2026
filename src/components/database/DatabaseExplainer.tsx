import {
  Database,
  FileSpreadsheet,
  Building2,
  ScrollText,
  BarChart3,
  Map,
  ArrowDownToLine,
  Shield,
  RefreshCw,
  GitBranch,
  Info,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import DataFlowDiagram from './DataFlowDiagram';
import DataSourceCard from './DataSourceCard';

const dataSources = [
  {
    icon: Building2,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    title: 'Instituciones',
    subtitle: 'Entidades gubernamentales',
    file: 'src/data/institutions.ts',
    format: 'TypeScript',
    fields: ['nombre', 'nombre_completo', 'descripcion', 'sitio_web', 'telefono', 'email', 'direccion', 'horario', 'servicios'],
    recordCount: 40,
    description: 'Catalogo de instituciones publicas de Guatemala con informacion de contacto, direccion, horarios y servicios que ofrecen.',
  },
  {
    icon: ScrollText,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    title: 'Tramites',
    subtitle: 'Procedimientos gubernamentales',
    file: 'src/data/procedures.ts',
    format: 'TypeScript',
    fields: ['nombre', 'descripcion', 'categoria', 'duracion', 'tipo', 'requisitos', 'pasos', 'costo', 'enlace'],
    recordCount: 22,
    description: 'Informacion detallada de tramites gubernamentales incluyendo requisitos, pasos, costos estimados y enlaces a portales oficiales.',
  },
  {
    icon: BarChart3,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
    title: 'Observatorio',
    subtitle: 'Evaluaciones de madurez digital',
    file: 'src/data/observatory.ts',
    format: 'TypeScript',
    fields: ['tramite', 'en_linea', 'firma_electronica', 'num_pasos', 'num_requisitos', 'nivel_madurez', 'puntaje'],
    recordCount: 22,
    description: 'Evaluaciones de madurez digital y eficiencia de cada tramite, basadas en indicadores de simplificacion y digitalizacion.',
  },
  {
    icon: Map,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    title: 'Experiencias Guiadas',
    subtitle: 'Rutas de tramites por objetivo',
    file: 'src/data/experiences.json',
    format: 'JSON',
    fields: ['nombre', 'descripcion', 'categoria', 'duracion_estimada', 'ids_tramites', 'pasos_adicionales'],
    recordCount: 8,
    description: 'Agrupaciones de tramites organizadas por objetivos ciudadanos como abrir un negocio, registrar un vehiculo, entre otros.',
  },
];

const layerDetails = [
  {
    icon: FileSpreadsheet,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title: 'Archivos CSV originales',
    description:
      'Red Ciudadana recopila la informacion de tramites e instituciones en hojas de calculo (CSV). Estos archivos son la fuente primaria de datos y se actualizan periodicamente conforme cambian los procedimientos gubernamentales.',
  },
  {
    icon: ArrowDownToLine,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'Conversion a TypeScript y JSON',
    description:
      'Los datos CSV se transforman en archivos TypeScript (.ts) y JSON (.json) con interfaces tipadas. Esto permite validacion en tiempo de compilacion, autocompletado y deteccion de errores antes de que el codigo llegue al usuario.',
  },
  {
    icon: GitBranch,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    title: 'Capa de servicios',
    description:
      'El archivo lib/data.ts contiene funciones de servicio que consultan, filtran y transforman los datos. Los hooks de React (useProcedures, useInstitutions, useObservatory, useExperiences) exponen estos datos a los componentes de forma reactiva.',
  },
  {
    icon: RefreshCw,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    title: 'Actualizacion y mantenimiento',
    description:
      'Cuando hay cambios en los tramites gubernamentales, el equipo de Red Ciudadana actualiza los CSV fuente, regenera los archivos tipados y despliega la nueva version. Las migraciones SQL en Supabase documentan la estructura historica de la base de datos.',
  },
];

export default function DatabaseExplainer() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {isEs ? 'Base de Datos' : 'Database'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {isEs
              ? 'Como se conecta la plataforma con los datos de tramites e instituciones, desde los archivos CSV hasta la interfaz que ve el ciudadano.'
              : 'How the platform connects with procedure and institution data, from CSV files to the interface the citizen sees.'}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 p-6 md:p-8 mb-10">
          <div className="flex items-start gap-3 mb-6">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-1">
                {isEs ? 'Resumen general' : 'General overview'}
              </h2>
              <p className="text-sm text-blue-800 leading-relaxed">
                {isEs
                  ? 'La plataforma consume datos estaticos derivados de archivos CSV que el equipo de Red Ciudadana mantiene. Estos archivos se convierten a TypeScript y JSON tipados, lo que garantiza la integridad de los datos. No se usa una base de datos en tiempo real para lectura; la informacion se empaqueta junto con la aplicacion para maxima velocidad y disponibilidad sin depender de un servidor externo.'
                  : 'The platform consumes static data derived from CSV files that the Red Ciudadana team maintains. These files are converted to typed TypeScript and JSON, ensuring data integrity. No real-time database is used for reading; information is bundled with the application for maximum speed and availability without depending on an external server.'}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-400" />
            {isEs ? 'Flujo de datos' : 'Data flow'}
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <DataFlowDiagram />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-gray-400" />
            {isEs ? 'Fuentes de datos' : 'Data sources'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dataSources.map((source) => (
              <DataSourceCard key={source.title} {...source} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-gray-400" />
            {isEs ? 'Capas de la arquitectura' : 'Architecture layers'}
          </h2>
          <div className="space-y-4">
            {layerDetails.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-5 rounded-xl border ${layer.border} ${layer.bg}`}
                >
                  <div className={`p-2.5 rounded-lg bg-white shadow-sm shrink-0`}>
                    <Icon className={`w-5 h-5 ${layer.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{layer.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{layer.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            {isEs ? 'Integridad y transparencia' : 'Integrity and transparency'}
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="bg-emerald-100 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {isEs ? 'Datos verificados' : 'Verified data'}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isEs
                    ? 'Cada registro es verificado contra fuentes oficiales del gobierno de Guatemala antes de ser publicado.'
                    : 'Each record is verified against official sources from the Guatemalan government before being published.'}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="bg-blue-100 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {isEs ? 'Actualizacion periodica' : 'Periodic updates'}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isEs
                    ? 'Los datos se revisan y actualizan periodicamente para reflejar cambios en procedimientos gubernamentales.'
                    : 'Data is reviewed and updated periodically to reflect changes in government procedures.'}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="bg-amber-100 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {isEs ? 'Codigo abierto' : 'Open source'}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isEs
                    ? 'La estructura de datos y el codigo fuente son abiertos, permitiendo a cualquier ciudadano verificar la informacion.'
                    : 'The data structure and source code are open, allowing any citizen to verify the information.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                {isEs ? 'Nota importante' : 'Important note'}
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                {isEs
                  ? 'Esta plataforma es un proyecto ciudadano desarrollado por Red Ciudadana. La informacion presentada es recopilada y organizada con fines informativos y de transparencia. No constituye informacion oficial del gobierno de Guatemala. Para informacion oficial, consulte directamente los portales de cada institucion.'
                  : 'This platform is a citizen project developed by Red Ciudadana. The information presented is collected and organized for informational and transparency purposes. It does not constitute official information from the Guatemalan government. For official information, please consult each institution\'s portal directly.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
