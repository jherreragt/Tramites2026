import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight, TrendingUp, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProcedureSearch } from '../../hooks/useProcedures';
import { Procedure } from '../../lib/data';
import { AcronymText } from './AcronymTooltip';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'popular' | 'recent' | 'keyword';
  icon?: React.ReactNode;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  const { procedures: results, loading } = useProcedureSearch(query);
  const limitedResults = results.slice(0, 5);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Popular search suggestions
  const popularSearches = [
    'Licencia de conducir',
    'Pasaporte',
    'DPI',
    'Acta de nacimiento',
    'Registro de empresa',
    'Patente de comercio',
    'Certificado de antecedentes',
    'Carnet de salud'
  ];

  // Keywords from procedure names for autocomplete
  const keywords = useMemo(() => {
    const allWords = new Set<string>();
    results.forEach(proc => {
      const words = proc.name.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) allWords.add(word);
      });
    });
    return Array.from(allWords);
  }, [results]);

  // Generate suggestions based on query
  const suggestions = useMemo(() => {
    const sug: SearchSuggestion[] = [];

    if (query.trim() === '') {
      // Show recent searches
      recentSearches.slice(0, 3).forEach((search, idx) => {
        sug.push({
          id: `recent-${idx}`,
          text: search,
          type: 'recent',
          icon: <Clock className="h-4 w-4" />
        });
      });

      // Show popular searches
      popularSearches.slice(0, 5).forEach((search, idx) => {
        sug.push({
          id: `popular-${idx}`,
          text: search,
          type: 'popular',
          icon: <TrendingUp className="h-4 w-4" />
        });
      });
    } else {
      // Show matching keywords
      const lowerQuery = query.toLowerCase();
      const matchingKeywords = keywords
        .filter(kw => kw.startsWith(lowerQuery) && kw !== lowerQuery)
        .slice(0, 5);

      matchingKeywords.forEach((kw, idx) => {
        sug.push({
          id: `keyword-${idx}`,
          text: kw,
          type: 'keyword',
          icon: <Zap className="h-4 w-4" />
        });
      });

      // Show matching popular searches
      const matchingPopular = popularSearches
        .filter(ps => ps.toLowerCase().includes(lowerQuery))
        .slice(0, 3);

      matchingPopular.forEach((ps, idx) => {
        sug.push({
          id: `popular-match-${idx}`,
          text: ps,
          type: 'popular',
          icon: <TrendingUp className="h-4 w-4" />
        });
      });
    }

    return sug;
  }, [query, recentSearches, keywords, popularSearches]);

  // Save search to recent searches
  const saveRecentSearch = (searchText: string) => {
    const updated = [searchText, ...recentSearches.filter(s => s !== searchText)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleProcedureClick = (procedure: Procedure) => {
    saveRecentSearch(procedure.name);
    navigate(`/tramite/${procedure.id}`);
    onClose();
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + limitedResults.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        const resultIndex = selectedIndex - suggestions.length;
        if (limitedResults[resultIndex]) {
          handleProcedureClick(limitedResults[resultIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const showSuggestions = query.trim() === '' || (suggestions.length > 0 && query.length < 3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Buscar Trámites</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="¿Qué trámite necesitas hacer?"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-4 py-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {query.trim() === '' ? 'Búsquedas sugeridas' : 'Sugerencias'}
              </p>
              {query.trim() === '' && recentSearches.length > 0 && (
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="pb-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    selectedIndex === index ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className={`${
                    suggestion.type === 'recent' ? 'text-gray-500' :
                    suggestion.type === 'popular' ? 'text-orange-500' :
                    'text-blue-500'
                  }`}>
                    {suggestion.icon}
                  </span>
                  <span className="text-sm text-gray-700">{suggestion.text}</span>
                  {suggestion.type === 'recent' && (
                    <span className="ml-auto text-xs text-gray-500">Reciente</span>
                  )}
                  {suggestion.type === 'popular' && (
                    <span className="ml-auto text-xs text-orange-600">Popular</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Buscando...</p>
            </div>
          ) : limitedResults.length > 0 ? (
            <div className="py-2">
              {!showSuggestions && (
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-700">
                    Resultados ({results.length})
                  </p>
                </div>
              )}
              {limitedResults.map((procedure, index) => {
                const resultIndex = suggestions.length + index;
                return (
                  <button
                    key={procedure.id}
                    onClick={() => handleProcedureClick(procedure)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedIndex === resultIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{procedure.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{procedure.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{procedure.institutions?.name || 'N/A'}</span>
                          <span>{procedure.duration}</span>
                          <span className="capitalize">{procedure.type}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
              {results.length > 5 && (
                <div className="px-4 py-3 text-center border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Mostrando 5 de {results.length} resultados. Continúa escribiendo para refinar tu búsqueda.
                  </p>
                </div>
              )}
            </div>
          ) : query.trim() !== '' && query.length >= 3 ? (
            <div className="p-6">
              <div className="text-center">
                <div className="text-gray-400 mb-3">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-900 font-semibold mb-2">
                  No se encontraron trámites para "{query}"
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Intenta con otros términos o explora las sugerencias populares
                </p>

                {/* Quick suggestions in modal */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Búsquedas populares:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Licencia', 'Pasaporte', 'DPI', 'Acta'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1 bg-white rounded-md text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors border border-blue-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : !showSuggestions ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-600">Comienza a escribir para buscar trámites</p>
              <p className="text-sm text-gray-500 mt-1">
                Puedes buscar por nombre, institución o descripción
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑↓</kbd>
                Navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd>
                Seleccionar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd>
                Cerrar
              </span>
            </div>
            <p className="text-sm text-gray-600">
              ¿No encuentras lo que buscas? <a href="#" className="text-blue-600 hover:text-blue-700">Contáctanos</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}