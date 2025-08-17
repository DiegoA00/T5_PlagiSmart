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

const isReportNotFoundError = (error: any): boolean => {
    const errorMessage = error.response?.data?.message || error.message || "";
    const url = error.config?.url || "";
    
    const isReportEndpoint = url.includes('/reports/');
    const hasNotFoundKeywords = (
        errorMessage.includes("FumigationReportNotFoundException") ||
        errorMessage.includes("No report found for fumigation ID") ||
        errorMessage.includes("CleanupReportNotFoundException") ||
        errorMessage.includes("No cleanup report found") ||
        errorMessage.includes("report found") ||
        errorMessage.includes("NotFoundException")
    );
    
    console.log('Checking if error is report not found:', {
        url,
        isReportEndpoint,
        hasNotFoundKeywords,
        errorMessage,
        result: isReportEndpoint && hasNotFoundKeywords
    });
    
    return isReportEndpoint && hasNotFoundKeywords;
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
        const status = error.response?.status;
        const url = error.config?.url || "";
        const message = error.response?.data?.message || error.message;
        const isReportNotFound = isReportNotFoundError(error);

        console.log('API Error intercepted:', {
            status,
            url,
            message,
            isReportNotFound,
            statusText: error.response?.statusText,
            fullResponse: error.response?.data
        });

        // Manejo de errores 401
        if (status === 401) {
            // Lista de endpoints donde un 401 no debería cerrar sesión automáticamente
            const nonAuthEndpoints = [
                '/reports/fumigations/by-fumigation',
                '/reports/',
                '/documents/'
            ];
            
            // Verificar si el error 401 viene de un endpoint de reportes/documentos
            const isNonAuthEndpoint = nonAuthEndpoints.some(endpoint => url.includes(endpoint));
            
            // No cerrar sesión si:
            // 1. Es un error de reporte no encontrado (lógica más inteligente)
            // 2. O es un endpoint específico de la lista (compatibilidad con lógica anterior)
            if (isReportNotFound || isNonAuthEndpoint) {
                const reason = isReportNotFound ? 'report not found error' : `non-auth endpoint (${url})`;
                console.warn(`401 error detected but NOT clearing session - reason: ${reason}`);
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
                console.log('Redirecting to login page');
                window.location.href = '/login';
            }
        } else if (isReportNotFound) {
            console.log('Report not found error detected (non-401), NOT clearing session');
        }
        
        return Promise.reject(error instanceof Error ? error : new Error(error?.message || 'API Error'));
    }
);

export default apiClient;