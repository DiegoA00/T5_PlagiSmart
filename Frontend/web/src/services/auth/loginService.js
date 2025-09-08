import apiClient from '../api/apiService';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'token_type';
const USER_DATA_KEY = 'user_data';

function getStorage(rememberMe) {
  return rememberMe ? localStorage : sessionStorage;
}

export const authService = {
  setAuthData(token, tokenType = 'Bearer', userData = null, rememberMe = false) {
    const storage = getStorage(rememberMe);
    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(TOKEN_TYPE_KEY, tokenType || 'Bearer');
    if (userData) {
      storage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  },

  getAuthHeader() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || sessionStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
    return token ? `${tokenType} ${token}` : null;
  },

  getUserData() {
    const userDataStr = localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY);
    return userDataStr ? JSON.parse(userDataStr) : null;
  },

  clearAuthData() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_TYPE_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
  },

  isAuthenticated() {
    const hasToken = !!(localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY));
    const hasUserData = !!(localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY));
    return hasToken && hasUserData;
  }
};

export const loginService = {
  login: async (email, password, rememberMe = false) => {
    try {
      const authResponse = await apiClient.post('/auth/login', {
        email,
        password
      });

      const { token, tokenType } = authResponse.data;
      if (!token) {
        throw new Error('Token no recibido del servidor');
      }
      
      const userResponse = await apiClient.get('/users/me', {
        headers: {
          'Authorization': `${tokenType || 'Bearer'} ${token}`
        }
      });
      
      const userData = userResponse.data;
      authService.setAuthData(token, tokenType, userData, rememberMe);

      return {
        success: true,
        user: userData,
        token
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw {
          success: false,
          message: 'Correo o contraseña incorrectos',
          status: 401
        };
      }
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión',
        status: error.response?.status || 500
      };
    }
  },

  validateSession: async () => {
    try {
      const authHeader = authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('No session token found');
      }
      
      const response = await apiClient.get('/users/me');
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      authService.clearAuthData();
      throw {
        success: false,
        message: 'Session expired or invalid',
        status: error.response?.status || 401
      };
    }
  },

  logout: () => {
    authService.clearAuthData();
  }
};
