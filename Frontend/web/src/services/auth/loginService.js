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
    return !!this.getAuthHeader();
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
      if (!token) throw new Error('Token no recibido del servidor');

      apiClient.defaults.headers.common['Authorization'] = `${tokenType || 'Bearer'} ${token}`;
      const userResponse = await apiClient.get('/users');
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
        message: error.response?.data?.message || 'Error al iniciar sesión',
        status: error.response?.status || 500
      };
    }
  },

  logout: () => {
    authService.clearAuthData();
  }
};
