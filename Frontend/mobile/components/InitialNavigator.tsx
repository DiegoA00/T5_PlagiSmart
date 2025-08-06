import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function InitialNavigator({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user && hasRole(['ROLE_ADMIN'])) {
        // Usuario autenticado con rol correcto, ir a tabs
        router.replace('/(tabs)');
      } else {
        // No autenticado o sin rol correcto, ir a login
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
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
});