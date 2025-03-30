import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Platform, TextInput, View } from 'react-native';
import Constants from 'expo-constants';

// Import the native library conditionally
let GoogleSignin: any, statusCodes: any;
const isExpoGo = Constants.appOwnership === 'expo';

// Only try to load GoogleSignin if not in Expo Go
if (!isExpoGo) {
  try {
    const googleSignInModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSignInModule.GoogleSignin;
    statusCodes = googleSignInModule.statusCodes;
  } catch (e) {
    console.error("Failed to load @react-native-google-signin/google-signin. Ensure you are in a dev build.", e);
  }
}

import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Declare the global variable for TypeScript (still potentially needed for tests)
declare global {
  var __TEST_API_URL__: string | undefined;
}

// Determine if running in Jest test environment
const isTest = process.env.JEST_WORKER_ID !== undefined;

// Ensure we have a proper named function component for LoginScreen
function LoginScreen() {
  const { signIn: backendSignIn, isLoading: authLoading, setDummyUser, signUpWithEmail } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Add state for email/password form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Configure Google Sign-in on component mount only if native module loaded
  useEffect(() => {
    if (GoogleSignin) {
      console.log("[app/screens/LoginScreen.tsx] Configuring Google Sign-in...");
      console.log("[app/screens/LoginScreen.tsx] Using Web Client ID (for native):", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
      
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
      });
      console.log("[app/screens/LoginScreen.tsx] Google Sign-in configured.");
    } else {
      console.log("[app/screens/LoginScreen.tsx] Running in Expo Go or native module failed to load. Skipping Google Sign-in config.");
    }
  }, []);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email signup for Expo Go
  const handleEmailSignUp = async () => {
    // Validate inputs
    const validEmail = validateEmail(email);
    const validPassword = password.length >= 8;
    
    setIsEmailValid(validEmail);
    setIsPasswordValid(validPassword);
    
    if (!validEmail || !validPassword) {
      return;
    }
    
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      console.error("Email signup error:", error);
    }
  };

  // Handle the Google Sign-in button press
  const handleGoogleSignInPress = async () => {
    if (!isExpoGo && GoogleSignin) {
      // --- Native Build Real Flow --- 
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
  
        if (userInfo.type === 'success' && userInfo.data?.idToken) { 
          const idToken = userInfo.data.idToken;
          console.log("[app/screens/LoginScreen.tsx] Successfully got idToken.");
          
          await backendSignIn(idToken);
        } else if (userInfo.type === 'cancelled') {
          console.log("[app/screens/LoginScreen.tsx] Sign-in cancelled (explicit check).");
          Alert.alert('Cancelled', 'You cancelled the sign-in process.');
        } else {
          console.error("[app/screens/LoginScreen.tsx] Sign-in failed or idToken missing:", userInfo);
          throw new Error('Google Sign-in failed: No ID token received or sign-in was not successful.');
        }
      } catch (error: any) {
        console.error("[app/screens/LoginScreen.tsx] Google Sign-in Error:", error, "Code:", error.code);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          Alert.alert('Cancelled', 'Sign-in process was cancelled.');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          Alert.alert('In Progress', 'Sign-in is already in progress.');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert('Error', 'Google Play Services not available or outdated.');
        } else {
          Alert.alert('Sign In Error', error.message || 'An unexpected error occurred during Google Sign-In.');
        }
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      Alert.alert("Error", "Google Sign-In is not available in Expo Go. Please use email signup instead.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to Planet League</ThemedText>
      <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
      
      {authLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {isExpoGo ? (
            // Email signup for Expo Go
            <View style={styles.formContainer}>
              <TextInput
                style={[styles.input, !isEmailValid && styles.inputError]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {!isEmailValid && <ThemedText style={styles.errorText}>Please enter a valid email</ThemedText>}
              
              <TextInput
                style={[styles.input, !isPasswordValid && styles.inputError]}
                placeholder="Password (min 8 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {!isPasswordValid && <ThemedText style={styles.errorText}>Password must be at least 8 characters</ThemedText>}
              
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={handleEmailSignUp}
                disabled={authLoading}
              >
                <ThemedText style={styles.buttonText}>Sign Up with Email</ThemedText>
              </TouchableOpacity>
              
              <ThemedText style={styles.expoGoNote}>
                Using Expo Go build with email authentication
              </ThemedText>
            </View>
          ) : (
            // Google Sign-In for native builds
            <View>
              {isGoogleLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignInPress}
                  disabled={isGoogleLoading || authLoading || (!isExpoGo && !GoogleSignin)}
                >
                  <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      )}
    </ThemedView>
  );
}

// Updated styles
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 10,
  },
  googleButton: {
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
  },
  expoGoNote: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  }
});

// Make sure to export the component properly
export default LoginScreen;

