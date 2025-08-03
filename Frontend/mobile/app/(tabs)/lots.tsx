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
  Alert,
  Modal
} from 'react-native';
import AdminLayout from '@/components/AdminLayout';
import { fumigationService } from '@/services/fumigationService';
import { ApiLot } from '@/types/request';

export default function LotsScreen() {
  const [lots, setLots] = useState<ApiLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ApiLot[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLot, setSelectedLot] = useState<ApiLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchLots();
  }, []);

  useEffect(() => {
    if (Array.isArray(lots) && lots.length > 0) {
      const filtered = lots.filter((lot) =>
        lot.name.toLowerCase().includes(search.toLowerCase()) ||
        lot.location.toLowerCase().includes(search.toLowerCase()) ||
        lot.companyName.toLowerCase().includes(search.toLowerCase()) ||
        (lot.assignedTechnician && lot.assignedTechnician.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredLots(filtered);
    } else {
      setFilteredLots([]);
    }
  }, [search, lots]);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const result = await fumigationService.getActiveLots();
      if (result.success && result.data) {
        setLots(result.data);
      } else {
        setLots([]);
        if (result.message) {
          Alert.alert('Error', result.message);
        }
      }
    } catch (error) {
      console.error('Error fetching lots:', error);
      Alert.alert('Error', 'Error al cargar los lotes');
      setLots([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLots();
    setRefreshing(false);
  };

  const openLotDetail = (lot: ApiLot) => {
    setSelectedLot(lot);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_SERVICE':
        return '#f59e0b';
      case 'COMPLETED':
        return '#10b981';
      case 'PENDING':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_SERVICE':
        return 'En Servicio';
      case 'COMPLETED':
        return 'Completado';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const renderLotCard = (lot: ApiLot) => (
    <TouchableOpacity
      key={lot.id}
      style={styles.lotCard}
      onPress={() => openLotDetail(lot)}
    >
      <View style={styles.lotHeader}>
        <Text style={styles.lotName}>{lot.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lot.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(lot.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.companyName}>🏢 {lot.companyName}</Text>
      <Text style={styles.location}>📍 {lot.location}</Text>
      
      {lot.assignedTechnician && (
        <Text style={styles.technician}>👤 {lot.assignedTechnician}</Text>
      )}
      
      {lot.startDate && (
        <Text style={styles.date}>
          📅 Inicio: {new Date(lot.startDate).toLocaleDateString()}
        </Text>
      )}
      
      {lot.estimatedEndDate && (
        <Text style={styles.date}>
          🏁 Est. Fin: {new Date(lot.estimatedEndDate).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <AdminLayout title="Lotes">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando lotes...</Text>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Lotes">
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, ubicación, empresa o técnico..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lots.filter(lot => lot.status === 'IN_SERVICE').length}
            </Text>
            <Text style={styles.statLabel}>En Servicio</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lots.filter(lot => lot.status === 'COMPLETED').length}
            </Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lots.filter(lot => lot.status === 'PENDING').length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>

        {/* Lots List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredLots.length > 0 ? (
            filteredLots.map(renderLotCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {lots.length === 0 ? 'No hay lotes registrados' : 'No se encontraron lotes con los criterios de búsqueda'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Detail Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedLot && (
                <>
                  <Text style={styles.modalTitle}>Detalle del Lote</Text>
                  
                  <Text style={styles.modalLabel}>Nombre del Lote:</Text>
                  <Text style={styles.modalValue}>{selectedLot.name}</Text>
                  
                  <Text style={styles.modalLabel}>Empresa:</Text>
                  <Text style={styles.modalValue}>{selectedLot.companyName}</Text>
                  
                  <Text style={styles.modalLabel}>Ubicación:</Text>
                  <Text style={styles.modalValue}>{selectedLot.location}</Text>
                  
                  <Text style={styles.modalLabel}>Estado:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedLot.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(selectedLot.status)}</Text>
                  </View>
                  
                  {selectedLot.assignedTechnician && (
                    <>
                      <Text style={styles.modalLabel}>Técnico Asignado:</Text>
                      <Text style={styles.modalValue}>{selectedLot.assignedTechnician}</Text>
                    </>
                  )}
                  
                  {selectedLot.startDate && (
                    <>
                      <Text style={styles.modalLabel}>Fecha de Inicio:</Text>
                      <Text style={styles.modalValue}>
                        {new Date(selectedLot.startDate).toLocaleDateString()}
                      </Text>
                    </>
                  )}
                  
                  {selectedLot.estimatedEndDate && (
                    <>
                      <Text style={styles.modalLabel}>Fecha Estimada de Finalización:</Text>
                      <Text style={styles.modalValue}>
                        {new Date(selectedLot.estimatedEndDate).toLocaleDateString()}
                      </Text>
                    </>
                  )}
                  
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
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
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  lotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lotName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  companyName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  technician: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});