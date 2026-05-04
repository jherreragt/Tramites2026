import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  MinusCircle,
  X,
  FileCheck,
  Shield,
  Link2,
  Bell,
  Info,
  Globe,
  UserCheck,
  Scale,
  BookOpen
} from 'lucide-react';
import { useObservatory, calculateStats, ObservatoryData } from '../../hooks/useObservatory';
import InfoTooltip from '../common/InfoTooltip';
import Breadcrumb from '../common/Breadcrumb';

export default function ObservatoryDashboard() {
  // All hooks must be called at the top level, unconditionally
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'digital' | 'partial' | 'none'>('all');
  const [selectedItem, setSelectedItem] = useState<ObservatoryData | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const { observatoryData, loading, error } = useObservatory();

  // Calculate stats from the loaded data - ALWAYS call these hooks
  const stats = useMemo(() => calculateStats(observatoryData), [observatoryData]);

  // ALWAYS call filteredData useMemo
  const filteredData = useMemo(() => {
    setIsFiltering(true);
    const filtered = observatoryData.filter(item => {
      if (selectedFilter === 'digital') return item.completamente_en_linea === 100;
      if (selectedFilter === 'partial') return item.completamente_en_linea === 50;
      if (selectedFilter === 'none') return item.completamente_en_linea === 0;
      return true;
    });
    setTimeout(() => setIsFiltering(false), 300);
    return filtered;
  }, [observatoryData, selectedFilter]);

  // Helper functions (not hooks)
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDigitalIcon = (value: number) => {
    if (value === 100) return <CheckCircle className="w-5 h-5 text-blue-600" />;
    if (value === 50) return <MinusCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del observatorio...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar datos</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Observatorio Ciudadano de Trámites' }]} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Observatorio Ciudadano de Trámites
                </h1>
                <InfoTooltip
                  text="El Observatorio evalúa el nivel de digitalización de los trámites gubernamentales usando 8 criterios diferentes, incluyendo procesos en línea, firma digital, y más."
                  position="right"
                />
              </div>
              <p className="text-gray-600">
                Evaluación de la digitalización y eficiencia de los procesos gubernamentales
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trámites</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProcedures}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completamente Digitales</p>
                <p className="text-3xl font-bold text-blue-600">{stats.digitalProcedures}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evaluación Promedio</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageEvaluation}%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trámites Excelentes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.excellentProcedures}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Filtrar por tipo de digitalización</h3>
            {isFiltering && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>Filtrando...</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({observatoryData.length})
            </button>
            <button
              onClick={() => setSelectedFilter('digital')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'digital'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Digitales 100% ({stats.digitalProcedures})
            </button>
            <button
              onClick={() => setSelectedFilter('partial')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'partial'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mixtos 50% ({stats.partialDigitalProcedures})
            </button>
            <button
              onClick={() => setSelectedFilter('none')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'none'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Presenciales ({stats.nonDigitalProcedures})
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                    Trámite
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Digitalización
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pasos
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Madurez
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluación
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{item.tramite}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.num_requisitos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        {getDigitalIcon(item.completamente_en_linea)}
                        <span className="text-sm font-medium">
                          {item.completamente_en_linea}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {item.num_pasos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        item.maturity_level >= 4.0 ? 'bg-blue-100 text-blue-800' :
                        item.maturity_level >= 3.0 ? 'bg-blue-100 text-blue-800' :
                        item.maturity_level >= 2.0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Number(item.maturity_level).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(item.evaluation_score)}`}>
                        {item.evaluation_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1 mx-auto"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver detalle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-8 bg-blue-50 rounded-xl p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Metodología de Evaluación</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Criterios Evaluados:</h4>
              <ul className="space-y-1">
                <li>• Completamente en línea (0%, 50%, 100%)</li>
                <li>• Adjunta documentos digitalmente</li>
                <li>• Firma electrónica avanzada</li>
                <li>• Resultado electrónico</li>
                <li>• Número de pasos y requisitos</li>
                <li>• Intercambio de datos entre entidades</li>
                <li>• Consulta de estado</li>
                <li>• Notificaciones electrónicas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Escala de Evaluación:</h4>
              <ul className="space-y-1">
                <li>• <strong>80-100:</strong> Excelente digitalización</li>
                <li>• <strong>60-79:</strong> Buena implementación digital</li>
                <li>• <strong>40-59:</strong> Digitalización parcial</li>
                <li>• <strong>0-39:</strong> Requiere modernización</li>
              </ul>
              <h4 className="font-semibold mt-4 mb-2">Nivel de Madurez:</h4>
              <ul className="space-y-1">
                <li>• <strong>4.0-5.0:</strong> Proceso maduro y optimizado</li>
                <li>• <strong>3.0-3.9:</strong> Proceso en desarrollo</li>
                <li>• <strong>2.0-2.9:</strong> Proceso básico</li>
                <li>• <strong>0-1.9:</strong> Proceso inicial</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

// Detail Modal Component
function DetailModal({ item, onClose }: { item: ObservatoryData; onClose: () => void }) {
  const indicators = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Completamente en Línea',
      value: `${item.completamente_en_linea}%`,
      color: item.completamente_en_linea === 100 ? 'text-blue-600' : item.completamente_en_linea === 50 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      label: 'Adjunta Documentos Digitalmente',
      value: item.adjunta_docs_digitalmente,
      color: item.adjunta_docs_digitalmente.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.adjunta_docs_digitalmente.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Firma Electrónica Avanzada',
      value: item.firma_electronica_avanzada,
      color: item.firma_electronica_avanzada.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.firma_electronica_avanzada.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Resultado Electrónico',
      value: item.resultado_electronico,
      color: item.resultado_electronico.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.resultado_electronico.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Número de Pasos',
      value: `${item.num_pasos} pasos`,
      color: item.num_pasos <= 3 ? 'text-blue-600' : item.num_pasos <= 5 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Número de Requisitos',
      value: item.num_requisitos,
      color: 'text-gray-700'
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      label: 'Docs de Misma Entidad',
      value: item.docs_misma_entidad,
      color: item.docs_misma_entidad.toLowerCase().startsWith('no') ? 'text-blue-600' : 'text-red-600'
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      label: 'Declaración Jurada Innecesaria',
      value: item.decl_jurada_innec,
      color: item.decl_jurada_innec.toLowerCase().startsWith('sí') ? 'text-blue-600' : 'text-red-600'
    },
    {
      icon: <Link2 className="w-5 h-5" />,
      label: 'Intercambia Datos',
      value: item.intercambia_datos,
      color: item.intercambia_datos.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.intercambia_datos.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Portal Interinstitucional',
      value: item.portal_interinst,
      color: item.portal_interinst.toLowerCase().startsWith('sí') ? 'text-blue-600' : 'text-red-600'
    },
    {
      icon: <Link2 className="w-5 h-5" />,
      label: 'Usa X-Road/API',
      value: item.usa_xroad_api,
      color: item.usa_xroad_api.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.usa_xroad_api.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Consulta Estado',
      value: item.consulta_estado,
      color: item.consulta_estado.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.consulta_estado.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notificación Electrónica',
      value: item.notificacion_electronica,
      color: item.notificacion_electronica.toLowerCase().startsWith('sí') ? 'text-blue-600' : 'text-red-600'
    },
    {
      icon: <Info className="w-5 h-5" />,
      label: 'Información en Línea',
      value: item.info_en_linea,
      color: item.info_en_linea.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.info_en_linea.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Atención Alternativa',
      value: item.atencion_alterna,
      color: item.atencion_alterna.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.atencion_alterna.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Multi-idioma',
      value: item.multi_idioma,
      color: item.multi_idioma.toLowerCase().startsWith('sí') ? 'text-blue-600' : 'text-red-600'
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Calificación de Usuarios',
      value: item.calif_usuarios,
      color: 'text-gray-700'
    },
    {
      icon: <Scale className="w-5 h-5" />,
      label: 'Requisitos Solo por Ley',
      value: item.req_solo_por_ley,
      color: item.req_solo_por_ley.toLowerCase().startsWith('sí') ? 'text-blue-600' : 'text-red-600'
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Normativa Vigente',
      value: item.normativa_vigente,
      color: item.normativa_vigente.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.normativa_vigente.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      label: 'Presunción de Buena Fe',
      value: item.presuncion_buena_fe,
      color: item.presuncion_buena_fe.toLowerCase().startsWith('sí') ? 'text-blue-600' : item.presuncion_buena_fe.toLowerCase().startsWith('parcial') ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{item.tramite}</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    Evaluación: {item.evaluation_score}/100
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    Madurez: {Number(item.maturity_level).toFixed(1)}/5.0
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Score Summary */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{item.completamente_en_linea}%</div>
                <div className="text-sm text-gray-600 mt-1">Digitalización</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{item.num_pasos}</div>
                <div className="text-sm text-gray-600 mt-1">Pasos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{item.evaluation_score}</div>
                <div className="text-sm text-gray-600 mt-1">Evaluación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{Number(item.maturity_level).toFixed(1)}</div>
                <div className="text-sm text-gray-600 mt-1">Madurez</div>
              </div>
            </div>
          </div>

          {/* Indicators Grid */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Evaluados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className={`${indicator.color} mt-0.5`}>
                    {indicator.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {indicator.label}
                    </div>
                    <div className={`text-sm font-semibold ${indicator.color}`}>
                      {indicator.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Nivel de Evaluación</span>
              <span className="text-sm font-bold text-gray-900">{item.evaluation_score}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  item.evaluation_score >= 80 ? 'bg-blue-500' :
                  item.evaluation_score >= 60 ? 'bg-blue-500' :
                  item.evaluation_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${item.evaluation_score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
