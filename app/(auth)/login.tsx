import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Conditionally import Google Sign-in
let GoogleSignin: any;
let GoogleSigninButton: any;
let statusCodes: any;

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

if (isExpoGo) {
  // Use mock implementation in Expo Go
  const mockModule = require('../utils/mockGoogleSignin');
  GoogleSignin = mockModule.MockGoogleSignin;
  statusCodes = mockModule.statusCodes;
  
  // Create a custom button for Google Sign-in
  GoogleSigninButton = ({ onPress, style }: any) => (
    <TouchableOpacity 
      style={[styles.googleButton, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.googleButtonContent}>
        <Image 
          source={{ uri: 'https://cdn.cdnlogo.com/logos/g/35/google-icon.svg' }} 
          style={styles.googleIcon} 
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );
} else {
  // Use real implementation in development/production builds
  const googleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignInModule.GoogleSignin;
  GoogleSigninButton = googleSignInModule.GoogleSigninButton;
  statusCodes = googleSignInModule.statusCodes;
}

// Configure Google Sign-in
GoogleSignin.configure({
  webClientId: '722533014078-ph3ud0bil0q2rj509lcaqq718v5skkls.apps.googleusercontent.com', // IMPORTANT: Replace with your actual Web Client ID
  offlineAccess: true, // Get refresh token for server-side auth
});

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  
  // Combine auth context loading with local loading state
  const isSigningIn = isLoading || localLoading;
  
  const handleGoogleSignIn = async () => {
    try {
      setLocalLoading(true);
      
      // Check for Google Play Services (on Android)
      await GoogleSignin.hasPlayServices();
      
      // Perform the sign-in
      const userInfo = await GoogleSignin.signIn();
      
      // Get the ID token
      const idToken = userInfo.idToken;
      
      if (!idToken) {
        throw new Error('Google Sign-in failed: No ID token received');
      }
      
      // Pass the token to our auth context to handle the backend API call
      await signIn(idToken);
      
    } catch (error: any) {
      // Handle specific errors
      if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled by user');
      } else if (error.code === statusCodes?.IN_PROGRESS) {
        console.log('Sign in already in progress');
        Alert.alert('Please wait', 'Sign in is already in progress');
      } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated');
      } else {
        // Handle other errors
        console.error('Google Sign in error:', error);
        Alert.alert(
          'Sign In Error',
          error.message || 'An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setLocalLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>PlanetLeagueApp</Text>
        </View>
        
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to access your account</Text>
        </View>
        
        {/* Sign In Button */}
        <View style={styles.signInContainer}>
          {isExpoGo ? (
            <GoogleSigninButton
              style={styles.signInButton}
              onPress={handleGoogleSignIn}
              disabled={isSigningIn}
            />
          ) : (
            <GoogleSigninButton
              style={styles.signInButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleSignIn}
              disabled={isSigningIn}
            />
          )}
          
          {/* Loading indicator */}
          {isSigningIn && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          )}
        </View>
        
        {/* Terms Text */}
        <Text style={styles.termsText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  signInContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  signInButton: {
    width: 240,
    height: 56,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    maxWidth: 280,
  },
  // Custom Google button styles for Expo Go
  googleButton: {
    width: 240,
    height: 56,
    backgroundColor: '#4285F4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 2,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 