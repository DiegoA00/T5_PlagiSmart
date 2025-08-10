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
import { ApiService } from '@/types/request';

export default function ServicesScreen() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [filteredServices, setFilteredServices] = useState<ApiService[]>([]);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedTechnician, setSelectedTechnician] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);

  const monthOptions = ['ALL', ...Array.from({length: 12}, (_, i) => 
    new Date(0, i).toLocaleDateString('es-ES', { month: 'long' })
  )];
  
  const technicianOptions = ['ALL', ...new Set(services.map(s => s.technician))];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (Array.isArray(services) && services.length > 0) {
      let filtered = services;
      
      // Filtrar por búsqueda
      if (search.trim()) {
        filtered = filtered.filter((service) =>
          service.lotName.toLowerCase().includes(search.toLowerCase()) ||
          service.companyName.toLowerCase().includes(search.toLowerCase()) ||
          service.technician.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Filtrar por mes
      if (selectedMonth !== 'ALL') {
        filtered = filtered.filter(service => {
          const serviceMonth = new Date(service.completionDate)
            .toLocaleDateString('es-ES', { month: 'long' });
          return serviceMonth === selectedMonth;
        });
      }
      
      // Filtrar por técnico
      if (selectedTechnician !== 'ALL') {
        filtered = filtered.filter(service => service.technician === selectedTechnician);
      }
      
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [search, services, selectedMonth, selectedTechnician]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const result = await fumigationService.getCompletedServices();
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        setServices([]);
        if (result.message) {
          Alert.alert('Error', result.message);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Error al cargar los servicios');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const openServiceDetail = (service: ApiService) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleGenerateCertificate = (service: ApiService) => {
    setSelectedService(service);
    setCertificateModalVisible(true);
  };

  const confirmGenerateCertificate = async () => {
    if (!selectedService) return;
    
    Alert.alert(
      'Generar Certificado',
      `¿Deseas generar el certificado de fumigación para el lote ${selectedService.lotName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Generar',
          onPress: async () => {
            try {
              const result = await fumigationService.generateCertificate(selectedService.id);
              if (result.success) {
                Alert.alert('Éxito', 'Certificado generado correctamente');
                setCertificateModalVisible(false);
              } else {
                Alert.alert('Error', result.message || 'Error al generar certificado');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error de conexión');
            }
          }
        }
      ]
    );
  };

  const renderFilterTabs = () => (
    <View style={styles.filtersContainer}>
      <Text style={styles.filterLabel}>Filtros:</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Mes:</Text>
          <View style={styles.filterTabs}>
            {monthOptions.slice(0, 6).map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.filterTab,
                  selectedMonth === month && styles.activeFilterTab
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedMonth === month && styles.activeFilterTabText
                ]}>
                  {month === 'ALL' ? 'Todos' : month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Técnico:</Text>
          <View style={styles.filterTabs}>
            {technicianOptions.slice(0, 5).map((technician) => (
              <TouchableOpacity
                key={technician}
                style={[
                  styles.filterTab,
                  selectedTechnician === technician && styles.activeFilterTab
                ]}
                onPress={() => setSelectedTechnician(technician)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedTechnician === technician && styles.activeFilterTabText
                ]}>
                  {technician === 'ALL' ? 'Todos' : technician.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderServiceCard = (service: ApiService) => (
    <View key={service.id} style={styles.serviceCard}>
      <TouchableOpacity onPress={() => openServiceDetail(service)}>
        <View style={styles.serviceHeader}>
          <Text style={styles.lotName}>{service.lotName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Completado</Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>🏢 {service.companyName}</Text>
        <Text style={styles.technician}>👤 {service.technician}</Text>
        <Text style={styles.completionDate}>
          ✅ Completado: {new Date(service.completionDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
        
        {service.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            📝 {service.notes}
          </Text>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.serviceActions}>
        <TouchableOpacity
          style={[styles.serviceActionButton, styles.detailsButton]}
          onPress={() => openServiceDetail(service)}
        >
          <Text style={styles.serviceActionButtonText}>📋 Detalles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.serviceActionButton, styles.certificateButton]}
          onPress={() => handleGenerateCertificate(service)}
        >
          <Text style={styles.serviceActionButtonText}>📄 Certificado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Estadísticas de servicios por mes
  const getMonthlyStats = () => {
    const monthlyStats: { [key: string]: number } = {};
    
    services.forEach(service => {
      const month = new Date(service.completionDate).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      });
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    return Object.entries(monthlyStats)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-3); // Últimos 3 meses
  };

  if (loading) {
    return (
      <AdminLayout title="Servicios Completados">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando servicios...</Text>
        </View>
      </AdminLayout>
    );
  }

  const monthlyStats = getMonthlyStats();

  return (
    <AdminLayout title="Servicios Completados">
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por lote, empresa o técnico..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Filters */}
        {renderFilterTabs()}

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredServices.length}</Text>
            <Text style={styles.statLabel}>Servicios Mostrados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(filteredServices.map(s => s.technician)).size}
            </Text>
            <Text style={styles.statLabel}>Técnicos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(filteredServices.map(s => s.companyName)).size}
            </Text>
            <Text style={styles.statLabel}>Empresas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Filter Results Info */}
        {(selectedMonth !== 'ALL' || selectedTechnician !== 'ALL' || search.trim()) && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterInfoText}>
              Mostrando {filteredServices.length} de {services.length} servicios
              {selectedMonth !== 'ALL' && ` - ${selectedMonth}`}
              {selectedTechnician !== 'ALL' && ` - ${selectedTechnician.split(' ')[0]}`}
              {search.trim() && ` - Búsqueda: "${search}"`}
            </Text>
          </View>
        )}

        {/* Monthly Stats */}
        {monthlyStats.length > 0 && (
          <View style={styles.monthlyStatsContainer}>
            <Text style={styles.monthlyStatsTitle}>Últimos 3 Meses</Text>
            {monthlyStats.map(([month, count]) => (
              <View key={month} style={styles.monthlyStatItem}>
                <Text style={styles.monthlyStatMonth}>{month}</Text>
                <Text style={styles.monthlyStatCount}>{count} servicios</Text>
              </View>
            ))}
          </View>
        )}

        {/* Services List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredServices.length > 0 ? (
            filteredServices.map(renderServiceCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {services.length === 0 ? 'No hay servicios completados' : 'No se encontraron servicios con los criterios de búsqueda'}
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
              {selectedService && (
                <>
                  <Text style={styles.modalTitle}>Detalle del Servicio</Text>
                  
                  <Text style={styles.modalLabel}>Lote:</Text>
                  <Text style={styles.modalValue}>{selectedService.lotName}</Text>
                  
                  <Text style={styles.modalLabel}>Empresa:</Text>
                  <Text style={styles.modalValue}>{selectedService.companyName}</Text>
                  
                  <Text style={styles.modalLabel}>Técnico:</Text>
                  <Text style={styles.modalValue}>{selectedService.technician}</Text>
                  
                  <Text style={styles.modalLabel}>Fecha de Finalización:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedService.completionDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  
                  <Text style={styles.modalLabel}>Estado:</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Completado</Text>
                  </View>
                  
                  {selectedService.notes && (
                    <>
                      <Text style={styles.modalLabel}>Notas:</Text>
                      <Text style={styles.modalValue}>{selectedService.notes}</Text>
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

        {/* Certificate Generation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={certificateModalVisible}
          onRequestClose={() => setCertificateModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.certificateModalContent}>
              {selectedService && (
                <>
                  <Text style={styles.modalTitle}>Generar Certificado</Text>
                  
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateInfoTitle}>Información del Servicio</Text>
                    
                    <Text style={styles.modalLabel}>Lote:</Text>
                    <Text style={styles.modalValue}>{selectedService.lotName}</Text>
                    
                    <Text style={styles.modalLabel}>Empresa:</Text>
                    <Text style={styles.modalValue}>{selectedService.companyName}</Text>
                    
                    <Text style={styles.modalLabel}>Técnico:</Text>
                    <Text style={styles.modalValue}>{selectedService.technician}</Text>
                    
                    <Text style={styles.modalLabel}>Fecha de Finalización:</Text>
                    <Text style={styles.modalValue}>
                      {new Date(selectedService.completionDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>

                  <Text style={styles.certificateWarning}>
                    ⚠️ Se generará un certificado oficial de fumigación para este servicio completado.
                  </Text>
                  
                  <View style={styles.certificateActions}>
                    <TouchableOpacity
                      style={styles.cancelCertificateButton}
                      onPress={() => setCertificateModalVisible(false)}
                    >
                      <Text style={styles.cancelCertificateButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.generateCertificateButton}
                      onPress={confirmGenerateCertificate}
                    >
                      <Text style={styles.generateCertificateButtonText}>📄 Generar Certificado</Text>
                    </TouchableOpacity>
                  </View>
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
  filtersContainer: {
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
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filterScrollView: {
    marginBottom: 8,
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterGroupLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeFilterTab: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterTabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#ffffff',
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
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  monthlyStatsContainer: {
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
  monthlyStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  monthlyStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  monthlyStatMonth: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  monthlyStatCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
  scrollView: {
    flex: 1,
  },
  serviceCard: {
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
  serviceHeader: {
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
    backgroundColor: '#10b981',
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
  technician: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  completionDate: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 4,
    fontWeight: '500',
  },
  notes: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 8,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  serviceActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  serviceActionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#3b82f6',
  },
  certificateButton: {
    backgroundColor: '#059669',
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
  certificateModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  certificateInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  certificateInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  certificateWarning: {
    fontSize: 14,
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  certificateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelCertificateButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelCertificateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  generateCertificateButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  generateCertificateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});