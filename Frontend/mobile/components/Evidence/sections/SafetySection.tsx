import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData } from '@/hooks/useFumigationEvidence';

interface SafetySectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  mode?: "fumigation" | "cleanup";
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  mode = "fumigation"
}) => {
  const handleHazardChange = (hazardType: keyof typeof fumigationData.hazards, checked: boolean) => {
    setFumigationData(prev => ({
      ...prev,
      hazards: {
        ...prev.hazards,
        [hazardType]: checked
      }
    }));
  };

  const CheckboxItem = ({ 
    id, 
    label, 
    checked, 
    onPress 
  }: { 
    id: string; 
    label: string; 
    checked: boolean; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onPress}
      disabled={!isEditable || fumigationReportSubmitted}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <CollapsibleSection title="Condiciones de Seguridad Industrial" defaultOpen>
      <View style={styles.container}>
        <CheckboxItem
          id="electric"
          label="Peligro Eléctrico"
          checked={fumigationData.hazards.electricDanger}
          onPress={() => handleHazardChange('electricDanger', !fumigationData.hazards.electricDanger)}
        />
        
        <CheckboxItem
          id="falls"
          label="Peligro de Caída"
          checked={fumigationData.hazards.fallingDanger}
          onPress={() => handleHazardChange('fallingDanger', !fumigationData.hazards.fallingDanger)}
        />
        
        <CheckboxItem
          id="hits"
          label="Peligro de Golpe"
          checked={fumigationData.hazards.hitDanger}
          onPress={() => handleHazardChange('hitDanger', !fumigationData.hazards.hitDanger)}
        />
        
        {mode === "cleanup" && (
          <CheckboxItem
            id="other"
            label="Otro Peligro"
            checked={fumigationData.hazards.otherDanger || false}
            onPress={() => handleHazardChange('otherDanger' as any, !(fumigationData.hazards as any).otherDanger)}
          />
        )}
      </View>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
});
