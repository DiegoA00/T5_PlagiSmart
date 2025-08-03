import { apiService } from './api/apiService';
import { ApiUser } from '@/types/request';

export const usersService = {
  async getAllUsers(): Promise<{ data: ApiUser[] | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<ApiUser[]>('/users');
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting all users:', error);
      return {
        data: null,
        success: false,
        message: error.message || 'Error al obtener usuarios'
      };
    }
  },

  async getUsersByRole(role: string): Promise<{ data: ApiUser[] | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<ApiUser[]>(`/users/role/${role}`);
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
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