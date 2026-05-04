import React from 'react';
import { 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Smartphone, 
  Monitor, 
  Keyboard, 
  Mouse, 
  Volume2, 
  Type, 
  Contrast, 
  Zap,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Heart
} from 'lucide-react';

export default function Accessibility() {
  const lastUpdated = "1 de enero de 2025";

  const features = [
    {
      category: "Accesibilidad Visual",
      icon: Eye,
      color: "blue",
      items: [
        "Alto contraste en todos los elementos de la interfaz",
        "Texto escalable hasta 200% sin pérdida de funcionalidad",
        "Colores que no son el único medio para transmitir información",
        "Iconos descriptivos acompañados de texto alternativo",
        "Navegación clara con indicadores visuales de ubicación"
      ]
    },
    {
      category: "Accesibilidad Auditiva",
      icon: Ear,
      color: "blue",
      items: [
        "Transcripciones disponibles para contenido de audio",
        "Subtítulos en videos informativos",
        "Alertas visuales además de sonoras",
        "Contenido principalmente textual y visual",
        "Sin dependencia de audio para información crítica"
      ]
    },
    {
      category: "Accesibilidad Motriz",
      icon: Hand,
      color: "blue",
      items: [
        "Navegación completa por teclado",
        "Áreas de clic amplias (mínimo 44x44 píxeles)",
        "Tiempo suficiente para completar acciones",
        "Sin requerimiento de gestos complejos",
        "Compatibilidad con tecnologías asistivas"
      ]
    },
    {
      category: "Accesibilidad Cognitiva",
      icon: Brain,
      color: "orange",
      items: [
        "Lenguaje claro y sencillo",
        "Estructura consistente en todas las páginas",
        "Instrucciones paso a paso para procesos complejos",
        "Evitamos contenido que parpadea o se mueve automáticamente",
        "Opciones para pausar o controlar contenido dinámico"
      ]
    }
  ];

  const technologies = [
    {
      name: "Lectores de Pantalla",
      icon: Volume2,
      description: "Compatible con NVDA, JAWS, VoiceOver y TalkBack",
      status: "Totalmente compatible"
    },
    {
      name: "Navegación por Teclado",
      icon: Keyboard,
      description: "Todas las funciones accesibles sin mouse",
      status: "Implementado"
    },
    {
      name: "Magnificadores de Pantalla",
      icon: Monitor,
      description: "Funciona correctamente con ZoomText y similares",
      status: "Optimizado"
    },
    {
      name: "Reconocimiento de Voz",
      icon: Smartphone,
      description: "Compatible con Dragon NaturallySpeaking",
      status: "Soportado"
    }
  ];

  const guidelines = [
    {
      standard: "WCAG 2.1 Nivel AA",
      description: "Cumplimos con las Pautas de Accesibilidad para el Contenido Web",
      compliance: "95%"
    },
    {
      standard: "Sección 508",
      description: "Estándares de accesibilidad del gobierno estadounidense",
      compliance: "90%"
    },
    {
      standard: "EN 301 549",
      description: "Estándar europeo de accesibilidad",
      compliance: "88%"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      orange: "bg-orange-100 text-orange-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Accesibilidad
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Red Ciudadana está comprometida con hacer que la información sea accesible para todos los ciudadanos guatemaltecos
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Última actualización:</strong> {lastUpdated}
            </p>
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestro Compromiso</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              En Red Ciudadana creemos que el acceso a la información es un derecho fundamental. 
              Trabajamos continuamente para asegurar que nuestro portal sea accesible para personas 
              con diversas capacidades, incluyendo aquellas que utilizan tecnologías asistivas.
            </p>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Características de Accesibilidad
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(feature.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assistive Technologies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Tecnologías Asistivas Compatibles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <div className="bg-gray-100 p-4 rounded-xl mb-4 mx-auto w-fit">
                    <IconComponent className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tech.description}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tech.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Standards Compliance */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Cumplimiento de Estándares
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {guidelines.map((guideline, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 p-4 rounded-xl mb-4 mx-auto w-fit">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{guideline.standard}</h3>
                  <p className="text-sm text-gray-600 mb-3">{guideline.description}</p>
                  <div className="text-2xl font-bold text-blue-600">{guideline.compliance}</div>
                  <div className="text-xs text-gray-500">Cumplimiento</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Keyboard className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Navegación por Teclado</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Atajos de Teclado Principales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Ir al contenido principal</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Alt + 1</kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Ir al menú de navegación</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Alt + 2</kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Ir al buscador</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Alt + 3</kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Ir al pie de página</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Alt + 4</kbd>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Navegación Estándar</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Siguiente elemento</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Tab</kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Elemento anterior</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Shift + Tab</kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Activar elemento</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Enter</kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Cerrar modal/menú</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Escape</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Tools */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Herramientas de Accesibilidad</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Type className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Tamaño de Texto</h3>
                <p className="text-sm text-gray-600 mb-4">Ajusta el tamaño del texto según tus necesidades</p>
                <div className="flex justify-center space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">A-</button>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">A</button>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">A+</button>
                </div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Contrast className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Alto Contraste</h3>
                <p className="text-sm text-gray-600 mb-4">Activa el modo de alto contraste para mejor visibilidad</p>
                <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                  Activar
                </button>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Modo de Lectura</h3>
                <p className="text-sm text-gray-600 mb-4">Simplifica la página para una lectura más fácil</p>
                <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                  Activar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">¿Encontraste una barrera de accesibilidad?</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Tu retroalimentación es valiosa para nosotros. Si encuentras algún problema de accesibilidad 
              o tienes sugerencias para mejorar, por favor contáctanos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Mail className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Correo de Accesibilidad</h4>
              <p className="text-sm text-gray-600 mb-3">accesibilidad@redciudadana.org.gt</p>
              <a
                href="mailto:accesibilidad@redciudadana.org.gt"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                <span>Enviar reporte</span>
              </a>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Phone className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Línea de Accesibilidad</h4>
              <p className="text-sm text-gray-600 mb-3">+502 2440-0000 ext. 123</p>
              <a
                href="tel:+50224400000"
                className="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Red Ciudadana Guatemala. Comprometidos con la accesibilidad universal.
          </p>
        </div>
      </div>
    </div>
  );
}