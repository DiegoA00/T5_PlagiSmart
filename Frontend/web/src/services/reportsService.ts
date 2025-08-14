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
  supervisor: string;
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
  supervisor: string;
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
      console.log("🔥 FUMIGATION REPORT - API SERVICE LAYER");
      console.log("📤 Making POST request to: /reports/fumigations");
      console.log("📦 Payload size:", JSON.stringify(data).length, "characters");
      console.log("🏷️  Fumigation ID (lot.id):", data.id);
      console.log("👥 Technicians:", data.technicians.length, "technicians");
      console.log("📋 Supplies:", data.supplies.length, "supplies");
      console.log("🎯 Request timestamp:", new Date().toISOString());
      
      const response = await apiClient.post('/reports/fumigations', data);
      
      console.log("✅ FUMIGATION REPORT - RESPONSE RECEIVED");
      console.log("📨 Response status:", response.status);
      console.log("📄 Response data:", response.data);
      console.log("⏰ Response timestamp:", new Date().toISOString());
      
      return response.data;
    } catch (error: any) {
      console.error("❌ FUMIGATION REPORT - ERROR OCCURRED");
      console.error("🚨 Error details:", error);
      console.error("📊 Error status:", error.response?.status);
      console.error("💬 Error message:", error.response?.data);
      
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
      throw new Error(error.response?.data?.message || "Error al crear el reporte de limpieza");
    }
  },

  getFumigationReport: async (fumigationId: number): Promise<FumigationReportResponse> => {
    try {
      const response = await apiClient.get(`/reports/fumigations/by-fumigation/${fumigationId}`);
      return response.data;
    } catch (error: any) {
      if (isReportNotFoundError(error, 'fumigation')) {
        throw new Error(`No se encontró un reporte de fumigación para el ID ${fumigationId}`);
      }
      throw new Error(error.response?.data?.message || "Error al obtener el reporte de fumigación");
    }
  },

  getCleanupReport: async (fumigationId: number): Promise<CleanupReportResponse> => {
    try {
      const response = await apiClient.get(`/reports/cleanup/by-fumigation/${fumigationId}`);
      return response.data;
    } catch (error: any) {
      if (isReportNotFoundError(error, 'cleanup')) {
        throw new Error(`No se encontró un reporte de limpieza para el ID ${fumigationId}`);
      }
      throw new Error(error.response?.data?.message || "Error al obtener el reporte de limpieza");
    }
  }
};