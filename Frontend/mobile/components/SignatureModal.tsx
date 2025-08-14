import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  PanResponder,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { stringToBase64 } from '../utils/base64';

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
  const [isDrawing, setIsDrawing] = useState(false);

  // Limpiar datos cuando el modal se abre
  React.useEffect(() => {
    if (isOpen) {
      clearSignature();
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDrawing(true);
        const { locationX, locationY } = evt.nativeEvent;
        const newPath = `M${locationX},${locationY}`;
        setCurrentPath(newPath);
      },
      onPanResponderMove: (evt) => {
        if (isDrawing) {
          const { locationX, locationY } = evt.nativeEvent;
          const newPath = `${currentPath} L${locationX},${locationY}`;
          setCurrentPath(newPath);
        }
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
        if (currentPath) {
          setPaths(prev => [...prev, currentPath]);
          setCurrentPath('');
        }
      },
    })
  ).current;

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    setIsDrawing(false);
  };

  const saveSignature = () => {
    try {
      if (paths.length === 0 && !currentPath) {
        Alert.alert('Error', 'Por favor, dibuje su firma antes de guardar.');
        return;
      }

      // Validar que la firma tenga al menos un trazo con cierta longitud
      const allPaths = [...paths];
      if (currentPath) {
        allPaths.push(currentPath);
      }
      
      const totalLength = allPaths.reduce((acc, path) => {
        // Calcular longitud aproximada del path
        const points = path.split(/[ML]/).filter(p => p.trim());
        return acc + points.length;
      }, 0);
      
      if (totalLength < 3) {
        Alert.alert('Error', 'Por favor, dibuje una firma más completa.');
        return;
      }

      // Convertir SVG a base64
      const svgWidth = Math.min(350, screenWidth * 0.8);
      const svgContent = `
        <svg width="${svgWidth}" height="200" xmlns="http://www.w3.org/2000/svg">
          ${paths.map(path => `<path d="${path}" stroke="black" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />`).join('')}
          ${currentPath ? `<path d="${currentPath}" stroke="black" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />` : ''}
        </svg>
      `;
      
      // Convertir SVG a base64
      const base64 = stringToBase64(svgContent);
      const signatureData = `data:image/svg+xml;base64,${base64}`;
      
      onSave(signatureData);
      clearSignature();
      onClose();
    } catch (error) {
      console.error('Error saving signature:', error);
      Alert.alert('Error', 'No se pudo guardar la firma. Inténtelo nuevamente.');
    }
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
            <Text style={styles.touchHint}>
              Toque y arrastre su dedo para firmar
            </Text>
            
            <View 
              style={[
                styles.signatureArea,
                isDrawing && styles.signatureAreaActive
              ]}
              {...panResponder.panHandlers}
            >
              <Svg height="200" width={Math.min(350, screenWidth * 0.8)} style={styles.svg}>
                {paths.map((path, index) => (
                  <Path
                    key={index}
                    d={path}
                    stroke="black"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke="black"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </Svg>
              <View style={styles.signatureLine} />
            </View>
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
    width: Math.min(screenWidth * 0.9, 400),
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
    position: 'relative',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderRadius: 8,
    width: Math.min(350, screenWidth * 0.8),
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signatureAreaActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f9ff',
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
