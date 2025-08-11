import { useState, useEffect } from "react";
import { fumigationService } from "@/services/fumigationService";
import { FumigationListItem, FumigationDetailResponse, PaginatedResponse, PageableRequest } from "@/types/request";

export const useFumigationData = (status: string, pageableRequest?: PageableRequest) => {
  const [fumigationsResponse, setFumigationsResponse] = useState<PaginatedResponse<FumigationListItem> | null>(null);
  const [fumigations, setFumigations] = useState<FumigationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFumigations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fumigationService.getFumigationsByStatus(status, pageableRequest);
      
      setFumigationsResponse(response);
      setFumigations(response.content || []);
    } catch (err) {
      
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setFumigationsResponse(null);
      setFumigations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFumigations();
  }, [status, pageableRequest?.page, pageableRequest?.size]);

  return {
    fumigations,
    fumigationsResponse,
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
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
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
