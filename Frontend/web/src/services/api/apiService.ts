import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
        return Promise.reject(error);
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
            fullResponse: error.response?.data
        });

        if (status === 401 && !isReportNotFound) {
            console.log('Clearing session due to 401 error (not a report not found error)');
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
            console.log('Report not found error detected, NOT clearing session');
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;