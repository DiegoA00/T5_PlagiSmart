import apiClient from "./api/apiService";

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

interface ApiResponse {
  message: string;
}

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
  }
};