import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
// Removed expo-auth-session imports
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import * as AuthSession from 'expo-auth-session';
// import Constants from 'expo-constants';

// Import the new library
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Removed WebBrowser initialization
// WebBrowser.maybeCompleteAuthSession();

// Declare the global variable for TypeScript (still potentially needed for tests)
declare global {
  var __TEST_API_URL__: string | undefined;
}

// Determine if running in Jest test environment (appOwnership check removed as it's irrelevant now)
const isTest = process.env.JEST_WORKER_ID !== undefined;
// const isExpoGo = Constants.appOwnership === 'expo'; // Removed

// Removed redirectUri logic

export default function LoginScreen() {
  const { signIn: backendSignIn, isLoading: authLoading } = useAuth(); // Renamed signIn to backendSignIn to avoid conflict
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Specific loading state for Google Sign-In

  // Configure Google Sign-in on component mount
  useEffect(() => {
    console.log("[app/screens/LoginScreen.tsx] Configuring Google Sign-in...");
    console.log("[app/screens/LoginScreen.tsx] Using Web Client ID (for native):", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
    // Note: Android Client ID is usually picked up from google-services.json for this library
    
    GoogleSignin.configure({
      // webClientId is required for getting the idToken
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
      // offlineAccess: true, // Optional: if you need server access with refresh tokens
      // hostedDomain: '', // Optional: restrict to users from a specific G Suite domain
      // forceCodeForRefreshToken: true, // Optional: if using offlineAccess and needing refresh token
      // accountName: '', // Optional: specifies an account name on android
      // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // Optional: if you need iOS specific setup
    });
    console.log("[app/screens/LoginScreen.tsx] Google Sign-in configured.");
  }, []);

  // Handle the Google Sign-in button press
  const handleGoogleSignIn = async () => {
    // Check if the user has Google Play Services installed (Android only)
    if (Platform.OS === 'android') {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      } catch (error: any) {
        console.error('PLAY_SERVICES_NOT_AVAILABLE', error);
        Alert.alert('Error', 'Google Play Services is not available or outdated. Please update it to use Google Sign-In.');
        return;
      }
    }

    setIsGoogleLoading(true);
    try {
      console.log("[app/screens/LoginScreen.tsx] Attempting Google Sign-in...");
      const userInfo = await GoogleSignin.signIn();
      console.log("[app/screens/LoginScreen.tsx] Google Sign-in Result:", userInfo);

      // Check for success type and access idToken via userInfo.data.idToken
      if (userInfo.type === 'success' && userInfo.data?.idToken) { 
        const idToken = userInfo.data.idToken;
        console.log("[app/screens/LoginScreen.tsx] Successfully got idToken.");
        
        // Pass the idToken to your backend authentication hook
        await backendSignIn(idToken);
        // Navigation happens inside useAuth hook upon successful backendSignIn

      } else if (userInfo.type === 'cancelled') {
        // This case should be handled by the catch block below, but we can be explicit
        console.log("[app/screens/LoginScreen.tsx] Sign-in cancelled (explicit check).");
        Alert.alert('Cancelled', 'You cancelled the sign-in process.');
        setIsGoogleLoading(false); // Ensure loading state is reset

      } else {
        // Throw error if not success or if idToken is missing after success
        console.error("[app/screens/LoginScreen.tsx] Sign-in failed or idToken missing:", userInfo);
        throw new Error('Google Sign-in failed: No ID token received or sign-in was not successful.');
      }

    } catch (error: any) {
      console.error("[app/screens/LoginScreen.tsx] Google Sign-in Error:", error, "Code:", error.code);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Cancelled', 'You cancelled the sign-in process.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        Alert.alert('In Progress', 'Sign-in is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated - handled above but good to catch here too
        Alert.alert('Error', 'Google Play Services not available or outdated.');
      } else {
        // some other error happened
        Alert.alert('Sign In Error', error.message || 'An unexpected error occurred during Google Sign-In.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to Planet League</ThemedText>
      <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
      
      {isGoogleLoading || authLoading ? ( // Check both loading states
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // Use a standard TouchableOpacity, or you could use GoogleSigninButton if desired
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn} // Call the new handler
          disabled={isGoogleLoading || authLoading} // Disable during either loading state
        >
          <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
        </TouchableOpacity>
        
        /* Example using the library's button (optional) */
        /*
        <GoogleSigninButton
            style={{ width: 240, height: 48, marginTop: 20 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading || authLoading}
        />
        */
      )}
    </ThemedView>
  );
}

// Styles remain largely the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center', // Ensure text is centered
    minHeight: 48, // Ensure minimum height
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, // Ensure consistent font size
  }
});

