import AsyncStorage from '@react-native-async-storage/async-storage';

// Para iOS, forzamos la IP local - no usar localhost
const API_BASE_URL = 'http://192.168.1.45:8082/api';

console.log('API_BASE_URL FORCED TO:', API_BASE_URL);
console.log('Environment EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  public baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthHeader(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const tokenType = await AsyncStorage.getItem('token_type') || 'Bearer';
      return token ? `${tokenType} ${token}` : null;
    } catch (error) {
      console.error('Error getting auth header:', error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const authHeader = await this.getAuthHeader();

      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
          ...options.headers,
        },
      };

      console.log('API Request:', { url, method: options.method || 'GET' });
      const response = await fetch(url, config);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('API request error:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión',
        error: error.message
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postWithoutAuth<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      };

      console.log('API Request (no auth):', { 
        url, 
        method: 'POST', 
        baseURL: this.baseURL,
        endpoint,
        fullURL: url
      });
      const response = await fetch(url, config);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      return {
        success: true,
        data: responseData
      };
    } catch (error: any) {
      console.error('API request error:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión',
        error: error.message
      };
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiService = new ApiService();
export default apiService;