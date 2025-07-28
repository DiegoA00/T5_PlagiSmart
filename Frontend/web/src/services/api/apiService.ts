import axios from 'axios';
import { authService } from '../auth/loginService';
import { constructFromSymbol } from 'date-fns/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
        // Obtener el token sin el prefijo "Bearer"
        const token = authService.getToken(); // Esta función debe existir en authService
        
        if (token) {
            // Enviar solo el token sin el prefijo "Bearer "
            config.headers.Authorization = token;
            
            // Log para depuración (quitar en producción)
            console.log("Token enviado:", token.substring(0, 20) + "...");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
let isRedirecting = false;

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isRedirecting) {
            const url = error.config.url;
            const isSpecialEndpoint = url && (
                url.includes('/fumigation-applications/')
            );

            if (!isSpecialEndpoint) {
                isRedirecting = true;
                console.log("Sesión expirada - redirigiendo al login");
                authService.clearAuthData();
                window.location.href = '/login';
                setTimeout(() => {
                    isRedirecting = false;
                }, 1000);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;