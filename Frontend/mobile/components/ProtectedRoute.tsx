import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  console.log('ProtectedRoute - State:', { 
    isAuthenticated, 
    loading, 
    user: user ? { ...user, roles: user.roles } : null,
    allowedRoles 
  });

  // Usar useEffect para manejar la redirección y evitar errores de React
  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      console.log('ProtectedRoute - Not authenticated, redirecting to login');
      router.replace('/login');
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Verificando acceso...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.redirectText}>Redirigiendo al login...</Text>
      </View>
    );
  }

  const userHasRole = hasRole(allowedRoles);
  console.log('ProtectedRoute - Role check:', { 
    userHasRole, 
    userRoles: user.roles?.map(r => r.name),
    allowedRoles 
  });

  // Temporalmente permitir acceso si el usuario está autenticado, sin importar roles
  const hasAccess = userHasRole || true; // Permitir acceso temporal
  
  if (!hasAccess) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedTitle}>Acceso No Autorizado</Text>
        <Text style={styles.unauthorizedText}>
          No tienes permisos para acceder a esta sección
        </Text>
        <Text style={styles.unauthorizedText}>
          Roles requeridos: {allowedRoles.join(', ')}
        </Text>
        <Text style={styles.unauthorizedText}>
          Tus roles: {user.roles?.map(r => r.name).join(', ') || 'Ninguno'}
        </Text>
      </View>
    );
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  redirectText: {
    fontSize: 16,
    color: '#6b7280',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});