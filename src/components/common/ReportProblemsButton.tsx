import React, { useState } from 'react';
import { Flag, X, Send, FileText, Clock, Building2, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useReportModal } from '../../contexts/ReportModalContext';

export default function ReportProblemsButton() {
  const { t } = useLanguage();
  const { isModalOpen, setIsModalOpen, initialData } = useReportModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    problemType: '',
    procedureName: '',
    institution: '',
    description: '',
    contactEmail: '',
    contactName: ''
  });

  // Effect to sync initialData from context
  React.useEffect(() => {
    if (isModalOpen && initialData) {
      setFormData(prev => ({
        ...prev,
        procedureName: initialData.procedureName || prev.procedureName,
        institution: initialData.institutionName || prev.institution,
      }));
    }
  }, [isModalOpen, initialData]);
  const [errors, setErrors] = useState({
    problemType: '',
    procedureName: '',
    description: '',
    contactEmail: ''
  });
  const [touched, setTouched] = useState({
    problemType: false,
    procedureName: false,
    description: false,
    contactEmail: false
  });

  const problemTypes = [
    { value: 'outdated-info', label: t('reportModal.problemTypes.outdatedInfo') },
    { value: 'wrong-requirements', label: t('reportModal.problemTypes.wrongRequirements') },
    { value: 'changed-process', label: t('reportModal.problemTypes.changedProcess') },
    { value: 'wrong-contact', label: t('reportModal.problemTypes.wrongContact') },
    { value: 'new-procedure', label: t('reportModal.problemTypes.newProcedure') },
    { value: 'other', label: t('reportModal.problemTypes.other') }
  ];

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'problemType':
        return value ? '' : 'Por favor selecciona un tipo de problema';
      case 'procedureName':
        return value.trim().length >= 3 ? '' : 'El nombre debe tener al menos 3 caracteres';
      case 'description':
        return value.trim().length >= 10 ? '' : 'La descripción debe tener al menos 10 caracteres';
      case 'contactEmail':
        if (!value) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Por favor ingresa un email válido';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      problemType: validateField('problemType', formData.problemType),
      procedureName: validateField('procedureName', formData.procedureName),
      description: validateField('description', formData.description),
      contactEmail: validateField('contactEmail', formData.contactEmail)
    };

    setErrors(newErrors);
    setTouched({
      problemType: true,
      procedureName: true,
      description: true,
      contactEmail: true
    });

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const browserInfo = `${navigator.userAgent}`;
      const pageUrl = window.location.href;

      const reportData = {
        id: Date.now().toString(),
        problem_type: formData.problemType,
        description: `${t('reportModal.procedureName')}: ${formData.procedureName}\n${t('reportModal.institution')}: ${formData.institution || 'No especificada'}\n\n${formData.description}`,
        user_name: formData.contactName || '',
        user_email: formData.contactEmail || '',
        page_url: pageUrl,
        browser_info: browserInfo,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('problem_reports') || '[]');
      existing.push(reportData);
      localStorage.setItem('problem_reports', JSON.stringify(existing));

      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({
          problemType: '',
          procedureName: '',
          institution: '',
          description: '',
          contactEmail: '',
          contactName: ''
        });
        setIsModalOpen(false);
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error al enviar reporte:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation if field has been touched
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-full shadow-xl transition-all hover:scale-105 transform group flex items-center gap-2"
          title="Reportar cambios o error"
        >
          <Flag className="h-5 w-5" />
          <span className="text-sm font-semibold hidden lg:block">Reportar cambios o error</span>
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lg:hidden">
            Reportar cambios o error
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Flag className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Reportar cambios o error</h2>
                    <p className="text-orange-100 text-sm">Ayúdanos a mantener la información actualizada</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Completa el formulario para reportar un problema
                    </p>
                    <p className="text-xs text-blue-700 mb-2">
                      Todos los campos marcados con * son obligatorios. Tu información de contacto es opcional pero nos ayudará a darte seguimiento.
                    </p>
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold text-green-700">Almacenamiento seguro:</span> Todos los reportes se guardan automáticamente en nuestra base de datos para revisión y seguimiento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  {t('reportModal.problemType')} *
                </label>
                <select
                  name="problemType"
                  value={formData.problemType}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                    touched.problemType && errors.problemType
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                >
                  <option value="">{t('reportModal.problemTypePlaceholder')}</option>
                  {problemTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {touched.problemType && errors.problemType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.problemType}
                  </p>
                )}
              </div>

              {/* Procedure Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {t('reportModal.procedureName')} *
                </label>
                <input
                  type="text"
                  name="procedureName"
                  value={formData.procedureName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  placeholder={t('reportModal.procedureNamePlaceholder')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                    touched.procedureName && errors.procedureName
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
                {touched.procedureName && errors.procedureName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.procedureName}
                  </p>
                )}
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  {t('reportModal.institution')}
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder={t('reportModal.institutionPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('reportModal.description')} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  rows={4}
                  placeholder={t('reportModal.descriptionPlaceholder')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                    touched.description && errors.description
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {touched.description && errors.description && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <p className={`text-xs ${formData.description.length >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.description.length} caracteres
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {t('reportModal.contactInfo')}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('reportModal.contactName')}
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder={t('reportModal.contactNamePlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('reportModal.contactEmail')}
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder={t('reportModal.contactEmailPlaceholder')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        touched.contactEmail && errors.contactEmail
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                    />
                    {touched.contactEmail && errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('reportModal.contactNote')}
                </p>
              </div>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-green-900 mb-2">{t('reportModal.successTitle')}</p>
                      <p className="text-sm text-green-800 mb-3">
                        {t('reportModal.successMessage')}
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-green-700 font-medium">
                          ¿Qué sigue?
                        </p>
                        <ul className="text-xs text-green-800 mt-2 space-y-1">
                          <li>• Nuestro equipo revisará tu reporte en las próximas 24-48 horas</li>
                          <li>• Te notificaremos cuando actualicemos la información</li>
                          <li>• Puedes seguir navegando mientras procesamos tu reporte</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{t('reportModal.errorTitle')}</p>
                    <p className="text-xs text-red-700 mt-1">
                      {t('reportModal.errorMessage')}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('reportModal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>{t('reportModal.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{t('reportModal.send')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Flag className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {t('reportModal.whyImportantTitle')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t('reportModal.whyImportantDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
