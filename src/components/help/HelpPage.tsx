import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileText,
  Users,
  Phone,
  Mail,
  MessageCircle,
  Book,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  User,
  Globe,
  Download
} from 'lucide-react';
import Breadcrumb from '../common/Breadcrumb';
import LoadingSpinner from '../common/LoadingSpinner';
import AcronymTooltip from '../common/AcronymTooltip';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ProcessStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const faqCategories = [
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'tramites', name: 'Trámites', icon: FileText },
    { id: 'instituciones', name: 'Instituciones', icon: Building2 },
    { id: 'documentos', name: 'Documentos', icon: CheckCircle },
    { id: 'tiempos', name: 'Tiempos', icon: Clock },
    { id: 'red-ciudadana', name: 'Red Ciudadana', icon: Users }
  ];

  const quickQuestions = [
    { text: '¿Cómo buscar un trámite?', icon: Search },
    { text: '¿Qué significa experiencia guiada?', icon: FileText },
    { text: '¿Cómo uso el buscador?', icon: Search },
    { text: '¿Qué es el Observatorio?', icon: Building2 },
    { text: '¿Cómo filtro por categoría?', icon: FileText },
    { text: '¿Puedo hacer trámites aquí?', icon: HelpCircle }
  ];

  const faqs: FAQ[] = [
    // General
    {
      id: '1',
      question: '¿Qué es Red Ciudadana?',
      answer: 'Red Ciudadana es una organización de sociedad civil que recopila, verifica y organiza información sobre trámites gubernamentales para facilitar el acceso ciudadano a los servicios públicos. Nuestro objetivo es empoderar a los ciudadanos con información clara y completa.',
      category: 'general'
    },
    {
      id: '2',
      question: '¿Es gratuito usar este portal?',
      answer: 'Sí, completamente gratuito. Red Ciudadana es una iniciativa sin fines de lucro que busca democratizar el acceso a la información pública. No cobramos por ningún servicio de información.',
      category: 'general'
    },
    {
      id: '3',
      question: '¿Puedo realizar trámites directamente aquí?',
      answer: 'No, este portal es únicamente informativo. Te proporcionamos toda la información necesaria para que llegues preparado a las oficinas gubernamentales o portales oficiales donde debes realizar tu trámite.',
      category: 'general'
    },

    // Trámites
    {
      id: '4',
      question: '¿Cómo buscar un trámite?',
      answer: 'Hay varias formas de buscar: 1) Usa el buscador en la parte superior de cualquier página y escribe el nombre del trámite. 2) Haz clic en "Catálogo" en el menú y explora por categorías. 3) Usa el botón de búsqueda flotante para acceder al buscador rápido con sugerencias automáticas. 4) Navega por "Experiencias Guiadas" si buscas trámites relacionados a un objetivo específico.',
      category: 'tramites'
    },
    {
      id: '5',
      question: '¿Qué significa experiencia guiada?',
      answer: 'Las experiencias guiadas son conjuntos de trámites organizados por objetivos comunes. Por ejemplo, "Abrir un negocio" incluye todos los trámites necesarios como registro de empresa, patente de comercio, inscripción en SAT, etc. Te muestran el camino completo para lograr un objetivo específico, ahorrándote tiempo en buscar cada trámite por separado.',
      category: 'tramites'
    },
    {
      id: '6',
      question: '¿Cómo uso el buscador con sugerencias?',
      answer: 'Al escribir en el buscador, verás sugerencias automáticas en tres tipos: 1) Búsquedas recientes (si has usado el buscador antes), 2) Búsquedas populares (los trámites más consultados), y 3) Palabras clave que coinciden con tu búsqueda. Puedes navegar con las flechas del teclado y presionar Enter para seleccionar.',
      category: 'tramites'
    },
    {
      id: '7',
      question: '¿Cómo filtro por categoría en el catálogo?',
      answer: 'En la página del Catálogo, encontrarás filtros en la parte superior. Puedes filtrar por: 1) Categorías (identidad, negocios, salud, etc.), 2) Tipo de usuario (persona o empresa), y 3) Modalidad (digital, presencial o mixto). Los filtros se actualizan en tiempo real mientras escribes en el buscador.',
      category: 'tramites'
    },
    {
      id: '8',
      question: '¿Qué información encuentro sobre cada trámite?',
      answer: 'Para cada trámite encontrarás: requisitos completos, pasos detallados, tiempos estimados, información institucional, costos, horarios de atención, enlaces a portales oficiales, y un botón para compartir el trámite en redes sociales.',
      category: 'tramites'
    },
    {
      id: '9',
      question: '¿Los trámites digitales se pueden hacer completamente en línea?',
      answer: 'Los trámites marcados como "digitales" generalmente se pueden completar en línea, pero algunos pueden requerir pasos presenciales. Siempre verifica en el portal oficial de la institución.',
      category: 'tramites'
    },
    {
      id: '10',
      question: '¿Qué es el Observatorio Ciudadano?',
      answer: 'El Observatorio es nuestra herramienta de análisis independiente que evalúa la eficiencia y accesibilidad de los procesos gubernamentales. Muestra estadísticas sobre tiempos promedio, satisfacción ciudadana, nivel de digitalización, y complejidad de cada trámite. Es una forma de hacer los procesos más transparentes y presionar por mejoras.',
      category: 'tramites'
    },

    // Instituciones
    {
      id: '11',
      question: '¿Dónde encuentro información de contacto de las instituciones?',
      answer: 'En cada página de trámite incluimos información completa de la institución: dirección, teléfonos, correos, horarios de atención y sitio web oficial. También puedes ir a la sección "Instituciones" en el menú principal para ver un directorio completo.',
      category: 'instituciones'
    },
    {
      id: '12',
      question: '¿Cómo sé si una institución tiene servicios en línea?',
      answer: 'Indicamos claramente qué trámites son digitales, presenciales o mixtos. También proporcionamos enlaces directos a los portales oficiales de cada institución.',
      category: 'instituciones'
    },

    // Documentos
    {
      id: '13',
      question: '¿Qué documentos necesito tener siempre listos?',
      answer: 'Los documentos más comunes son: DPI (Documento Personal de Identificación) vigente, partida de nacimiento certificada, comprobante de residencia reciente, y fotografías tamaño cédula. Cada trámite tiene requisitos específicos.',
      category: 'documentos'
    },
    {
      id: '14',
      question: '¿Dónde obtengo certificaciones de documentos?',
      answer: 'Las partidas de nacimiento se obtienen en RENAP (Registro Nacional de las Personas), las certificaciones académicas en tu institución educativa, y otros documentos en sus respectivas instituciones emisoras.',
      category: 'documentos'
    },

    // Tiempos
    {
      id: '11',
      question: '¿Los tiempos estimados son exactos?',
      answer: 'Los tiempos son estimaciones basadas en información oficial y experiencias ciudadanas. Pueden variar según la demanda, época del año y eficiencia de cada oficina.',
      category: 'tiempos'
    },
    {
      id: '12',
      question: '¿Qué hacer si mi trámite toma más tiempo del estimado?',
      answer: 'Contacta directamente a la institución para consultar el estado. Si hay demoras injustificadas, puedes presentar una queja formal o contactar a Red Ciudadana para reportar la situación.',
      category: 'tiempos'
    },

    // Red Ciudadana
    {
      id: '13',
      question: '¿Cómo puedo contribuir con información?',
      answer: 'Puedes reportar cambios en procesos, compartir tu experiencia, verificar información existente, o contactarnos con actualizaciones. Tu contribución ayuda a mantener la información actualizada.',
      category: 'red-ciudadana'
    },
    {
      id: '14',
      question: '¿Cómo verifican la información?',
      answer: 'Nuestro equipo verifica información con fuentes oficiales, experiencias ciudadanas, y monitoreo constante de cambios en procesos gubernamentales. También contamos con una red de colaboradores.',
      category: 'red-ciudadana'
    }
  ];

  const processSteps: ProcessStep[] = [
    {
      title: 'Identifica tu necesidad',
      description: 'Usa nuestro buscador o navega por categorías para encontrar el trámite que necesitas.',
      icon: Search
    },
    {
      title: 'Revisa la información completa',
      description: 'Lee todos los requisitos, pasos y información institucional antes de proceder.',
      icon: FileText
    },
    {
      title: 'Prepara tus documentos',
      description: 'Reúne todos los documentos requeridos y verifica que estén vigentes y en buen estado.',
      icon: CheckCircle
    },
    {
      title: 'Planifica tu visita',
      description: 'Verifica horarios de atención, ubicación y si necesitas cita previa.',
      icon: Clock
    },
    {
      title: 've al portal oficial',
      description: 'Usa los enlaces que proporcionamos para ir directamente al sitio oficial de la institución.',
      icon: Globe
    },
    {
      title: 'Comparte tu experiencia',
      description: 'Ayuda a otros ciudadanos reportando cambios o compartiendo tu experiencia.',
      icon: Users
    }
  ];

  const filteredFAQs = useMemo(() => {
    setIsFiltering(true);
    const filtered = faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'general' || faq.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setTimeout(() => setIsFiltering(false), 300);
    return filtered;
  }, [selectedCategory, searchQuery]);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Centro de Ayuda' }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Centro de Ayuda
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Encuentra respuestas a tus preguntas sobre trámites, instituciones y cómo usar
            la información de Red Ciudadana para tener éxito en tus gestiones gubernamentales.
          </p>

          {/* Acronym Tooltip Demo */}
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <User className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-gray-700">
              Los acrónimos como <AcronymTooltip acronym="DPI" /> y <AcronymTooltip acronym="SAT" /> tienen tooltips informativos
            </p>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 mb-12 text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">¿Necesitas ayuda inmediata?</h2>
            <p className="text-blue-100">Nuestro equipo está aquí para apoyarte</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Chat en Vivo</h3>
              <p className="text-sm text-blue-100 mb-3">Respuesta inmediata</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Próximamente
              </button>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Correo Electrónico</h3>
              <p className="text-sm text-blue-100 mb-3">info@redciudadana.org.gt</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Enviar correo
              </button>
            </div>
            {/* <div className="text-center">
              <div className="bg-white/20 p-4 rounded-xl mb-3 mx-auto w-fit">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Teléfono</h3>
              <p className="text-sm text-blue-100 mb-3">+502 2440-0000</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Llamar ahora
              </button>
            </div> */}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Book className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h2>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en preguntas frecuentes..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quick Questions */}
              {!searchQuery && (
                <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    Preguntas comunes - Click para ver respuesta
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, index) => {
                      const IconComponent = q.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            const faq = faqs.find(f => f.question === q.text);
                            if (faq) {
                              setExpandedFAQ(faq.id);
                              setSelectedCategory(faq.category);
                            }
                          }}
                          className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-sm font-medium group"
                        >
                          <IconComponent className="h-4 w-4 text-blue-600 group-hover:text-white" />
                          {q.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category Filters with loading indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">Filtrar por categoría</p>
                  {isFiltering && <LoadingSpinner size="sm" inline />}
                </div>
                <div className="flex flex-wrap gap-2">
                  {faqCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FAQ List */}
              {isFiltering ? (
                <LoadingSpinner size="lg" text="Filtrando preguntas..." />
              ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 text-gray-700 border-t border-gray-100">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}

              {!isFiltering && filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No se encontraron preguntas que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Process Guide */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cómo Usar Red Ciudadana</h3>
              </div>
              <div className="space-y-4">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Documentación</h3>
              </div>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Guía de Trámites 2024</span>
                  </div>
                  <span className="text-xs text-gray-500">PDF</span>
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Lista de Instituciones</span>
                  </div>
                  <span className="text-xs text-gray-500">PDF</span>
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Documentos Comunes</span>
                  </div>
                  <span className="text-xs text-gray-500">PDF</span>
                </a>
              </div>
            </div>

            {/* Community */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Únete a la Comunidad</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Ayuda a otros ciudadanos compartiendo tu experiencia y manteniendo la información actualizada.
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Contribuir
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}