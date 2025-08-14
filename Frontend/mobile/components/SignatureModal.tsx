import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const { width: screenWidth } = Dimensions.get('window');

interface SignatureModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (signature: string) => void;
  existingSignature?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  existingSignature
}) => {
  const [hasSignature, setHasSignature] = useState(false);
  const signatureRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && existingSignature) {
      setTimeout(() => {
        signatureRef.current?.fromDataURL(existingSignature);
        setHasSignature(true);
      }, 100);
    } else if (isOpen) {
      setHasSignature(false);
    }
  }, [isOpen, existingSignature]);

  const handleSignature = () => {
    console.log('Signature detected!');
    setHasSignature(true);
  };

  const handleEmpty = () => {
    console.log('Signature area is empty');
    setHasSignature(false);
  };

  const handleBegin = () => {
    console.log('Signature drawing started');
  };

  const handleEnd = () => {
    console.log('Signature drawing ended');
    setHasSignature(true);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setHasSignature(false);
  };

  const handleSave = () => {
    // For now, allow saving even without signature detection
    // The signature canvas will handle empty signatures
    console.log('Attempting to save signature...');
    signatureRef.current?.readSignature();
  };

  const handleData = (data: string) => {
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    signatureRef.current?.clearSignature();
    setHasSignature(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          <View style={styles.signatureContainer}>
            <Text style={styles.instructionText}>
              Dibuje su firma en el área de abajo
            </Text>
            <Text style={styles.touchHint}>
              Toque y arrastre su dedo para firmar
            </Text>
            
            <View style={styles.signatureArea}>
              <SignatureCanvas
                ref={signatureRef}
                onOK={handleData}
                onEmpty={handleEmpty}
                onBegin={handleBegin}
                onEnd={handleEnd}
                webStyle={`
                  .m-signature-pad {
                    box-shadow: none;
                    border: none;
                  }
                  .m-signature-pad--body {
                    border: none;
                  }
                  .m-signature-pad--footer {
                    display: none;
                  }
                `}
                style={{
                  width: Math.min(350, screenWidth * 0.8),
                  height: 200,
                  borderWidth: 2,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  backgroundColor: '#ffffff',
                }}
                backgroundColor="rgba(255,255,255,1)"
                penColor="black"
                descriptionText=""
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.saveButton
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                Guardar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {hasSignature ? '✓ Firma detectada' : '○ Sin firma'}
            </Text>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => {
                console.log('Debug: Forcing signature state');
                setHasSignature(true);
              }}
            >
              <Text style={styles.debugButtonText}>Debug: Forzar Firma</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: Math.min(screenWidth * 0.95, 450),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  signatureContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  touchHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  signatureArea: {
    width: Math.min(350, screenWidth * 0.8),
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#6b7280',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  debugButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  debugButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
