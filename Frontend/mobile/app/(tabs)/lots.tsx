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
import { usersService } from '@/services/usersService';
import { ApiLot, ApiUser } from '@/types/request';

export default function LotsScreen() {
  const [lots, setLots] = useState<ApiLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ApiLot[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLot, setSelectedLot] = useState<ApiLot | null>(null);
  const [technicians, setTechnicians] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<ApiUser | null>(null);

  const statusOptions = ['ALL', 'PENDING', 'IN_SERVICE', 'COMPLETED'];

  useEffect(() => {
    fetchLots();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    if (Array.isArray(lots) && lots.length > 0) {
      let filtered = lots;
      
      // Filtrar por estado
      if (selectedStatus !== 'ALL') {
        filtered = filtered.filter(lot => lot.status === selectedStatus);
      }
      
      // Filtrar por búsqueda
      if (search.trim()) {
        filtered = filtered.filter((lot) =>
          lot.name.toLowerCase().includes(search.toLowerCase()) ||
          lot.location.toLowerCase().includes(search.toLowerCase()) ||
          lot.companyName.toLowerCase().includes(search.toLowerCase()) ||
          (lot.assignedTechnician && lot.assignedTechnician.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      setFilteredLots(filtered);
    } else {
      setFilteredLots([]);
    }
  }, [search, lots, selectedStatus]);

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

  const fetchTechnicians = async () => {
    try {
      const result = await usersService.getUsersByRole('technician');
      if (result.success && result.data) {
        setTechnicians(result.data);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
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

  const openAssignTechnician = (lot: ApiLot) => {
    setSelectedLot(lot);
    setAssignModalVisible(true);
  };

  const handleAssignTechnician = async (technicianId: number) => {
    if (!selectedLot) return;
    
    try {
      const result = await fumigationService.assignTechnician(selectedLot.id, technicianId);
      if (result.success) {
        Alert.alert('Éxito', 'Técnico asignado correctamente');
        setAssignModalVisible(false);
        fetchLots();
      } else {
        Alert.alert('Error', result.message || 'Error al asignar técnico');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error de conexión');
    }
  };

  const handleUpdateLotStatus = async (lotId: number, newStatus: 'IN_SERVICE' | 'COMPLETED') => {
    try {
      const result = await fumigationService.updateLotStatus(lotId, newStatus);
      if (result.success) {
        Alert.alert('Éxito', `Estado del lote actualizado a ${getStatusLabel(newStatus)}`);
        fetchLots();
      } else {
        Alert.alert('Error', result.message || 'Error al actualizar estado');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error de conexión');
    }
  };

  const showStatusUpdateOptions = (lot: ApiLot) => {
    const options = [];
    
    if (lot.status === 'PENDING') {
      options.push({
        text: 'Iniciar Servicio',
        onPress: () => handleUpdateLotStatus(lot.id, 'IN_SERVICE')
      });
    }
    
    if (lot.status === 'IN_SERVICE') {
      options.push({
        text: 'Marcar como Completado',
        onPress: () => handleUpdateLotStatus(lot.id, 'COMPLETED')
      });
    }
    
    options.push({ text: 'Cancelar', style: 'cancel' });
    
    Alert.alert('Actualizar Estado', 'Selecciona el nuevo estado:', options);
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
      case 'ALL':
        return 'Todos';
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

  const renderStatusTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
      <View style={styles.tabContainer}>
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tab,
              selectedStatus === status && styles.activeTab
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={[
              styles.tabText,
              selectedStatus === status && styles.activeTabText
            ]}>
              {getStatusLabel(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderLotCard = (lot: ApiLot) => (
    <View key={lot.id} style={styles.lotCard}>
      <TouchableOpacity onPress={() => openLotDetail(lot)}>
        <View style={styles.lotHeader}>
          <Text style={styles.lotName}>{lot.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lot.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(lot.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>🏢 {lot.companyName}</Text>
        <Text style={styles.location}>📍 {lot.location}</Text>
        
        {lot.assignedTechnician ? (
          <Text style={styles.technician}>👤 {lot.assignedTechnician}</Text>
        ) : (
          <Text style={styles.noTechnician}>👤 Sin técnico asignado</Text>
        )}
        
        {lot.startDate && (
          <Text style={styles.date}>
            📅 Inicio: {new Date(lot.startDate).toLocaleDateString('es-ES')}
          </Text>
        )}
        
        {lot.estimatedEndDate && (
          <Text style={styles.date}>
            🏁 Est. Fin: {new Date(lot.estimatedEndDate).toLocaleDateString('es-ES')}
          </Text>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.lotActions}>
        {!lot.assignedTechnician && (
          <TouchableOpacity
            style={[styles.lotActionButton, styles.assignButton]}
            onPress={() => openAssignTechnician(lot)}
          >
            <Text style={styles.lotActionButtonText}>👤 Asignar</Text>
          </TouchableOpacity>
        )}
        
        {(lot.status === 'PENDING' || lot.status === 'IN_SERVICE') && (
          <TouchableOpacity
            style={[styles.lotActionButton, styles.statusButton]}
            onPress={() => showStatusUpdateOptions(lot)}
          >
            <Text style={styles.lotActionButtonText}>
              {lot.status === 'PENDING' ? '▶️ Iniciar' : '✅ Completar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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

        {/* Status Tabs */}
        {renderStatusTabs()}

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lots.filter(lot => lot.status === 'PENDING').length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
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
              {lots.filter(lot => !lot.assignedTechnician).length}
            </Text>
            <Text style={styles.statLabel}>Sin Asignar</Text>
          </View>
        </View>

        {/* Filter Results Info */}
        {(selectedStatus !== 'ALL' || search.trim()) && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterInfoText}>
              Mostrando {filteredLots.length} de {lots.length} lotes
              {selectedStatus !== 'ALL' && ` (${getStatusLabel(selectedStatus)})`}
              {search.trim() && ` - Búsqueda: "${search}"`}
            </Text>
          </View>
        )}

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
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalContent}>
                {selectedLot && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalle del Lote</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedLot.status) }]}>
                        <Text style={styles.statusText}>{getStatusLabel(selectedLot.status)}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Información General</Text>
                      
                      <Text style={styles.modalLabel}>Nombre del Lote:</Text>
                      <Text style={styles.modalValue}>{selectedLot.name}</Text>
                      
                      <Text style={styles.modalLabel}>Empresa:</Text>
                      <Text style={styles.modalValue}>🏢 {selectedLot.companyName}</Text>
                      
                      <Text style={styles.modalLabel}>Ubicación:</Text>
                      <Text style={styles.modalValue}>📍 {selectedLot.location}</Text>
                      
                      <Text style={styles.modalLabel}>ID del Lote:</Text>
                      <Text style={styles.modalValue}>#{selectedLot.id}</Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Asignación y Fechas</Text>
                      
                      <Text style={styles.modalLabel}>Técnico Asignado:</Text>
                      <Text style={styles.modalValue}>
                        {selectedLot.assignedTechnician ? 
                          `👤 ${selectedLot.assignedTechnician}` : 
                          '👤 Sin técnico asignado'
                        }
                      </Text>
                      
                      {selectedLot.startDate && (
                        <>
                          <Text style={styles.modalLabel}>Fecha de Inicio:</Text>
                          <Text style={styles.modalValue}>
                            📅 {new Date(selectedLot.startDate).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Text>
                        </>
                      )}
                      
                      {selectedLot.estimatedEndDate && (
                        <>
                          <Text style={styles.modalLabel}>Fecha Estimada de Finalización:</Text>
                          <Text style={styles.modalValue}>
                            🏁 {new Date(selectedLot.estimatedEndDate).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Text>
                        </>
                      )}
                    </View>

                    <View style={styles.modalActions}>
                      {!selectedLot.assignedTechnician && (
                        <TouchableOpacity
                          style={[styles.modalActionButton, styles.assignButton]}
                          onPress={() => {
                            setModalVisible(false);
                            openAssignTechnician(selectedLot);
                          }}
                        >
                          <Text style={styles.modalActionButtonText}>👤 Asignar Técnico</Text>
                        </TouchableOpacity>
                      )}
                      
                      {(selectedLot.status === 'PENDING' || selectedLot.status === 'IN_SERVICE') && (
                        <TouchableOpacity
                          style={[styles.modalActionButton, styles.statusButton]}
                          onPress={() => {
                            setModalVisible(false);
                            showStatusUpdateOptions(selectedLot);
                          }}
                        >
                          <Text style={styles.modalActionButtonText}>
                            {selectedLot.status === 'PENDING' ? '▶️ Iniciar Servicio' : '✅ Completar'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Assign Technician Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={assignModalVisible}
          onRequestClose={() => setAssignModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Asignar Técnico</Text>
              <Text style={styles.modalSubtitle}>
                Lote: {selectedLot?.name}
              </Text>
              
              <ScrollView style={styles.technicianList}>
                {technicians.length > 0 ? (
                  technicians.map((technician) => (
                    <TouchableOpacity
                      key={technician.id}
                      style={styles.technicianItem}
                      onPress={() => handleAssignTechnician(technician.id)}
                    >
                      <Text style={styles.technicianName}>
                        👤 {technician.firstName} {technician.lastName}
                      </Text>
                      <Text style={styles.technicianEmail}>{technician.email}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noTechniciansText}>
                    No hay técnicos disponibles
                  </Text>
                )}
              </ScrollView>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAssignModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
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
  tabScrollView: {
    maxHeight: 50,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
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
  noTechnician: {
    fontSize: 14,
    color: '#ef4444',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  lotActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  lotActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  lotActionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalScrollView: {
    flex: 1,
    paddingTop: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
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
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalActionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  assignButton: {
    backgroundColor: '#f59e0b',
  },
  statusButton: {
    backgroundColor: '#10b981',
  },
  technicianList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  technicianItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  technicianName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  technicianEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  noTechniciansText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});