import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Globe, Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useInstitutions } from '../hooks/useInstitutions';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function InstitutionsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { institutions, loading, error } = useInstitutions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const filteredInstitutions = useMemo(() => {
    setIsFiltering(true);
    const filtered = institutions.filter(institution =>
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTimeout(() => setIsFiltering(false), 300);
    return filtered;
  }, [institutions, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{t('common.error')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: t('institutions.title') }]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('institutions.title')}</h1>
              <p className="text-orange-100 mt-1">{t('institutions.description')}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('institutions.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{t('institutions.totalInstitutions')}</p>
                <p className="text-3xl font-bold text-gray-900">{institutions.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{t('institutions.withWebsite')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {institutions.filter(i => i.website).length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{t('institutions.digitalEnabled')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {institutions.filter(i => i.is_digital_enabled).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ExternalLink className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count with Loading Indicator */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredInstitutions.length} {t('institutions.results')}
          </p>
          {isFiltering && <LoadingSpinner size="sm" inline />}
        </div>

        {/* Institutions Grid */}
        {isFiltering ? (
          <LoadingSpinner size="lg" text={t('common.loading')} />
        ) : filteredInstitutions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">{t('institutions.noResults')}</p>
            <p className="text-gray-500">{t('institutions.tryDifferent')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <div
                key={institution.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate(`/institutions/${institution.id}`)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Building2 className="h-6 w-6 text-orange-600" />
                    </div>
                    {institution.is_digital_enabled && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {t('institutions.digital')}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {institution.name}
                  </h3>

                  {/* Full Name */}
                  {institution.full_name && (
                    <p className="text-sm text-gray-600 font-medium mb-3">
                      {institution.full_name}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {institution.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {institution.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{institution.phone}</span>
                      </div>
                    )}

                    {institution.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{institution.email}</span>
                      </div>
                    )}

                    {institution.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{institution.address}</span>
                      </div>
                    )}

                    {institution.working_hours && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{institution.working_hours}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-medium flex items-center justify-center space-x-2">
                    <span>{t('institutions.viewDetails')}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
