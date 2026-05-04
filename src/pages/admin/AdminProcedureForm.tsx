import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, AlertCircle, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProcedureForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<{ id: string, name: string }[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [existingSubcategories, setExistingSubcategories] = useState<string[]>([]);
  const [existingLegals, setExistingLegals] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    full_description: '',
    institution_id: '',
    category: '',
    subcategory: '',
    duration: '',
    type: 'presencial',
    user_type: 'persona',
    is_digital: false,
    costo: '',
    codigo_moneda: 'GTQ',
    enlace: '',
    respaldo_legal: '',
    requirements: [] as string[],
    steps: [] as (string | { title: string, description: string })[],
    unidad_direccion: '',
    enlace_respaldo_legal: '',
    fecha_actualizado: new Date().toISOString().split('T')[0],
    // Campos del Observatorio
    obs_adjunta_docs: 'No',
    obs_firma_elec: 'No',
    obs_resultado_elec: 'Físico',
    obs_docs_misma_entidad: 'No',
    obs_decl_jurada: 'No',
    obs_intercambia_datos: 'No',
    obs_portal_interinst: 'No',
    obs_usa_xroad_api: 'No',
    obs_consulta_estado: 'Sí',
    obs_notif_elec: 'Sí',
    obs_info_en_linea: 'Sí',
    obs_atencion_alterna: 'Sí',
    obs_multi_idioma: 'No',
    obs_calif_usuarios: 'N/D',
    obs_req_solo_por_ley: 'Sí',
    obs_normativa_vigente: 'Sí',
    obs_presuncion_buena_fe: 'Sí',
    obs_maturity_level: 0,
    obs_evaluation_score: 0
  });

  const [reqInput, setReqInput] = useState('');
  const [stepInput, setStepInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: instData } = await supabase
        .from('institutions')
        .select('id, name')
        .is('deleted_at', null)
        .order('name');

      if (instData) setInstitutions(instData);

      const { data: allProcedures } = await supabase
        .from('procedures')
        .select('category, subcategory, respaldo_legal')
        .is('deleted_at', null);

      if (allProcedures) {
        setExistingCategories(Array.from(new Set(allProcedures.map(p => p.category).filter(Boolean))).sort());
        setExistingSubcategories(Array.from(new Set(allProcedures.map(p => p.subcategory).filter(Boolean))).sort());
        setExistingLegals(Array.from(new Set(allProcedures.map(p => p.respaldo_legal).filter(Boolean))).sort());
      }

      if (isEditing && id) {
        const { data } = await supabase.from('procedures').select('*').eq('id', id).single();
        if (data) {
          const safeArray = (val: any) => {
            if (Array.isArray(val)) return val;
            try { return JSON.parse(val) || []; } catch { return []; }
          };
          setFormData({
            ...data,
            costo: data.costo ? String(data.costo) : '',
            requirements: safeArray(data.requirements),
            steps: safeArray(data.steps),
            unidad_direccion: data.unidad_direccion || '',
            enlace_respaldo_legal: data.enlace_respaldo_legal || '',
            fecha_actualizado: data.fecha_actualizado || new Date().toISOString().split('T')[0],
            // Valores por defecto para el observatorio si no se encuentran luego
            obs_adjunta_docs: data.is_digital ? 'Sí' : 'No',
            obs_firma_elec: 'No',
            obs_resultado_elec: data.is_digital ? 'Digital' : 'Físico',
            obs_docs_misma_entidad: 'No',
            obs_decl_jurada: 'No',
            obs_intercambia_datos: 'No',
            obs_portal_interinst: 'No',
            obs_usa_xroad_api: 'No',
            obs_consulta_estado: 'Sí',
            obs_notif_elec: 'Sí',
            obs_info_en_linea: 'Sí',
            obs_atencion_alterna: 'Sí',
            obs_multi_idioma: 'No',
            obs_calif_usuarios: 'N/D',
            obs_req_solo_por_ley: 'Sí',
            obs_normativa_vigente: 'Sí',
            obs_presuncion_buena_fe: 'Sí',
            obs_maturity_level: 0,
            obs_evaluation_score: 0
          });

          // Intentar cargar datos del observatorio por el nombre del trámite
          const { data: obsData } = await supabase
            .from('observatory')
            .select('*')
            .eq('tramite', data.name)
            .maybeSingle();

          if (obsData) {
            setFormData(prev => ({
              ...prev,
              obs_adjunta_docs: obsData.adjunta_docs_digitalmente,
              obs_firma_elec: obsData.firma_electronica_avanzada,
              obs_resultado_elec: obsData.resultado_electronico,
              obs_docs_misma_entidad: obsData.docs_misma_entidad,
              obs_decl_jurada: obsData.decl_jurada_innec,
              obs_intercambia_datos: obsData.intercambia_datos,
              obs_portal_interinst: obsData.portal_interinst,
              obs_usa_xroad_api: obsData.usa_xroad_api,
              obs_consulta_estado: obsData.consulta_estado,
              obs_notif_elec: obsData.notificacion_electronica,
              obs_info_en_linea: obsData.info_en_linea,
              obs_atencion_alterna: obsData.atencion_alterna,
              obs_multi_idioma: obsData.multi_idioma,
              obs_calif_usuarios: obsData.calif_usuarios,
              obs_req_solo_por_ley: obsData.req_solo_por_ley,
              obs_normativa_vigente: obsData.normativa_vigente,
              obs_presuncion_buena_fe: obsData.presuncion_buena_fe,
              obs_maturity_level: obsData.maturity_level,
              obs_evaluation_score: obsData.evaluation_score
            }));
          } else {
            // Intentar una búsqueda más flexible si no hubo match exacto
            const { data: flexibleObs } = await supabase
              .from('observatory')
              .select('*')
              .ilike('tramite', `%${data.name.trim()}%`)
              .maybeSingle();

            if (flexibleObs) {
              setFormData(prev => ({
                ...prev,
                obs_adjunta_docs: flexibleObs.adjunta_docs_digitalmente,
                obs_firma_elec: flexibleObs.firma_electronica_avanzada,
                obs_resultado_elec: flexibleObs.resultado_electronico,
                obs_docs_misma_entidad: flexibleObs.docs_misma_entidad,
                obs_decl_jurada: flexibleObs.decl_jurada_innec,
                obs_intercambia_datos: flexibleObs.intercambia_datos,
                obs_portal_interinst: flexibleObs.portal_interinst,
                obs_usa_xroad_api: flexibleObs.usa_xroad_api,
                obs_consulta_estado: flexibleObs.consulta_estado,
                obs_notif_elec: flexibleObs.notificacion_electronica,
                obs_info_en_linea: flexibleObs.info_en_linea,
                obs_atencion_alterna: flexibleObs.atencion_alterna,
                obs_multi_idioma: flexibleObs.multi_idioma,
                obs_calif_usuarios: flexibleObs.calif_usuarios,
                obs_req_solo_por_ley: flexibleObs.req_solo_por_ley,
                obs_normativa_vigente: flexibleObs.normativa_vigente,
                obs_presuncion_buena_fe: flexibleObs.presuncion_buena_fe,
                obs_maturity_level: flexibleObs.maturity_level,
                obs_evaluation_score: flexibleObs.evaluation_score
              }));
            }
          }
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
      // Campos base del trámite para procedures
      const procedureToSave = {
        name: formData.name,
        description: formData.description,
        full_description: formData.full_description,
        institution_id: formData.institution_id,
        category: formData.category,
        subcategory: formData.subcategory,
        duration: formData.duration,
        type: formData.type,
        user_type: formData.user_type,
        is_digital: formData.is_digital,
        costo: formData.costo,
        codigo_moneda: formData.codigo_moneda,
        enlace: formData.enlace,
        respaldo_legal: formData.respaldo_legal,
        requirements: formData.requirements,
        steps: formData.steps,
        unidad_direccion: formData.unidad_direccion,
        enlace_respaldo_legal: formData.enlace_respaldo_legal,
        fecha_actualizado: formData.fecha_actualizado
      };

      if (isEditing) {
        // Obtener el nombre original para actualizar el observatorio correctamente
        const { data: oldData } = await supabase.from('procedures').select('name').eq('id', id).single();
        const oldName = oldData?.name;

        const { error } = await supabase.from('procedures').update(procedureToSave).eq('id', id);
        if (error) throw error;

        // Actualizar el Observatorio
        await supabase.from('observatory').update({
          tramite: formData.name,
          completamente_en_linea: formData.is_digital ? 100 : 0,
          adjunta_docs_digitalmente: formData.obs_adjunta_docs,
          firma_electronica_avanzada: formData.obs_firma_elec,
          resultado_electronico: formData.obs_resultado_elec,
          num_pasos: formData.steps.length,
          num_requisitos: String(formData.requirements.length),
          docs_misma_entidad: formData.obs_docs_misma_entidad,
          decl_jurada_innec: formData.obs_decl_jurada,
          intercambia_datos: formData.obs_intercambia_datos,
          portal_interinst: formData.obs_portal_interinst,
          usa_xroad_api: formData.obs_usa_xroad_api,
          consulta_estado: formData.obs_consulta_estado,
          notificacion_electronica: formData.obs_notif_elec,
          info_en_linea: formData.obs_info_en_linea,
          atencion_alterna: formData.obs_atencion_alterna,
          multi_idioma: formData.obs_multi_idioma,
          calif_usuarios: formData.obs_calif_usuarios,
          req_solo_por_ley: formData.obs_req_solo_por_ley,
          normativa_vigente: formData.obs_normativa_vigente,
          presuncion_buena_fe: formData.obs_presuncion_buena_fe,
          maturity_level: formData.obs_maturity_level,
          evaluation_score: formData.obs_evaluation_score
        }).eq('tramite', oldName || formData.name);

      } else {
        // 1. Insertar el Trámite
        const { error: procError } = await supabase
          .from('procedures')
          .insert([procedureToSave]);

        if (procError) throw procError;

        // 2. Obtener el siguiente ID numérico para el Observatorio
        const { data: lastIdData } = await supabase
          .from('observatory')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        const nextNumericId = (lastIdData && lastIdData.length > 0) ? Number(lastIdData[0].id) + 1 : 1;

        // 3. Insertar en el Observatorio
        const { error: obsError } = await supabase
          .from('observatory')
          .insert([{
            id: nextNumericId,
            tramite: formData.name,
            completamente_en_linea: formData.is_digital ? 100 : 0,
            adjunta_docs_digitalmente: formData.obs_adjunta_docs,
            firma_electronica_avanzada: formData.obs_firma_elec,
            resultado_electronico: formData.obs_resultado_elec,
            num_pasos: formData.steps.length,
            num_requisitos: String(formData.requirements.length),
            docs_misma_entidad: formData.obs_docs_misma_entidad,
            decl_jurada_innec: formData.obs_decl_jurada,
            intercambia_datos: formData.obs_intercambia_datos,
            portal_interinst: formData.obs_portal_interinst,
            usa_xroad_api: formData.obs_usa_xroad_api,
            consulta_estado: formData.obs_consulta_estado,
            notificacion_electronica: formData.obs_notif_elec,
            info_en_linea: formData.obs_info_en_linea,
            atencion_alterna: formData.obs_atencion_alterna,
            multi_idioma: formData.obs_multi_idioma,
            calif_usuarios: formData.obs_calif_usuarios,
            req_solo_por_ley: formData.obs_req_solo_por_ley,
            normativa_vigente: formData.obs_normativa_vigente,
            presuncion_buena_fe: formData.obs_presuncion_buena_fe,
            maturity_level: formData.obs_maturity_level,
            evaluation_score: formData.obs_evaluation_score
          }]);

        if (obsError) throw obsError;
      }
      navigate('/admin/procedures');
    } catch (err: any) {
      console.error("Error completo:", err);
      setError(`Error: ${err.message}. Verifica que la tabla 'observatory' tenga el campo 'id' como numérico.`);
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field: 'requirements' | 'steps', val: string, setter: any) => {
    if (!val.trim()) return;
    if (field === 'steps') {
      setFormData(prev => ({ ...prev, steps: [...prev.steps, { title: '', description: val.trim() }] }));
    } else {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], val.trim()] }));
    }
    setter('');
  };

  const removeArrayItem = (field: 'requirements' | 'steps', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...formData.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSteps.length) return;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const updateStep = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...formData.steps];
    const step = newSteps[index];
    
    if (typeof step === 'string') {
      newSteps[index] = { title: '', description: step, [field]: value };
    } else {
      newSteps[index] = { ...step, [field]: value };
    }
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/procedures" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar Trámite' : 'Nuevo Trámite'}</h1>
          <p className="text-gray-600">Completa todos los campos para la plataforma y el observatorio.</p>
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
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Trámite *</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve *</label>
              <textarea required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Completa</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.full_description} onChange={e => setFormData({ ...formData, full_description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institución *</label>
              <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.institution_id} onChange={e => setFormData({ ...formData, institution_id: e.target.value })}>
                <option value="">Selecciona...</option>
                {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <input required type="text" list="catList" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
              <datalist id="catList">{existingCategories.map((c, i) => <option key={i} value={c} />)}</datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad o dirección</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.unidad_direccion} onChange={e => setFormData({ ...formData, unidad_direccion: e.target.value })} placeholder="Ej: Dirección de Catastro" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Detalles Operativos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.costo} onChange={e => setFormData({ ...formData, costo: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.codigo_moneda} onChange={e => setFormData({ ...formData, codigo_moneda: e.target.value })}>
                <option value="GTQ">Quetzales (GTQ)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" checked={formData.is_digital} onChange={e => setFormData({ ...formData, is_digital: e.target.checked })} />
                <span className="text-sm font-medium text-gray-700">¿Es Digital?</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enlace (si aplica)</label>
              <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.enlace} onChange={e => setFormData({ ...formData, enlace: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Respaldo Legal (Texto)</label>
              <input type="text" list="legList" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.respaldo_legal} onChange={e => setFormData({ ...formData, respaldo_legal: e.target.value })} />
              <datalist id="legList">{existingLegals.map((l, i) => <option key={i} value={l} />)}</datalist>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enlace a respaldo legal (URL)</label>
              <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.enlace_respaldo_legal} onChange={e => setFormData({ ...formData, enlace_respaldo_legal: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Última fecha de actualización</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.fecha_actualizado} onChange={e => setFormData({ ...formData, fecha_actualizado: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">3. Requisitos y Pasos</h2>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Requisitos</label>
            <div className="flex space-x-2">
              <input type="text" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('requirements', reqInput, setReqInput))} />
              <button type="button" onClick={() => addArrayItem('requirements', reqInput, setReqInput)} className="px-4 py-2 bg-gray-100 rounded-lg">Agregar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                  {req} <button type="button" onClick={() => removeArrayItem('requirements', i)}><Trash2 className="w-3 h-3 text-red-400" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Pasos del Procedimiento</label>
              <span className="text-xs text-gray-500">Puedes reordenar los pasos usando las flechas</span>
            </div>
            
            <div className="flex space-x-2">
              <input type="text" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Nueva descripción de paso..." value={stepInput} onChange={e => setStepInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('steps', stepInput, setStepInput))} />
              <button type="button" onClick={() => addArrayItem('steps', stepInput, setStepInput)} className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100">Agregar Paso</button>
            </div>

            <div className="space-y-3">
              {formData.steps.map((step, i) => {
                const isObject = typeof step !== 'string';
                const title = isObject ? step.title : '';
                const description = isObject ? step.description : step;

                return (
                  <div key={i} className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative group">
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button type="button" onClick={() => moveStep(i, 'up')} disabled={i === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button type="button" onClick={() => moveStep(i, 'down')} disabled={i === formData.steps.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button type="button" onClick={() => removeArrayItem('steps', i)} className="p-1 text-red-400 hover:text-red-600 ml-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <input 
                        type="text" 
                        placeholder="Título del paso (opcional)" 
                        className="w-full px-3 py-1 text-sm font-semibold border-b border-transparent focus:border-blue-300 bg-transparent"
                        value={title}
                        onChange={(e) => updateStep(i, 'title', e.target.value)}
                      />
                      <textarea 
                        rows={2}
                        placeholder="Descripción detallada del paso..." 
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500"
                        value={description}
                        onChange={(e) => updateStep(i, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
              {formData.steps.length === 0 && (
                <p className="text-center py-4 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">No hay pasos agregados aún.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">4. Datos del Observatorio (Avanzado)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjunta docs digitalmente</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.obs_adjunta_docs} onChange={e => setFormData({ ...formData, obs_adjunta_docs: e.target.value })}>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma electrónica avanzada</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.obs_firma_elec} onChange={e => setFormData({ ...formData, obs_firma_elec: e.target.value })}>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resultado electrónico</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.obs_resultado_elec} onChange={e => setFormData({ ...formData, obs_resultado_elec: e.target.value })}>
                <option value="Físico">Físico</option>
                <option value="Digital">Digital</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intercambio de datos</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.obs_intercambia_datos} onChange={e => setFormData({ ...formData, obs_intercambia_datos: e.target.value })}>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación (0-100)</label>
                <input type="number" min="0" max="100" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.obs_evaluation_score} onChange={e => setFormData({ ...formData, obs_evaluation_score: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Madurez (0-5)</label>
                <input type="number" step="0.1" min="0" max="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.obs_maturity_level} onChange={e => setFormData({ ...formData, obs_maturity_level: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/admin/procedures" className="px-6 py-2 border rounded-lg">Cancelar</Link>
          <button type="submit" disabled={saving} className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? <LoadingSpinner size="sm" inline /> : <Save className="w-5 h-5" />}
            <span>{saving ? 'Guardando...' : 'Guardar Trámite'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProcedureForm;