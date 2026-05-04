import { useState, useEffect } from 'react';
import { institutionsService, Institution } from '../lib/data';

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await institutionsService.getAll();
      setInstitutions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar instituciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return {
    institutions,
    loading,
    error,
    refetch: fetchInstitutions
  };
}

export function useInstitution(id: string) {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await institutionsService.getById(id);
        setInstitution(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar institución');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstitution();
    }
  }, [id]);

  return {
    institution,
    loading,
    error
  };
}