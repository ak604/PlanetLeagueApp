import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

// Declare the global variable for TypeScript
declare global {
  var __TEST_API_URL__: string | undefined;
}

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

// Auth state interface
interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  user: User | null;
}

// Auth context interface
interface AuthContextData extends AuthState {
  signIn: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextData>({
  isLoading: true,
  isSignout: false,
  userToken: null,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// REMOVE module-level API_URL constant
// const API_URL = 'http://localhost:3000/api/auth/google';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isSignout: false,
    userToken: null,
    user: null,
  });

  // Determine if running in Jest test environment
  const isTest = process.env.JEST_WORKER_ID !== undefined;

  // Check for existing authentication on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken: string | null = null;
      let user: User | null = null;

      try {
        // Get stored token and user data
        userToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const userJson = await SecureStore.getItemAsync(USER_KEY);
        
        if (userJson) {
          user = JSON.parse(userJson);
        }
        
        // Validate token with backend (optional for stronger security)
        if (userToken) {
          // You could make a call to your API to verify token validity
          // For now, we'll just trust the stored token
        }
      } catch (e) {
        // Handle error reading token
        console.warn('Failed to retrieve authentication state:', e);
        // If not in test, alert the user
        if (!isTest) {
          Alert.alert("Error", "Could not restore session. Please sign in again.");
        }
      }

      // Update state after checking auth
      setState(prev => ({
        ...prev,
        isLoading: false,
        userToken,
        user,
      }));
    };

    bootstrapAsync();
  }, [isTest]);

  // Auth actions
  const authActions = {
    signIn: async (idToken: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Determine base URL based on environment
        const baseUrl = isTest ? __TEST_API_URL__ : process.env.EXPO_PUBLIC_PL_BASE_URL; 
        if (!baseUrl) {
           console.error('API Base URL is not configured.');
           // Only Alert if not in test
           if (!isTest) {
               Alert.alert('Configuration Error', 'Cannot sign in: API configuration missing.');
           }
           setState(prev => ({ ...prev, isLoading: false }));
           return; // Stop execution
        }
        const apiUrl = `${baseUrl}/api/auth/google`; 

        const response = await fetch(apiUrl, { 
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
          
        if (!response.ok) {
          let errorMsg = 'Authentication failed';
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || `HTTP error! Status: ${response.status}`; 
          } catch (e) { /* Ignore JSON parse error */ }
          throw new Error(errorMsg);
        }
          
        const data = await response.json();
          
        const user: User = { 
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          photo: data.user.photo,
        };
        
        await SecureStore.setItemAsync(TOKEN_KEY, idToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        
        setState({
          isLoading: false,
          isSignout: false,
          userToken: idToken,
          user,
        });
      } catch (error: any) {
        console.error('Sign in error:', error);
         // Only Alert if not in test
        if (!isTest) {
          Alert.alert(
            'Authentication Error',
            error.message || 'Failed to sign in. Please try again later.'
          );
        }
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    
    signOut: async () => {
      try {
        // Mark as signing out
        setState(prev => ({ ...prev, isSignout: true, isLoading: true }));
        
        // Clear stored credentials
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        
        // Update state
        setState({
          isLoading: false,
          isSignout: true,
          userToken: null,
          user: null,
        });
      } catch (error) {
        console.error('Sign out error:', error);
        // Only Alert if not in test
        if (!isTest) {
           Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
      }
    },
    
    refreshUser: async () => {
      try {
        const userToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!userToken) {
          throw new Error('No authentication token found');
        }
        
        // In a real app, you'd make an API call here to refresh user data
        // For now, we'll just retrieve the stored user
        const userJson = await SecureStore.getItemAsync(USER_KEY);
        if (userJson) {
          const user = JSON.parse(userJson);
          setState(prev => ({ ...prev, user }));
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    },
  };

  // Combined context value
  const contextValue = {
    ...state,
    ...authActions,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context usage
export const useAuth = () => useContext(AuthContext);

// Default export for Expo Router
export default AuthProvider; 