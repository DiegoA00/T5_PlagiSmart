import apiClient from "./api/apiService";
import { FumigationApplication } from "@/types/request";

export const fumigationService = {
  getApplicationById: async (id: string): Promise<FumigationApplication> => {
    try {
      const response = await apiClient.get(`/fumigation-applications/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("No autorizado para ver esta solicitud. Por favor verifica tus permisos.");
      }
      throw new Error(error.response?.data?.message || "Error al obtener detalles de la solicitud");
    }
  },
};