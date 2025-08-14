import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { CollapsibleSection } from './CollapsibleSection';
import { SignatureModal } from '../../SignatureModal';

interface SignaturesSectionProps {
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  technicianSignature?: string;
  clientSignature?: string;
  onTechnicianSignatureChange?: (signature: string) => void;
  onClientSignatureChange?: (signature: string) => void;
}

export const SignaturesSection: React.FC<SignaturesSectionProps> = ({ 
  isEditable, 
  fumigationReportSubmitted,
  technicianSignature,
  clientSignature,
  onTechnicianSignatureChange,
  onClientSignatureChange
}) => {
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const handleTechnicianSign = () => {
    setShowTechnicianModal(true);
  };

  const handleClientSign = () => {
    setShowClientModal(true);
  };

  const handleTechnicianSave = (signature: string) => {
    onTechnicianSignatureChange?.(signature);
  };

  const handleClientSave = (signature: string) => {
    onClientSignatureChange?.(signature);
  };

  const handleRemoveTechnicianSignature = () => {
    onTechnicianSignatureChange?.("");
  };

  const handleRemoveClientSignature = () => {
    onClientSignatureChange?.("");
  };

  const SignatureBox = ({
    title,
    signature,
    onSign,
    onRemove,
    buttonColor,
    buttonText
  }: {
    title: string;
    signature?: string;
    onSign: () => void;
    onRemove: () => void;
    buttonColor: string;
    buttonText: string;
  }) => (
    <View style={styles.signatureBox}>
      <Text style={styles.signatureLabel}>{title}</Text>
      
      {signature ? (
        <View style={styles.signatureContainer}>
          <View style={styles.signatureImageContainer}>
            <Image 
              source={{ uri: signature }} 
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </View>
          {isEditable && !fumigationReportSubmitted && (
            <View style={styles.signatureButtons}>
              <TouchableOpacity
                style={[styles.signatureButton, styles.changeButton]}
                onPress={onSign}
              >
                <Text style={styles.changeButtonText}>Cambiar Firma</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.signatureButton, styles.removeButton]}
                onPress={onRemove}
              >
                <Text style={styles.removeButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noSignatureContainer}>
          <View style={styles.noSignatureBox}>
            <Text style={styles.noSignatureText}>Sin firma</Text>
          </View>
          {isEditable && !fumigationReportSubmitted && (
            <TouchableOpacity
              style={[styles.signButton, { backgroundColor: buttonColor }]}
              onPress={onSign}
            >
              <Text style={styles.signButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <>
      <CollapsibleSection title="Firmas">
        <View style={styles.container}>
          <View style={styles.signaturesRow}>
            <SignatureBox
              title="Firma del Técnico"
              signature={technicianSignature}
              onSign={handleTechnicianSign}
              onRemove={handleRemoveTechnicianSignature}
              buttonColor="#003595"
              buttonText="Firmar"
            />
            
            <SignatureBox
              title="Firma del Cliente"
              signature={clientSignature}
              onSign={handleClientSign}
              onRemove={handleRemoveClientSignature}
              buttonColor="#16a34a"
              buttonText="Firmar"
            />
          </View>
        </View>
      </CollapsibleSection>

      <SignatureModal
        isOpen={showTechnicianModal}
        title="Firma del Técnico"
        onClose={() => setShowTechnicianModal(false)}
        onSave={handleTechnicianSave}
        existingSignature={technicianSignature}
      />

      <SignatureModal
        isOpen={showClientModal}
        title="Firma del Cliente"
        onClose={() => setShowClientModal(false)}
        onSave={handleClientSave}
        existingSignature={clientSignature}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  signaturesRow: {
    gap: 16,
  },
  signatureBox: {
    gap: 12,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  signatureContainer: {
    gap: 12,
  },
  signatureImageContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureImage: {
    width: '100%',
    height: '100%',
  },
  signatureButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  signatureButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  changeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  changeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  noSignatureContainer: {
    gap: 12,
  },
  noSignatureBox: {
    height: 100,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  noSignatureText: {
    color: '#6b7280',
    fontSize: 14,
  },
  signButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
