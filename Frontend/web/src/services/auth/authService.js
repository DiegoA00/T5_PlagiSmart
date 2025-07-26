const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'token_type';
const USER_DATA_KEY = 'user_data';

export const authService = {
    setToken(token, tokenType = 'Bearer', rememberMe = false) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(AUTH_TOKEN_KEY, token);
        storage.setItem(TOKEN_TYPE_KEY, tokenType);
    },

    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    },
    
    getTokenType() {
        return localStorage.getItem(TOKEN_TYPE_KEY) || sessionStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';
    },

    removeToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_TYPE_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_TYPE_KEY);
    },

    isAuthenticated() {
        return !!this.getToken();
    },
    
    getAuthHeader() {
        const token = this.getToken();
        const tokenType = this.getTokenType();
        return token ? `${tokenType} ${token}` : null;
    }
};