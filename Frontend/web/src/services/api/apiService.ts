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
        if (error.response?.status === 401) {
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
        
        return Promise.reject(error);
    }
);

export default apiClient;