import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { FumigationData } from '@/hooks/useFumigationEvidence';

interface ObservationsSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  return (
    <CollapsibleSection title="Observaciones">
      <View style={styles.container}>
        <TextInput
          style={[
            styles.textArea,
            (!isEditable || fumigationReportSubmitted) ? styles.disabledTextArea : null
          ]}
          value={fumigationData.observations}
          onChangeText={(value) => setFumigationData(prev => ({ ...prev, observations: value }))}
          editable={isEditable && !fumigationReportSubmitted}
          placeholder="Observaciones adicionales (opcional)..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
    </CollapsibleSection>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
    minHeight: 120,
  },
  disabledTextArea: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
});
