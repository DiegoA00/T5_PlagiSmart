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
      '¿Estás seguro que deseas aprobar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: async () => {
            const result = await fumigationService.approveApplication(id);
            if (result.success) {
              Alert.alert('Éxito', 'Solicitud aprobada correctamente');
              fetchApplications();
            } else {
              Alert.alert('Error', result.message || 'Error al aprobar la solicitud');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (id: number) => {
    Alert.alert(
      'Rechazar Solicitud',
      '¿Estás seguro que deseas rechazar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            const result = await fumigationService.rejectApplication(id);
            if (result.success) {
              Alert.alert('Éxito', 'Solicitud rechazada correctamente');
              fetchApplications();
            } else {
              Alert.alert('Error', result.message || 'Error al rechazar la solicitud');
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
            <View style={styles.modalContent}>
              {selectedRequest && (
                <>
                  <Text style={styles.modalTitle}>Detalle de Solicitud</Text>
                  <Text style={styles.modalLabel}>Empresa:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.companyName}</Text>
                  
                  <Text style={styles.modalLabel}>Representante:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.representative}</Text>
                  
                  <Text style={styles.modalLabel}>Ubicación:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.location}</Text>
                  
                  <Text style={styles.modalLabel}>Fecha de Solicitud:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedRequest.submissionDate).toLocaleDateString()}
                  </Text>
                  
                  {selectedRequest.description && (
                    <>
                      <Text style={styles.modalLabel}>Descripción:</Text>
                      <Text style={styles.modalValue}>{selectedRequest.description}</Text>
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