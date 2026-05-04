import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2, Globe, Phone, Mail, MapPin, Clock, ArrowLeft,
  ExternalLink, FileText, CheckCircle, Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import institutionsData from '../data/institutions';
import proceduresData from '../data/procedures';
import Breadcrumb from '../components/common/Breadcrumb';

interface Institution {
  id: number | string;
  name: string;
  full_name?: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  working_hours?: string;
  services?: string;
  is_digital_enabled?: boolean;
  social_media?: string;
  category?: string;
}

interface Procedure {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: string;
  is_digital: boolean;
  type: string;
}

export default function InstitutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutionData = () => {
      try {
        setLoading(true);
        const numId = Number(id);

        const instData = institutionsData.find(i => i.id === numId);
        if (!instData) {
          setError('Institution not found');
          setLoading(false);
          return;
        }

        setInstitution({
          ...instData,
          id: instData.id,
        });

        const procData = proceduresData.filter(p => p.institution_id === numId);
        setProcedures(procData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          duration: p.duration,
          is_digital: p.is_digital,
          type: p.type,
        })));

      } catch (err) {
        console.error('Error fetching institution:', err);
        setError(err instanceof Error ? err.message : 'Error loading institution');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstitutionData();
    }
  }, [id]);

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

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">{error || 'Institution not found'}</p>
          <button
            onClick={() => navigate('/institutions')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: t('institutions.title'), path: '/instituciones' },
            { label: institution.name }
          ]}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/institutions')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{t('institutionDetail.backToList')}</span>
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <Building2 className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{institution.name}</h1>
                  {institution.full_name && (
                    <p className="text-xl text-orange-100 mb-3">{institution.full_name}</p>
                  )}
                  {institution.is_digital_enabled && (
                    <span className="inline-flex items-center bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('institutionDetail.digitalEnabled')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t('institutionDetail.about')}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{institution.description}</p>
            </div>

            {/* Services */}
            {institution.services && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('institutionDetail.services')}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{institution.services}</p>
              </div>
            )}

            {/* Procedures */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('institutionDetail.procedures')}</h2>
                </div>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {procedures.length} {t('institutionDetail.total')}
                </span>
              </div>

              {procedures.length === 0 ? (
                <p className="text-gray-600 text-center py-8">{t('institutionDetail.noProcedures')}</p>
              ) : (
                <div className="space-y-4">
                  {procedures.map((procedure) => (
                    <div
                      key={procedure.id}
                      onClick={() => navigate(`/procedures/${procedure.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                            {procedure.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{procedure.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {procedure.category}
                            </span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {procedure.duration}
                            </span>
                            {procedure.is_digital && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                {t('institutionDetail.digital')}
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors ml-4 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('institutionDetail.contactInfo')}</h2>
              <div className="space-y-4">
                {institution.phone && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{t('institutionDetail.phone')}</p>
                      <p className="text-gray-900">{institution.phone}</p>
                    </div>
                  </div>
                )}

                {institution.email && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{t('institutionDetail.email')}</p>
                      <a
                        href={`mailto:${institution.email}`}
                        className="text-orange-600 hover:text-orange-700 break-all"
                      >
                        {institution.email}
                      </a>
                    </div>
                  </div>
                )}

                {institution.website && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Globe className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{t('institutionDetail.website')}</p>
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 break-all flex items-center space-x-1"
                      >
                        <span>{institution.website}</span>
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                )}

                {institution.address && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{t('institutionDetail.address')}</p>
                      <p className="text-gray-900">{institution.address}</p>
                    </div>
                  </div>
                )}

                {institution.working_hours && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{t('institutionDetail.workingHours')}</p>
                      <p className="text-gray-900">{institution.working_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visit Website Button */}
            {institution.website && (
              <a
                href={institution.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-medium text-center flex items-center justify-center space-x-2"
              >
                <Globe className="h-5 w-5" />
                <span>{t('institutionDetail.visitWebsite')}</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
