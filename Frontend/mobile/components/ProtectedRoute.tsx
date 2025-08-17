import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
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

  // Verificar si el usuario tiene uno de los roles permitidos
  const hasAccess = userHasRole;
  
  if (!hasAccess) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PlagiSmart</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🚫</Text>
          </View>
          
          <Text style={styles.title}>Acceso No Autorizado</Text>
          
          <Text style={styles.message}>
            No tienes permisos para acceder a esta sección
          </Text>
          
          <Text style={styles.subtitle}>
            Sección exclusiva para administrativos
          </Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Si crees que esto es un error, contacta al administrador del sistema.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginButtonText}>Ir al Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#003595',
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#003595',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
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
});