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
  otherDanger: boolean;
}

export interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // Agregamos campos adicionales que podrían estar en UserResponseDTO
  username?: string;
  role?: string;
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

// Interfaces para Cleanup Report
export interface LotDescription {
  stripsState: string;
  fumigationTime: number;
  ppmFosfina: number;
}

export interface CleanupReport {
  id: number;
  location: string;
  supervisor: string;
  date: string;
  startTime: string;
  endTime: string;
  lotDescription: LotDescription;
  industrialSafetyConditions: IndustrialSafetyConditions;
  technicians: Technician[];
  fumigationInfo: FumigationInfo;
  signatures: Signature[];
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
      console.log(`Solicitando reporte para fumigación ID: ${fumigationId}`);
      
      // Para pruebas, simulemos algunos datos cuando no hay backend
      if (fumigationId === 999) {
        console.log('Devolviendo datos simulados para ID 999');
        return {
          id: 999,
          supervisor: "Juan Pérez",
          location: "Bodega Central",
          date: "2024-08-14",
          startTime: "08:00",
          endTime: "17:00",
          observations: "Fumigación completada satisfactoriamente",
          dimensions: {
            height: 10,
            width: 20,
            length: 30
          },
          environmentalConditions: {
            temperature: 28,
            humidity: 65
          },
          industrialSafetyConditions: {
            electricDanger: false,
            fallingDanger: true,
            hitDanger: false,
            otherDanger: false
          },
          technicians: [
            {
              id: 1,
              firstName: "Carlos",
              lastName: "Rodríguez",
              email: "carlos@empresa.com"
            },
            {
              id: 2,
              firstName: "Ana",
              lastName: "García",
              email: "ana@empresa.com"
            }
          ],
          supplies: [
            {
              id: 1,
              name: "Fosfina",
              quantity: 50,
              dosage: "2g/m³",
              kindOfSupply: "Fumigante",
              numberOfStrips: "10"
            }
          ],
          fumigationInfo: {
            id: 1,
            lotNumber: "LOT-2024-001",
            ton: 25,
            portDestination: "Puerto de Guayaquil",
            sacks: 500,
            quality: "Primera",
            dateTime: "2024-08-14T08:00:00",
            status: "COMPLETED",
            message: "Fumigación exitosa"
          },
          signatures: []
        };
      }
      
      const response = await apiClient.get(`/reports/fumigations/by-fumigation/${fumigationId}`);
      console.log('Respuesta del backend recibida:', response.data);
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
  },

  // Función para obtener el reporte de cleanup por ID de fumigación
  async getCleanupReportByFumigationId(fumigationId: number | string): Promise<CleanupReport> {
    try {
      console.log(`Solicitando reporte de cleanup para fumigación ID: ${fumigationId}`);
      
      // Para pruebas, simulemos algunos datos cuando no hay backend
      if (fumigationId === 999) {
        console.log('Devolviendo datos simulados de cleanup para ID 999');
        return {
          id: 999,
          location: "Bodega Central",
          supervisor: "Juan Pérez",
          date: "2024-08-14",
          startTime: "08:00",
          endTime: "17:00",
          lotDescription: {
            stripsState: "Retiradas completamente",
            fumigationTime: 72,
            ppmFosfina: 1000
          },
          industrialSafetyConditions: {
            electricDanger: false,
            fallingDanger: true,
            hitDanger: false,
            otherDanger: false
          },
          technicians: [
            {
              id: 1,
              firstName: "Carlos",
              lastName: "Ruiz",
              email: "carlos.ruiz@example.com"
            },
            {
              id: 2,
              firstName: "Ana",
              lastName: "López",
              email: "ana.lopez@example.com"
            }
          ],
          fumigationInfo: {
            id: 1,
            lotNumber: "LOTE-2024-001",
            ton: 25.5,
            portDestination: "Puerto de Guayaquil",
            sacks: 510,
            quality: "Primera",
            dateTime: "2024-08-14T08:00:00Z",
            status: "APPROVED",
            message: "Lote aprobado para fumigación"
          },
          signatures: []
        };
      }
      
      const response = await apiClient.get(`/reports/cleanup/by-fumigation/${fumigationId}`);
      console.log('Respuesta del backend de cleanup recibida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener reporte de cleanup:', error);
      
      // Manejo específico de errores HTTP
      if (error.response?.status === 404) {
        throw new Error("No se encontró ningún reporte de descarpe para este lote de fumigación");
      }
      
      if (error.response?.status === 400) {
        throw new Error("ID de fumigación inválido");
      }
      
      if (error.response?.status === 403) {
        throw new Error("No tienes permisos para acceder a este reporte de descarpe");
      }
      
      // Para errores 401 en este endpoint específico, tratarlo como "no encontrado"
      if (error.response?.status === 401) {
        console.warn('401 en endpoint de reportes de cleanup - tratando como "no encontrado"');
        throw new Error("No se encontró ningún reporte de descarpe para este lote de fumigación o el reporte aún no está disponible");
      }
      
      if (error.response?.status === 500) {
        throw new Error("Error interno del servidor. Inténtalo más tarde");
      }
      
      // Para otros errores, usar el mensaje del servidor si está disponible
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(serverMessage || "Error al obtener el reporte de descarpe");
    }
  }
};
