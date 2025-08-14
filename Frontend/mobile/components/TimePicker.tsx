import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  placeholder?: string;
  style?: any;
  error?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  otherTime?: string; // Para validar contra otra hora (startTime vs endTime)
  isEndTime?: boolean; // Indica si es hora de finalización
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "HH:MM",
  style,
  error = false,
  onValidationChange,
  otherTime,
  isEndTime = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Parse current value
  React.useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      setSelectedHour(hour || 0);
      setSelectedMinute(minute || 0);
    }
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    
    // Validar si es hora de finalización y hay hora de inicio
    if (isEndTime && otherTime) {
      const startTime = new Date(`2000-01-01T${otherTime}`);
      const endTime = new Date(`2000-01-01T${timeString}`);
      
      if (endTime <= startTime) {
        // No permitir confirmar si la hora de finalización es menor o igual a la de inicio
        return;
      }
    }
    
    onChange(timeString);
    setIsVisible(false);
  };

  const handleCancel = () => {
    // Reset to original value
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      setSelectedHour(hour || 0);
      setSelectedMinute(minute || 0);
    }
    setIsVisible(false);
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Validar si la hora seleccionada es válida
  const isValidTime = () => {
    if (isEndTime && otherTime) {
      const startTime = new Date(`2000-01-01T${otherTime}`);
      const endTime = new Date(`2000-01-01T${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`);
      return endTime > startTime;
    }
    return true;
  };

  const currentTimeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
  const isValid = isValidTime();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.disabledInput,
          style
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <View style={styles.inputContent}>
          <Text style={[
            styles.inputText,
            !value && styles.placeholderText,
            disabled && styles.disabledText
          ]}>
            {value || placeholder}
          </Text>
          <Text style={[
            styles.clockIcon,
            disabled && styles.disabledText
          ]}>
            🕐
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Hora</Text>
              {isEndTime && otherTime && !isValid && (
                <Text style={styles.validationError}>
                  La hora de finalización debe ser posterior a {otherTime}
                </Text>
              )}
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <ScrollView 
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.selectedPickerItem
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedHour === hour && styles.selectedPickerItemText
                      ]}>
                        {formatNumber(hour)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <ScrollView 
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.selectedPickerItem
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedMinute === minute && styles.selectedPickerItemText
                      ]}>
                        {formatNumber(minute)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  !isValid && styles.disabledConfirmButton
                ]}
                onPress={handleConfirm}
                disabled={!isValid}
              >
                <Text style={[
                  styles.confirmButtonText,
                  !isValid && styles.disabledConfirmButtonText
                ]}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    minHeight: 44,
    justifyContent: 'center',
  },
  inputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  inputText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  disabledText: {
    color: '#9ca3af',
  },
  clockIcon: {
    fontSize: 16,
    marginLeft: 8,
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
    width: screenWidth * 0.9,
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 10,
  },
  pickerScroll: {
    height: 150,
    width: 80,
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPickerItem: {
    backgroundColor: '#3b82f6',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#374151',
  },
  selectedPickerItemText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  pickerSeparator: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  disabledConfirmButton: {
    backgroundColor: '#9ca3af',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledConfirmButtonText: {
    color: '#d1d5db',
  },
  validationError: {
    color: '#dc2626',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
