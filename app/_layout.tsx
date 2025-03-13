// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { isAuthenticated, setupAxiosInterceptors } from '@/utils/auth';

export default function RootLayout() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Configurar interceptadores do axios
    setupAxiosInterceptors();

    // Verificar estado de autenticação
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const authenticated = await isAuthenticated();
    setIsLoggedIn(authenticated);
    setIsAuthChecked(true);
  };

  if (!isAuthChecked) {
    // Você pode mostrar uma tela de splash aqui
    return null;
  }

  return (
    <>
      <Stack>
        {/* Tornar a tela de login pública */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Rotas protegidas */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}