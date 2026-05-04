import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Building2, ArrowRight, Star } from 'lucide-react';
import { useProcedures } from '../../hooks/useProcedures';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PopularProceduresSection() {
  const { procedures, loading } = useProcedures();
  const { t } = useLanguage();

  const popularProcedureNames = [
    'Inscripción al NIT',
    'Licencia sanitaria',
    'Constitución de empresa o comerciante individual'
  ];

  const popularProcedures = popularProcedureNames
    .map(name => procedures.find(p => p.name === name))
    .filter(Boolean)
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('home.popular.title')}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('home.popular.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {popularProcedures.map((procedure, index) => (
            <Link
              key={procedure.id}
              to={`/tramite/${procedure.id}`}
              className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                {index + 1}
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-600 transition-colors">
                  <Star className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {procedure.name}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {procedure.description}
              </p>

              <div className="space-y-2 mb-4">
                {procedure.institutions && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{procedure.institutions.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Duración: {procedure.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {procedure.type?.toLowerCase() === 'digital' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      💻 Digital
                    </span>
                  ) : procedure.type?.toLowerCase() === 'mixto' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      🔄 Mixto
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      🏢 Presencial
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Ver más
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Ver todos los trámites
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
