import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="requests"
          options={{
            title: 'Solicitudes',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="lots"
          options={{
            title: 'Lotes',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.3x3.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Servicios',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color} />,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
