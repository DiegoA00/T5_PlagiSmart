import apiClient from "./api/apiService";

// DTO para crear una nueva compañía
export interface CreateCompanyDTO {
  name: string;
  businessName: string;
  phoneNumber: string;
  ruc: string;
  address: string;
}

// DTO para actualizar una compañía existente
export interface UpdateCompanyDTO {
  name?: string;
  businessName?: string;
  phoneNumber?: string;
  ruc?: string;
  address?: string;
}

// Respuesta del backend para una compañía
export interface CompanyResponse {
  id: number;
  name: string;
  businessName: string;
  phoneNumber: string;
  ruc: string;
  address: string;
  legalRepresentative: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const companyService = {
  // Crear una nueva compañía
  createCompany: async (companyData: CreateCompanyDTO): Promise<CompanyResponse> => {
    try {
      const response = await apiClient.post('/companies', companyData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al crear la compañía");
    }
  },

  // Obtener la compañía del usuario autenticado
  getUserCompany: async (): Promise<CompanyResponse | null> => {
    try {
      const response = await apiClient.get('/companies/my-company');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // El usuario no tiene compañía
      }
      throw new Error(error.response?.data?.message || "Error al obtener la compañía");
    }
  },

  // Actualizar la compañía del usuario autenticado
  updateUserCompany: async (companyData: UpdateCompanyDTO): Promise<CompanyResponse> => {
    try {
      const response = await apiClient.put('/companies/my-company', companyData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al actualizar la compañía");
    }
  },

  // Eliminar la compañía del usuario autenticado
  deleteUserCompany: async (): Promise<void> => {
    try {
      await apiClient.delete('/companies/my-company');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al eliminar la compañía");
    }
  }
};
