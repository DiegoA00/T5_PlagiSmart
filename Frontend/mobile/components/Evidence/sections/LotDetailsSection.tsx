import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData, ValidationErrors } from '@/hooks/useFumigationEvidence';

interface LotDetailsSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
  mode?: "fumigation" | "cleanup";
}

export const LotDetailsSection: React.FC<LotDetailsSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField,
  mode = "fumigation"
}) => {
  const handleLotDetailsChange = (field: keyof typeof fumigationData.lotDetails, value: string) => {
    updateField('lotDetails', {
      ...fumigationData.lotDetails,
      [field]: value
    });
  };

  const handleDimensionsChange = (field: keyof typeof fumigationData.dimensions, value: string) => {
    updateField('dimensions', {
      ...fumigationData.dimensions,
      [field]: value
    });
  };

  return (
    <CollapsibleSection title="Detalles del Lote" defaultOpen>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Lote</Text>
          
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Número de Lote</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={fumigationData.lotDetails.lotNumber}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Toneladas</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={fumigationData.lotDetails.tons}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Calidad</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={fumigationData.lotDetails.quality}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Número de Sacos</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={fumigationData.lotDetails.sacks}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.fullWidthField}>
            <Text style={styles.label}>Destino</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={fumigationData.lotDetails.destination}
              editable={false}
            />
          </View>

          {mode === "cleanup" && (
            <>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Estado de Cintas</Text>
                  <TextInput
                    style={[
                      styles.input,
                      (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                    ]}
                    value={fumigationData.lotDetails.stripsState || ""}
                    onChangeText={(value) => handleLotDetailsChange('stripsState', value)}
                    editable={isEditable && !fumigationReportSubmitted}
                    placeholder="Ej: Bueno, Regular, Malo"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, styles.required]}>Tiempo de Fumigación (horas)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      validationErrors?.fumigationTime ? styles.inputError : null,
                      (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                    ]}
                    value={fumigationData.lotDetails.fumigationTime || ""}
                    onChangeText={(value) => handleLotDetailsChange('fumigationTime', value)}
                    editable={isEditable && !fumigationReportSubmitted}
                    placeholder="Ej: 72"
                    keyboardType="numeric"
                  />
                  {validationErrors?.fumigationTime && (
                    <Text style={styles.errorText}>{validationErrors.fumigationTime}</Text>
                  )}
                </View>
              </View>

              <View style={styles.fullWidthField}>
                <Text style={[styles.label, styles.required]}>PPM Fosfina</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors?.ppmFosfina ? styles.inputError : null,
                    (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                  ]}
                  value={fumigationData.lotDetails.ppmFosfina || ""}
                  onChangeText={(value) => handleLotDetailsChange('ppmFosfina', value)}
                  editable={isEditable && !fumigationReportSubmitted}
                  placeholder="Ej: 25"
                  keyboardType="numeric"
                />
                {validationErrors?.ppmFosfina && (
                  <Text style={styles.errorText}>{validationErrors.ppmFosfina}</Text>
                )}
              </View>
            </>
          )}
        </View>

        {mode === "fumigation" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.dimensionsTitle]}>
              Dimensiones del Lugar de Fumigación <Text style={styles.required}>*</Text>
            </Text>
            
            <View style={styles.dimensionsRow}>
              <View style={styles.field}>
                <Text style={[styles.label, styles.required]}>Altura (m)</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.dimensions ? styles.inputError : null,
                    (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                  ]}
                  value={fumigationData.dimensions.height}
                  onChangeText={(value) => handleDimensionsChange('height', value)}
                  editable={isEditable && !fumigationReportSubmitted}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, styles.required]}>Ancho (m)</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.dimensions ? styles.inputError : null,
                    (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                  ]}
                  value={fumigationData.dimensions.width}
                  onChangeText={(value) => handleDimensionsChange('width', value)}
                  editable={isEditable && !fumigationReportSubmitted}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, styles.required]}>Largo (m)</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.dimensions ? styles.inputError : null,
                    (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                  ]}
                  value={fumigationData.dimensions.length}
                  onChangeText={(value) => handleDimensionsChange('length', value)}
                  editable={isEditable && !fumigationReportSubmitted}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            {validationErrors.dimensions && (
              <Text style={styles.errorText}>{validationErrors.dimensions}</Text>
            )}
          </View>
        )}
      </View>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  dimensionsTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  field: {
    flex: 1,
  },
  fullWidthField: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#dc2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
});
