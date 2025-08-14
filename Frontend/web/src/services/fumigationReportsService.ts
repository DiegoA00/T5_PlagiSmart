import apiClient from "./api/apiService";

// Interfaces para la respuesta de la API
export interface Dimensions {
  height: number;
  width: number;
  length: number;
}

export interface EnvironmentalConditions {
  temperature: number;
  humidity: number;
}

export interface IndustrialSafetyConditions {
  electricDanger: boolean;
  fallingDanger: boolean;
  hitDanger: boolean;
}

export interface Technician {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Supply {
  id: number;
  name: string;
  quantity: number;
  dosage: string;
  kindOfSupply: string;
  numberOfStrips: string;
}

export interface FumigationInfo {
  id: number;
  lotNumber: string;
  ton: number;
  portDestination: string;
  sacks: number;
  quality: string;
  dateTime: string;
  status: string;
  message: string;
}

export interface Signature {
  id: number;
  signatureType: string;
  fileUrl: string;
  reportId: number;
}

export interface FumigationReport {
  id: number;
  supervisor: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  observations: string;
  dimensions: Dimensions;
  environmentalConditions: EnvironmentalConditions;
  industrialSafetyConditions: IndustrialSafetyConditions;
  technicians: Technician[];
  supplies: Supply[];
  fumigationInfo: FumigationInfo;
  signatures: Signature[];
}

export const fumigationReportsService = {
  getFumigationReport: async (fumigationId: number): Promise<FumigationReport> => {
    try {
      const response = await apiClient.get(`/reports/fumigations/by-fumigation/${fumigationId}`);
      return response.data;
    } catch (error: any) {
      console.log('Fumigation Report Service Error:', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message
      });
      
      // Manejar específicamente diferentes códigos de estado
      if (error.response?.status === 404) {
        throw new Error("No se encontró ningún reporte para este lote de fumigación");
      }
      
      if (error.response?.status === 400) {
        throw new Error("ID de fumigación inválido");
      }
      
      if (error.response?.status === 403) {
        throw new Error("No tienes permisos para acceder a este reporte");
      }
      
      // Para errores 401 en este endpoint específico, tratarlo como "no encontrado"
      // ya que el backend puede estar devolviendo 401 para lotes sin reportes
      if (error.response?.status === 401) {
        console.warn('401 en endpoint de reportes - tratando como "no encontrado" en lugar de cerrar sesión');
        throw new Error("No se encontró ningún reporte para este lote de fumigación o el reporte aún no está disponible");
      }
      
      if (error.response?.status === 500) {
        throw new Error("Error interno del servidor. Inténtalo más tarde");
      }
      
      // Para otros errores, usar el mensaje del servidor si está disponible
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(serverMessage || "Error al obtener el reporte de fumigación");
    }
  }
};
