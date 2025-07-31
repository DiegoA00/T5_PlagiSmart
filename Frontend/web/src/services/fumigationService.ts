import apiClient from "./api/apiService";
import { FumigationApplication, ApiFumigationApplication } from "@/types/request";

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
  }
};