import React, { useState, useEffect } from 'react';
import { X, Sparkles, Search, Target, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PromoPopup() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem('hasSeenPromo');
    const lastSeenDate = localStorage.getItem('promoLastSeen');
    const today = new Date().toDateString();

    if (!hasSeenPromo || lastSeenDate !== today) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('hasSeenPromo', 'true');
      localStorage.setItem('promoLastSeen', new Date().toDateString());
    }, 300);
  };

  const handleClick = () => {
    localStorage.setItem('hasSeenPromo', 'true');
    localStorage.setItem('promoLastSeen', new Date().toDateString());
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isAnimating
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl shadow-2xl overflow-hidden max-w-sm">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-all z-10"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-6 pb-4">
          <div className="absolute top-0 right-0 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-400 rounded-full p-2 animate-pulse">
                <Sparkles className="w-5 h-5 text-blue-900" />
              </div>
              <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {t('popup.new')}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {t('popup.title')}
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              {t('popup.subtitle')}
            </p>

            <div className="space-y-3 mb-5">
              <Link
                to="/categorias"
                onClick={handleClick}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-lg transition-all group"
              >
                <div className="bg-white/20 rounded-lg p-2 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{t('popup.categories')}</div>
                  <div className="text-blue-100 text-xs">{t('popup.categoriesDesc')}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                to="/experiencias"
                onClick={handleClick}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-lg transition-all group"
              >
                <div className="bg-white/20 rounded-lg p-2 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{t('popup.experiences')}</div>
                  <div className="text-blue-100 text-xs">{t('popup.experiencesDesc')}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                to="/observatorio"
                onClick={handleClick}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-lg transition-all group"
              >
                <div className="bg-white/20 rounded-lg p-2 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{t('popup.observatory')}</div>
                  <div className="text-blue-100 text-xs">{t('popup.observatoryDesc')}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-black/20 px-6 py-3 text-center">
          <button
            onClick={handleClose}
            className="text-white text-xs hover:text-blue-100 transition-colors underline"
          >
            {t('popup.dontShowToday')}
          </button>
        </div>

        <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-yellow-400 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute -top-2 -right-2 w-24 h-24 bg-white rounded-full opacity-10 blur-2xl"></div>
      </div>
    </div>
  );
}
