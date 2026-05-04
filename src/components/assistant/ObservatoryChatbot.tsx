import React from 'react';
import { MessageCircle, Bot, Search, BarChart3, FileText, Users } from 'lucide-react';
import { useProcedures } from '../../hooks/useProcedures';
import { useInstitutions } from '../../hooks/useInstitutions';
import { useNavigate } from 'react-router-dom';

export default function ObservatoryChatbot() {
  const { procedures, loading: proceduresLoading } = useProcedures();
  const { institutions, loading: institutionsLoading } = useInstitutions();
  const navigate = useNavigate();

  // Calculate real statistics
  const totalProcedures = procedures.length;
  const totalInstitutions = institutions.length;
  const digitalProcedures = procedures.filter(p => p.is_digital).length;
  const digitalPercentage = totalProcedures > 0 ? Math.round((digitalProcedures / totalProcedures) * 100) : 0;
  
  // Get popular procedures (first 5 for example)
  const popularProcedures = procedures.slice(0, 5);
  
  // Get categories with counts
  const categories = [
    { name: 'Identidad', count: procedures.filter(p => p.category === 'identidad').length },
    { name: 'Negocios', count: procedures.filter(p => p.category === 'negocios').length },
    { name: 'Educación', count: procedures.filter(p => p.category === 'educacion').length },
    { name: 'Salud', count: procedures.filter(p => p.category === 'salud').length },
    { name: 'Justicia', count: procedures.filter(p => p.category === 'justicia').length },
    { name: 'Vivienda', count: procedures.filter(p => p.category === 'vivienda').length }
  ].filter(cat => cat.count > 0);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'search':
        navigate('/catalogo');
        break;
      case 'observatory':
        navigate('/observatorio');
        break;
      case 'categories':
        navigate('/catalogo');
        break;
      case 'help':
        navigate('/ayuda');
        break;
    }
  };

  const handleProcedureClick = (procedureId: string) => {
    navigate(`/tramite/${procedureId}`);
  };

  if (proceduresLoading || institutionsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando asistente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Asistente de Trámites
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tu asistente inteligente para encontrar información sobre trámites gubernamentales. 
            Tengo información sobre {totalProcedures} trámites de {totalInstitutions} instituciones.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Asistente Red Ciudadana</h3>
                <p className="text-blue-100">Especialista en información de trámites</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl p-4">
                  <p className="text-gray-800 mb-3">
                    ¡Hola! Soy tu asistente especializado en trámites gubernamentales de Guatemala. 
                    Tengo información actualizada sobre {totalProcedures} trámites. Puedo ayudarte con:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Información sobre requisitos y documentos</li>
                    <li>• Tiempos estimados de procesamiento</li>
                    <li>• Ubicación y contacto de instituciones</li>
                    <li>• Pasos detallados para completar trámites</li>
                    <li>• {digitalProcedures} trámites disponibles digitalmente ({digitalPercentage}%)</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Hace un momento
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Acciones rápidas:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
                onClick={() => handleQuickAction('search')}
                <Search className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Buscar trámite específico</p>
                  <p className="text-xs text-blue-700">{totalProcedures} trámites disponibles</p>
                </div>
              </button>
              
                onClick={() => handleQuickAction('observatory')}
              <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Ver análisis del Observatorio</p>
                  <p className="text-xs text-blue-700">Análisis de {totalProcedures} procesos</p>
                </div>
              </button>
              
                onClick={() => handleQuickAction('categories')}
              <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Explorar categorías</p>
                  <p className="text-xs text-blue-700">{categories.length} categorías disponibles</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-left">
                onClick={() => handleQuickAction('help')}
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Centro de ayuda</p>
                  <p className="text-xs text-orange-700">Guías y preguntas frecuentes</p>
                </div>
              </button>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Preguntas frecuentes:</h4>
            <div className="space-y-2">
              {popularProcedures.map((procedure, index) => (
                <button
                  key={index}
                  onClick={() => handleProcedureClick(procedure.id)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  ¿Cómo realizar: {procedure.name}?
                </button>
              ))}
              {categories.slice(0, 3).map((category, index) => (
                <button
                  key={`cat-${index}`}
                  onClick={() => navigate(`/catalogo/${category.name.toLowerCase()}`)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  ¿Qué trámites de {category.name} están disponibles? ({category.count} trámites)
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Escribe tu pregunta sobre trámites aquí..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-colors font-medium">
                Enviar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Presiona Enter para enviar tu mensaje
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Búsqueda Inteligente</h3>
            <p className="text-gray-600 text-sm">
              Busca entre {totalProcedures} trámites usando lenguaje natural
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Análisis en Tiempo Real</h3>
            <p className="text-gray-600 text-sm">
              Datos de {totalInstitutions} instituciones actualizados constantemente
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Asistencia 24/7</h3>
            <p className="text-gray-600 text-sm">
              {digitalProcedures} trámites digitales disponibles las 24 horas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}