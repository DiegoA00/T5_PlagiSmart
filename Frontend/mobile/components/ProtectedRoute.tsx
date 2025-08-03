import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Verificando acceso...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace('/login');
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.redirectText}>Redirigiendo al login...</Text>
      </View>
    );
  }

  if (!hasRole(allowedRoles)) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedTitle}>Acceso No Autorizado</Text>
        <Text style={styles.unauthorizedText}>
          No tienes permisos para acceder a esta sección
        </Text>
      </View>
    );
  }

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