import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    },
    timeout: 15000
});

const getToken = () => {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};

apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = token;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error instanceof Error ? error : new Error(error?.message || 'Request failed'));
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('API Error Response:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            
            // Lista de endpoints donde un 401 no debería cerrar sesión automáticamente
            const nonAuthEndpoints = [
                '/reports/fumigations/by-fumigation',
                '/reports/',
                '/documents/'
            ];
            
            // Verificar si el error 401 viene de un endpoint de reportes/documentos
            const isNonAuthEndpoint = nonAuthEndpoints.some(endpoint => url.includes(endpoint));
            
            if (isNonAuthEndpoint) {
                console.warn(`401 en endpoint de recursos (${url}) - no cerrando sesión automáticamente`);
                // No cerrar sesión para estos endpoints, dejar que el servicio específico maneje el error
                return Promise.reject(error instanceof Error ? error : new Error(error?.message || 'API Error'));
            }
            
            console.log('401 Unauthorized - Clearing tokens and redirecting to login');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('user_data');
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('token_type');
            sessionStorage.removeItem('user_data');
            
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error instanceof Error ? error : new Error(error?.message || 'API Error'));
    }
);

export default apiClient;