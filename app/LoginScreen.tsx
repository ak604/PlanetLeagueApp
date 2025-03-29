import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Directly import real Google Sign-in
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Configure Google Sign-in
GoogleSignin.configure({
  webClientId: '722533014078-ph3ud0bil0q2rj509lcaqq718v5skkls.apps.googleusercontent.com', // Corrected .coms to .com
  // Add other configuration options if needed
});

const LoginScreen = () => {
  const router = useRouter();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // --- Send idToken to your backend --- 
      console.log('User Info: ', userInfo);

      // Check if userInfo has idToken directly (assuming success structure)
      const idToken = userInfo && 'idToken' in userInfo ? userInfo.idToken : null;
      
      if (!idToken) {
        // Handle cases where idToken is missing (e.g., cancellation, error, or unexpected structure)
        // The catch block below will likely handle cancellations/errors, 
        // but this adds an explicit check for the token itself.
        throw new Error('Google Sign-in failed: No ID token received or sign-in was not successful.');
      }

      // Construct the API URL using the environment variable
      const apiUrl = `${process.env.PL_BASE_URL}/api/auth/google`;

      // Replace with your actual API call for real implementations
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        // Handle backend authentication error
        const errorData = await response.json();
        throw new Error(`Backend auth failed: ${errorData.message || response.statusText}`);
      }

      // Assuming successful backend auth, navigate to the main app
      // Store user session/token as needed (e.g., in AsyncStorage or state management)
      console.log('Backend Auth Successful');
      router.replace('/(tabs)'); // Adjust the route based on your app structure (e.g., '/(tabs)' or '/home')

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert('Error', 'Google Play Services not available or outdated.');
      } else {
        // some other error happened
        console.error(error);
        Alert.alert('Sign In Error', error.message || 'An unexpected error occurred during sign-in.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
         {/* Replace with your actual Logo component */}
         <Text style={styles.logoPlaceholder}>PlanetLeagueApp</Text>
         <Text style={styles.title}>Welcome!</Text>
         <Text style={styles.subtitle}>Sign in to continue</Text>
        <GoogleSigninButton
          style={styles.signInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </View>
    </SafeAreaView>
  );
};

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
  signInButton: {
    width: 240,
    height: 48,
  },
});

export default LoginScreen; 