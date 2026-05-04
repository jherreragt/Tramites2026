import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart2, CheckCircle, AlertCircle, Search, ExternalLink, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminObservatory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [observatoryData, setObservatoryData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: procData } = await supabase
        .from('procedures')
        .select('id, name, category, institution_id, institutions(name)')
        .is('deleted_at', null)
        .order('name');
        
      const { data: obsData } = await supabase
        .from('observatory')
        .select('id, tramite, evaluation_score, maturity_level');

      if (procData) setProcedures(procData);
      if (obsData) setObservatoryData(obsData);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const getObservatoryStatus = (procName: string) => {
    const normalize = (text: string) => 
      text.toLowerCase()
        .replace(/\s*\(.*?\)\s*/g, ' ') // Quitar contenido entre paréntesis
        .replace(/[/-]/g, ' ') // Reemplazar barras y guiones por espacios
        .replace(/[.,]/g, '') // Quitar puntos y comas
        .replace(/\b(de|del|la|el|o|u|y)\b/g, '') // Quitar conectores
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();

    const normalizedProc = normalize(procName);
    
    return observatoryData.find(obs => {
      const normalizedObs = normalize(obs.tramite);
      return normalizedObs === normalizedProc || 
             normalizedProc.includes(normalizedObs) || 
             normalizedObs.includes(normalizedProc);
    });
  };

  const filteredProcedures = procedures.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.institutions?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const totalInObservatory = procedures.filter(p => getObservatoryStatus(p.name)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estado del Observatorio</h1>
          <p className="text-gray-600">Monitorea qué trámites ya cuentan con datos en el observatorio ciudadano.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Trámites</p>
          <p className="text-3xl font-bold text-gray-900">{procedures.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">En Observatorio</p>
          <p className="text-3xl font-bold text-green-600">{totalInObservatory}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-orange-600">{procedures.length - totalInObservatory}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar trámite o institución..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Trámite</th>
                <th className="px-6 py-4 font-semibold">Institución</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Puntaje</th>
                <th className="px-6 py-4 font-semibold text-center">Nivel</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProcedures.map((proc) => {
                const obs = getObservatoryStatus(proc.name);
                return (
                  <tr key={proc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{proc.name}</p>
                      <p className="text-xs text-gray-500">{proc.category}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {proc.institutions?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {obs ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> En Observatorio
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <AlertCircle className="w-3 h-3 mr-1" /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {obs ? (
                        <span className="font-semibold text-gray-900">{obs.evaluation_score}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {obs ? (
                        <span className="font-semibold text-gray-900">{obs.maturity_level}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/procedures/edit/${proc.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProcedures.length === 0 && (
            <div className="p-8 text-center text-gray-500">No se encontraron trámites con esos criterios.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminObservatory;
