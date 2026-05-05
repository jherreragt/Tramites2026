import { supabase } from './supabase';

// --- INTERFACES ACTUALIZADAS ---

export interface Institution {
  id: string;
  uuid?: string;
  name: string;
  full_name: string;
  description?: string;
  category: string;
  website?: string;
  phone?: number | string;
  email?: string;
  address?: string;
  working_hours?: string;
  services?: string;
  is_digital_enabled: boolean;
  social_media?: any;
  created_at: string;
  updated_at: string;
}

export interface Procedure {
  id: string;
  uuid?: string;
  name: string;
  description: string;
  full_description: string;
  institution_id?: string;
  category: string;
  subcategory?: string;
  duration: string;
  type: string;
  user_type: string;
  requirements: string[];
  steps: any[]; // Puede ser string[] o { title: string, description: string }[]
  is_digital: boolean;
  respaldo_legal?: string;
  enlace_respaldo_legal?: string;
  unidad_direccion?: string;
  fecha_actualizado?: string;
  fecha_revision?: string;
  codigo_moneda?: string;
  costo?: string | number;
  documento_obtenible?: string;
  enlace?: string;
  created_at: string;
  updated_at: string;
  institutions?: Institution;
}

// Interfaz ajustada a tu nuevo script de SQL del Observatorio
export interface ObservatoryData {
  id: number;
  tramite: string;
  name?: string; // Alias para compatibilidad con la UI
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

export interface ProcedureComment {
  id: string;
  procedure_id: string;
  author_name: string;
  author_email?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// --- FUNCIONES DE MAPEO ---

function mapProcedure(raw: any, institution?: any): Procedure {
  const parseSteps = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return val.split(', ');
      }
    }
    return [];
  };

  return {
    ...raw,
    id: String(raw.id),
    institution_id: String(raw.institution_id),
    requirements: typeof raw.requirements === 'string' ? raw.requirements.split(', ') : raw.requirements || [],
    steps: parseSteps(raw.steps),
    institutions: institution ? { ...institution, id: String(institution.id) } : undefined,
  };
}

// --- SERVICIOS ---

export const proceduresService = {
  async getAll(): Promise<Procedure[]> {
    const { data, error } = await supabase
      .from('procedures')
      .select('*, institutions(*)');

    if (error) {
      console.error('Error fetching procedures:', error);
      return [];
    }
    return (data || []).map(p => mapProcedure(p, p.institutions));
  },

  async getById(id: string): Promise<Procedure | null> {
    const { data, error } = await supabase
      .from('procedures')
      .select('*, institutions(*)')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapProcedure(data, data.institutions);
  },

  async getByInstitutionId(institutionId: string | number): Promise<Procedure[]> {
    const { data, error } = await supabase
      .from('procedures')
      .select('*, institutions(*)')
      .eq('institution_id', institutionId);

    if (error) {
      console.error('Error fetching procedures by institution:', error);
      return [];
    }
    return (data || []).map(p => mapProcedure(p, p.institutions));
  }
};

export const institutionsService = {
  async getAll(): Promise<Institution[]> {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name');

    if (error) return [];
    return (data || []).map(i => ({ ...i, id: String(i.id) }));
  },

  async getById(id: string | number): Promise<Institution | null> {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return { ...data, id: String(data.id) };
  }
};

export const observatoryService = {
  async getAll(): Promise<ObservatoryData[]> {
    const { data, error } = await supabase
      .from('observatory')
      .select('*')
      .order('evaluation_score', { ascending: false });

    if (error) {
      console.error('Error fetching observatory data:', error);
      return [];
    }

    // Mapeamos 'tramite' a 'name' para que los componentes de React no fallen
    return (data || []).map(item => ({
      ...item,
      name: item.tramite
    }));
  }
};

// Servicio de comentarios (Simulado en memoria como lo tenías)
const commentsStorage: { [key: string]: ProcedureComment[] } = {};

export const commentsService = {
  async getByProcedureId(procedureId: string): Promise<ProcedureComment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(commentsStorage[procedureId] || []);
      }, 100);
    });
  },

  async addComment(
    procedureId: string,
    commentData: {
      author_name: string;
      author_email?: string;
      rating: number;
      comment: string;
    }
  ): Promise<ProcedureComment> {
    const newComment: ProcedureComment = {
      id: Math.random().toString(36).substring(2, 15),
      procedure_id: procedureId,
      ...commentData,
      helpful_count: 0,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!commentsStorage[procedureId]) {
      commentsStorage[procedureId] = [];
    }
    commentsStorage[procedureId].unshift(newComment);
    return newComment;
  }
};