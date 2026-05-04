import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, Heart, Scale, MapPin, FileText, Building, FileCheck, BookOpen, FileHeart, Shield, Gavel, Home, Zap, Users, Globe, Phone, User, AlignCenterVertical as Certificate, Award, ArrowRight, Briefcase } from 'lucide-react';
import { useProcedures } from '../../hooks/useProcedures';
import { useInstitutions } from '../../hooks/useInstitutions';
import { useLanguage } from '../../contexts/LanguageContext';

// Create icon map for dynamic access
const iconMap = {
  Building2,
  GraduationCap,
  Heart,
  Scale,
  MapPin,
  FileText,
  Building,
  FileCheck,
  BookOpen,
  FileHeart,
  Shield,
  Gavel,
  Home,
  Zap,
  Users,
  Globe,
  Phone,
  Briefcase
};

export default function CategoriesSection() {
  const navigate = useNavigate();
  const { procedures } = useProcedures();
  const { institutions } = useInstitutions();
  const { t } = useLanguage();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/catalogo/${categoryId}`);
  };

  // Calculate real category counts from JSON data
  const categoryMapping = [
    {
      id: 'Negocios',
      name: 'Negocios',
      icon: 'Briefcase',
      dbCategory: 'Negocios'
    },
    {
      id: 'Fiscal',
      name: 'Fiscal',
      icon: 'FileText',
      dbCategory: 'Fiscal'
    },
    {
      id: 'Educación',
      name: 'Educación',
      icon: 'GraduationCap',
      dbCategory: 'Educación'
    },
    {
      id: 'Laboral',
      name: 'Laboral',
      icon: 'Briefcase',
      dbCategory: 'Laboral'
    },
    {
      id: 'Salud',
      name: 'Salud',
      icon: 'Heart',
      dbCategory: 'Salud'
    },
    {
      id: 'Ambiente',
      name: 'Ambiente',
      icon: 'Globe',
      dbCategory: 'Ambiente'
    },
    {
      id: 'Construcción',
      name: 'Construcción',
      icon: 'MapPin',
      dbCategory: 'Construcción'
    },
    {
      id: 'Municipal',
      name: 'Municipal',
      icon: 'Building2',
      dbCategory: 'Municipal'
    },
    {
      id: 'Propiedad Intelectual',
      name: 'Propiedad Intelectual',
      icon: 'Shield',
      dbCategory: 'Propiedad Intelectual'
    },
    {
      id: 'Comercio exterior',
      name: 'Comercio Exterior',
      icon: 'Globe',
      dbCategory: 'Comercio exterior'
    },
    {
      id: 'Sanidad vegetal',
      name: 'Sanidad Vegetal',
      icon: 'Heart',
      dbCategory: 'Sanidad vegetal'
    },
    {
      id: 'Aduanas',
      name: 'Aduanas',
      icon: 'FileText',
      dbCategory: 'Aduanas'
    },
    {
      id: 'Comunicaciones y Transporte',
      name: 'Comunicaciones',
      icon: 'Phone',
      dbCategory: 'Comunicaciones y Transporte'
    }
  ];

  const categories = categoryMapping
    .map(cat => ({
      ...cat,
      count: procedures.filter(p => p.category === cat.dbCategory).length
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  const getInstitutionCount = (category: string) => {
    return institutions.filter(inst => inst.category === category).length;
  };

  return (
    <>
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/categorias')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
        >
          <div className="relative p-12 text-white">
            <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-64 h-64 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-12 h-12" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  {t('home.categories.title')}
                </h2>
              </div>

              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {t('home.categories.description')}
              </p>

              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <div className="text-blue-100 text-sm">{t('home.categories.activeCategories')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                  <div className="text-3xl font-bold">{procedures.length}</div>
                  <div className="text-blue-100 text-sm">{t('home.categories.availableProcedures')}</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 bg-white text-blue-800 px-8 py-4 rounded-xl font-bold text-lg group-hover:gap-4 transition-all shadow-lg">
                {t('home.categories.viewAll')}
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>

    {/* Institutions Section */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Principales Instituciones
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conoce las instituciones gubernamentales más importantes donde puedes realizar tus trámites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* MAGA */}
          <div className="bg-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MAGA</h3>
                <p className="text-sm">Ministerio de Agricultura, Ganadería y Alimentación</p>
              </div>
            </div>
            <p className="text-blue-800 text-sm mb-4">
              Ministerio encargado del desarrollo agropecuario y la seguridad alimentaria del país.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Heart className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MAGA').length} trámites agrícolas</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Heart className="h-4 w-4" />
                <span>Agricultura y ganadería</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2413-7000</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MAGA')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MINECO */}
          <div className="bg-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MINECO</h3>
                <p className="text-sm">Ministerio de Economía</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de promover el desarrollo económico y empresarial del país.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Building2 className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MINECO').length} trámites empresariales</span>
              </div>
              <div className="flex items-center space-x-2 text-sm ">
                <FileCheck className="h-4 w-4" />
                <span>Registro mercantil</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2411-9595</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MINECO')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MINEDUC */}
          <div className="bg-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MINEDUC</h3>
                <p className="text-sm">Ministerio de Educación</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de la educación pública y el desarrollo educativo nacional.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <GraduationCap className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MINEDUC').length} trámites educativos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Certificate className="h-4 w-4" />
                <span>Certificaciones académicas</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2411-9595</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MINEDUC')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MSPAS */}
          <div className="bg-white rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MSPAS</h3>
                <p className="text-sm">Ministerio de Salud Pública</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de formular políticas y programas en materia de salud pública.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Heart className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MSPAS').length} trámites de salud</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Licencias sanitarias</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2440-4747</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MSPAS')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MINGOB */}
          <div className="bg-white rounded-xl p-6 border border-yellow-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MINGOB</h3>
                <p className="text-sm">Ministerio de Gobernación</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de la seguridad interna y el orden público del país.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm ">
                <Shield className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MINGOB').length} trámites de seguridad</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FileCheck className="h-4 w-4" />
                <span>Antecedentes penales</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2413-8888</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MINGOB')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MARN */}
          <div className="bg-white rounded-xl p-6 border border-indigo-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MARN</h3>
                <p className="text-sm">Ministerio de Ambiente y Recursos Naturales</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de la protección del medio ambiente y recursos naturales.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MARN').length} trámites ambientales</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Licencias ambientales</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2423-0500</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MARN')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MINTRABAJO */}
          <div className="bg-white rounded-xl p-6 border border-teal-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MINTRABAJO</h3>
                <p className="text-sm">Ministerio de Trabajo y Previsión Social</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de las políticas laborales y la previsión social.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MINTRABAJO').length} trámites laborales</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FileCheck className="h-4 w-4" />
                <span>Permisos de trabajo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm ">
                <Phone className="h-4 w-4" />
                <span>2422-2500</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MINTRABAJO')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>

          {/* MEM */}
          <div className="bg-white rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MEM</h3>
                <p className="text-sm">Ministerio de Energía y Minas</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Ministerio encargado de la política energética y minera del país.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="h-4 w-4" />
                <span>{procedures.filter(p => p.institutions?.name === 'MEM').length} trámites energéticos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FileCheck className="h-4 w-4" />
                <span>Licencias mineras</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>2277-4400</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalogo?search=MEM')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Ver trámites
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            ¿Necesitas información sobre otra institución?
          </p>
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors inline-flex items-center space-x-2"
          >
            <span>Explorar todas las instituciones</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
    </>
  );
}