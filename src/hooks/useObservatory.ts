import { useState, useEffect } from 'react';
import { observatoryService } from '../lib/data';

export interface ObservatoryData {
  id: number;
  tramite: string;
  completamente_en_linea: number;
  adjunta_docs_digitalmente: string;
  firma_electronica_avanzada: string;
  resultado_electronico: string;
  num_pasos: number;
  num_requisitos: string;
  docs_misma_entidad: string;
  decl_jurada_innec: string;
  intercambia_datos: string;
  portal_interinst: string;
  usa_xroad_api: string;
  consulta_estado: string;
  notificacion_electronica: string;
  info_en_linea: string;
  atencion_alterna: string;
  multi_idioma: string;
  calif_usuarios: string;
  req_solo_por_ley: string;
  normativa_vigente: string;
  presuncion_buena_fe: string;
  maturity_level: number;
  evaluation_score: number;
  created_at: string;
  updated_at: string;
}

export function useObservatory() {
  const [observatoryData, setObservatoryData] = useState<ObservatoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObservatoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await observatoryService.getAll();
      console.log('Observatory data loaded:', data?.length || 0, 'items');
      setObservatoryData(data || []);
    } catch (err) {
      console.error('Error loading observatory data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos del observatorio');
      setObservatoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservatoryData();
  }, []);

  return {
    observatoryData,
    loading,
    error,
    refetch: fetchObservatoryData
  };
}

export function calculateStats(observatoryData: ObservatoryData[]) {
  return {
    totalProcedures: observatoryData.length,
    averageEvaluation: observatoryData.length > 0
      ? Math.round(observatoryData.reduce((sum, item) => sum + item.evaluation_score, 0) / observatoryData.length)
      : 0,
    digitalProcedures: observatoryData.filter(item => item.completamente_en_linea === 100).length,
    partialDigitalProcedures: observatoryData.filter(item => item.completamente_en_linea === 50).length,
    nonDigitalProcedures: observatoryData.filter(item => item.completamente_en_linea === 0).length,
    excellentProcedures: observatoryData.filter(item => item.maturity_level >= 4.0).length,
    bestProcedures: [...observatoryData]
      .sort((a, b) => b.maturity_level - a.maturity_level)
      .slice(0, 5)
  };
}

export function useObservatoryStats() {
  const { observatoryData, loading, error } = useObservatory();

  const stats = calculateStats(observatoryData);

  return {
    stats,
    loading,
    error
  };
}
