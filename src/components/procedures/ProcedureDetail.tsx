import React from 'react';
import {
  Clock,
  Building2,
  User,
  Users,
  FileText,
  CheckCircle,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Info,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Zap,
  Scale,
  ExternalLink as ExternalLinkIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Procedure } from '../../lib/data';
import Breadcrumb from '../common/Breadcrumb';
import SocialShareButton from '../common/SocialShareButton';
import { AcronymText } from '../common/AcronymTooltip';
import { useReportModal } from '../../contexts/ReportModalContext';

interface ProcedureDetailProps {
  procedure: Procedure;
}

export default function ProcedureDetail({ procedure }: ProcedureDetailProps) {
  const { openReportModal } = useReportModal();
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'digital': return <Zap className="w-4 h-4" />;
      case 'presencial': return <Building2 className="w-4 h-4" />;
      case 'mixto': return <Globe className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'digital': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'presencial': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mixto': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const parseArrayField = (field: string[] | string | undefined): string[] => {
    if (!field) return [];
    let stringData = '';
    if (typeof field === 'string') stringData = field;
    else if (Array.isArray(field)) {
      if (field.length === 1 && typeof field[0] === 'string' && field[0].startsWith('[')) stringData = field[0];
      else return field.map(item => typeof item === 'string' ? item.replace(/^["'\\]+|["'\\]+$/g, '') : item).filter(Boolean);
    }
    if (stringData) {
      try {
        const parsed = JSON.parse(stringData);
        if (Array.isArray(parsed)) return parsed.map(item => typeof item === 'string' ? item.replace(/^["'\\]+|["'\\]+$/g, '') : item).filter(Boolean);
      } catch (e) {
        const cleanStr = stringData.replace(/^\[|\]$/g, '').replace(/"/g, '');
        return cleanStr.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }
    }
    return [];
  };

  const requirements = parseArrayField(procedure.requirements);
  const steps = parseArrayField(procedure.steps);
  const institutionName = procedure.institutions?.name || 'N/A';

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Header Background */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white pt-8 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            variant="white"
            items={[
              { label: 'Catálogo de Trámites', path: '/catalogo' },
              { label: procedure.name }
            ]}
          />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(procedure.type)}`}>
                  {getTypeIcon(procedure.type)} {procedure.type}
                </span>
                {procedure.subcategory && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/90 border border-white/20">
                    {procedure.subcategory}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-white">
                {procedure.name}
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl leading-relaxed opacity-90">
                <AcronymText text={procedure.description || procedure.full_description} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Quick Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Building2, label: 'Institución', value: institutionName, color: 'text-blue-600', bg: 'bg-white' },
            { icon: Clock, label: 'Duración', value: procedure.duration || 'Variable', color: 'text-indigo-600', bg: 'bg-white' },
            { icon: DollarSign, label: 'Costo', value: procedure.costo || 'Gratuito', color: 'text-emerald-600', bg: 'bg-white' },
            { icon: User, label: 'Público', value: procedure.user_type, color: 'text-orange-600', bg: 'bg-white' },
          ].map((item, idx) => (
            <div key={idx} className={`${item.bg} p-4 rounded-xl shadow-lg shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1`}>
              <item.icon className={`w-5 h-5 ${item.color} mb-1.5`} />
              <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-xs font-bold text-gray-900 capitalize leading-tight line-clamp-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Online Link Section (Moved from here) */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Steps Section - Reimagined as a Timeline */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Pasos a seguir</h2>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md uppercase">
                  {steps.length} Pasos
                </span>
              </div>
              
              <div className="p-8">
                <div className="space-y-0 relative">
                  {/* The Timeline Line */}
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-600 to-blue-50"></div>
                  
                  {steps.map((step, index) => {
                    const isObject = typeof step !== 'string' && step !== null;
                    const title = isObject ? (step as any).title : '';
                    const description = isObject ? (step as any).description : step;

                    return (
                      <div key={index} className="relative pl-16 pb-12 last:pb-0 group">
                        {/* Step Circle */}
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 font-black text-base shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all z-10">
                          {index + 1}
                        </div>
                        
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                          {title && (
                            <h4 className="text-base font-black text-blue-900 mb-1">
                              <AcronymText text={title} />
                            </h4>
                          )}
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            <AcronymText text={description} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

              {/* Info Cards (Legal & Update) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-2xl">
                    <Scale className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Marco Legal</h3>
                    <p className="text-sm text-gray-700 font-bold leading-tight">{procedure.respaldo_legal || 'No especificado'}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-2xl">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Última Actualización</h3>
                    <p className="text-sm text-gray-700 font-bold leading-tight">
                      {procedure.fecha_actualizado || procedure.updated_at ? new Date(procedure.fecha_actualizado || procedure.updated_at!).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '20 de octubre de 2025'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Link Section */}
              {procedure.enlace && (
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-40"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-blue-900 mb-6 tracking-tight">Ir al trámite en línea</h3>
                    <div className="mb-8">
                      <a
                        href={procedure.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#003E5F] hover:bg-[#002a41] text-white px-10 py-4 rounded-lg font-bold transition-all shadow-lg active:scale-95"
                      >
                        Ver Trámite
                      </a>
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                      Información proporcionada por: <span className="text-blue-900 font-bold">{institutionName}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Information (Restored Full Version) */}
              <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-blue-900 tracking-tight">Información de Contacto</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-sm font-black text-blue-700 uppercase tracking-widest mb-4">Institución Responsable</h4>
                    <p className="text-xl font-bold text-blue-900 mb-6">{institutionName}</p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-blue-700 font-bold hover:text-blue-900 cursor-pointer group transition-colors">
                        <PhoneIcon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-sm">{procedure.institutions?.phone || 'Consulta el directorio telefónico oficial'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-blue-700 font-bold hover:text-blue-900 cursor-pointer group transition-colors">
                        <MailIcon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-sm">{procedure.institutions?.email || 'Información disponible en el sitio web oficial'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-blue-700 font-bold hover:text-blue-900 cursor-pointer group transition-colors">
                        <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-sm line-clamp-2">{procedure.institutions?.address || 'Ubicaciones en el sitio web de la institución'}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-blue-700 uppercase tracking-widest mb-4">Recursos Adicionales</h4>
                    <ul className="space-y-4">
                      {procedure.institutions?.website && (
                        <li className="flex items-center gap-3 text-blue-700 font-bold hover:text-blue-900 cursor-pointer group transition-colors">
                          <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <a 
                            href={procedure.institutions.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm flex items-center gap-2"
                          >
                            Sitio web oficial de {procedure.institutions.name}
                            <ExternalLinkIcon className="w-3 h-3 opacity-50" />
                          </a>
                        </li>
                      )}
                      <li className="flex items-center gap-3 text-blue-700 font-bold hover:text-blue-900 cursor-pointer group transition-colors">
                        <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">
                          {procedure.institutions?.working_hours || 'Horarios de atención disponibles en línea'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Aviso Importante */}
              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-start gap-6">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100 flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-amber-900 mb-2">Aviso Importante</h4>
                  <p className="text-amber-800 font-bold text-sm leading-relaxed opacity-80">
                    Esta información es recopilada y verificada por Red Ciudadana para facilitar el acceso ciudadano. Siempre confirme los requisitos y procedimientos actuales en las fuentes oficiales de la institución antes de realizar su trámite. Los procesos pueden cambiar sin previo aviso.
                  </p>
                </div>
              </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Requirements Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden sticky top-8">
              <div className="px-6 py-5 bg-orange-500 text-white">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-lg font-extrabold">Requisitos</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {requirements.length > 0 ? requirements.map((req, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div className="mt-1">
                      <div className="w-5 h-5 rounded-md border-2 border-orange-200 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 leading-tight">
                      <AcronymText text={req} />
                    </p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No se requieren documentos específicos.</p>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                {procedure.enlace && (
                  <a
                    href={procedure.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-200 active:scale-95"
                  >
                    INICIAR TRÁMITE <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Info className="w-24 h-24 rotate-12" />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">¿Necesitas ayuda?</h3>
              <p className="text-blue-100 text-sm mb-6 relative z-10">
                Confirmamos esta información regularmente, pero los procesos pueden variar. Si encuentras un error, por favor infórmanos.
              </p>
              <button 
                onClick={() => openReportModal(procedure.name, institutionName)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all relative z-10"
              >
                Reportar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}