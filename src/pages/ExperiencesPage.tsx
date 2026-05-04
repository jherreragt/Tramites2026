import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Target,
  ArrowLeft,
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Building2,
  Sprout,
  Globe,
  Leaf,
  Pill,
  Dna,
  Microscope,
  Package,
  FlaskConical,
  Store,
  Briefcase,
  Plane,
  Users,
  Home,
  GraduationCap,
  Award,
  Rocket,
  Zap,
  CreditCard,
  BookOpen,
  UserCheck,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  Scale as ScaleIcon
} from 'lucide-react';
import { useProcedures } from '../hooks/useProcedures';
import { useExperiences } from '../hooks/useExperiences';
import { useLanguage } from '../contexts/LanguageContext';
import InfoTooltip from '../components/common/InfoTooltip';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import loader from '../assets/loader.gif';

const iconMap: Record<string, React.ElementType> = {
  Sprout,
  Globe,
  Leaf,
  Pill,
  Dna,
  Microscope,
  Package,
  FlaskConical,
  Target,
  Store,
  Briefcase,
  Plane,
  Users,
  Home,
  GraduationCap,
  Award,
  Building2
};

const colorMap: Record<string, { icon: string; bg: string }> = {
  'from-blue-500 to-blue-700': { icon: 'text-blue-600', bg: 'bg-blue-50' },
  'from-emerald-500 to-emerald-700': { icon: 'text-emerald-600', bg: 'bg-emerald-50' },
  'from-indigo-500 to-indigo-700': { icon: 'text-indigo-600', bg: 'bg-indigo-50' },
  'from-cyan-500 to-cyan-700': { icon: 'text-cyan-600', bg: 'bg-cyan-50' },
  'from-orange-500 to-orange-700': { icon: 'text-orange-600', bg: 'bg-orange-50' },
  'from-rose-500 to-rose-700': { icon: 'text-rose-600', bg: 'bg-rose-50' },
  'from-amber-500 to-amber-700': { icon: 'text-amber-600', bg: 'bg-amber-50' }
};

type CategoryFilter = 'all' | 'business' | 'identity' | 'education' | 'employment';

const categoryMapping: Record<string, CategoryFilter> = {
  'Emprendimiento': 'business',
  'Negocios': 'business',
  'Emprendimiento Formal': 'business',
  'Comercio Exterior': 'business',
  'Propiedad Intelectual': 'business',
  'Identidad': 'identity',
  'Documentos': 'identity',
  'Educación': 'education',
  'Recursos Humanos': 'employment',
  'Construcción': 'business'
};

