import React from 'react';
import { useParams } from 'react-router-dom';
import { useProcedure } from '../hooks/useProcedures';
import ProcedureDetail from '../components/procedures/ProcedureDetail';

const ProcedureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { procedure, loading, error } = useProcedure(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del trámite...</p>
        </div>
      </div>
    );
  }

  if (error || !procedure) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trámite no encontrado</h1>
          <p className="text-gray-600 mb-4">
            {error || 'El trámite que buscas no existe o ha sido removido.'}
          </p>
          <a
            href="/catalogo"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al catálogo
          </a>
        </div>
      </div>
    );
  }

  return <ProcedureDetail procedure={procedure} />;
};

export default ProcedureDetailPage;