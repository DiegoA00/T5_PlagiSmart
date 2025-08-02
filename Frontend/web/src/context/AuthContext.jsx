import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth/loginService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay datos de autenticación
    const isAuth = authService.isAuthenticated();
    const userData = authService.getUserData();
    
    if (isAuth && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    setUser(loginData.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (roles) => {
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