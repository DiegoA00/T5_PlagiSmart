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
import { ApiFumigationApplication } from '@/types/request';

export default function RequestsScreen() {
  const [applications, setApplications] = useState<ApiFumigationApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApiFumigationApplication[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('PENDING');
  const [selectedRequest, setSelectedRequest] = useState<ApiFumigationApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const statuses = ['PENDING', 'REJECTED'];

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  useEffect(() => {
    if (Array.isArray(applications) && applications.length > 0) {
      const filtered = applications.filter((app) =>
        app.companyName.toLowerCase().includes(search.toLowerCase()) ||
        app.representative.toLowerCase().includes(search.toLowerCase()) ||
        app.location.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications([]);
    }
  }, [search, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let result;
      if (selectedStatus === 'PENDING') {
        result = await fumigationService.getPendingApplications();
      } else {
        result = await fumigationService.getRejectedApplications();
      }

      if (result.success && result.data?.content) {
        setApplications(result.data.content);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      Alert.alert('Error', 'Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const handleApprove = async (id: number) => {
    Alert.alert(
      'Aprobar Solicitud',
      '¿Estás seguro que deseas aprobar esta solicitud? Esto creará lotes para fumigación.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: async () => {
            try {
              const result = await fumigationService.approveApplication(id);
              if (result.success) {
                Alert.alert(
                  'Éxito', 
                  'Solicitud aprobada correctamente. Se han creado los lotes para fumigación.',
                  [{ text: 'OK', onPress: () => fetchApplications() }]
                );
              } else {
                Alert.alert('Error', result.message || 'Error al aprobar la solicitud');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error de conexión');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (id: number, reason?: string) => {
    Alert.prompt(
      'Rechazar Solicitud',
      'Ingresa el motivo del rechazo (opcional):',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async (rejectionReason) => {
            try {
              const result = await fumigationService.rejectApplication(id, rejectionReason);
              if (result.success) {
                Alert.alert(
                  'Éxito', 
                  'Solicitud rechazada correctamente.',
                  [{ text: 'OK', onPress: () => fetchApplications() }]
                );
              } else {
                Alert.alert('Error', result.message || 'Error al rechazar la solicitud');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error de conexión');
            }
          }
        }
      ],
      'plain-text',
      '',
      'Motivo del rechazo'
    );
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    const pendingApplications = filteredApplications.filter(app => selectedStatus === 'PENDING');
    
    if (pendingApplications.length === 0) {
      Alert.alert('Sin solicitudes', 'No hay solicitudes pendientes para procesar.');
      return;
    }

    const actionText = action === 'approve' ? 'aprobar' : 'rechazar';
    const confirmText = action === 'approve' ? 'Aprobar Todas' : 'Rechazar Todas';
    
    Alert.alert(
      `${confirmText} las Solicitudes`,
      `¿Estás seguro que deseas ${actionText} todas las solicitudes pendientes (${pendingApplications.length})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: confirmText,
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              const promises = pendingApplications.map(app => 
                action === 'approve' 
                  ? fumigationService.approveApplication(app.id)
                  : fumigationService.rejectApplication(app.id)
              );
              
              await Promise.all(promises);
              Alert.alert('Éxito', `Todas las solicitudes han sido ${action === 'approve' ? 'aprobadas' : 'rechazadas'} correctamente.`);
              fetchApplications();
            } catch (error: any) {
              Alert.alert('Error', `Error al ${actionText} las solicitudes: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const openRequestDetail = (request: ApiFumigationApplication) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const renderStatusTabs = () => (
    <View style={styles.tabContainer}>
      {statuses.map((status) => (
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
            {status === 'PENDING' ? 'Pendientes' : 'Rechazadas'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRequestCard = (request: ApiFumigationApplication) => (
    <TouchableOpacity
      key={request.id}
      style={styles.requestCard}
      onPress={() => openRequestDetail(request)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.companyName}>{request.companyName}</Text>
        <Text style={styles.requestDate}>
          {new Date(request.submissionDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.representative}>Rep: {request.representative}</Text>
      <Text style={styles.location}>📍 {request.location}</Text>
      
      {selectedStatus === 'PENDING' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(request.id)}
          >
            <Text style={styles.actionButtonText}>Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(request.id)}
          >
            <Text style={styles.actionButtonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <AdminLayout title="Solicitudes">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando solicitudes...</Text>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Solicitudes">
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empresa, representante o ubicación..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Status Tabs */}
        {renderStatusTabs()}

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredApplications.length}</Text>
            <Text style={styles.statLabel}>
              {selectedStatus === 'PENDING' ? 'Pendientes' : 'Rechazadas'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredApplications.filter(app => 
                new Date(app.submissionDate).getMonth() === new Date().getMonth()
              ).length}
            </Text>
            <Text style={styles.statLabel}>Este Mes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredApplications.filter(app => 
                new Date(app.submissionDate).toDateString() === new Date().toDateString()
              ).length}
            </Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
        </View>

        {/* Bulk Actions */}
        {selectedStatus === 'PENDING' && filteredApplications.length > 0 && (
          <View style={styles.bulkActionsContainer}>
            <Text style={styles.bulkActionsTitle}>Acciones en Lote:</Text>
            <View style={styles.bulkActionsButtons}>
              <TouchableOpacity
                style={[styles.bulkActionButton, styles.approveAllButton]}
                onPress={() => handleBulkAction('approve')}
              >
                <Text style={styles.bulkActionButtonText}>✅ Aprobar Todas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bulkActionButton, styles.rejectAllButton]}
                onPress={() => handleBulkAction('reject')}
              >
                <Text style={styles.bulkActionButtonText}>❌ Rechazar Todas</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Requests List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredApplications.length > 0 ? (
            filteredApplications.map(renderRequestCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay solicitudes {selectedStatus === 'PENDING' ? 'pendientes' : 'rechazadas'}
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
                {selectedRequest && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalle de Solicitud</Text>
                      <View style={[styles.statusBadge, { 
                        backgroundColor: selectedRequest.status === 'PENDING' ? '#f59e0b' : '#ef4444' 
                      }]}>
                        <Text style={styles.statusText}>
                          {selectedRequest.status === 'PENDING' ? 'Pendiente' : 'Rechazada'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Información de la Empresa</Text>
                      
                      <Text style={styles.modalLabel}>Empresa:</Text>
                      <Text style={styles.modalValue}>{selectedRequest.companyName}</Text>
                      
                      <Text style={styles.modalLabel}>Representante:</Text>
                      <Text style={styles.modalValue}>{selectedRequest.representative}</Text>
                      
                      <Text style={styles.modalLabel}>Ubicación:</Text>
                      <Text style={styles.modalValue}>📍 {selectedRequest.location}</Text>
                      
                      {selectedRequest.contactInfo && (
                        <>
                          <Text style={styles.modalLabel}>Información de Contacto:</Text>
                          <Text style={styles.modalValue}>{selectedRequest.contactInfo}</Text>
                        </>
                      )}
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Detalles de la Solicitud</Text>
                      
                      <Text style={styles.modalLabel}>Fecha de Solicitud:</Text>
                      <Text style={styles.modalValue}>
                        📅 {new Date(selectedRequest.submissionDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      
                      <Text style={styles.modalLabel}>ID de Solicitud:</Text>
                      <Text style={styles.modalValue}>#{selectedRequest.id}</Text>

                      {selectedRequest.description && (
                        <>
                          <Text style={styles.modalLabel}>Descripción:</Text>
                          <Text style={styles.modalValue}>{selectedRequest.description}</Text>
                        </>
                      )}

                      {selectedRequest.estimatedVolume && (
                        <>
                          <Text style={styles.modalLabel}>Volumen Estimado:</Text>
                          <Text style={styles.modalValue}>📦 {selectedRequest.estimatedVolume} TM</Text>
                        </>
                      )}

                      {selectedRequest.preferredDate && (
                        <>
                          <Text style={styles.modalLabel}>Fecha Preferida:</Text>
                          <Text style={styles.modalValue}>
                            🗓️ {new Date(selectedRequest.preferredDate).toLocaleDateString('es-ES')}
                          </Text>
                        </>
                      )}
                    </View>

                    {selectedStatus === 'PENDING' && (
                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          style={[styles.modalActionButton, styles.approveButton]}
                          onPress={() => {
                            setModalVisible(false);
                            handleApprove(selectedRequest.id);
                          }}
                        >
                          <Text style={styles.modalActionButtonText}>✅ Aprobar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.modalActionButton, styles.rejectButton]}
                          onPress={() => {
                            setModalVisible(false);
                            handleReject(selectedRequest.id);
                          }}
                        >
                          <Text style={styles.modalActionButtonText}>❌ Rechazar</Text>
                        </TouchableOpacity>
                      </View>
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
            </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  requestDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  representative: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  bulkActionsContainer: {
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
  bulkActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  bulkActionsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveAllButton: {
    backgroundColor: '#10b981',
  },
  rejectAllButton: {
    backgroundColor: '#ef4444',
  },
  bulkActionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
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