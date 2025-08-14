import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData, ValidationErrors } from '@/hooks/useFumigationEvidence';

interface EnvironmentalSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
}

export const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField
}) => {
  const handleEnvironmentalChange = (field: keyof typeof fumigationData.environmentalConditions, value: string) => {
    updateField('environmentalConditions', {
      ...fumigationData.environmentalConditions,
      [field]: value
    });
  };

  return (
    <CollapsibleSection title="Condiciones Ambientales" defaultOpen>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Temperatura (°C)</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.temperature ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={fumigationData.environmentalConditions.temperature}
              onChangeText={(value) => handleEnvironmentalChange('temperature', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="0.0"
              keyboardType="decimal-pad"
            />
            {validationErrors.temperature && (
              <Text style={styles.errorText}>{validationErrors.temperature}</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Humedad (%)</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.humidity ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={fumigationData.environmentalConditions.humidity}
              onChangeText={(value) => handleEnvironmentalChange('humidity', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="0.0"
              keyboardType="decimal-pad"
            />
            {validationErrors.humidity && (
              <Text style={styles.errorText}>{validationErrors.humidity}</Text>
            )}
          </View>
        </View>
      </View>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
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
