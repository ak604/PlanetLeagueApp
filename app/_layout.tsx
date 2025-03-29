import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Platform, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useColorScheme } from '@/hooks/useColorScheme';
import LoadingScreen from './LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Main navigation component handling authentication state
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading, userToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [initialized, setInitialized] = useState(false);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle navigation based on auth state, but only after initial render
  useEffect(() => {
    if (isLoading || !fontsLoaded || !initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // Only navigate if we're showing the wrong screen for the auth state
    if (!userToken && !inAuthGroup) {
      // Not authenticated, redirect to login
      router.replace('/(auth)/login');
    } else if (userToken && inAuthGroup) {
      // Authenticated, redirect to main app
      router.replace('/(tabs)');
    }
  }, [isLoading, userToken, segments, router, fontsLoaded, initialized]);

  // Mark as initialized after first render to avoid navigation on mount
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Show loading screen until everything is ready
  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  // Use a Slot component as initial render to ensure layout is mounted before navigation
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Root layout wrapping everything with auth provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
