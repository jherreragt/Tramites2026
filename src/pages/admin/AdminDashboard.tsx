import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Building2, TrendingUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    procedures: 0,
    institutions: 0,
    recentProcedures: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count procedures
        const { count: procCount } = await supabase
          .from('procedures')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null);

        // Count institutions
        const { count: instCount } = await supabase
          .from('institutions')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null);

        // Get recent procedures
        const { data: recent } = await supabase
          .from('procedures')
          .select('id, name, updated_at')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false })
          .limit(5);

        setStats({
          procedures: procCount || 0,
          institutions: instCount || 0,
          recentProcedures: recent || [],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido al Panel de Control</h1>
        <p className="text-gray-600">Resumen general del sistema de Trámites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Trámites</p>
            <p className="text-3xl font-bold text-gray-900">{stats.procedures}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Instituciones</p>
            <p className="text-3xl font-bold text-gray-900">{stats.institutions}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <p className="text-3xl font-bold text-gray-900">En Línea</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Trámites Actualizados Recientemente</h2>
          <Link to="/admin/procedures" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.recentProcedures.length > 0 ? (
            stats.recentProcedures.map((proc) => (
              <div key={proc.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 line-clamp-1">{proc.name}</p>
                  <p className="text-sm text-gray-500">ID: {proc.id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {new Date(proc.updated_at).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/admin/procedures/edit/${proc.id}`}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No hay trámites recientes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
