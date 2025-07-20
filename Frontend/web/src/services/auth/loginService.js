import apiClient from '../api/apiService';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'token_type';
const USER_DATA_KEY = 'user_data';

export const authService = {
    setAuthData(token, tokenType, userData) {
        try {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
            if (userData) {
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Error saving auth data:', error);
            this.clearAuthData();
            throw new Error('Error al guardar los datos de autenticación');
        }
    },

    getAuthHeader() {
        try {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);
            return token && tokenType ? `${tokenType} ${token}` : null;
        } catch (error) {
            console.error('Error getting auth header:', error);
            return null;
        }
    },

    getUserData() {
        try {
            const userData = localStorage.getItem(USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
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
            // Validación básica
            if (!email || !password) {
                throw new Error('El correo y la contraseña son requeridos');
            }

            // 1. Autenticación
            const authResponse = await apiClient.post('/auth/login', {
                email,
                password
            });

            const { token, tokenType } = authResponse.data;

            if (!token || !tokenType) {
                throw new Error('Respuesta de autenticación inválida');
            }

            // 2. Obtener información del usuario
            try {
                const userResponse = await apiClient.get('/users', {
                    headers: {
                        Authorization: `${tokenType} ${token}`
                    }
                });

                // Guardar todos los datos
                authService.setAuthData(token, tokenType, userResponse.data);

                return {
                    success: true,
                    user: userResponse.data,
                    token,
                    tokenType
                };

            } catch (userError) {
                // Si falla la obtención del usuario, limpiamos los datos de auth
                authService.clearAuthData();
                throw new Error('Error al obtener los datos del usuario');
            }

        } catch (error) {
            // Manejar diferentes tipos de errores
            let errorMessage = 'Error al iniciar sesión';
            let statusCode = error.response?.status;

            switch (statusCode) {
                case 400:
                    errorMessage = 'Datos de inicio de sesión inválidos';
                    break;
                case 401:
                    errorMessage = 'Correo o contraseña incorrectos';
                    break;
                case 403:
                    errorMessage = 'Acceso denegado';
                    break;
                case 404:
                    errorMessage = 'Servicio no disponible';
                    break;
                case 500:
                    errorMessage = 'Error del servidor. Por favor, intente más tarde';
                    break;
            }

            throw {
                success: false,
                message: error.response?.data?.message || errorMessage,
                status: statusCode || 500
            };
        }
    },

    logout: () => {
        try {
            authService.clearAuthData();
            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            return false;
        }
    },

    // Método útil para verificar si la sesión sigue activa
    validateSession: async () => {
        try {
            const authHeader = authService.getAuthHeader();
            if (!authHeader) {
                throw new Error('No hay sesión activa');
            }

            const response = await apiClient.get('/users', {
                headers: {
                    Authorization: authHeader
                }
            });

            return {
                success: true,
                user: response.data
            };
        } catch (error) {
            authService.clearAuthData(); // Limpiar datos si la sesión no es válida
            throw {
                success: false,
                message: 'Sesión inválida',
                status: error.response?.status
            };
        }
    }
};
