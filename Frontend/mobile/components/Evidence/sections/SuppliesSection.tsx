import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData, Supply, ValidationErrors } from '@/hooks/useFumigationEvidence';

interface SuppliesSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
  addToArray: (field: keyof FumigationData, item: any) => void;
  removeFromArray: (field: keyof FumigationData, index: number) => void;
}

export const SuppliesSection: React.FC<SuppliesSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField,
  addToArray,
  removeFromArray
}) => {
  const handleSupplyChange = (index: number, field: keyof Supply, value: string) => {
    if (field === 'quantity' || field === 'numberOfStrips') {
      if (value !== "") {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
          return;
        }
      }
    }
    
    const newSupplies = fumigationData.supplies.map((supply, i) => 
      i === index ? { ...supply, [field]: value } : supply
    );
    updateField('supplies', newSupplies);
  };

  const addSupply = () => {
    addToArray('supplies', { 
      name: "", 
      quantity: "", 
      dosage: "", 
      kindOfSupply: "", 
      numberOfStrips: "" 
    });
  };

  const removeSupply = (index: number) => {
    if (fumigationData.supplies.length > 1) {
      Alert.alert(
        'Remover Suministro',
        '¿Estás seguro de que deseas remover este suministro?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: () => removeFromArray('supplies', index)
          }
        ]
      );
    } else {
      Alert.alert(
        'No se puede remover',
        'Debe mantener al menos un suministro en la lista.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderSupplyItem = ({ item, index }: { item: Supply; index: number }) => (
    <View style={[
      styles.supplyCard,
      validationErrors.supplies ? styles.supplyCardError : null
    ]}>
      <Text style={styles.supplyTitle}>Suministro {index + 1}</Text>
      
      <View style={styles.supplyFields}>
        <View style={styles.field}>
          <Text style={[styles.label, styles.required]}>Producto</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.supplies ? styles.inputError : null,
              (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
            ]}
            value={item.name}
            onChangeText={(value) => handleSupplyChange(index, 'name', value)}
            editable={isEditable && !fumigationReportSubmitted}
            placeholder="Nombre del producto"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Cantidad</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.supplies ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={item.quantity}
              onChangeText={(value) => handleSupplyChange(index, 'quantity', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="0.0"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Dosis</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.supplies ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={item.dosage}
              onChangeText={(value) => handleSupplyChange(index, 'dosage', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="ej: 5ml/m2"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={[styles.label, styles.required]}>Tipo</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.supplies ? styles.inputError : null,
                (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
              ]}
              value={item.kindOfSupply}
              onChangeText={(value) => handleSupplyChange(index, 'kindOfSupply', value)}
              editable={isEditable && !fumigationReportSubmitted}
              placeholder="Gas, Líquido, etc."
            />
          </View>
          <View style={styles.fieldWithButton}>
            <Text style={styles.label}>N° Cintas</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputInRow,
                  (!isEditable || fumigationReportSubmitted) ? styles.disabledInput : null
                ]}
                value={item.numberOfStrips}
                onChangeText={(value) => handleSupplyChange(index, 'numberOfStrips', value)}
                editable={isEditable && !fumigationReportSubmitted}
                placeholder="0"
                keyboardType="numeric"
              />
              {isEditable && !fumigationReportSubmitted && (
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    fumigationData.supplies.length === 1 ? styles.removeButtonDisabled : null
                  ]}
                  onPress={() => removeSupply(index)}
                  disabled={fumigationData.supplies.length === 1}
                >
                  <Text style={styles.removeButtonText}>−</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <CollapsibleSection title="Suministros Utilizados" defaultOpen required>
      <View style={styles.container}>
        <FlatList
          data={fumigationData.supplies}
          renderItem={renderSupplyItem}
          keyExtractor={(item, index) => `supply-${index}`}
          scrollEnabled={false}
        />
        
        {validationErrors.supplies && (
          <Text style={styles.errorText}>{validationErrors.supplies}</Text>
        )}
        
        {isEditable && !fumigationReportSubmitted && (
          <TouchableOpacity style={styles.addButton} onPress={addSupply}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Agregar Suministro</Text>
          </TouchableOpacity>
        )}
      </View>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  supplyCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  supplyCardError: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  supplyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  supplyFields: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
  },
  fieldWithButton: {
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
  inputInRow: {
    flex: 1,
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  removeButtonText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  addButtonIcon: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
});
