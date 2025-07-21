import apiClient from '../api/apiService';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'token_type';
const USER_DATA_KEY = 'user_data';

export const authService = {
    setAuthData(token, tokenType = 'Bearer', userData = null) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(TOKEN_TYPE_KEY, tokenType || 'Bearer');
        if (userData) {
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        }
    },

    getAuthHeader() {
        try {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
            return token ? `${tokenType} ${token}` : null;
        } catch (error) {
            console.error('Error getting auth header:', error);
            return null;
        }
    },

    getUserData() {
        try {
            const userDataStr = localStorage.getItem(USER_DATA_KEY);
            return userDataStr ? JSON.parse(userDataStr) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    clearAuthData() {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(TOKEN_TYPE_KEY);
            localStorage.removeItem(USER_DATA_KEY);
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    },

    isAuthenticated() {
        return !!this.getAuthHeader();
    }
};

export const loginService = {
    login: async (email, password) => {
        try {
            // 1. Realizar el login
            const authResponse = await apiClient.post('/auth/login', {
                email,
                password
            });

            const { token, tokenType } = authResponse.data;
            
            if (!token) {
                throw new Error('Token no recibido del servidor');
            }

            // 2. Configurar el token para la siguiente petición
            apiClient.defaults.headers.common['Authorization'] = `${tokenType || 'Bearer'} ${token}`;

            // 3. Obtener la información completa del usuario
            const userResponse = await apiClient.get('/users');
            const userData = userResponse.data;

            // 4. Guardar toda la información
            authService.setAuthData(token, tokenType, userData);

            return {
                success: true,
                user: userData,
                token
            };

        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            
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
