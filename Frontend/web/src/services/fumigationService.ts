import apiClient from "./api/apiService";
import { 
  FumigationApplication, 
  ApiFumigationApplication, 
  FumigationListItem, 
  FumigationDetailResponse,
  PaginatedResponse,
  PageableRequest
} from "@/types/request";

// Interfaces para la creación de aplicaciones de fumigación
export interface FumigationRequestData {
  lotNumber: string;
  ton: number;
  portDestination: string;
  sacks: number;
  quality: string;
  dateTime: string; // Backend format: "dd-MM-yyyy HH:mm"
}

export interface FumigationApplicationRequest {
  company: {
    id: number;
  };
  fumigations: FumigationRequestData[];
}

const formatSortParams = (sort?: string[]): string | undefined => {
  if (!sort || sort.length === 0) return undefined;
  return sort.join(',');
};

const createEmptyPaginatedResponse = <T>(): PaginatedResponse<T> => ({
  totalPages: 0,
  totalElements: 0,
  size: 0,
  content: [],
  number: 0,
  sort: { empty: true, unsorted: true, sorted: false },
  first: true,
  last: true,
  numberOfElements: 0,
  pageable: {
    offset: 0,
    sort: { empty: true, unsorted: true, sorted: false },
    unpaged: false,
    paged: true,
    pageNumber: 0,
    pageSize: 0
  },
  empty: true
});

const getApplicationsByStatus = async (
  status: string, 
  pageableRequest?: PageableRequest
): Promise<PaginatedResponse<ApiFumigationApplication>> => {
  try {
    const defaultPageable: PageableRequest = {
      page: 0,
      size: 50,
      sort: ["id"]
    };

    const pageable = { ...defaultPageable, ...pageableRequest };
    
    const params: any = {
      status,
      page: pageable.page,
      size: pageable.size
    };

    if (pageable.sort && pageable.sort.length > 0) {
      params.sort = formatSortParams(pageable.sort);
    }
    
    const response = await apiClient.get('/fumigation-applications', { params });
    
    return response.data || createEmptyPaginatedResponse<ApiFumigationApplication>();
  } catch (error: any) {
    if (error.response?.status >= 500) {
      return createEmptyPaginatedResponse<ApiFumigationApplication>();
    }
    
    throw new Error(`Error al cargar solicitudes con estado ${status}: ${error.response?.data?.message || error.message}`);
  }
};

export const fumigationService = {
  getApplicationById: async (id: string): Promise<FumigationApplication> => {
    try {
      const response = await apiClient.get(`/fumigation-applications/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener detalles de la solicitud");
    }
  },

  updateFumigationStatus: async (id: number, status: string, message: string = ""): Promise<void> => {
    try {
      await apiClient.put(`/fumigations/${id}/status`, {
        status,
        message
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al actualizar el estado de la fumigación");
    }
  },

  getPendingApplications: async (pageableRequest?: PageableRequest): Promise<PaginatedResponse<ApiFumigationApplication>> => {
    return getApplicationsByStatus('PENDING', pageableRequest);
  },

  getRejectedApplications: async (pageableRequest?: PageableRequest): Promise<PaginatedResponse<ApiFumigationApplication>> => {
    return getApplicationsByStatus('REJECTED', pageableRequest);
  },

  getFumigationsByStatus: async (
    status: string, 
    pageableRequest?: PageableRequest
  ): Promise<PaginatedResponse<FumigationListItem>> => {
    try {
      const defaultPageable: PageableRequest = {
        page: 0,
        size: 50,
        sort: ["id"]
      };

      const pageable = { ...defaultPageable, ...pageableRequest };
      
      const params: any = {
        status,
        page: pageable.page,
        size: pageable.size
      };

      if (pageable.sort && pageable.sort.length > 0) {
        params.sort = formatSortParams(pageable.sort);
      }
      
      const response = await apiClient.get('/fumigations', { params });
      
      return response.data || createEmptyPaginatedResponse<FumigationListItem>();
    } catch (error: any) {
      if (error.response?.status >= 500) {
        return createEmptyPaginatedResponse<FumigationListItem>();
      }
      
      throw new Error(`Error al cargar fumigaciones con status ${status}: ${error.response?.data?.message || error.message}`);
    }
  },

  getFumigationDetails: async (id: number): Promise<FumigationDetailResponse> => {
    try {
      const response = await apiClient.get(`/fumigations/info/${id}`);
      
      return response.data;
    } catch (error: any) {
      
      if (error.response?.status === 404) {
        throw new Error(`No se encontró el lote con ID ${id}.`);
      }
      
      throw new Error(error.response?.data?.message || "Error al obtener detalles de la fumigación");
    }
  },

  createFumigationApplication: async (applicationData: FumigationApplicationRequest): Promise<void> => {
    try {
      const response = await apiClient.post('/fumigation-applications', applicationData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al crear la aplicación de fumigación");
    }
  }
};