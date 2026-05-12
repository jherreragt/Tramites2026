import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminSettings() {
  const [gaId, setGaId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('google_analytics_id')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setGaId(data.google_analytics_id || '');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, google_analytics_id: gaId, updated_at: new Date().toISOString() });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Configuración guardada exitosamente.' });
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Error al guardar la configuración.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordMessage({ type: 'error', text: 'Error al actualizar la contraseña.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h1>
        <p className="mt-2 text-gray-600">Administra las integraciones y configuraciones globales del portal.</p>
      </div>

      <div className="space-y-8">
        {/* Google Analytics Section */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Save className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Google Analytics</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="max-w-md">
                <label htmlFor="ga-id" className="block text-sm font-medium text-gray-700 mb-2">
                  ID de Medición de Google Analytics (G-XXXXXXXXXX)
                </label>
                <input
                  type="text"
                  id="ga-id"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="G-ABC123DEFG"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="mt-3 text-sm text-gray-500">
                  Este ID permitirá al sistema enviar eventos de visitas y clics a tu propiedad de Analytics.
                </p>
              </div>

              {message && (
                <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
                  message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-all font-medium disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar GA ID'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Security Section - Password Change */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Seguridad</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              {passwordMessage && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                  passwordMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {passwordMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updatingPassword || !newPassword}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50"
                >
                  {updatingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
