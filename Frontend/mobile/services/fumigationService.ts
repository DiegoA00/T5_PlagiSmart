import { apiService } from './api/apiService';
import { ApiFumigationApplication, PaginatedResponse, ApiLot, ApiService, FumigationListItem, FumigationDetailResponse, PageableRequest } from '@/types/request';

export const fumigationService = {
  // Solicitudes
  async getPendingApplications(): Promise<{ data: PaginatedResponse<ApiFumigationApplication> | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<PaginatedResponse<ApiFumigationApplication>>('/fumigation-applications?status=PENDING');
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
      const response = await apiService.get<PaginatedResponse<ApiFumigationApplication>>('/fumigation-applications?status=REJECTED');
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

  // Lotes APPROVED (como en web)
  async getApprovedFumigations(): Promise<{ data: PaginatedResponse<FumigationListItem> | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<PaginatedResponse<FumigationListItem>>('/fumigations?status=APPROVED&page=0&size=50&sort=id');
      return {
        data: response.data || null,
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error getting approved fumigations:', error);
      return {
        data: null,
        success: false,
        message: error.message || 'Error al obtener fumigaciones aprobadas'
      };
    }
  },

  // Servicios completados
  async getCompletedServices(): Promise<{ data: ApiService[] | null; success: boolean; message?: string }> {
    try {
      const response = await apiService.get<ApiService[]>('/fumigations?status=COMPLETED');
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

  // Asignar técnico a lote
  async assignTechnician(lotId: number, technicianId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.post(`/fumigations/${lotId}/assign-technician`, { technicianId });
      return {
        success: response.success,
        message: response.message || 'Técnico asignado correctamente'
      };
    } catch (error: any) {
      console.error('Error assigning technician:', error);
      return {
        success: false,
        message: error.message || 'Error al asignar técnico'
      };
    }
  },

  // Actualizar estado del lote
  async updateLotStatus(lotId: number, status: 'IN_SERVICE' | 'COMPLETED'): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.patch(`/fumigations/${lotId}/status`, { status });
      return {
        success: response.success,
        message: response.message || 'Estado actualizado correctamente'
      };
    } catch (error: any) {
      console.error('Error updating lot status:', error);
      return {
        success: false,
        message: error.message || 'Error al actualizar estado'
      };
    }
  },

  // Métodos para técnicos - obtener fumigaciones por estado
  async getFumigationsByStatus(status: string, pageableRequest?: PageableRequest): Promise<PaginatedResponse<FumigationListItem>> {
    try {
      let url = `/fumigations?status=${status}`;
      
      if (pageableRequest) {
        url += `&page=${pageableRequest.page || 0}&size=${pageableRequest.size || 50}`;
        if (pageableRequest.sort) {
          url += `&sort=${pageableRequest.sort}`;
        }
      } else {
        url += '&page=0&size=50&sort=id';
      }

      const response = await apiService.get<PaginatedResponse<FumigationListItem>>(url);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener fumigaciones');
      }
    } catch (error: any) {
      console.error('Error getting fumigations by status:', error);
      throw new Error(error.message || 'Error al obtener fumigaciones');
    }
  },

  // Obtener detalles de una fumigación específica
  async getFumigationDetails(id: number): Promise<FumigationDetailResponse> {
    try {
      const response = await apiService.get<FumigationDetailResponse>(`/fumigations/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener detalles de fumigación');
      }
    } catch (error: any) {
      console.error('Error getting fumigation details:', error);
      throw new Error(error.message || 'Error al obtener detalles de fumigación');
    }
  },
};