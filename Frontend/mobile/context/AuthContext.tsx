import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: Array<{ name: string }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (loginData: { user: any; token?: string }) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sincronizar isAuthenticated con el estado del usuario
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    // Verificar si hay datos de autenticación al iniciar
    checkAuthData();
  }, []);

  const checkAuthData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userDataStr = await AsyncStorage.getItem('user_data');
      
      if (token && userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUser(userData);
        // isAuthenticated se establecerá automáticamente via useEffect
      } else {
        setUser(null);
        // isAuthenticated se establecerá automáticamente via useEffect
      }
    } catch (error) {
      console.error('Error checking auth data:', error);
      setUser(null);
      // isAuthenticated se establecerá automáticamente via useEffect
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: { user: any; token?: string }) => {
    try {
      console.log('AuthContext - Logging in user:', loginData.user);
      
      // Validar y normalizar los datos del usuario
      const normalizedUser: User = {
        id: loginData.user.id || loginData.user.userId || 0,
        firstName: loginData.user.firstName || loginData.user.first_name || loginData.user.nombre || '',
        lastName: loginData.user.lastName || loginData.user.last_name || loginData.user.apellido || '',
        email: loginData.user.email || loginData.user.correo || '',
        roles: loginData.user.roles || loginData.user.authorities || [{ name: 'USER' }]
      };
      
      console.log('AuthContext - Normalized user data:', normalizedUser);
      
      // Guardar datos del usuario en AsyncStorage PRIMERO
      await AsyncStorage.setItem('user_data', JSON.stringify(normalizedUser));
      
      // Si se proporciona un token, guardarlo también
      if (loginData.token) {
        await AsyncStorage.setItem('auth_token', loginData.token);
        await AsyncStorage.setItem('token_type', 'Bearer');
      }
      
      // Solo establecer el usuario - isAuthenticated se sincronizará automáticamente
      setUser(normalizedUser);
      
      console.log('AuthContext - Login successful, user data saved:', {
        user: normalizedUser,
        roles: normalizedUser.roles
      });
    } catch (error) {
      console.error('Error saving login data:', error);
      // En caso de error, asegurar que el estado sea consistente
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'token_type', 'user_data']);
      setUser(null);
      // isAuthenticated se sincronizará automáticamente cuando user sea null
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const hasRole = (roles: string[]) => {
    if (!user || !user.roles) {
      return false;
    }
    const userRoles = user.roles.map(role => role.name);
    return roles.some(role => userRoles.includes(role));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};