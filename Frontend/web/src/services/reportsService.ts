import apiClient from "./api/apiService";
import { FumigationReportResponse, CleanupReportResponse } from "@/types/request";

interface FumigationReportRequest {
  id: number;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  technicians: { id: number }[];
  supplies: {
    name: string;
    quantity: number;
    dosage: string;
    kindOfSupply: string;
    numberOfStrips: string;
  }[];
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
  environmentalConditions: {
    temperature: number;
    humidity: number;
  };
  industrialSafetyConditions: {
    electricDanger: boolean;
    fallingDanger: boolean;
    hitDanger: boolean;
  };
  observations: string;
}

interface CleanupReportRequest {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  technicians: { id: number }[];
  lotDescription: {
    stripsState: string;
    fumigationTime: number;
    ppmFosfina: number;
  };
  industrialSafetyConditions: {
    electricDanger: boolean;
    fallingDanger: boolean;
    hitDanger: boolean;
    otherDanger: boolean;
  };
}

interface ApiResponse {
  message: string;
}

const isReportNotFoundError = (error: any, reportType?: string): boolean => {
  const errorMessage = error.response?.data?.message || error.message || "";
  
  const fumigationNotFound = (
    errorMessage.includes("FumigationReportNotFoundException") ||
    errorMessage.includes("No report found for fumigation ID")
  );
  
  const cleanupNotFound = (
    errorMessage.includes("CleanupReportNotFoundException") ||
    errorMessage.includes("No cleanup report found") ||
    errorMessage.includes("cleanup report not found")
  );
  
  const generalNotFound = (
    errorMessage.includes("NotFoundException") ||
    errorMessage.includes("not found") ||
    errorMessage.includes("Not found")
  );

  if (reportType === 'fumigation') {
    return fumigationNotFound || generalNotFound;
  } else if (reportType === 'cleanup') {
    return cleanupNotFound || generalNotFound;
  }
  
  return fumigationNotFound || cleanupNotFound || generalNotFound;
};

export const reportsService = {
  createFumigationReport: async (data: FumigationReportRequest): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/reports/fumigations', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Datos inválidos");
      }
      throw new Error(error.response?.data?.message || "Error al crear el reporte de fumigación");
    }
  },

  createCleanupReport: async (data: CleanupReportRequest): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/reports/cleanup', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Datos inválidos");
      }
      throw new Error(error.response?.data?.message || "Error al crear el reporte de descarpe");
    }
  },

  getFumigationReport: async (fumigationId: number): Promise<FumigationReportResponse> => {
    try {
      const response = await apiClient.get(`/reports/fumigations/by-fumigation/${fumigationId}`);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      
      console.log(`Error getting fumigation report for ID ${fumigationId}:`, {
        status,
        message: errorMessage,
        fullError: error
      });

      if (status === 404 || isReportNotFoundError(error, 'fumigation')) {
        const notFoundError = new Error("REPORT_NOT_FOUND");
        (notFoundError as any).status = 404;
        (notFoundError as any).originalMessage = errorMessage;
        throw notFoundError;
      }
      
      if (status === 401) {
        const authError = new Error("NO_AUTH");
        (authError as any).status = 401;
        (authError as any).originalMessage = errorMessage;
        throw authError;
      }
      
      if (status === 403) {
        const forbiddenError = new Error("NO_PERMISSION");
        (forbiddenError as any).status = 403;
        (forbiddenError as any).originalMessage = errorMessage;
        throw forbiddenError;
      }
      
      if (status === 500 && !isReportNotFoundError(error, 'fumigation')) {
        const serverError = new Error("SERVER_ERROR");
        (serverError as any).status = 500;
        (serverError as any).originalMessage = errorMessage;
        throw serverError;
      }
      
      const genericError = new Error("UNKNOWN_ERROR");
      (genericError as any).status = status || 0;
      (genericError as any).originalMessage = errorMessage;
      throw genericError;
    }
  },

  getCleanupReport: async (fumigationId: number): Promise<CleanupReportResponse> => {
    try {
      console.log(`Requesting cleanup report for fumigation ID: ${fumigationId}`);
      const response = await apiClient.get(`/reports/cleanup/by-fumigation/${fumigationId}`);
      console.log(`Cleanup report response:`, response.data);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      
      console.log(`Error getting cleanup report for ID ${fumigationId}:`, {
        status,
        message: errorMessage,
        fullError: error
      });

      if (status === 404 || isReportNotFoundError(error, 'cleanup')) {
        const notFoundError = new Error("REPORT_NOT_FOUND");
        (notFoundError as any).status = 404;
        (notFoundError as any).originalMessage = errorMessage;
        throw notFoundError;
      }
      
      if (status === 401) {
        const authError = new Error("NO_AUTH");
        (authError as any).status = 401;
        (authError as any).originalMessage = errorMessage;
        throw authError;
      }
      
      if (status === 403) {
        const forbiddenError = new Error("NO_PERMISSION");
        (forbiddenError as any).status = 403;
        (forbiddenError as any).originalMessage = errorMessage;
        throw forbiddenError;
      }
      
      if (status === 500 && !isReportNotFoundError(error, 'cleanup')) {
        const serverError = new Error("SERVER_ERROR");
        (serverError as any).status = 500;
        (serverError as any).originalMessage = errorMessage;
        throw serverError;
      }
      
      const genericError = new Error("UNKNOWN_ERROR");
      (genericError as any).status = status || 0;
      (genericError as any).originalMessage = errorMessage;
      throw genericError;
    }
  }
};