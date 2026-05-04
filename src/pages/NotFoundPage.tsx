import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, BookOpen, Users, FileText, TrendingUp, MapPin } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const popularPages = [
    { name: 'Catálogo de Trámites', path: '/catalogo', icon: FileText, description: 'Explora todos los trámites disponibles' },
    { name: 'Instituciones', path: '/instituciones', icon: MapPin, description: 'Encuentra instituciones gubernamentales' },
    { name: 'Experiencias Guiadas', path: '/experiencias', icon: TrendingUp, description: 'Trámites organizados por objetivos' },
    { name: 'Centro de Ayuda', path: '/ayuda', icon: BookOpen, description: 'Preguntas frecuentes y soporte' }
  ];

  const popularSearches = [
    'Licencia de conducir',
    'Pasaporte',
    'DPI',
    'Acta de nacimiento',
    'Registro de empresa',
    'Certificado de antecedentes'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Main 404 Message */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="text-9xl font-bold text-blue-600 opacity-20">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-20 w-20 text-blue-600" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Ups! Página no encontrada
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Parece que te has perdido. La página que buscas no existe o ha sido movida.
            Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <Home className="h-6 w-6" />
              <span>Ir al Inicio</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Volver Atrás</span>
            </button>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Páginas que podrían interesarte
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {page.name}
                      </h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Búsquedas Populares
            </h2>
          </div>
          <p className="text-center text-gray-600 mb-6">
            ¿Buscabas alguno de estos trámites?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {popularSearches.map((search) => (
              <Link
                key={search}
                to={`/catalogo?q=${encodeURIComponent(search)}`}
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-md font-medium"
              >
                <Search className="h-4 w-4" />
                {search}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
            <Users className="h-5 w-5 text-blue-600" />
            <p className="text-gray-700">
              ¿Necesitas ayuda?{' '}
              <Link to="/ayuda" className="text-blue-600 hover:text-blue-700 font-semibold">
                Visita nuestro Centro de Ayuda
              </Link>
              {' '}o{' '}
              <a href="mailto:info@redciudadana.org.gt" className="text-blue-600 hover:text-blue-700 font-semibold">
                contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;