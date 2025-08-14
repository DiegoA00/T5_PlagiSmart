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
      if (!token) {
        console.log('=== AUTH HEADER DEBUG ===');
        console.log('No token in storage');
        console.log('========================');
        return null;
      }

      // Get token type from storage and construct header like loginService does
      const tokenType = await AsyncStorage.getItem('token_type') || 'Bearer';
      const authHeader = `${tokenType} ${token}`;

      console.log('=== AUTH HEADER DEBUG ===');
      console.log('Token in storage:', token.substring(0, 30) + '...');
      console.log('Token type:', tokenType);
      console.log('Auth header to send:', authHeader.substring(0, 30) + '...');
      console.log('========================');

      return authHeader;
    } catch (error) {
      console.error('Error getting auth header:', error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const authHeader = await this.getAuthHeader();

      // Build headers exactly like web client
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      };

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...(authHeader && { Authorization: authHeader }),
          ...(options.headers as any),
        },
      };

      console.log('API Request:', { 
        url, 
        method: options.method || 'GET',
        hasAuth: !!authHeader,
        authHeader: authHeader ? authHeader.substring(0, 30) + '...' : 'No auth',
        retryCount
      });
      let response = await fetch(url, config);
      console.log('API Response status:', response.status, 'for', url);
      
      // Si recibimos 401 y tenemos token, intentar renovarlo una sola vez
      if (response.status === 401 && authHeader && retryCount === 0) {
        // Primero, intentar con el formato alternativo del header (con/sin Bearer)
        const alternateHeader = authHeader.startsWith('Bearer ')
          ? authHeader.replace(/^Bearer\s+/i, '')
          : `Bearer ${authHeader}`;
        console.log('401 received. Retrying once with alternate Authorization header format');
        const altConfig: RequestInit = {
          ...config,
          headers: {
            ...(config.headers as any),
            Authorization: alternateHeader,
          },
        };
        response = await fetch(url, altConfig);
        console.log('Alternate header retry status:', response.status);
        if (response.ok) {
          const altData = await response.json();
          return { success: true, data: altData };
        }

        console.log('=== 401 ERROR DETECTED ===');
        console.log('Attempting token refresh...');
        const refreshed = await this.refreshToken();
        if (refreshed) {
          console.log('Token refreshed successfully, retrying request...');
          return this.request(endpoint, options, retryCount + 1);
        } else {
          console.log('Token refresh failed, clearing invalid auth data...');
          // Si no se puede renovar el token, limpiar datos de autenticación inválidos
          await AsyncStorage.multiRemove(['auth_token', 'user_data', 'temp_password']);
          // No limpiar token_type ya que no lo estamos usando
        }
        console.log('=====================');
      }
      
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

  private async refreshToken(): Promise<boolean> {
    try {
      // Obtener los datos necesarios para renovar el token
      const userDataStr = await AsyncStorage.getItem('user_data');
      const tempPassword = await AsyncStorage.getItem('temp_password');
      
      if (!userDataStr || !tempPassword) {
        console.error('No user data or password found for token refresh');
        return false;
      }

      const userData = JSON.parse(userDataStr);
      console.log('Attempting automatic token refresh for user:', userData.email);
      
      // Intentar hacer login nuevamente para obtener un nuevo token
      const { authService } = await import('@/services/auth/loginService');
      const result = await authService.login(userData.email, tempPassword);
      
      if (result.success && result.data) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.error('Failed to refresh token:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      return false;
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

  // Método para verificar si el token actual es válido
  async verifyToken(): Promise<boolean> {
    try {
      console.log('=== VERIFYING TOKEN ===');
      const authHeader = await this.getAuthHeader();
      if (!authHeader) {
        console.log('No auth header available');
        return false;
      }

      // For token verification, always use the Bearer scheme explicitly
      const tokenInStorage = await AsyncStorage.getItem('auth_token');
      const bearerHeader = tokenInStorage?.startsWith('Bearer ')
        ? tokenInStorage
        : tokenInStorage
        ? `Bearer ${tokenInStorage}`
        : null;

      const response = await fetch(`${this.baseURL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerHeader ? { Authorization: bearerHeader } : {})
        }
      });

      const isValid = response.ok;
      console.log('Token verification result:', isValid);
      console.log('=====================');
      return isValid;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;