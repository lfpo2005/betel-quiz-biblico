// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';

// Definição de cores básicas
const Colors = {
  light: {
    tint: '#4B7BEC',
    tabIconDefault: '#687076',
    background: '#FFFFFF'
  },
  dark: {
    tint: '#4B7BEC',
    tabIconDefault: '#9BA1A6',
    background: '#121212'
  }
};

export default function TabLayout() {
  const colorScheme = 'light'; // Podemos fixar no light por enquanto

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#EAEAEA',
          backgroundColor: Colors[colorScheme].background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Feather name="compass" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}