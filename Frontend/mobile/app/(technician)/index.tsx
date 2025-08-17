import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Pressable
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { fumigationService } from '@/services/fumigationService';
import { FumigationListItem, FumigationDetailResponse } from '@/types/request';
import { useFumigationDetails } from '@/hooks/useFumigationData';
import AppLayout from '@/components/AppLayout';
import { TechnicianEvidenceOverlay } from '@/components/Evidence/TechnicianEvidenceOverlay';

interface ExtendedFumigationListItem extends FumigationListItem {
  status: string;
}

export default function TechnicianLotsScreen() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [fumigations, setFumigations] = useState<ExtendedFumigationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ExtendedFumigationListItem | null>(null);
  const [showLotDetails, setShowLotDetails] = useState(false);
  const [showEvidenceOverlay, setShowEvidenceOverlay] = useState(false);
  const [selectedFumigationStatus, setSelectedFumigationStatus] = useState<string | null>(null);
  const [lotDetails, setLotDetails] = useState<FumigationDetailResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { fumigationDetails, loading: detailsLoading, loadFumigationDetails, clearDetails } = useFumigationDetails();

  const FILTER_OPTIONS = [
    { value: 'ALL', label: 'Todos los lotes' },
    { value: 'APPROVED', label: 'Fumigación' },
    { value: 'FUMIGATED', label: 'Descarpe' }
  ];

  useEffect(() => {
    loadFumigations();
  }, [selectedFilter]);

  const loadFumigations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let allFumigations: ExtendedFumigationListItem[] = [];

      if (selectedFilter === 'ALL') {
        const [approvedResponse, fumigatedResponse] = await Promise.all([
          fumigationService.getFumigationsByStatus('APPROVED'),
          fumigationService.getFumigationsByStatus('FUMIGATED')
        ]);
        
        const approvedWithStatus = approvedResponse.content.map(item => ({
          ...item,
          status: 'APPROVED'
        }));
        
        const fumigatedWithStatus = fumigatedResponse.content.map(item => ({
          ...item,
          status: 'FUMIGATED'
        }));
        
        allFumigations = [
          ...approvedWithStatus,
          ...fumigatedWithStatus
        ];
      } else {
        const response = await fumigationService.getFumigationsByStatus(selectedFilter);
        allFumigations = response.content.map(item => ({
          ...item,
          status: selectedFilter
        }));
      }

      setFumigations(allFumigations);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los lotes');
    } finally {
      setLoading(false);
    }
  };

  const loadLotDetails = async (lotId: number) => {
    try {
      setLoadingDetails(true);
      const details = await fumigationService.getFumigationDetails(lotId);
      setLotDetails(details);
    } catch (error: any) {
      console.error('Error loading lot details:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles del lote');
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredFumigations = fumigations.filter((fumigation) =>
    fumigation.companyName && fumigation.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { backgroundColor: '#3B82F6', color: '#FFFFFF' };
      case 'FUMIGATED':
        return { backgroundColor: '#10B981', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#6B7280', color: '#FFFFFF' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Fumigación';
      case 'FUMIGATED':
        return 'Descarpe';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewDetails = async (fumigation: ExtendedFumigationListItem) => {
    setSelectedLot(fumigation);
    setShowLotDetails(true);
    await loadLotDetails(fumigation.id);
  };

  const handleUploadEvidence = async (fumigation: ExtendedFumigationListItem) => {
    setSelectedLot(fumigation);
    setSelectedFumigationStatus(fumigation.status);
    setShowEvidenceOverlay(true);
    await loadFumigationDetails(fumigation.id);
  };

  const handleCloseDetails = () => {
    setSelectedLot(null);
    setShowLotDetails(false);
    setShowEvidenceOverlay(false);
    setSelectedFumigationStatus(null);
    setLotDetails(null);
    clearDetails();
  };

  const handleEvidenceSubmitted = async () => {
    try {
      console.log('=== HANDLING EVIDENCE SUBMITTED ===');
      console.log('Selected filter:', selectedFilter);
      
      // Recargar la lista de fumigaciones
      let allFumigations: ExtendedFumigationListItem[] = [];

      if (selectedFilter === 'ALL') {
        console.log('Loading ALL fumigations...');
        const [approvedResponse, fumigatedResponse] = await Promise.all([
          fumigationService.getFumigationsByStatus('APPROVED'),
          fumigationService.getFumigationsByStatus('FUMIGATED')
        ]);
        
        console.log('Approved response:', approvedResponse);
        console.log('Fumigated response:', fumigatedResponse);
        
        const approvedWithStatus = approvedResponse.content.map(item => ({
          ...item,
          status: 'APPROVED'
        }));
        
        const fumigatedWithStatus = fumigatedResponse.content.map(item => ({
          ...item,
          status: 'FUMIGATED'
        }));
        
        allFumigations = [
          ...approvedWithStatus,
          ...fumigatedWithStatus
        ];
      } else {
        console.log('Loading fumigations for status:', selectedFilter);
        const response = await fumigationService.getFumigationsByStatus(selectedFilter);
        console.log('Response for status', selectedFilter, ':', response);
        
        allFumigations = response.content.map(item => ({
          ...item,
          status: selectedFilter
        }));
      }

      console.log('Final fumigations list:', allFumigations);
      setFumigations(allFumigations);
    } catch (err) {
      console.error("Error al refrescar la lista:", err);
    }
  };

  const renderLotCard = ({ item }: { item: ExtendedFumigationListItem }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.lotNumber}>Lote {item.lotNumber}</Text>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Empresa:</Text>
            <Text style={styles.value}>{item.companyName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Representante:</Text>
            <Text style={styles.value}>{item.representative}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{item.phoneNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.value}>{item.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha Planificada:</Text>
            <Text style={styles.value}>{formatDate(item.plannedDate)}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => handleViewDetails(item)}
          >
            <Text style={styles.detailsButtonText}>Ver Información</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.evidenceButton]}
            onPress={() => handleUploadEvidence(item)}
          >
            <Text style={styles.evidenceButtonText}>Subir Evidencias</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtrar por estado</Text>
          
          {FILTER_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.filterOption,
                selectedFilter === option.value && styles.selectedFilter
              ]}
              onPress={() => {
                setSelectedFilter(option.value);
                setShowFilterModal(false);
              }}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === option.value && styles.selectedFilterText
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}

          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.closeModalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderLotDetailsModal = () => (
    <Modal
      visible={showLotDetails}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLotDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailsModalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>
              Información del Lote a Fumigar
            </Text>
          </View>

          <ScrollView style={styles.modalScrollView}>
            {loadingDetails ? (
              <View style={styles.loadingDetailsContainer}>
                <ActivityIndicator size="large" color="#003595" />
                <Text style={styles.loadingDetailsText}>Cargando detalles del lote...</Text>
              </View>
            ) : lotDetails ? (
              <>
                {/* Datos Generales del Cliente */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Datos Generales del Cliente</Text>
                  
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Nombre de la Empresa:</Text>
                      <Text style={styles.detailValue}>{lotDetails.company.businessName}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Razón Social:</Text>
                      <Text style={styles.detailValue}>{lotDetails.company.businessName}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>RUC:</Text>
                      <Text style={styles.detailValue}>{lotDetails.company.id || '-'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dirección:</Text>
                      <Text style={styles.detailValue}>{lotDetails.company.address}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Teléfono:</Text>
                      <Text style={styles.detailValue}>{lotDetails.company.phone || '-'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Representante:</Text>
                      <Text style={styles.detailValue}>{selectedLot?.representative || '-'}</Text>
                    </View>
                  </View>
                </View>

                {/* Información del Lote */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Información del Lote</Text>
                  
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Número de Lote:</Text>
                      <Text style={styles.detailValue}>{lotDetails.lot.lotNumber}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Toneladas:</Text>
                      <Text style={styles.detailValue}>{lotDetails.lot.tons}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Calidad:</Text>
                      <Text style={styles.detailValue}>{lotDetails.lot.quality}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Número de Sacos:</Text>
                      <Text style={styles.detailValue}>{lotDetails.lot.sacks}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Puerto de Destino:</Text>
                      <Text style={styles.detailValue}>{lotDetails.lot.portDestination}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Fecha Planificada:</Text>
                      <Text style={styles.detailValue}>{formatDate(lotDetails.plannedDate)}</Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.errorDetailsContainer}>
                <Text style={styles.errorDetailsText}>No se pudieron cargar los detalles del lote</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowLotDetails(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <AppLayout title="Lotes Asignados">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando lotes asignados...</Text>
        </View>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Lotes Asignados">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFumigations}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Lotes Asignados">
      <View style={styles.content}>
        <Text style={styles.subtitle}>Gestiona los lotes asignados para fumigación y descarpe</Text>

        <View style={styles.controls}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por empresa"
            value={search}
            onChangeText={setSearch}
          />
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterButtonText}>
              {FILTER_OPTIONS.find(opt => opt.value === selectedFilter)?.label}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredFumigations}
          renderItem={renderLotCard}
          keyExtractor={(item) => `${item.id}-${item.status}`}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {renderFilterModal()}
        {renderLotDetailsModal()}
        
        <TechnicianEvidenceOverlay
          visible={showEvidenceOverlay}
          fumigationDetails={fumigationDetails}
          loading={detailsLoading}
          isEditable={true}
          fumigationStatus={selectedFumigationStatus}
          onClose={handleCloseDetails}
          onSave={handleEvidenceSubmitted}
        />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  content: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    minWidth: 120,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 115,
  },
  value: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  detailsButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  evidenceButton: {
    backgroundColor: '#2563eb',
  },
  evidenceButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  detailsModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#003595',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalScrollView: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#003595',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: '#dbeafe',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedFilterText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: '#003595',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#003595',
    paddingBottom: 8,
  },
  detailsGrid: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: '50%',
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
  },
  loadingDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingDetailsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorDetailsText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
});
