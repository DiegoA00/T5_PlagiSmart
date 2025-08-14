import { useState } from 'react';
import { FumigationDetailResponse } from '@/types/request';
import { fumigationService } from '@/services/fumigationService';

export const useFumigationDetails = () => {
  const [fumigationDetails, setFumigationDetails] = useState<FumigationDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFumigationDetails = async (fumigationId: number) => {
    try {
      setLoading(true);
      setError(null);
      const details = await fumigationService.getFumigationDetails(fumigationId);
      setFumigationDetails(details);
    } catch (err: any) {
      setError(err.message || 'Error al cargar detalles de fumigación');
      console.error('Error loading fumigation details:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearDetails = () => {
    setFumigationDetails(null);
    setError(null);
  };

  return {
    fumigationDetails,
    loading,
    error,
    loadFumigationDetails,
    clearDetails
  };
};