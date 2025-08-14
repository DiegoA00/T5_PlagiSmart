import { apiService } from './api/apiService';
import { ApiUser } from '@/types/request';

export const usersService = {
  async getAllUsers(): Promise<{ data: ApiUser[] | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<{ content: ApiUser[], totalElements: number } | ApiUser[]>('/users/all');
      
      let usersData: ApiUser[] | null = null;
      
      if (response.data) {
        // Si la respuesta es paginada, extraer el array content
        if (typeof response.data === 'object' && 'content' in response.data && Array.isArray(response.data.content)) {
          console.log('Received paginated users response with', response.data.content.length, 'users');
          usersData = response.data.content;
        } 
        // Si es un array directo
        else if (Array.isArray(response.data)) {
          console.log('Received array users response with', response.data.length, 'users');
          usersData = response.data;
        }
        // Si es otro tipo de objeto, intentar convertir
        else {
          console.log('Received unknown users response format:', response.data);
          usersData = [];
        }
      } else {
        console.log('No data received from users endpoint');
        usersData = [];
      }
      
      return {
        data: usersData,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting all users:', error);
      return {
        data: [],
        success: false,
        message: error.message || 'Error al obtener usuarios'
      };
    }
  },

  async getUsersByRole(role: string): Promise<{ data: ApiUser[] | null; success: boolean; message?: string }> {
    try {
      console.log(`=== getUsersByRole(${role}) ===`);
      // Use the same endpoint as web: /users with role parameter
      const response = await apiService.get<{ content: ApiUser[] }>(`/users?role=${role}&page=0&size=50`);
      
      console.log('Raw API response:', response);
      console.log('Response success:', response.success);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      let usersData: ApiUser[] | null = null;
      
      if (response.data && response.success) {
        // Handle both paginated response and direct array
        if (typeof response.data === 'object' && 'content' in response.data && Array.isArray(response.data.content)) {
          usersData = response.data.content;
          console.log('Extracted paginated data:', usersData.length, 'users');
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
          console.log('Using direct array data:', usersData.length, 'users');
        } else {
          console.log('Unknown data format, setting empty array');
          usersData = [];
        }
      } else {
        console.log('No data or not successful');
        usersData = [];
      }
      
      const result = {
        data: usersData,
        success: response.success,
        message: response.message
      };
      
      console.log('Final result:', result);
      console.log('============================');
      
      return result;
    } catch (error: any) {
      console.error(`Error getting users by role ${role}:`, error);
      return {
        data: null,
        success: false,
        message: error.message || `Error al obtener usuarios con rol ${role}`
      };
    }
  },

  async updateUserRole(userId: number, newRole: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.patch(`/users/${userId}/role`, { role: newRole });
      return {
        success: response.success,
        message: response.message || 'Rol actualizado correctamente'
      };
    } catch (error: any) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        message: error.message || 'Error al actualizar rol del usuario'
      };
    }
  },

  async deleteUser(userId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.delete(`/users/${userId}`);
      return {
        success: response.success,
        message: response.message || 'Usuario eliminado correctamente'
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.message || 'Error al eliminar usuario'
      };
    }
  },
};