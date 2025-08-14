import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData, ValidationErrors } from '@/hooks/useFumigationEvidence';
import { TimePicker } from '../../TimePicker';

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
  // Función para validar tiempo en tiempo real
  const validateTimeRange = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      
      if (end <= start) {
        return "La hora de finalización debe ser posterior a la hora de inicio";
      }
      
      // Validar que la diferencia sea al menos de 1 minuto
      const timeDiff = end.getTime() - start.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < 1) {
        return "La hora de finalización debe ser al menos 1 minuto después de la hora de inicio";
      }
    }
    return null;
  };

  const handleStartTimeChange = (value: string) => {
    updateField('startTime', value);
    
    // Validar inmediatamente si hay hora de finalización
    if (fumigationData.endTime) {
      const timeRangeError = validateTimeRange(value, fumigationData.endTime);
      if (timeRangeError) {
        // Aquí podrías actualizar los errores de validación si tienes acceso a setValidationErrors
        console.log('Time range error:', timeRangeError);
      }
    }
  };

  const handleEndTimeChange = (value: string) => {
    updateField('endTime', value);
    
    // Validar inmediatamente si hay hora de inicio
    if (fumigationData.startTime) {
      const timeRangeError = validateTimeRange(fumigationData.startTime, value);
      if (timeRangeError) {
        // Aquí podrías actualizar los errores de validación si tienes acceso a setValidationErrors
        console.log('Time range error:', timeRangeError);
      }
    }
  };
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
            <TimePicker
              value={fumigationData.startTime}
              onChange={handleStartTimeChange}
              disabled={!isEditable || fumigationReportSubmitted}
              placeholder="HH:MM"
              error={!!validationErrors.startTime}
            />
            {validationErrors.startTime && (
              <Text style={styles.errorText}>{validationErrors.startTime}</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Hora de Finalización</Text>
            <TimePicker
              value={fumigationData.endTime}
              onChange={handleEndTimeChange}
              disabled={!isEditable || fumigationReportSubmitted}
              placeholder="HH:MM"
              error={!!validationErrors.endTime || !!validationErrors.timeRange}
              otherTime={fumigationData.startTime}
              isEndTime={true}
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