export default function ExperiencesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [isFiltering, setIsFiltering] = useState(false);

  const { procedures, loading: proceduresLoading } = useProcedures();
  const { experiences, loading: experiencesLoading } = useExperiences();
  const { t } = useLanguage();

  const loading = proceduresLoading || experiencesLoading;

  const selectedExperience = useMemo(() => {
    if (!selectedId) return null;
    return experiences.find(exp => String(exp.id) === String(selectedId)) || null;
  }, [experiences, selectedId]);

  const handleSelectExperience = (id: string) => {
    setSearchParams({ id });
  };

  const handleBackToList = () => {
    setSearchParams({});
  };

  const filteredExperiences = useMemo(() => {
    setIsFiltering(true);

    let filtered = experiences;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => {
        const expCategory = categoryMapping[exp.categoria];
        return expCategory === selectedCategory;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.nombre.toLowerCase().includes(query) ||
        exp.descripcion.toLowerCase().includes(query) ||
        exp.categoria.toLowerCase().includes(query)
      );
    }

    setTimeout(() => setIsFiltering(false), 300);
    return filtered;
  }, [experiences, searchQuery, selectedCategory]);

  const getCategoryCount = (category: CategoryFilter) => {
    if (category === 'all') return experiences.length;
    return experiences.filter(exp => categoryMapping[exp.categoria] === category).length;
  };

  const getExperienceProcedures = (experienceId: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (!experience) return [];
    return procedures.filter(proc => experience.ids_procedures.includes(proc.id.toString()));
  };

  const getColorClasses = (colorGradient: string) => {
    return colorMap[colorGradient] || { icon: 'text-blue-600', bg: 'bg-blue-50' };
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'digital': return '💻';
      case 'presencial': return '🏢';
      case 'mixto': return '🔄';
      default: return '📄';
    }
  };

  const getStatusColor = (type: string) => {
    switch (type?.toLowerCase()) {
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
            <p className="text-gray-600">Cargando experiencias...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExperience) {
    const expProcedures = getExperienceProcedures(selectedExperience.id);
    const IconComponent = iconMap[selectedExperience.icon] || Target;

    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-800 to-indigo-950 text-white pt-6 pb-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-400 opacity-5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-8">
              <Breadcrumb
                variant="white"
                items={[
                  { label: t('experiences.title'), path: '/experiencias' },
                  { label: selectedExperience.nombre }
                ]}
              />
            </div>

            <button
              onClick={handleBackToList}
              className="group mb-10 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Volver a todas las experiencias
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-[9px] font-black uppercase tracking-widest mb-2">
                  Ruta de {selectedExperience.categoria}
                </span>
                <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tight leading-tight text-white">
                  {selectedExperience.nombre}
                </h1>
                <p className="text-sm md:text-base text-blue-100 max-w-xl leading-relaxed font-medium opacity-80">
                  {selectedExperience.descripcion}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <FileText className="w-3.5 h-3.5 text-blue-300" />
                    <span className="font-bold text-[10px] tracking-tight text-white/90">
                      {expProcedures.length} Trámites
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-blue-300" />
                    <span className="font-bold text-[10px] tracking-tight text-white/90">
                      {selectedExperience.duracion_estimada}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-24 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase border-b-2 border-blue-600 pb-1">Tu Hoja de Ruta</h2>
              </div>

              <div className="space-y-0 relative">
                {/* Visual Connector Line */}
                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-600 via-blue-200 to-transparent opacity-20"></div>

                <div className="space-y-12">
                  {expProcedures.map((procedure, index) => (
                    <div key={procedure.id} className="relative pl-12 group">
                      {/* Step Indicator */}
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-white border border-blue-100 flex items-center justify-center font-black text-blue-600 text-sm shadow-sm z-10 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                        {index + 1}
                      </div>

                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:border-blue-100 border-l-4 border-l-blue-600/20 hover:border-l-blue-600 flex flex-col md:flex-row gap-5 items-start md:items-center group/card">
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {procedure.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-4 font-medium leading-relaxed">
                            {procedure.description}
                          </p>

                          <div className="flex flex-wrap gap-3 mb-2">
                            {procedure.institutions && (
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                <Building2 className="w-3 h-3 text-blue-500" />
                                <span>{procedure.institutions.name}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                              <Clock className="w-3 h-3 text-blue-500" />
                              <span>{procedure.duration}</span>
                            </div>
                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(procedure.type)}`}>
                              {getTypeIcon(procedure.type)} {procedure.type}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/tramite/${procedure.id}`}
                          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-6 py-3 rounded-xl font-black text-sm transition-all group/btn"
                        >
                          Ver Tramite
                          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {selectedExperience.pasos_adicionales.length > 0 && (
                <div className="mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-100">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Consejos de Expertos</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedExperience.pasos_adicionales.map((paso, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                        <div className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center font-black text-[10px] shadow-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-emerald-900 font-bold leading-relaxed text-xs">{paso}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Notice */}
              <div className="mt-12 bg-blue-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/30">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <AlertCircle className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black mb-1">Antes de empezar...</h4>
                    <p className="text-blue-100 font-medium text-xs leading-relaxed opacity-90">
                      Recuerda que algunos de estos trámites se pueden realizar en paralelo. Te recomendamos leer cada guía individual para optimizar tu tiempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb variant="white" items={[{ label: t('experiences.title') }]} />
          </div>

          <div className="text-center">
            <Target className="w-16 h-16 mx-auto mb-4" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                {t('experiences.title')}
              </h1>
              <div className="mt-2">
                <InfoTooltip
                  text="Las Experiencias Guiadas te muestran todos los trámites necesarios para alcanzar una meta específica, organizados paso a paso en el orden correcto."
                  position="bottom"
                />
              </div>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('experiences.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar experiencias... (ej: negocio, semillas, exportar)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Filtrar por categoría
            </h3>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedCategory === 'all'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedCategory === 'all' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Target className={`w-5 h-5 ${
                  selectedCategory === 'all' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${
                  selectedCategory === 'all' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  Todas
                </div>
                <div className="text-sm text-gray-600">
                  {getCategoryCount('all')} experiencias
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('business')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedCategory === 'business'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedCategory === 'business' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Rocket className={`w-5 h-5 ${
                  selectedCategory === 'business' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${
                  selectedCategory === 'business' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  Negocios y emprendimiento
                </div>
                <div className="text-sm text-gray-600">
                  {getCategoryCount('business')} experiencias
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('identity')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedCategory === 'identity'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedCategory === 'identity' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <CreditCard className={`w-5 h-5 ${
                  selectedCategory === 'identity' ? 'text-green-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${
                  selectedCategory === 'identity' ? 'text-green-900' : 'text-gray-900'
                }`}>
                  Identidad y documentos
                </div>
                <div className="text-sm text-gray-600">
                  {getCategoryCount('identity')} experiencias
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('education')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedCategory === 'education'
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedCategory === 'education' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <BookOpen className={`w-5 h-5 ${
                  selectedCategory === 'education' ? 'text-purple-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${
                  selectedCategory === 'education' ? 'text-purple-900' : 'text-gray-900'
                }`}>
                  Educación y formación
                </div>
                <div className="text-sm text-gray-600">
                  {getCategoryCount('education')} experiencias
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('employment')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedCategory === 'employment'
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedCategory === 'employment' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <UserCheck className={`w-5 h-5 ${
                  selectedCategory === 'employment' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${
                  selectedCategory === 'employment' ? 'text-orange-900' : 'text-gray-900'
                }`}>
                  Trabajo y empleo
                </div>
                <div className="text-sm text-gray-600">
                  {getCategoryCount('employment')} experiencias
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Results count with loading indicator */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredExperiences.length} {filteredExperiences.length === 1 ? 'experiencia' : 'experiencias'}
            {selectedCategory !== 'all' && (
              <span className="ml-2 text-blue-600 font-medium">
                en la categoría seleccionada
              </span>
            )}
          </p>
          {isFiltering && <LoadingSpinner size="sm" inline />}
        </div>

        {/* Experiences grid */}
        {isFiltering ? (
          <LoadingSpinner size="lg" text="Filtrando experiencias..." />
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => {
            const IconComponent = iconMap[experience.icon] || Target;
            const expProcedures = getExperienceProcedures(experience.id);
            const colors = getColorClasses(experience.color);

            return (
              <button
                key={experience.id}
                onClick={() => handleSelectExperience(experience.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left group border-2 border-transparent hover:border-blue-500"
              >
                <div className={`${colors.bg} p-6`}>
                  <IconComponent className={`w-12 h-12 ${colors.icon} mb-4`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {experience.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {experience.descripcion}
                  </p>
                  <span className={`inline-block ${colors.icon} text-xs px-3 py-1 rounded-full font-semibold bg-white`}>
                    {experience.categoria}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {expProcedures.length} {t('categories.procedures')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{experience.duracion_estimada}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all pt-2">
                    {t('procedure.viewDetails')}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        )}

        {!isFiltering && filteredExperiences.length === 0 && (
          <EmptyState
            title="No se encontraron experiencias"
            description="Intenta con otros términos de búsqueda o explora nuestras sugerencias"
            type="search"
            searchQuery={searchQuery}
            suggestions={[
              'Exportar semillas',
              'Abrir un negocio',
              'Registro sanitario',
              'Importar productos',
              'Patente de comercio'
            ]}
            showHomeLink={false}
          />
        )}
      </div>
    </div>
  );
}
