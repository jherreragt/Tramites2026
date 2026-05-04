export type { Procedure, Institution } from '../lib/data';

export interface UserProcedure {
  id: string;
  procedureId: string;
  procedureName: string;
  status: 'recibido' | 'en-revision' | 'aprobado' | 'observado';
  submittedDate: string;
  estimatedCompletion: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface FormData {
  name: string;
  cui: string;
  email: string;
  phone: string;
  document?: File;
  additionalInfo?: string;
}
