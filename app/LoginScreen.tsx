import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Platform, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import the new library
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Declare the global variable for TypeScript (still potentially needed for tests)
declare global {
  var __TEST_API_URL__: string | undefined;
}

// Determine if running in Jest test environment
const isTest = process.env.JEST_WORKER_ID !== undefined;

const LoginScreen = () => {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Specific loading state

  // Configure Google Sign-in on component mount
  useEffect(() => {
    console.log("[app/LoginScreen.tsx] Configuring Google Sign-in...");
    console.log("[app/LoginScreen.tsx] Using Web Client ID (for native):", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
    
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
    });
    console.log("[app/LoginScreen.tsx] Google Sign-in configured.");
  }, []);

  // Handle the Google Sign-in button press
  const handleGoogleSignIn = async () => {
    if (Platform.OS === 'android') {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      } catch (error: any) {
        console.error('PLAY_SERVICES_NOT_AVAILABLE', error);
        Alert.alert('Error', 'Google Play Services is not available or outdated.');
        return;
      }
    }

    setIsGoogleLoading(true);
    try {
      console.log("[app/LoginScreen.tsx] Attempting Google Sign-in...");
      const userInfo = await GoogleSignin.signIn();
      console.log("[app/LoginScreen.tsx] Google Sign-in Result:", userInfo);

      if (userInfo.type === 'success' && userInfo.data?.idToken) {
        const idToken = userInfo.data.idToken;
        console.log("[app/LoginScreen.tsx] Successfully got idToken.");

        // --- Send idToken to your backend --- 
        const baseUrl = isTest ? __TEST_API_URL__ : process.env.EXPO_PUBLIC_PL_BASE_URL;
        
        if (!baseUrl) {
          const errorMsg = 'API Base URL is not configured.';
          console.error(errorMsg);
          if (!isTest) {
            Alert.alert('Configuration Error', errorMsg);
          }
          throw new Error(errorMsg); // Re-throw to be caught by outer catch
        }
        
        const apiUrl = `${baseUrl}/api/auth/google`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }), // Send the correct idToken
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText })); // Graceful handling if response not json
          throw new Error(`Backend auth failed: ${errorData.message || response.statusText}`);
        }

        console.log('[app/LoginScreen.tsx] Backend Auth Successful');
        router.replace('/(tabs)'); // Navigate after successful backend auth

      } else if (userInfo.type === 'cancelled') {
        console.log("[app/LoginScreen.tsx] Sign-in cancelled (explicit check).");
        Alert.alert('Cancelled', 'You cancelled the sign-in process.');

      } else {
        console.error("[app/LoginScreen.tsx] Sign-in failed or idToken missing:", userInfo);
        throw new Error('Google Sign-in failed: No ID token received or sign-in was not successful.');
      }

    } catch (error: any) {
      console.error("[app/LoginScreen.tsx] Sign-in Error:", error, "Code:", error.code);
      // Handle specific Google Sign-In errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign-in process was cancelled.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated.');
      } else {
        // Handle generic errors or backend errors
        Alert.alert('Sign In Error', error.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoPlaceholder}>PlanetLeagueApp</Text>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        {isGoogleLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            style={styles.signInButton} // Reuse existing style name
            onPress={handleGoogleSignIn} 
            disabled={isGoogleLoading} 
          >
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

// Combine and reuse styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoPlaceholder: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  signInButton: { // Renamed from googleButton for clarity if needed, reusing original style
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, 
  }
});

export default LoginScreen; 