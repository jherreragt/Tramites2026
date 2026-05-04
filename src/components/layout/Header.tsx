import React from 'react';
import { Search, Menu, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logorednegro.png';
import LanguageSelector from '../common/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  onSearchOpen: () => void;
}

export default function Header({ onSearchOpen }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { path: '/', label: t('nav.home'), description: t('nav.homeDesc') },
    { path: '/catalogo', label: t('nav.catalog'), description: t('nav.catalogDesc') },
    { path: '/instituciones', label: t('nav.institutions'), description: t('nav.institutionsDesc') },
    { path: '/experiencias', label: t('nav.experiences'), description: t('nav.experiencesDesc') },
    { path: '/observatorio', label: t('nav.observatory'), description: t('nav.observatoryDesc') },
    { path: '/estadisticas', label: t('nav.statistics'), description: t('nav.statisticsDesc') },
    { path: '/ayuda', label: t('nav.help'), description: t('nav.helpDesc') }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer group">
            <img src={logo} alt="Red Ciudadana" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={item.description}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-800 shadow-sm'
                    : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="p-2.5 text-gray-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              title="Panel de Administración"
            >
              <UserCircle className="h-5 w-5" />
              <span className="hidden lg:block text-sm font-medium">Admin</span>
            </Link>

            <LanguageSelector />

            <button
              onClick={onSearchOpen}
              className="p-2.5 text-gray-400 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-gray-400 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-left px-4 py-3 transition-colors rounded-lg ${
                    isActive(item.path)
                      ? 'text-blue-800 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}