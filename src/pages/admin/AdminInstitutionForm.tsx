import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminInstitutionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    description: '',
    category: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    services: '',
    is_digital_enabled: true,
    social_media: [] as { platform: string, url: string }[]
  });

  const [socialInput, setSocialInput] = useState({ platform: '', url: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && id) {
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setFormData({
            name: data.name || '',
            full_name: data.full_name || '',
            description: data.description || '',
            category: data.category || '',
            website: data.website || '',
            phone: data.phone?.toString() || '',
            email: data.email || '',
            address: data.address || '',
            working_hours: data.working_hours || '',
            services: data.services || '',
            is_digital_enabled: data.is_digital_enabled !== false,
            social_media: typeof data.social_media === 'string' 
              ? (data.social_media.startsWith('[') ? JSON.parse(data.social_media) : []) 
              : (Array.isArray(data.social_media) ? data.social_media : [])
          });
        }
      }

      try {
        const { data: allInstitutions, error: catError } = await supabase
          .from('institutions')
          .select('category');
          
        if (!catError && allInstitutions) {
          setExistingCategories(Array.from(new Set(allInstitutions.map(i => i.category).filter(Boolean))).sort() as string[]);
        }
      } catch (e) {
        // Ignorar si la columna no existe aún
        console.warn('Could not fetch categories. Column might not exist yet.');
      }
      
      setLoading(false);
    };

    fetchData();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const dataToSave = {
        ...formData,
        social_media: JSON.stringify(formData.social_media)
      };

      if (isEditing) {
        const { error } = await supabase
          .from('institutions')
          .update(dataToSave)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('institutions')
          .insert([dataToSave]);
        if (error) throw error;
      }
      navigate('/admin/institutions');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar la institución.');
    } finally {
      setSaving(false);
    }
  };

  const addSocialMedia = () => {
    if (!socialInput.platform.trim() || !socialInput.url.trim()) return;
    setFormData(prev => ({
      ...prev,
      social_media: [...prev.social_media, { ...socialInput }]
    }));
    setSocialInput({ platform: '', url: '' });
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social_media: prev.social_media.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/institutions" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Institución' : 'Nueva Institución'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Modifica los detalles de la entidad.' : 'Completa el formulario para registrar una institución.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECCIÓN 1: Información Principal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Identidad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Siglas / Acrónimo *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ej. SAT"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                placeholder="Ej. Superintendencia de Administración Tributaria"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de sus funciones</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                list="instCatList"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
              <datalist id="instCatList">
                {existingCategories.map((c, i) => <option key={i} value={c} />)}
              </datalist>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Contacto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Información de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Física</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horario de Atención</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.working_hours}
                onChange={e => setFormData({...formData, working_hours: e.target.value})}
                placeholder="Ej. Lunes a Viernes de 8:00 a 16:00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Redes Sociales</label>
              
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Red (ej: Facebook)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={socialInput.platform}
                  onChange={e => setSocialInput({...socialInput, platform: e.target.value})}
                />
                <input
                  type="url"
                  placeholder="Link al perfil (https://...)"
                  className="flex-[2] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={socialInput.url}
                  onChange={e => setSocialInput({...socialInput, url: e.target.value})}
                />
                <button
                  type="button"
                  onClick={addSocialMedia}
                  className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Agregar
                </button>
              </div>

              <div className="space-y-2">
                {formData.social_media.map((social, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{social.platform}</span>
                      <span className="text-xs text-gray-500 truncate max-w-xs">{social.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSocialMedia(i)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
                {formData.social_media.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No se han agregado redes sociales.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/admin/institutions"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? <LoadingSpinner size="sm" inline /> : <Save className="w-5 h-5" />}
            <span>{saving ? 'Guardando...' : 'Guardar Institución'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminInstitutionForm;
