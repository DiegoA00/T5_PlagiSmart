import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const pathRef = useRef<string>('');

  const onGestureEvent = (event: any) => {
    const { translationX, translationY, absoluteX, absoluteY } = event.nativeEvent;
    
    if (event.nativeEvent.state === State.BEGAN) {
      const newPath = `M${absoluteX - 20},${absoluteY - 150}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    } else if (event.nativeEvent.state === State.ACTIVE) {
      const newPath = `${pathRef.current} L${absoluteX - 20},${absoluteY - 150}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    } else if (event.nativeEvent.state === State.END) {
      setPaths(prev => [...prev, pathRef.current]);
      setCurrentPath('');
      pathRef.current = '';
    }
  };

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const saveSignature = () => {
    if (paths.length === 0 && !currentPath) {
      Alert.alert('Error', 'Por favor, dibuje su firma antes de guardar.');
      return;
    }

    // Convert SVG to a simple string representation
    const signatureData = `data:image/svg+xml;base64,${btoa(`
      <svg width="350" height="200" xmlns="http://www.w3.org/2000/svg">
        ${paths.map(path => `<path d="${path}" stroke="black" stroke-width="2" fill="none" />`).join('')}
        ${currentPath ? `<path d="${currentPath}" stroke="black" stroke-width="2" fill="none" />` : ''}
      </svg>
    `)}`;

    onSave(signatureData);
    clearSignature();
    onClose();
  };

  const handleClose = () => {
    clearSignature();
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
            
            <PanGestureHandler onGestureEvent={onGestureEvent}>
              <View style={styles.signatureArea}>
                <Svg height="200" width="350" style={styles.svg}>
                  {paths.map((path, index) => (
                    <Path
                      key={index}
                      d={path}
                      stroke="black"
                      strokeWidth="2"
                      fill="none"
                    />
                  ))}
                  {currentPath && (
                    <Path
                      d={currentPath}
                      stroke="black"
                      strokeWidth="2"
                      fill="none"
                    />
                  )}
                </Svg>
                <View style={styles.signatureLine} />
              </View>
            </PanGestureHandler>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearSignature}
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
              style={[styles.button, styles.saveButton]}
              onPress={saveSignature}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
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
    width: screenWidth * 0.9,
    maxWidth: 400,
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
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  signatureArea: {
    position: 'relative',
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    width: 350,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  signatureLine: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#9ca3af',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
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
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
