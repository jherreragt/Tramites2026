import { useState, useEffect } from 'react';
import { proceduresService, Procedure } from '../lib/data';

export function useProcedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proceduresService.getAll();
      setProcedures(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar trámites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  return {
    procedures,
    loading,
    error,
    refetch: fetchProcedures
  };
}

export function useProcedure(id: string) {
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await proceduresService.getById(id);
        setProcedure(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar trámite');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProcedure();
    }
  }, [id]);

  return {
    procedure,
    loading,
    error
  };
}

export function useProcedureSearch(query: string, category?: string) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProcedures = async () => {
      if (!query.trim() && !category) {
        setProcedures([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (category) {
          data = await proceduresService.getByCategory(category);
          if (query.trim()) {
            data = data.filter(proc => 
              proc.name.toLowerCase().includes(query.toLowerCase()) ||
              proc.description.toLowerCase().includes(query.toLowerCase())
            );
          }
        } else {
          data = await proceduresService.search(query);
        }
        
        setProcedures(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProcedures, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, category]);

  return {
    procedures,
    loading,
    error
  };
}