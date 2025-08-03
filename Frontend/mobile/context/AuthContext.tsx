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
  login: (loginData: { user: User }) => Promise<void>;
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
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth data:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: { user: User }) => {
    setUser(loginData.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'token_type', 'user_data']);
      setUser(null);
      setIsAuthenticated(false);
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