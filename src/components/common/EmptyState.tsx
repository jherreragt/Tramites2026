import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Home, FileText, Lightbulb } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: 'search' | 'filter' | 'general';
  searchQuery?: string;
  suggestions?: string[];
  showHomeLink?: boolean;
}

export default function EmptyState({
  title = 'No se encontraron resultados',
  description = 'Intenta con otros términos de búsqueda o explora nuestras sugerencias',
  type = 'general',
  searchQuery = '',
  suggestions = [],
  showHomeLink = true
}: EmptyStateProps) {
  const defaultSuggestions = [
    'Licencia de conducir',
    'Pasaporte',
    'DPI',
    'Acta de nacimiento',
    'Registro de empresa',
    'Certificado de antecedentes'
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  const tips = [
    'Verifica la ortografía de las palabras',
    'Intenta usar términos más generales',
    'Usa sinónimos o palabras relacionadas',
    'Reduce el número de palabras en tu búsqueda'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
      {/* Icon and Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
          <Search className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
        {searchQuery && (
          <div className="mt-4 inline-block">
            <p className="text-sm text-gray-500">
              Búsqueda: <span className="font-semibold text-gray-700">"{searchQuery}"</span>
            </p>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {type === 'search' && (
        <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Consejos de búsqueda</h3>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Suggestions */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">
            {type === 'search' ? 'Búsquedas populares' : 'Trámites populares'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {displaySuggestions.slice(0, 6).map((suggestion) => (
            <Link
              key={suggestion}
              to={`/catalogo?q=${encodeURIComponent(suggestion)}`}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
            >
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{suggestion}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/catalogo"
          className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all group"
        >
          <div className="bg-blue-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 mb-1">Ver Catálogo Completo</h4>
            <p className="text-sm text-gray-600">Explora todos los trámites disponibles</p>
          </div>
        </Link>

        <Link
          to="/experiencias"
          className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all group"
        >
          <div className="bg-orange-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 mb-1">Experiencias Guiadas</h4>
            <p className="text-sm text-gray-600">Trámites organizados por objetivos</p>
          </div>
        </Link>
      </div>

      {/* Home Link */}
      {showHomeLink && (
        <div className="text-center pt-6 border-t border-gray-200">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Home className="h-5 w-5" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      )}
    </div>
  );
}
