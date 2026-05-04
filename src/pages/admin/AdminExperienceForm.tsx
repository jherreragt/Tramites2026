import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, AlertCircle, Trash2, Plus, Target, Palette } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminExperienceForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allProcedures, setAllProcedures] = useState<{ id: number, name: string }[]>([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    icon: 'Target',
    color: 'from-blue-500 to-blue-700',
    duracion_estimada: '',
    ids_procedures: [] as string[],
    pasos_adicionales: [] as string[]
  });

  const [stepInput, setStepInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Cargar todos los trámites para el multiselect
      const { data: procData } = await supabase
        .from('procedures')
        .select('id, name')
        .is('deleted_at', null)
        .order('name');
      
      if (procData) setAllProcedures(procData);

      if (isEditing && id) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data) {
          setFormData({
            ...data,
            ids_procedures: data.ids_procedures || [],
            pasos_adicionales: data.pasos_adicionales || []
          });
        }
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
      if (isEditing) {
        const { error } = await supabase
          .from('experiences')
          .update(formData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([formData]);
        if (error) throw error;
      }
      navigate('/admin/experiences');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProcedure = (procId: string) => {
    const current = [...formData.ids_procedures];
    const index = current.indexOf(procId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(procId);
    }
    setFormData({ ...formData, ids_procedures: current });
  };

  const addStep = () => {
    if (!stepInput.trim()) return;
    setFormData({ 
      ...formData, 
      pasos_adicionales: [...formData.pasos_adicionales, stepInput.trim()] 
    });
    setStepInput('');
  };

  const removeStep = (index: number) => {
    setFormData({ 
      ...formData, 
      pasos_adicionales: formData.pasos_adicionales.filter((_, i) => i !== index) 
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...formData.pasos_adicionales];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSteps.length) return;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setFormData({ ...formData, pasos_adicionales: newSteps });
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/experiences" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar Experiencia' : 'Nueva Experiencia'}</h1>
          <p className="text-gray-600">Configura el camino guiado para los ciudadanos</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Información de la Experiencia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Experiencia *</label>
              <input 
                required 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                value={formData.nombre} 
                onChange={e => setFormData({ ...formData, nombre: e.target.value })} 
                placeholder="Ej: Quiero abrir mi primera empresa"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea 
                required 
                rows={3} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                value={formData.descripcion} 
                onChange={e => setFormData({ ...formData, descripcion: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <input 
                required 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                value={formData.categoria} 
                onChange={e => setFormData({ ...formData, categoria: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración Estimada</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                value={formData.duracion_estimada} 
                onChange={e => setFormData({ ...formData, duracion_estimada: e.target.value })} 
                placeholder="Ej: 10-15 días"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            Estilo Visual
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icono (Lucide)</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
              >
                <option value="Target">Target</option>
                <option value="Store">Store</option>
                <option value="Briefcase">Briefcase</option>
                <option value="Plane">Plane</option>
                <option value="Users">Users</option>
                <option value="Home">Home</option>
                <option value="GraduationCap">GraduationCap</option>
                <option value="Award">Award</option>
                <option value="Building2">Building2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gradiente de Color</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
              >
                <option value="from-blue-500 to-blue-700">Azul</option>
                <option value="from-emerald-500 to-emerald-700">Verde</option>
                <option value="from-indigo-500 to-indigo-700">Índigo</option>
                <option value="from-cyan-500 to-cyan-700">Cian</option>
                <option value="from-orange-500 to-orange-700">Naranja</option>
                <option value="from-rose-500 to-rose-700">Rosa</option>
                <option value="from-amber-500 to-amber-700">Ámbar</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Trámites Asociados
          </h2>
          <p className="text-sm text-gray-500">Selecciona los trámites que forman parte de esta experiencia en el orden que deben realizarse.</p>
          <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
            {allProcedures.map(proc => (
              <label key={proc.id} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded"
                  checked={formData.ids_procedures.includes(String(proc.id))}
                  onChange={() => handleToggleProcedure(String(proc.id))}
                />
                <span className="ml-3 text-sm text-gray-700">{proc.name}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
             {formData.ids_procedures.map((pid, idx) => {
               const proc = allProcedures.find(p => String(p.id) === pid);
               return (
                 <span key={pid} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                   {idx + 1}. {proc?.name || pid}
                 </span>
               );
             })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Pasos Adicionales</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" 
              placeholder="Ej: Buscar local comercial"
              value={stepInput}
              onChange={e => setStepInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addStep())}
            />
            <button 
              type="button" 
              onClick={addStep}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {formData.pasos_adicionales.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <button type="button" onClick={() => moveStep(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button type="button" onClick={() => moveStep(index, 'down')} disabled={index === formData.pasos_adicionales.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-700">{step}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/admin/experiences" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Cancelar</Link>
          <button 
            type="submit" 
            disabled={saving} 
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? <LoadingSpinner size="sm" inline /> : <Save className="w-5 h-5" />}
            <span>{saving ? 'Guardando...' : 'Guardar Experiencia'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminExperienceForm;
