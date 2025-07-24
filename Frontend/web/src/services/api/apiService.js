import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    console.error('VITE_API_URL no está definida en el archivo .env');
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';
        
        if (token) {
            config.headers.Authorization = `${tokenType} ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;