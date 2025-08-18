import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { FumigationDetailResponse, ApiUser } from '@/types/request';
import { usersService } from '@/services/usersService';
import { reportsService } from '@/services/reportsService';
import { FumigationForm } from './FumigationForm';
import { UncoveringForm } from './UncoveringForm';
import { useFumigationEvidence } from '@/hooks/useFumigationEvidence';
import { useUncoveringEvidence } from '@/hooks/useUncoveringEvidence';

interface TechnicianEvidenceOverlayProps {
  visible: boolean;
  fumigationDetails: FumigationDetailResponse | null;
  isEditable?: boolean;
  fumigationStatus?: string | null;
  onClose?: () => void;
  onSave?: (data: any) => void;
  loading?: boolean;
}

export const TechnicianEvidenceOverlay: React.FC<TechnicianEvidenceOverlayProps> = ({
  visible,
  fumigationDetails,
  isEditable = true,
  fumigationStatus,
  onClose,
  onSave,
  loading = false
}) => {
  const [availableTechnicians, setAvailableTechnicians] = useState<ApiUser[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fumigationReportSubmitted, setFumigationReportSubmitted] = useState(false);
  const [cleanupReportSubmitted, setCleanupReportSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    fumigationData,
    setFumigationData,
    validateFumigationForm,
    validationErrors: fumigationValidationErrors,
    clearValidationErrors: clearFumigationValidationErrors,
    updateField: updateFumigationField,
    addToArray: addToFumigationArray,
    removeFromArray: removeFromFumigationArray,
    resetForm: resetFumigationForm
  } = useFumigationEvidence(fumigationDetails);

  const {
    cleanupData,
    setCleanupData,
    validateForm: validateCleanupForm,
    validationErrors: cleanupValidationErrors,
    clearValidationErrors: clearCleanupValidationErrors,
    updateField: updateCleanupField,
    updateLotDescription,
    updateSafetyConditions,
    addTechnician: addCleanupTechnician,
    removeTechnician: removeCleanupTechnician,
    resetForm: resetCleanupForm
  } = useUncoveringEvidence(fumigationDetails);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        console.log('=== LOADING TECHNICIANS ===');
        const response = await usersService.getUsersByRole('TECHNICIAN');
        console.log('Technicians response:', response);
        console.log('Response data:', response.data);
        console.log('Response success:', response.success);
        
        if (response.success && response.data) {
          console.log('Setting available technicians:', response.data.length, 'technicians');
          setAvailableTechnicians(response.data);
        } else {
          console.log('No technicians data received or request failed');
          setAvailableTechnicians([]);
        }
        console.log('==========================');
      } catch (error) {
        console.error("Error loading technicians:", error);
        setAvailableTechnicians([]);
      }
    };

    if (isEditable && visible) {
      loadTechnicians();
    }
  }, [isEditable, visible]);

  const handleSubmitClick = () => {
    console.log('=== HANDLE SUBMIT CLICK ===');
    console.log('Fumigation status:', fumigationStatus);
    
    if (fumigationStatus === "APPROVED") {
      console.log('Validating fumigation form...');
      if (!validateFumigationForm()) {
        console.log('Fumigation form validation failed');
        return;
      }
      console.log('Fumigation form validation passed');
    } else if (fumigationStatus === "FUMIGATED") {
      console.log('Validating cleanup form...');
      if (!validateCleanupForm()) {
        console.log('Cleanup form validation failed');
        return;
      }
      console.log('Cleanup form validation passed');
    }
    
    console.log('Setting show confirm dialog to true');
    setShowConfirmDialog(true);
  };

  const handleSubmitFumigationReport = async () => {
    console.log('=== HANDLE SUBMIT FUMIGATION REPORT START ===');
    console.log('Is submitting:', isSubmitting);
    
    if (isSubmitting) {
      console.log('Already submitting, returning');
      return;
    }
    
    console.log('Setting is submitting to true');
    setIsSubmitting(true);

    try {
      const formatDateForBackend = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      const reportData = {
        id: fumigationDetails?.lot?.id || 0,
        location: fumigationData.location.trim(),
        date: formatDateForBackend(fumigationData.date),
        startTime: fumigationData.startTime,
        endTime: fumigationData.endTime,
        supervisor: fumigationData.supervisor.trim(),
        technicians: fumigationData.technicians.map(t => ({ id: t.id })),
        supplies: fumigationData.supplies.map(supply => ({
          name: supply.name.trim(),
          quantity: parseFloat(supply.quantity),
          dosage: supply.dosage.trim(),
          kindOfSupply: supply.kindOfSupply.trim(),
          numberOfStrips: supply.numberOfStrips.trim() || "0"
        })),
        dimensions: {
          height: parseFloat(fumigationData.dimensions.height),
          width: parseFloat(fumigationData.dimensions.width),
          length: parseFloat(fumigationData.dimensions.length)
        },
        environmentalConditions: {
          temperature: parseFloat(fumigationData.environmentalConditions.temperature),
          humidity: parseFloat(fumigationData.environmentalConditions.humidity)
        },
        industrialSafetyConditions: {
          electricDanger: fumigationData.hazards.electricDanger,
          fallingDanger: fumigationData.hazards.fallingDanger,
          hitDanger: fumigationData.hazards.hitDanger
        },
        observations: fumigationData.observations.trim() || "",
        signatures: {
          technician: fumigationData.technicianSignature,
          client: fumigationData.clientSignature
        }
      };

      console.log('=== SUBMITTING FUMIGATION REPORT ===');
      console.log('Report data to submit:', JSON.stringify(reportData, null, 2));
      
      const result = await reportsService.createFumigationReport(reportData);
      console.log('Report submission result:', result);
      
      setFumigationReportSubmitted(true);
      setShowConfirmDialog(false);
      
      // Call onSave immediately after successful submission
      onSave?.(reportData);
      
      Alert.alert(
        'Éxito',
        'El registro de fumigación ha sido enviado correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose?.();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error submitting fumigation report:", error);
      Alert.alert('Error', 'No se pudo enviar el registro. Inténtelo nuevamente.');
    } finally {
      console.log('Setting is submitting to false');
      setIsSubmitting(false);
    }
  };

  const handleSubmitCleanupReport = async () => {
    console.log('=== HANDLE SUBMIT CLEANUP REPORT START ===');
    console.log('Is submitting:', isSubmitting);
    
    if (isSubmitting) {
      console.log('Already submitting, returning');
      return;
    }
    
    console.log('Setting is submitting to true');
    setIsSubmitting(true);

    try {
      const formatDateForBackend = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      const reportData = {
        id: fumigationDetails?.lot?.id || 0,
        date: formatDateForBackend(cleanupData.date),
        startTime: cleanupData.startTime,
        endTime: cleanupData.endTime,
        supervisor: cleanupData.supervisor.trim(),
        technicians: cleanupData.technicians.map(t => ({ id: t.id })),
        lotDescription: {
          stripsState: cleanupData.lotDescription.stripsState.trim(),
          fumigationTime: cleanupData.lotDescription.fumigationTime,
          ppmFosfina: cleanupData.lotDescription.ppmFosfina
        },
        industrialSafetyConditions: {
          electricDanger: cleanupData.industrialSafetyConditions.electricDanger,
          fallingDanger: cleanupData.industrialSafetyConditions.fallingDanger,
          hitDanger: cleanupData.industrialSafetyConditions.hitDanger,
          otherDanger: cleanupData.industrialSafetyConditions.otherDanger
        },
        signatures: {
          technician: cleanupData.technicianSignature,
          client: cleanupData.clientSignature
        }
      };

      console.log('=== SUBMITTING CLEANUP REPORT ===');
      console.log('Report data to submit:', JSON.stringify(reportData, null, 2));
      
      const result = await reportsService.createCleanupReport(reportData);
      console.log('Report submission result:', result);
      
      setCleanupReportSubmitted(true);
      setShowConfirmDialog(false);
      
      // Call onSave immediately after successful submission
      onSave?.(reportData);
      
      Alert.alert(
        'Éxito',
        'El registro de descarpe ha sido enviado correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose?.();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error submitting cleanup report:", error);
      Alert.alert('Error', 'No se pudo enviar el registro. Inténtelo nuevamente.');
    } finally {
      console.log('Setting is submitting to false');
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = () => {
    console.log('=== HANDLE CONFIRM SUBMIT ===');
    console.log('Fumigation status:', fumigationStatus);
    
    if (fumigationStatus === "APPROVED") {
      console.log('Calling handleSubmitFumigationReport');
      handleSubmitFumigationReport();
    } else {
      console.log('Calling handleSubmitCleanupReport');
      handleSubmitCleanupReport();
    }
  };

  const getTitle = () => {
    if (fumigationStatus === "APPROVED") {
      return `Registro de Fumigación - Lote ${fumigationDetails?.lot?.lotNumber || ''}`;
    } else if (fumigationStatus === "FUMIGATED") {
      return `Registro de Descarpe - Lote ${fumigationDetails?.lot?.lotNumber || ''}`;
    }
    return `Evidencias - Lote ${fumigationDetails?.lot?.lotNumber || ''}`;
  };

  const getButtonText = () => {
    if (fumigationStatus === "APPROVED") {
      return "Subir Registro de Fumigación";
    } else if (fumigationStatus === "FUMIGATED") {
      return "Subir Registro de Descarpe";
    }
    return "Subir Registro";
  };

  const isFormSubmitted = () => {
    if (fumigationStatus === "APPROVED") {
      return fumigationReportSubmitted;
    } else if (fumigationStatus === "FUMIGATED") {
      return cleanupReportSubmitted;
    }
    return false;
  };

  const getButtonColor = () => {
    if (fumigationStatus === "APPROVED") {
      return "#003595";
    } else if (fumigationStatus === "FUMIGATED") {
      return "#16a34a";
    }
    return "#003595";
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#003595" />
              <Text style={styles.loadingText}>Cargando evidencias...</Text>
            </View>
          ) : !fumigationDetails ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No se pudieron cargar los detalles</Text>
            </View>
          ) : (
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {fumigationStatus === "APPROVED" && (
                <FumigationForm
                  fumigationData={fumigationData}
                  setFumigationData={setFumigationData}
                  availableTechnicians={availableTechnicians}
                  isEditable={isEditable}
                  fumigationReportSubmitted={fumigationReportSubmitted}
                  validationErrors={fumigationValidationErrors}
                  updateField={updateFumigationField}
                  addToArray={addToFumigationArray}
                  removeFromArray={removeFromFumigationArray}
                />
              )}

              {fumigationStatus === "FUMIGATED" && (
                <UncoveringForm
                  fumigationDetails={fumigationDetails}
                  cleanupData={cleanupData}
                  setCleanupData={setCleanupData}
                  availableTechnicians={availableTechnicians}
                  isEditable={isEditable}
                  cleanupReportSubmitted={cleanupReportSubmitted}
                  validationErrors={cleanupValidationErrors}
                  updateField={updateCleanupField}
                  updateLotDescription={updateLotDescription}
                  updateSafetyConditions={updateSafetyConditions}
                  addTechnician={addCleanupTechnician}
                  removeTechnician={removeCleanupTechnician}
                />
              )}
            </ScrollView>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {isEditable && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              {!isFormSubmitted() && (
                <TouchableOpacity
                  style={[styles.button, styles.submitButton, { backgroundColor: getButtonColor() }]}
                  onPress={handleSubmitClick}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitButtonText}>{getButtonText()}</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {!isEditable && (
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <Modal
            visible={showConfirmDialog}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowConfirmDialog(false)}
          >
            <View style={styles.confirmOverlay}>
              <View style={styles.confirmDialog}>
                <Text style={styles.confirmTitle}>Confirmar envío</Text>
                <Text style={styles.confirmMessage}>
                  ¿Estás seguro de que deseas enviar este registro? Esta acción no se puede deshacer.
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={[styles.confirmButton, styles.confirmCancelButton]}
                    onPress={() => setShowConfirmDialog(false)}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.confirmCancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmButton, styles.confirmSubmitButton, { backgroundColor: getButtonColor() }]}
                    onPress={handleConfirmSubmit}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.confirmSubmitButtonText}>
                      {isSubmitting ? "Enviando..." : "Confirmar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#003595',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 70,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
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
  },
  formContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#003595',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#003595',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDialog: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmCancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  confirmCancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmSubmitButton: {
    backgroundColor: '#003595',
  },
  confirmSubmitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
