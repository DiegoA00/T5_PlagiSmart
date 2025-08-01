const TOKEN_KEY = 'auth_token';

export const authService = {
    // Guardar token
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Obtener token
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Eliminar token
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Verificar si hay un token
    isAuthenticated() {
        return !!this.getToken();
    }
};