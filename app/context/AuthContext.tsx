import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

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

// API endpoint - Use environment variable
// Remove the old constant: const API_URL = 'http://localhost:3000/api/auth/google';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isSignout: false,
    userToken: null,
    user: null,
  });

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
  }, []);

  // Auth actions
  const authActions = {
    signIn: async (idToken: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Remove Expo Go check and mock logic
        /*
        // If running in Expo Go, simulate successful API response
        const isExpoGo = Constants.appOwnership === 'expo'; // Requires importing Constants
        let user: User;
        
        if (isExpoGo) {
          // Simulate successful response with mock user data
          console.log('Using mock authentication in Expo Go');
          user = {
            id: '12345',
            email: 'user@example.com',
            name: 'Test User',
            photo: 'https://via.placeholder.com/150',
          };
          
          // Fake loading delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else { 
          // Code inside else block is now the default path
        }
        */
        
        // Production: Make actual API call to your backend (this now always runs)
        const apiUrl = `${process.env.PL_BASE_URL}/api/auth/google`; // Use EXPO_PUBLIC_ prefix
        const response = await fetch(apiUrl, { // Use apiUrl
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
          
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Authentication failed');
        }
          
        // Parse the response from your backend
        const data = await response.json();
          
        // Your backend should return user data with the token
        // Adjust this according to your actual backend response structure
        const user: User = { // Define user here
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          photo: data.user.photo,
        };
        
        // Store token and user data securely
        await SecureStore.setItemAsync(TOKEN_KEY, idToken); // Use the original idToken passed to signIn
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        
        // Update state
        setState({
          isLoading: false,
          isSignout: false,
          userToken: idToken,
          user,
        });
      } catch (error: any) {
        console.error('Sign in error:', error);
        Alert.alert(
          'Authentication Error',
          error.message || 'Failed to sign in. Please try again later.'
        );
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
        setState(prev => ({ ...prev, isLoading: false }));
        Alert.alert('Error', 'Failed to sign out completely. Please try again.');
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