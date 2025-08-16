import apiClient from "./api/apiService";
import { ApiUser, PaginatedResponse, PageableRequest } from "@/types/request";

// DTO para actualizar información del usuario (legacy)
export interface UpdateUserDTO {
  nationalId: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  birthday: string;
}

// DTO para setup completo de perfil (coincide con backend)
export interface UserProfileSetUpRequestDTO {
  nationalId: string;
  birthday: string; // Formato: "yyyy-MM-dd"
  company: CompanyCreationDTO;
  country: string;
  city: string;
  personalPhone: string;
}

// DTO para crear compañía (coincide con backend)
export interface CompanyCreationDTO {
  companyName: string;
  businessName: string;
  phoneNumber: string; // Debe ser 10 dígitos
  ruc: string; // Debe ser 13 dígitos
  address: string;
}

// Estructura de respuesta de /users/me
export interface UserMeResponse {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  hasCompletedProfile: boolean;
  country?: string;
  city?: string;
  personalPhone?: string;
  birthday?: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
  companies: Array<{
    id: number;
    name: string;
    businessName: string;
    phoneNumber: string;
    ruc: string;
    address: string;
    legalRepresentative: {
      id: number;
      firstName: string;
      lastName: string;
    };
  }>;
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

export const usersService = {
  getAllUsers: async (pageableRequest?: PageableRequest): Promise<PaginatedResponse<ApiUser>> => {
    try {
      const defaultPageable: PageableRequest = {
        page: 0,
        size: 50,
        sort: ["firstName", "lastName"]
      };

      const pageable = { ...defaultPageable, ...pageableRequest };
      
      const params: any = {
        page: pageable.page,
        size: pageable.size
      };

      if (pageable.sort && pageable.sort.length > 0) {
        params.sort = formatSortParams(pageable.sort);
      }
      
      const response = await apiClient.get('/users/all', { params });
      
      return response.data || createEmptyPaginatedResponse<ApiUser>();
    } catch (error: any) {
      if (error.response?.status >= 500) {
        return createEmptyPaginatedResponse<ApiUser>();
      }
      
      throw new Error(error.response?.data?.message || "Error al cargar usuarios");
    }
  },

  getUsersByRole: async (role: string, pageableRequest?: PageableRequest): Promise<PaginatedResponse<ApiUser>> => {
    try {
      const defaultPageable: PageableRequest = {
        page: 0,
        size: 50,
        sort: ["firstName", "lastName"]
      };

      const pageable = { ...defaultPageable, ...pageableRequest };
      
      const params: any = {
        role,
        page: pageable.page,
        size: pageable.size
      };

      if (pageable.sort && pageable.sort.length > 0) {
        params.sort = formatSortParams(pageable.sort);
      }
      
      const response = await apiClient.get('/users', { params });
      
      return response.data || createEmptyPaginatedResponse<ApiUser>();
    } catch (error: any) {
      if (error.response?.status >= 500) {
        return createEmptyPaginatedResponse<ApiUser>();
      }
      
      throw new Error(error.response?.data?.message || "Error al cargar usuarios por rol");
    }
  },

  changeUserRole: async (email: string): Promise<void> => {
    try {
      await apiClient.put('/users/role', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al cambiar el rol");
    }
  },

  updateUserProfile: async (profileData: UpdateUserDTO): Promise<ApiUser> => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al actualizar el perfil del usuario");
    }
  },

  getCurrentUser: async (): Promise<UserMeResponse> => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener información del usuario");
    }
  },

  setupUserProfile: async (profileData: UserProfileSetUpRequestDTO): Promise<void> => {
    try {
      const response = await apiClient.post('/auth/profile-setup', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al configurar el perfil del usuario");
    }
  }
};