import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Experience {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
  color: string;
  categoria: string;
  duracion_estimada: string;
  ids_procedures: string[];
  pasos_adicionales: string[];
  respaldo_legal?: string;
  updated_at?: string;
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('experiences')
          .select('*')
          .order('nombre');

        if (supabaseError) throw supabaseError;
        
        setExperiences(data as Experience[]);
      } catch (err: any) {
        setError(err.message || 'Error al cargar experiencias');
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, []);

  return {
    experiences,
    loading,
    error
  };
}
