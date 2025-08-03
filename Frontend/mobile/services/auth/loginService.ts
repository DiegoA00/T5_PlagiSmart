import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../api/apiService';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'token_type';
const USER_DATA_KEY = 'user_data';

export const authService = {
  async setAuthData(token: string, tokenType = 'Bearer', userData: any = null) {
    try {
      await AsyncStorage.multiSet([
        [AUTH_TOKEN_KEY, token],
        [TOKEN_TYPE_KEY, tokenType || 'Bearer'],
        [USER_DATA_KEY, userData ? JSON.stringify(userData) : '']
      ]);
    } catch (error) {
      console.error('Error setting auth data:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async getAuthHeader(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const tokenType = await AsyncStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
      return token ? `${tokenType} ${token}` : null;
    } catch (error) {
      console.error('Error getting auth header:', error);
      return null;
    }
  },

  async getUserData(): Promise<any | null> {
    try {
      const userDataStr = await AsyncStorage.getItem(USER_DATA_KEY);
      return userDataStr ? JSON.parse(userDataStr) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, TOKEN_TYPE_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return !!(token && userData);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  async login(email: string, password: string, rememberMe: boolean = false): Promise<{
    success: boolean;
    data?: { token: string; user: any };
    message?: string;
  }> {
    try {
      const response = await apiService.post<{ token: string; user: any }>('/auth/login', {
        email,
        password
      });

      if (response.success && response.data) {
        const { token, user } = response.data;
        await this.setAuthData(token, 'Bearer', user);
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        message: response.message || 'Error en el login'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión'
      };
    }
  }
};