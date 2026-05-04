import React from 'react';
import { Users, Target, Eye, Heart, Award, Globe, Mail, Phone, MapPin } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Acerca de Red Ciudadana
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organización de sociedad civil comprometida con la transparencia y el acceso a la información pública en Guatemala
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Empoderar a los ciudadanos guatemaltecos con información clara, verificada y actualizada 
              sobre trámites gubernamentales para facilitar su acceso a los servicios públicos y 
              fortalecer la transparencia en la administración pública.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 mb-8 border border-blue-200">
          <div className="text-center">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Nuestra Visión</h2>
            <p className="text-lg text-blue-800 max-w-3xl mx-auto leading-relaxed">
              Ser la plataforma de referencia para información ciudadana en Guatemala, contribuyendo 
              a una sociedad más informada, participativa y con acceso equitativo a los servicios públicos.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparencia</h3>
              <p className="text-sm text-gray-600">
                Promovemos la apertura y claridad en toda la información que proporcionamos
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Calidad</h3>
              <p className="text-sm text-gray-600">
                Verificamos y actualizamos constantemente nuestra información
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Servicio</h3>
              <p className="text-sm text-gray-600">
                Nos enfocamos en las necesidades reales de los ciudadanos
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accesibilidad</h3>
              <p className="text-sm text-gray-600">
                Hacemos la información accesible para todos los ciudadanos
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Qué Hacemos?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Recopilación de Información</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Investigamos y documentamos procesos gubernamentales</li>
                <li>• Verificamos requisitos y procedimientos con fuentes oficiales</li>
                <li>• Actualizamos constantemente la información disponible</li>
                <li>• Organizamos datos de manera clara y comprensible</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Análisis y Monitoreo</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Evaluamos la eficiencia de procesos gubernamentales</li>
                <li>• Monitoreamos cambios en trámites y procedimientos</li>
                <li>• Analizamos la experiencia ciudadana</li>
                <li>• Generamos reportes de transparencia y accesibilidad</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contáctanos</h2>
            <p className="text-gray-600">
              ¿Tienes preguntas o quieres colaborar con nosotros?
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Mail className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Correo Electrónico</h4>
              <p className="text-sm text-gray-600 mb-3">info@redciudadana.org.gt</p>
              <a
                href="mailto:info@redciudadana.org.gt"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Enviar correo
              </a>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <Phone className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Teléfono</h4>
              <p className="text-sm text-gray-600 mb-3">+502 2440-0000</p>
              <a
                href="tel:+50224400000"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Llamar ahora
              </a>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mb-3 shadow-sm">
                <MapPin className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Ubicación</h4>
              <p className="text-sm text-gray-600 mb-3">Zona 1, Ciudad de Guatemala</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Ver mapa
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Red Ciudadana Guatemala. Organización de sociedad civil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;