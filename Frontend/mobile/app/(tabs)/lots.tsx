import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import AdminLayout from '@/components/AdminLayout';
import { fumigationService } from '@/services/fumigationService';
import { FumigationListItem, PaginatedResponse } from '@/types/request';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LotsScreen() {
  const [fumigations, setFumigations] = useState<FumigationListItem[]>([]);
  const [fumigationsResponse, setFumigationsResponse] = useState<PaginatedResponse<FumigationListItem> | null>(null);
  const [filteredFumigations, setFilteredFumigations] = useState<FumigationListItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadDebugInfo();
    fetchFumigations();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      setDebugInfo({
        hasToken: !!token,
        hasUserData: !!userData,
        tokenPreview: token ? token.substring(0, 30) + '...' : 'No token',
        isAuthenticated,
        userEmail: user?.email || 'No user'
      });
    } catch (error) {
      console.error('Error loading debug info:', error);
    }
  };

  useEffect(() => {
    if (Array.isArray(fumigations) && fumigations.length > 0) {
      let filtered = fumigations;
      
      // Filtrar por búsqueda
      if (search.trim()) {
        filtered = filtered.filter((fumigation) =>
          fumigation.companyName.toLowerCase().includes(search.toLowerCase()) ||
          fumigation.lotNumber.toLowerCase().includes(search.toLowerCase()) ||
          fumigation.representative.toLowerCase().includes(search.toLowerCase()) ||
          fumigation.location.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setFilteredFumigations(filtered);
    } else {
      setFilteredFumigations([]);
    }
  }, [search, fumigations]);

  const fetchFumigations = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('=== FETCHING APPROVED FUMIGATIONS ===');
      
      const result = await fumigationService.getApprovedFumigations();
      console.log('Fumigations fetch result:', { success: result.success, dataLength: result.data?.content?.length });
      
      if (result.success && result.data) {
        setFumigationsResponse(result.data);
        setFumigations(result.data.content || []);
        console.log('Fumigations loaded successfully:', result.data.content?.length, 'items');
      } else {
        setFumigations([]);
        setFumigationsResponse(null);
        console.log('No fumigations data received:', result.message);
        if (result.message) {
          setError(result.message);
        }
      }
      console.log('======================================');
    } catch (error: any) {
      console.error('Error fetching fumigations:', error);
      setError('Error al cargar los lotes aprobados');
      setFumigations([]);
      setFumigationsResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFumigations();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderFumigationCard = (fumigation: FumigationListItem) => (
    <View key={fumigation.id} style={styles.fumigationCard}>
      <View style={styles.fumigationHeader}>
        <Text style={styles.lotNumber}>Lote #{fumigation.lotNumber}</Text>
        <View style={styles.approvedBadge}>
          <Text style={styles.approvedText}>APROBADO</Text>
        </View>
      </View>
      
      <Text style={styles.companyName}>🏢 {fumigation.companyName}</Text>
      <Text style={styles.representative}>👤 {fumigation.representative}</Text>
      <Text style={styles.phoneNumber}>📞 {fumigation.phoneNumber}</Text>
      <Text style={styles.location}>📍 {fumigation.location}</Text>
      
      {fumigation.plannedDate && (
        <Text style={styles.plannedDate}>
          📅 Fecha planificada: {formatDate(fumigation.plannedDate)}
        </Text>
      )}
    </View>
  );

  if (error) {
    return (
      <AdminLayout title="Lotes a Fumigar">
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchFumigations}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Lotes a Fumigar">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando lotes aprobados...</Text>
          <Text style={styles.loadingSubtext}>Obteniendo fumigaciones con estado APPROVED</Text>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Lotes a Fumigar">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lotes a fumigar</Text>
          <Text style={styles.subtitle}>
            Gestiona los lotes pendientes de fumigación
            {fumigationsResponse && fumigationsResponse.totalElements > 0 && 
              ` (${fumigationsResponse.totalElements} total${fumigationsResponse.totalElements !== 1 ? 'es' : ''})`
            }
          </Text>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empresa, lote, representante o ubicación..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Filter Results Info */}
        {(search.trim()) && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterInfoText}>
              Mostrando {filteredFumigations.length} de {fumigations.length} lotes
              {search.trim() && ` - Búsqueda: "${search}"`}
            </Text>
          </View>
        )}

        {/* Fumigations List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {fumigations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No hay lotes aprobados</Text>
              <Text style={styles.emptyText}>
                No se encontraron fumigaciones con estado APPROVED.
                {fumigationsResponse?.totalElements === 0 
                  ? " La base de datos parece estar vacía después del reinicio."
                  : " Puede que no haya solicitudes aprobadas aún."
                }
              </Text>
            </View>
          ) : filteredFumigations.length > 0 ? (
            <>
              {filteredFumigations.length !== fumigations.length && (
                <View style={styles.filterResultsInfo}>
                  <Text style={styles.filterResultsText}>
                    Mostrando {filteredFumigations.length} de {fumigations.length} lotes (filtrados por "{search}")
                  </Text>
                </View>
              )}
              {filteredFumigations.map(renderFumigationCard)}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
              <Text style={styles.emptyText}>
                No hay lotes que coincidan con tu búsqueda "{search}"
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
  },
  filterInfo: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  filterInfoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  fumigationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  fumigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lotNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  approvedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  representative: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  plannedDate: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  filterResultsInfo: {
    marginBottom: 16,
  },
  filterResultsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  debugRefresh: {
    backgroundColor: '#ffeaa7',
    borderRadius: 4,
    padding: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  debugRefreshText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
  },
});