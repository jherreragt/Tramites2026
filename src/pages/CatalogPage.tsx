import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Building2, Clock, User, ArrowRight } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useProcedures } from '../hooks/useProcedures';
import loader from '../assets/loader.gif';
import CatalogHero from '../components/catalog/CatalogHero';
import Breadcrumb from '../components/common/Breadcrumb';

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { category: urlCategory } = useParams();
  
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState(urlCategory || 'Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Synchronize categoryFilter with URL params when they change
  useEffect(() => {
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    } else {
      setCategoryFilter('Todas');
    }
  }, [urlCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { procedures, loading } = useProcedures();

  const categories = useMemo(() => {
    const cats = procedures.map(p => p.category);
    return ['Todas', ...Array.from(new Set(cats))];
  }, [procedures]);

  const filteredProcedures = useMemo(() => {
    return procedures.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (p.institutions?.name || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [procedures, debouncedSearch, categoryFilter]);

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'digital': return 'bg-blue-100 text-blue-800';
      case 'presencial': return 'bg-gray-100 text-gray-800';
      case 'semi-digital': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'digital': return '💻';
      case 'presencial': return '🏢';
      case 'semi-digital': return '🕒';
      default: return '📄';
    }
  };

  if (loading && procedures.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src={loader} alt="Cargando..." className="w-16 h-16 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando trámites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Catálogo de Trámites' }]} />
        
        <CatalogHero totalProcedures={procedures.length} />

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar trámites por nombre, descripción o institución..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border transition-all ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === category
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Mostrando <span className="font-bold text-gray-900">{filteredProcedures.length}</span> de <span className="font-bold text-gray-900">{procedures.length}</span> trámites
          </p>
        </div>

        {/* Procedures List */}
        <div className="grid gap-6">
          {filteredProcedures.map((procedure) => (
            <div
              key={procedure.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group"
              onClick={() => navigate(`/tramite/${procedure.id}`)}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                        {procedure.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(procedure.type)}`}>
                        {getTypeIcon(procedure.type)} {procedure.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{procedure.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{procedure.institutions?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{procedure.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span className="capitalize">{procedure.user_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="min-w-[140px]">
                    <button 
                      onClick={() => navigate(`/tramite/${procedure.id}`)}
                      className="w-full bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Ver detalles</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProcedures.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron trámites</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Intenta ajustar tus criterios de búsqueda o filtros para encontrar lo que necesitas.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('Todas');
              }}
              className="mt-6 text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
