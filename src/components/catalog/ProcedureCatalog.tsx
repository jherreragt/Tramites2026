import React, { useState, useMemo } from 'react';
import { Search, Filter, Building2, Clock, User, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProcedures, useProcedureSearch } from '../../hooks/useProcedures';
import { Procedure } from '../../lib/data';
import loader from '../../assets/loader.gif';
import CatalogHero from './CatalogHero';

interface ProcedureCatalogProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export default function ProcedureCatalog({ 
  searchQuery = '', 
  selectedCategory = ''
}: ProcedureCatalogProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [institutionFilter, setInstitutionFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Use hooks to fetch data from JSON
  const { procedures: allProcedures, loading: allLoading } = useProcedures();
  const { procedures: searchResults, loading: searchLoading } = useProcedureSearch(localSearchQuery || searchQuery);

  const loading = allLoading || searchLoading;
  const procedures = (localSearchQuery || searchQuery) ? searchResults : allProcedures;

  const filteredProcedures = useMemo(() => {
    let filtered = procedures;
    
    // Apply selected category from URL parameter first
    if (selectedCategory) {
      filtered = filtered.filter(procedure => procedure.category === selectedCategory);
    }
    
    // Then apply other filters
    return filtered.filter(procedure => {
      const matchesInstitution = institutionFilter === '' || procedure.institutions?.name === institutionFilter;
      const matchesCategory = categoryFilter === '' || procedure.category === categoryFilter;
      const matchesSubcategory = subcategoryFilter === '' || procedure.subcategory === subcategoryFilter;
      
      return matchesInstitution && matchesCategory && matchesSubcategory;
    });
  }, [procedures, selectedCategory, institutionFilter, categoryFilter, subcategoryFilter]);

  // Get unique values for filter options
  const institutions = useMemo(() => {
    const uniqueInstitutions = [...new Set(procedures.map(p => p.institutions?.name).filter(Boolean))];
    return uniqueInstitutions.sort();
  }, [procedures]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(procedures.map(p => p.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [procedures]);

  const subcategories = useMemo(() => {
    const uniqueSubcategories = [...new Set(procedures.map(p => p.subcategory).filter(Boolean))];
    return uniqueSubcategories.sort();
  }, [procedures]);

  const handleProcedureClick = (procedure: Procedure) => {
    navigate(`/tramite/${procedure.id}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'digital': return '💻';
      case 'presencial': return '🏢';
      case 'mixto': return '🔄';
      default: return '📄';
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'digital': return 'bg-blue-100 text-blue-800';
      case 'presencial': return 'bg-blue-100 text-blue-800';
      case 'mixto': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <img src={loader} alt="Cargando..." className="h-16 w-16 mx-auto mb-4" />
            <p className="text-gray-600">Cargando trámites...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-800 transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">
            {selectedCategory
              ? `Categoría: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
              : 'Catálogo de Trámites'
            }
          </span>
        </nav>

        {/* Hero Slider */}
        <CatalogHero totalProcedures={filteredProcedures.length} />

        {/* Category Info if selected */}
        {selectedCategory && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-600">
              Mostrando trámites de <span className="font-semibold text-gray-900">{selectedCategory}</span>
            </p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Buscar trámites por nombre, descripción o institución..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institución
                  </label>
                  <select
                    value={institutionFilter}
                    onChange={(e) => setInstitutionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas las instituciones</option>
                    {institutions.map(institution => (
                      <option key={institution} value={institution}>
                        {institution}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategoría
                  </label>
                  <select
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas las subcategorías</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setInstitutionFilter('');
                      setCategoryFilter('');
                      setSubcategoryFilter('');
                      setLocalSearchQuery('');
                    }}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div id="tramites-section" className="grid gap-6">
          {filteredProcedures.map((procedure) => (
            <div
              key={procedure.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group"
              onClick={() => handleProcedureClick(procedure)}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between h-full">
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                          {procedure.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(procedure.type)}`}>
                          {getTypeIcon(procedure.type)} {procedure.type}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                          {procedure.category}
                        </span>
                      </div>

                      {procedure.subcategory && (
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          {procedure.subcategory}
                        </p>
                      )}

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {procedure.description}
                      </p>

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
                          {procedure.user_type === 'persona' ? (
                            <User className="h-4 w-4" />
                          ) : procedure.user_type === 'empresa' ? (
                            <Building2 className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                          <span className="capitalize">{procedure.user_type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {procedure.fecha_actualizado && (
                      <div className="text-xs text-gray-400 mt-2">
                        Actualizado: {new Date(procedure.fecha_actualizado).toLocaleDateString('es-GT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex items-end">
                    <button className="w-full lg:w-auto bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center space-x-2 group-hover:bg-blue-900">
                      <span>Ver información</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProcedures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-6">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron trámites
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o cambia los términos de búsqueda
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setLocalSearchQuery('');
                  setInstitutionFilter('');
                  setCategoryFilter('');
                  setSubcategoryFilter('');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}