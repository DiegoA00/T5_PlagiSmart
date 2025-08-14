import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  required?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleSection}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {title}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
        <Text style={styles.arrow}>
          {isOpen ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  required: {
    color: '#dc2626',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
});
