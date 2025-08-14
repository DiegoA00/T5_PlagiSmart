import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SignatureModal } from './SignatureModal';

export const SignatureTest: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [signature, setSignature] = useState<string>('');

  const handleSave = (signatureData: string) => {
    setSignature(signatureData);
    Alert.alert('Éxito', 'Firma guardada correctamente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de Firma Táctil</Text>
      
      <TouchableOpacity
        style={styles.signButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.signButtonText}>Firmar</Text>
      </TouchableOpacity>

      {signature && (
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureLabel}>Firma guardada:</Text>
          <View style={styles.signatureImageContainer}>
            <Image 
              source={{ uri: signature }} 
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      <SignatureModal
        isOpen={showModal}
        title="Prueba de Firma"
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        existingSignature={signature}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  signButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  signButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  signatureContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  signatureImageContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    width: 300,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureImage: {
    width: '100%',
    height: '100%',
  },
});
