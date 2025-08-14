import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData, ValidationErrors } from '@/hooks/useFumigationEvidence';

interface GeneralInfoSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField
}) => {
  return (
    <CollapsibleSection title="Información General" defaultOpen>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Número de Registro</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={fumigationData.registrationNumber}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Empresa</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={fumigationData.company}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Ubicación</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={fumigationData.location}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={fumigationData.date}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Hora de Inicio</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.startTime ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={fumigationData.startTime}
              onChangeText={(value) => updateField('startTime', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="HH:MM"
            />
            {validationErrors.startTime && (
              <Text style={styles.errorText}>{validationErrors.startTime}</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Hora de Finalización</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.endTime ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={fumigationData.endTime}
              onChangeText={(value) => updateField('endTime', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="HH:MM"
            />
            {validationErrors.endTime && (
              <Text style={styles.errorText}>{validationErrors.endTime}</Text>
            )}
            {validationErrors.timeRange && (
              <Text style={styles.errorText}>{validationErrors.timeRange}</Text>
            )}
          </View>
        </View>

        <View style={styles.fullWidthField}>
          <Text style={[styles.label, styles.required]}>Supervisor</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.supervisor ? styles.inputError : null,
              (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
            ]}
            value={fumigationData.supervisor}
            onChangeText={(value) => updateField('supervisor', value)}
            editable={isEditable && !fumigationReportSubmitted}
            placeholder="Nombre del supervisor"
          />
          {validationErrors.supervisor && (
            <Text style={styles.errorText}>{validationErrors.supervisor}</Text>
          )}
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
