import { apiService } from './api/apiService';
import { ApiFumigationApplication, PaginatedResponse, ApiLot, ApiService } from '@/types/request';

export const fumigationService = {
  // Solicitudes
  async getPendingApplications(): Promise<{ data: PaginatedResponse<ApiFumigationApplication> | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<PaginatedResponse<ApiFumigationApplication>>('/fumigation/applications/pending');
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting pending applications:', error);
      return {
        data: null,
        success: false,
        message: error.message || 'Error al obtener solicitudes pendientes'
      };
    }
  },

  async getRejectedApplications(): Promise<{ data: PaginatedResponse<ApiFumigationApplication> | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<PaginatedResponse<ApiFumigationApplication>>('/fumigation/applications/rejected');
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting rejected applications:', error);
      return {
        data: null,
        success: false,
        message: error.message || 'Error al obtener solicitudes rechazadas'
      };
    }
  },

  async approveApplication(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.post(`/fumigation/applications/${id}/approve`);
      return {
        success: response.success,
        message: response.message || 'Solicitud aprobada correctamente'
      };
    } catch (error: any) {
      console.error('Error approving application:', error);
      return {
        success: false,
        message: error.message || 'Error al aprobar solicitud'
      };
    }
  },

  async rejectApplication(id: number, reason?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.post(`/fumigation/applications/${id}/reject`, { reason });
      return {
        success: response.success,
        message: response.message || 'Solicitud rechazada correctamente'
      };
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      return {
        success: false,
        message: error.message || 'Error al rechazar solicitud'
      };
    }
  },

  // Lotes
  async getActiveLots(): Promise<{ data: ApiLot[] | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<ApiLot[]>('/fumigation/lots/active');
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting active lots:', error);
      return {
        data: null,
        success: false,
        message: error.message || 'Error al obtener lotes activos'
      };
    }
  },

  // Servicios completados
  async getCompletedServices(): Promise<{ data: ApiService[] | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<ApiService[]>('/fumigation/services/completed');
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting completed services:', error);
      return {
        data: null,
        success: false,
        message: error.message || 'Error al obtener servicios completados'
      };
    }
  },
};