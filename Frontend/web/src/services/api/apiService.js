import axios from 'axios';
import { authService } from '../auth/loginService';

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

apiClient.interceptors.request.use(
    (config) => {
        const authHeader = authService.getAuthHeader();
        if (authHeader) {
            config.headers.Authorization = authHeader;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authService.clearAuthData();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;