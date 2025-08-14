import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { ApiUser } from '@/types/request';
import { FumigationData } from '@/hooks/useFumigationEvidence';

interface PersonnelSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  availableTechnicians: ApiUser[];
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const PersonnelSection: React.FC<PersonnelSectionProps> = ({
  fumigationData,
  setFumigationData,
  availableTechnicians,
  isEditable,
  fumigationReportSubmitted
}) => {
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);

  const handleTechnicianSelect = (technician: ApiUser) => {
    const isAlreadyAdded = fumigationData.technicians.some(t => t.id === technician.id);
    
    if (!isAlreadyAdded) {
      const newTechnician = {
        id: technician.id,
        name: `${technician.firstName} ${technician.lastName}`,
        role: "Técnico"
      };

      setFumigationData(prev => ({
        ...prev,
        selectedTechnician: technician.id.toString(),
        technicians: [...prev.technicians, newTechnician]
      }));
    }
    
    setShowTechnicianModal(false);
  };

  const removeTechnician = (technicianId: number) => {
    Alert.alert(
      'Remover Técnico',
      '¿Estás seguro de que deseas remover este técnico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setFumigationData(prev => {
              const updatedTechnicians = prev.technicians.filter(t => t.id !== technicianId);
              return {
                ...prev,
                technicians: updatedTechnicians,
                selectedTechnician: updatedTechnicians.length === 0 ? "" : prev.selectedTechnician
              };
            });
          }
        }
      ]
    );
  };

  const availableToAdd = availableTechnicians.filter(tech => 
    !fumigationData.technicians.some(addedTech => addedTech.id === tech.id)
  );

  const renderTechnicianItem = ({ item }: { item: ApiUser }) => (
    <TouchableOpacity
      style={styles.technicianItem}
      onPress={() => handleTechnicianSelect(item)}
    >
      <View style={styles.technicianInfo}>
        <Text style={styles.technicianName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.technicianRole}>Técnico</Text>
      </View>
      <Text style={styles.addIcon}>+</Text>
    </TouchableOpacity>
  );

  const renderAssignedTechnician = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.assignedTechnicianCard}>
      <View style={styles.technicianDetails}>
        <View style={styles.technicianField}>
          <Text style={styles.fieldLabel}>Nombre Completo</Text>
          <Text style={styles.fieldValue}>{item.name}</Text>
        </View>
        <View style={styles.technicianField}>
          <Text style={styles.fieldLabel}>Cargo</Text>
          <Text style={styles.fieldValue}>{item.role}</Text>
        </View>
      </View>
      {isEditable && !fumigationReportSubmitted && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeTechnician(item.id)}
        >
          <Text style={styles.removeButtonText}>Remover</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <CollapsibleSection title="Personal que Interviene" defaultOpen required>
      <View style={styles.container}>
        {isEditable && !fumigationReportSubmitted && availableToAdd.length > 0 && (
          <View style={styles.addSection}>
            <Text style={[styles.label, styles.required]}>Agregar Técnico</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowTechnicianModal(true)}
            >
              <Text style={styles.selectButtonText}>
                Seleccione un técnico para agregar
              </Text>
              <Text style={styles.selectButtonIcon}>⌄</Text>
            </TouchableOpacity>
          </View>
        )}

        {fumigationData.technicians.length > 0 && (
          <View style={styles.techniciansSection}>
            <Text style={styles.sectionTitle}>
              Técnicos Asignados ({fumigationData.technicians.length})
            </Text>
            <FlatList
              data={fumigationData.technicians}
              renderItem={renderAssignedTechnician}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {fumigationData.technicians.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>+</Text>
            <Text style={styles.emptyText}>No hay técnicos asignados</Text>
            <Text style={styles.emptyWarning}>
              ⚠️ Se requiere al menos un técnico para continuar
            </Text>
          </View>
        )}

        {isEditable && !fumigationReportSubmitted && availableToAdd.length === 0 && fumigationData.technicians.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Todos los técnicos disponibles han sido asignados
            </Text>
          </View>
        )}

        <Modal
          visible={showTechnicianModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTechnicianModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Técnico</Text>
              
              <FlatList
                data={availableToAdd}
                renderItem={renderTechnicianItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.technicianList}
              />

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTechnicianModal(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  addSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  required: {
    color: '#dc2626',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  selectButtonIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  techniciansSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  assignedTechnicianCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  technicianDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  technicianField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 32,
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  emptyWarning: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1d4ed8',
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
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  technicianList: {
    maxHeight: 300,
  },
  technicianItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  technicianInfo: {
    flex: 1,
  },
  technicianName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  technicianRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  addIcon: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
