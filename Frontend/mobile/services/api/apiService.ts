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
      // Get the stored auth header (already contains "Bearer token")
      const authHeader = await AsyncStorage.getItem('auth_token');
      
      if (!authHeader) {
        return null;
      }

      // Clean any extra whitespace but preserve single space between Bearer and token
      const cleanAuthHeader = authHeader.trim().replace(/\s+/g, ' ');

      // Debug: Log the exact token being used
      console.log('=== JWT TOKEN DEBUG ===');
      console.log('Raw auth header:', `"${authHeader}"`);
      console.log('Clean auth header:', `"${cleanAuthHeader}"`);
      console.log('Auth header length:', cleanAuthHeader.length);
      console.log('======================');

      return cleanAuthHeader;
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

      let response = await fetch(url, config);
      console.log('API Response status:', response.status, 'for', url);
      
      // If we get 401 and have a token, try to refresh it once
      if (response.status === 401 && authHeader && retryCount === 0) {
        console.log('=== 401 ERROR DETECTED ===');
        console.log('Attempting token refresh...');
        const refreshed = await this.refreshToken();
        if (refreshed) {
          console.log('Token refreshed successfully, retrying request...');
          return this.request(endpoint, options, retryCount + 1);
        } else {
          console.log('Token refresh failed, clearing invalid auth data...');
          // Clear invalid auth data if token refresh fails
          await AsyncStorage.multiRemove(['auth_token', 'user_data', 'temp_password']);
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
      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);
      console.log('API Response URL:', response.url);
      console.log('API Response type:', response.type);
      console.log('API Response ok:', response.ok);
      
      const result = {
        success: true,
        data
      };
      console.log('Returning API response:', result);
      return result;
    } catch (error: any) {
      console.error('API request error:', error);
      const result = {
        success: false,
        message: error.message || 'Error de conexión',
        error: error.message
      };
      console.log('Returning API error response:', result);
      return result;
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
        fullURL: url,
        data: data ? JSON.stringify(data).substring(0, 200) + '...' : 'No data'
      });
      const response = await fetch(url, config);
      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      const result = {
        success: true,
        data: responseData
      };
      console.log('Returning API response (no auth):', result);
      return result;
    } catch (error: any) {
      console.error('API request error:', error);
      const result = {
        success: false,
        message: error.message || 'Error de conexión',
        error: error.message
      };
      console.log('Returning API error response (no auth):', result);
      return result;
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

  // Method to verify if the current token is valid
  async verifyToken(): Promise<boolean> {
    try {
      const authHeader = await this.getAuthHeader();
      if (!authHeader) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;