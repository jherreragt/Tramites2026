import { useState, useEffect } from 'react';
import { commentsService, ProcedureComment } from '../lib/data';

export function useComments(procedureId: string) {
  const [comments, setComments] = useState<ProcedureComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentsService.getByProcedureId(procedureId);
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData: {
    author_name: string;
    author_email?: string;
    rating: number;
    comment: string;
  }) => {
    try {
      const data = await commentsService.addComment(procedureId, commentData);
      setComments(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar comentario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const markHelpful = async (commentId: string) => {
    try {
      const voterIp = await getClientIP();
      const result = await commentsService.markHelpful(commentId, voterIp);

      if (result.success) {
        setComments(prev => prev.map(comment =>
          comment.id === commentId
            ? { ...comment, helpful_count: comment.helpful_count + 1 }
            : comment
        ));
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar como útil';
      return { success: false, error: errorMessage };
    }
  };

  // Función auxiliar para obtener IP (simulada)
  const getClientIP = async (): Promise<string> => {
    try {
      // En producción, podrías usar un servicio como ipapi.co
      // Por ahora, generamos un identificador único por sesión
      let sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    } catch {
      return Math.random().toString(36).substring(2, 15);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [procedureId]);

  return {
    comments,
    loading,
    error,
    addComment,
    markHelpful,
    refetch: fetchComments
  };
}