import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './LoadingScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Main navigation component handling authentication state
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading, userToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  // Hide splash screen after a short delay
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 500);
  }, []);

  // Handle navigation based on auth state, but only after initial render
  useEffect(() => {
    if (isLoading || !initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // Only navigate if we're showing the wrong screen for the auth state
    if (!userToken && !inAuthGroup) {
      // Not authenticated, redirect to login
      router.replace('/(auth)/login');
    } else if (userToken && inAuthGroup) {
      // Authenticated, redirect to main app
      router.replace('/(tabs)');
    }
  }, [isLoading, userToken, segments, router, initialized]);

  // Mark as initialized after first render to avoid navigation on mount
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Show a simple loading screen until ready
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Root layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
