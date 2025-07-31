import apiClient from "./api/apiService";

export interface ApiUser {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const usersService = {
  getAllUsers: async (): Promise<ApiUser[]> => {
    try {
      const response = await apiClient.get('/users/all');
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al cargar usuarios");
    }
  },

  getUsersByRole: async (role: string): Promise<ApiUser[]> => {
    try {
      const response = await apiClient.get('/users', {
        params: { role }
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al cargar usuarios por rol");
    }
  },

  changeUserRole: async (email: string): Promise<void> => {
    try {
      await apiClient.put('/users/role', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al cambiar el rol");
    }
  }
};