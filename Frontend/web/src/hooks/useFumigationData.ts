import { useState, useEffect } from "react";
import { fumigationService } from "@/services/fumigationService";
import { FumigationListItem, FumigationDetailResponse } from "@/types/request";

export const useFumigationData = (status: string) => {
  const [fumigations, setFumigations] = useState<FumigationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFumigations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fumigationService.getFumigationsByStatus(status);
      setFumigations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFumigations();
  }, [status]);

  return {
    fumigations,
    loading,
    error,
    refetch: loadFumigations
  };
};

export const useFumigationDetails = () => {
  const [fumigationDetails, setFumigationDetails] = useState<FumigationDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFumigationDetails = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fumigationService.getFumigationDetails(id);
      setFumigationDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setFumigationDetails(null);
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