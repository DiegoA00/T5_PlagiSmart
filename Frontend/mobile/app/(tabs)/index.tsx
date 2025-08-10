import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import AdminLayout from '@/components/AdminLayout';
import { fumigationService } from '@/services/fumigationService';
import { usersService } from '@/services/usersService';
import { ApiFumigationApplication, ApiUser } from '@/types/request';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    rejectedRequests: 0,
    totalUsers: 0,
    activeLots: 0,
    completedServices: 0,
    adminUsers: 0,
    clientUsers: 0,
    technicianUsers: 0,
  });
  const [recentRequests, setRecentRequests] = useState<ApiFumigationApplication[]>([]);
  const [monthlyData, setMonthlyData] = useState({
    currentMonth: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    pendingThisMonth: 0,
    completedThisMonth: 0,
    rejectedThisMonth: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const [
        pendingResult, 
        rejectedResult,
        usersResult,
        activeLots,
        completedServices
      ] = await Promise.all([
        fumigationService.getPendingApplications(),
        fumigationService.getRejectedApplications(),
        usersService.getAllUsers(),
        fumigationService.getActiveLots(),
        fumigationService.getCompletedServices()
      ]);

      // Procesar usuarios por rol
      const users = usersResult.data || [];
      const usersByRole = {
        admin: users.filter((u: ApiUser) => u.role === 'admin').length,
        client: users.filter((u: ApiUser) => u.role === 'client').length,
        technician: users.filter((u: ApiUser) => u.role === 'technician').length,
      };

      setStats({
        pendingRequests: pendingResult.data?.content?.length || 0,
        rejectedRequests: rejectedResult.data?.content?.length || 0,
        totalUsers: users.length,
        activeLots: activeLots.data?.length || 0,
        completedServices: completedServices.data?.length || 0,
        adminUsers: usersByRole.admin,
        clientUsers: usersByRole.client,
        technicianUsers: usersByRole.technician,
      });

      // Cargar solicitudes recientes (primeras 5)
      if (pendingResult.data?.content) {
        setRecentRequests(pendingResult.data.content.slice(0, 5));
      }

      // Calcular estadísticas del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthPending = pendingResult.data?.content?.filter((req: ApiFumigationApplication) => {
        const reqDate = new Date(req.submissionDate);
        return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
      }).length || 0;

      const thisMonthCompleted = completedServices.data?.filter((service: any) => {
        const serviceDate = new Date(service.completionDate);
        return serviceDate.getMonth() === currentMonth && serviceDate.getFullYear() === currentYear;
      }).length || 0;

      const thisMonthRejected = rejectedResult.data?.content?.filter((req: ApiFumigationApplication) => {
        const rejDate = new Date(req.submissionDate);
        return rejDate.getMonth() === currentMonth && rejDate.getFullYear() === currentYear;
      }).length || 0;

      setMonthlyData({
        currentMonth: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        pendingThisMonth: thisMonthPending,
        completedThisMonth: thisMonthCompleted,
        rejectedThisMonth: thisMonthRejected,
      });

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

  const navigateToSection = (section: string) => {
    router.push(`/(tabs)/${section}`);
  };

  const renderStatCard = (title: string, value: number, color: string, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.statNumber, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <AdminLayout title="Dashboard">
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Resumen General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Solicitudes Pendientes', stats.pendingRequests, '#f59e0b', () => navigateToSection('requests'))}
            {renderStatCard('Lotes Activos', stats.activeLots, '#3b82f6', () => navigateToSection('lots'))}
            {renderStatCard('Servicios Completados', stats.completedServices, '#10b981', () => navigateToSection('services'))}
            {renderStatCard('Total Usuarios', stats.totalUsers, '#8b5cf6', () => navigateToSection('users'))}
          </View>
        </View>

        {/* Estadísticas del Mes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas de {monthlyData.currentMonth}</Text>
          <View style={styles.monthlyStats}>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatValue}>{monthlyData.pendingThisMonth}</Text>
              <Text style={styles.monthlyStatLabel}>Pendientes</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={[styles.monthlyStatValue, { color: '#10b981' }]}>{monthlyData.completedThisMonth}</Text>
              <Text style={styles.monthlyStatLabel}>Completados</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={[styles.monthlyStatValue, { color: '#ef4444' }]}>{monthlyData.rejectedThisMonth}</Text>
              <Text style={styles.monthlyStatLabel}>Rechazados</Text>
            </View>
          </View>
        </View>

        {/* Distribución de Usuarios por Rol */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usuarios por Rol</Text>
          <View style={styles.roleDistribution}>
            <View style={styles.roleItem}>
              <View style={[styles.roleIcon, { backgroundColor: '#dc2626' }]}>
                <Text style={styles.roleIconText}>👨‍💼</Text>
              </View>
              <Text style={styles.roleCount}>{stats.adminUsers}</Text>
              <Text style={styles.roleLabel}>Administradores</Text>
            </View>
            <View style={styles.roleItem}>
              <View style={[styles.roleIcon, { backgroundColor: '#2563eb' }]}>
                <Text style={styles.roleIconText}>👤</Text>
              </View>
              <Text style={styles.roleCount}>{stats.clientUsers}</Text>
              <Text style={styles.roleLabel}>Clientes</Text>
            </View>
            <View style={styles.roleItem}>
              <View style={[styles.roleIcon, { backgroundColor: '#059669' }]}>
                <Text style={styles.roleIconText}>🔧</Text>
              </View>
              <Text style={styles.roleCount}>{stats.technicianUsers}</Text>
              <Text style={styles.roleLabel}>Técnicos</Text>
            </View>
          </View>
        </View>

        {/* Solicitudes Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Solicitudes Recientes</Text>
            <TouchableOpacity onPress={() => navigateToSection('requests')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {recentRequests.length > 0 ? (
            recentRequests.map((request) => (
              <TouchableOpacity 
                key={request.id} 
                style={styles.requestCard}
                onPress={() => navigateToSection('requests')}
              >
                <View style={styles.requestHeader}>
                  <Text style={styles.requestCompany}>{request.companyName}</Text>
                  <Text style={styles.requestDate}>
                    {new Date(request.submissionDate).toLocaleDateString('es-ES')}
                  </Text>
                </View>
                <Text style={styles.requestLocation}>📍 {request.location}</Text>
                <Text style={styles.requestRepresentative}>👤 {request.representative}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No hay solicitudes recientes</Text>
          )}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#f59e0b' }]}
              onPress={() => navigateToSection('requests')}
            >
              <Text style={styles.quickActionIcon}>📋</Text>
              <Text style={styles.quickActionText}>Gestionar Solicitudes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#3b82f6' }]}
              onPress={() => navigateToSection('lots')}
            >
              <Text style={styles.quickActionIcon}>📦</Text>
              <Text style={styles.quickActionText}>Ver Lotes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#8b5cf6' }]}
              onPress={() => navigateToSection('users')}
            >
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={styles.quickActionText}>Administrar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#10b981' }]}
              onPress={() => navigateToSection('services')}
            >
              <Text style={styles.quickActionIcon}>✅</Text>
              <Text style={styles.quickActionText}>Servicios Completados</Text>
            </TouchableOpacity>
          </View>
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: (width - 60) / 2,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
  },
  monthlyStatItem: {
    alignItems: 'center',
  },
  monthlyStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  roleDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roleItem: {
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIconText: {
    fontSize: 20,
  },
  roleCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  requestCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  requestCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  requestDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  requestLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  requestRepresentative: {
    fontSize: 14,
    color: '#6b7280',
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});