// Mock implementation of GoogleSignin for use in Expo Go
export const MockGoogleSignin = {
  configure: () => Promise.resolve(),
  hasPlayServices: () => Promise.resolve(true),
  signIn: () => Promise.resolve({
    idToken: 'mock-id-token',
    user: {
      email: 'test@example.com',
      name: 'Test User',
      photo: 'https://via.placeholder.com/150',
      id: '12345',
    }
  }),
  signInSilently: () => Promise.reject({ code: 'SIGN_IN_REQUIRED' }),
  signOut: () => Promise.resolve(),
  revokeAccess: () => Promise.resolve(),
  isSignedIn: () => Promise.resolve(false),
  getCurrentUser: () => null,
};

export const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
};

// Mock component for Expo Router (empty component to satisfy default export requirement)
import React from 'react';
const MockGoogleSigninComponent = () => null;

// Default export for Expo Router
export default MockGoogleSigninComponent;

// Usage in your app:
// import { Platform } from 'react-native';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { MockGoogleSignin, statusCodes as mockStatusCodes } from './utils/mockGoogleSignin';
// 
// const SignIn = Platform.OS === 'web' ? MockGoogleSignin : GoogleSignin;
// const SignInCodes = Platform.OS === 'web' ? mockStatusCodes : statusCodes; 