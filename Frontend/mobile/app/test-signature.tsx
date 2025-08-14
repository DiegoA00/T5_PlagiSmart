import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { SignatureModal } from '../components/SignatureModal';

export default function TestSignature() {
  const [showModal, setShowModal] = useState(false);
  const [signature, setSignature] = useState<string>('');

  const handleSave = (signatureData: string) => {
    setSignature(signatureData);
    Alert.alert('Éxito', 'Firma guardada correctamente');
  };

  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  signButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  signButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signatureContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  signatureImageContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  signatureImage: {
    width: 300,
    height: 150,
  },
});
