import apiClient from '../api/apiService';

export const registerService = {
    register: async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password
            });

            return {
                success: true,
                user: response.data
            };
        } catch (error) {
            console.error('Register error:', error.response?.data || error.message);
            throw {
                success: false,
                message: error.response?.data?.message || 'Error en el registro',
                status: error.response?.status
            };
        }
    }
};