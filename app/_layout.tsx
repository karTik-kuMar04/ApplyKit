import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/lib/theme';

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="applications/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="applications/[id]" />
        <Stack.Screen name="cover-letter/create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="cover-letter/template/[id]" />
        <Stack.Screen name="cover-letter/template/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="email/prepare" options={{ presentation: 'modal' }} />
        <Stack.Screen name="email/template/[id]" />
        <Stack.Screen name="email/template/new" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
