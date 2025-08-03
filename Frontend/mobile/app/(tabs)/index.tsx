import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import AdminLayout from '@/components/AdminLayout';
import { fumigationService } from '@/services/fumigationService';
import { usersService } from '@/services/usersService';
import { ApiFumigationApplication, ApiUser } from '@/types/request';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    totalUsers: 0,
    activeLots: 0,
    completedServices: 0,
  });
  const [recentRequests, setRecentRequests] = useState<ApiFumigationApplication[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const [pendingResult, usersResult] = await Promise.all([
        fumigationService.getPendingApplications(),
        usersService.getAllUsers()
      ]);

      setStats({
        pendingRequests: pendingResult.data?.content?.length || 0,
        totalUsers: usersResult.data?.length || 0,
        activeLots: 0, // TODO: implementar cuando tengamos el servicio de lotes
        completedServices: 0, // TODO: implementar cuando tengamos el servicio de servicios
      });

      // Cargar solicitudes recientes (primeras 5)
      if (pendingResult.data?.content) {
        setRecentRequests(pendingResult.data.content.slice(0, 5));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Solicitudes Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Usuarios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeLots}</Text>
            <Text style={styles.statLabel}>Lotes Activos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completedServices}</Text>
            <Text style={styles.statLabel}>Servicios Completados</Text>
          </View>
        </View>

        {/* Solicitudes Recientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solicitudes Recientes</Text>
          {recentRequests.length > 0 ? (
            recentRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <Text style={styles.requestCompany}>{request.companyName}</Text>
                <Text style={styles.requestLocation}>{request.location}</Text>
                <Text style={styles.requestDate}>
                  {new Date(request.submissionDate).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No hay solicitudes recientes</Text>
          )}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ver Todas las Solicitudes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Gestionar Usuarios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  requestCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  requestCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  requestLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  requestDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});