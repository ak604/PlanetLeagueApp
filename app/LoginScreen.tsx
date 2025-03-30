import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  Platform, 
  View, 
  Text,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Import the Google sign-in library
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Import theme and components
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { PlanetLeagueLogo } from './components/ui/PlanetLeagueLogo';

// Declare the global variable for TypeScript (only needed for tests)
declare global {
  var __TEST_API_URL__: string | undefined;
}

// Determine if running in Jest test environment
const isTest = process.env.JEST_WORKER_ID !== undefined;

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Configure Google Sign-in on component mount
  useEffect(() => {
    console.log("[app/LoginScreen.tsx] Configuring Google Sign-in...");
    
    // Configure with your Google web client ID
    // The webClientId is required for both Android and iOS
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      // Add iOS client ID if you have one
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      // Ensure proper scopes for the data you need
      scopes: ['profile', 'email'],
      // Ensure proper offlineAccess setting
      offlineAccess: true,
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
      
      // Use proper format based on API version
      // Make sure we're signed out first to avoid issues
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      
      console.log("[app/LoginScreen.tsx] Google Sign-in Result:", userInfo);

      // Use type assertion to handle GoogleSignin response structure
      // Different versions of the library might have different response structures
      const response = userInfo as any;
      if (response && response.idToken) {
        const idToken = response.idToken;
        console.log("[app/LoginScreen.tsx] Successfully got idToken.");

        // --- Send idToken to your backend --- 
        const baseUrl = isTest ? __TEST_API_URL__ : process.env.EXPO_PUBLIC_PL_BASE_URL;
        
        if (!baseUrl) {
          const errorMsg = 'API Base URL is not configured.';
          console.error(errorMsg);
          if (!isTest) {
            Alert.alert('Configuration Error', errorMsg);
          }
          throw new Error(errorMsg);
        }
        
        const apiUrl = `${baseUrl}/api/auth/google`;

        const backendResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!backendResponse.ok) {
          const errorData = await backendResponse.json().catch(() => ({ message: backendResponse.statusText }));
          throw new Error(`Backend auth failed: ${errorData.message || backendResponse.statusText}`);
        }

        console.log('[app/LoginScreen.tsx] Backend Auth Successful');
        router.replace('/(tabs)');
      } else {
        console.error("[app/LoginScreen.tsx] Sign-in failed or idToken missing:", userInfo);
        throw new Error('Google Sign-in failed: No ID token received.');
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
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['#202124', '#303134']
          : ['#f8f9fa', '#ffffff']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.logoContainer}>
            <PlanetLeagueLogo size={120} withText={true} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to Planet League
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Play games, collect NFTs, and compete in tournaments
          </Text>
          
          {isGoogleLoading ? (
            <ActivityIndicator 
              size="large" 
              color={colors.primary} 
              style={styles.loading}
            />
          ) : (
            <TouchableOpacity
              style={[styles.signInButton, { backgroundColor: colors.primary }]}
              onPress={handleGoogleSignIn} 
              disabled={isGoogleLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  logoContainer: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  loading: {
    marginVertical: Theme.spacing.xl,
  },
  signInButton: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Theme.typography.sizes.md,
  },
  footer: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  footerText: {
    fontSize: Theme.typography.sizes.xs,
    textAlign: 'center',
  },
}); 