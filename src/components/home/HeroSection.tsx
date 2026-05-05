import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProcedures } from '../../hooks/useProcedures';
import { useInstitutions } from '../../hooks/useInstitutions';
import { useLanguage } from '../../contexts/LanguageContext';
import Slider from '../../assets/TG-09.png'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { procedures } = useProcedures();
  const { institutions } = useInstitutions();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularSearches = [
    'Renovación de DPI',
    'Inscribir empresa',
    'Antecedentes penales',
    'Certificado de salud'
  ];

  const handlePopularSearch = (search: string) => {
    navigate(`/experiencias?search=${encodeURIComponent(search)}`);
  };

  // Calculate real statistics
  const totalProcedures = procedures.length;
  const totalInstitutions = institutions.length;
  const digitalProcedures = procedures.filter(p => p.is_digital).length;
  const digitalPercentage = totalProcedures > 0 ? Math.round((digitalProcedures / totalProcedures) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <img src={Slider} alt="Hero Background" className="absolute right-0 bottom-0 w-1/3 opacity-20 pointer-events-none select-none" 
        style={{ position: 'absolute', top: '0%', left: 0, bottom:0, margin:'auto', width: '2000px'}}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              {t('home.hero.subtitle')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('home.hero.description')}
            <br/><br/>
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.hero.searchPlaceholder')}
                className="w-full pl-16 pr-40 py-5 text-lg rounded-2xl text-gray-900 placeholder-gray-500 border-0 focus:ring-4 focus:ring-blue-300/50 focus:outline-none shadow-2xl backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
              >
                <span>{t('home.hero.searchButton')}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Popular Searches & Category Tags */}
          <div className="mb-12">
            <p className="text-blue-200 text-sm mb-4">Sugerencias:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {['Negocios', 'Salud', 'Educación', 'Fiscal', 'Municipal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/experiencias?search=${cat}`)}
                  className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-all border border-white/20 font-medium"
                >
                  #{cat}
                </button>
              ))}
              <div className="w-full h-2 hidden md:block"></div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearch(search)}
                  className="bg-blue-800/40 backdrop-blur-sm text-blue-50 px-4 py-2 rounded-full text-xs hover:bg-blue-700/60 transition-colors border border-blue-600/30"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
          {/* Real-time Statistics */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {totalProcedures}
              </div>
              <div className="text-sm text-blue-200">
                Trámites disponibles
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {totalInstitutions}
              </div>
              <div className="text-sm text-blue-200">
                Instituciones
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {digitalProcedures}
              </div>
              <div className="text-sm text-blue-200">
                Trámites digitales
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {digitalPercentage}%
              </div>
              <div className="text-sm text-blue-200">
                Digitalización
              </div>
            </div>
          </div> */}

      </div>
    </div>
  );
}