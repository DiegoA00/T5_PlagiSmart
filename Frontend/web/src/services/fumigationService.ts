import apiClient from "./api/apiService";
import { FumigationApplication, ApiFumigationApplication, FumigationListItem, FumigationDetailResponse } from "@/types/request";

export const fumigationService = {
  getApplicationById: async (id: string): Promise<FumigationApplication> => {
    try {
      const response = await apiClient.get(`/fumigation-applications/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener detalles de la solicitud");
    }
  },

  getAllApplications: async (): Promise<ApiFumigationApplication[]> => {
    try {
      const [pendingApps, rejectedApps] = await Promise.all([
        fumigationService.getPendingApplications(),
        fumigationService.getRejectedApplications()
      ]);
      
      const allApplications = [...pendingApps, ...rejectedApps];
      return allApplications;
    } catch (error: any) {
      throw new Error(error.message || "Error al cargar todas las solicitudes");
    }
  },

  getPendingApplications: async (): Promise<ApiFumigationApplication[]> => {
    try {
      const response = await apiClient.get('/fumigation-applications', {
        params: { status: 'PENDING' }
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error: any) {
      throw new Error(`Error al cargar solicitudes pendientes: ${error.response?.data?.message || error.message}`);
    }
  },

  getRejectedApplications: async (): Promise<ApiFumigationApplication[]> => {
    try {
      const response = await apiClient.get('/fumigation-applications', {
        params: { status: 'REJECTED' }
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error: any) {
      throw new Error(`Error al cargar solicitudes rechazadas: ${error.response?.data?.message || error.message}`);
    }
  },

  getFumigationsByStatus: async (status: string): Promise<FumigationListItem[]> => {
    try {
      const response = await apiClient.get('/fumigations', {
        params: { status }
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error: any) {
      throw new Error(`Error al cargar fumigaciones con status ${status}: ${error.response?.data?.message || error.message}`);
    }
  },

  getFumigationDetails: async (id: number): Promise<FumigationDetailResponse> => {
    try {
      console.log(`🔍 Enviando petición a /fumigations/info/${id}`);
      console.log(`📋 ID del lote: ${id} (tipo: ${typeof id})`);
      console.warn(`⚠️  TEMPORAL: Usando ID extraído del lotNumber. Pendiente que backend incluya 'id' en GET /fumigations`);
      
      const response = await apiClient.get(`/fumigations/info/${id}`);
      
      console.log(`✅ Respuesta recibida para ID ${id}:`, response.data);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al obtener detalles del lote ID ${id}:`, error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        throw new Error(`No se encontró el lote con ID ${id}. Esto puede deberse a que el ID fue extraído del número de lote y no corresponde al ID real del registro.`);
      }
      
      throw new Error(error.response?.data?.message || "Error al obtener detalles de la fumigación");
    }
  }
};