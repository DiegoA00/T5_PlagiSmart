import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  // Este componente es solo una pantalla de carga inicial
  // La navegación real la maneja InitialNavigator
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});