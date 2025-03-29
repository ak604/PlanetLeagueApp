import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './LoginScreen'; // Adjust path if necessary
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

// --- Mocks ---

// Mock Google Sign-in
jest.mock('@react-native-google-signin/google-signin', () => {
  // Create a basic mock component function
  const MockGoogleSigninButton = ({ onPress }: { onPress: () => void }) => {
    const MockButton = require('react-native').Button;
    return <MockButton title="Sign in with Google" onPress={onPress} />;
  };

  // Assign static properties to the mock component function
  MockGoogleSigninButton.Size = {
    Icon: 0,
    Standard: 1,
    Wide: 2,
  };
  MockGoogleSigninButton.Color = {
    Dark: 0,
    Light: 1,
  };

  return {
    GoogleSignin: {
      configure: jest.fn(),
      hasPlayServices: jest.fn().mockResolvedValue(true),
      signIn: jest.fn(),
      // Add other methods if needed
    },
    GoogleSigninButton: MockGoogleSigninButton, // Use the enhanced mock component
    statusCodes: {
      SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
      IN_PROGRESS: 'IN_PROGRESS',
      PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
      SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
      // Add other codes if your component uses them
    },
  };
});

// Mock expo-router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest
      .fn()
      .mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children) // Simple mock
  };
});


// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock fetch
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Default successful sign-in
  (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
    idToken: 'test-id-token',
    user: { email: 'test@example.com', name: 'Test User' },
  });
  // Default successful fetch
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }), // Mock JSON response if needed
  });
});

// --- Tests ---

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('PlanetLeagueApp')).toBeTruthy();
    expect(getByText('Welcome!')).toBeTruthy();
    expect(getByText('Sign in to continue')).toBeTruthy();
    expect(getByText('Sign in with Google')).toBeTruthy(); // From our mock button
  });

  it('handles successful sign-in and navigates', async () => {
    const { getByText } = render(<LoginScreen />);
    const signInButton = getByText('Sign in with Google');

    fireEvent.press(signInButton);

    // Wait for async operations (signIn, fetch, navigation)
    await waitFor(() => {
      expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/google', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: 'test-id-token' }),
          });
    });
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)'); // Check navigation
    });
     expect(Alert.alert).not.toHaveBeenCalled(); // No error alerts
  });

  it('handles sign-in cancellation', async () => {
    // Mock sign-in cancellation
    const error: any = new Error('User cancelled.');
    error.code = statusCodes.SIGN_IN_CANCELLED;
    (GoogleSignin.signIn as jest.Mock).mockRejectedValue(error);

    const { getByText } = render(<LoginScreen />);
    const signInButton = getByText('Sign in with Google');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
    });

    // Check that navigation did NOT happen and no alert was shown for cancellation
    expect(mockReplace).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
    // You could also spy on console.log if needed: jest.spyOn(console, 'log');
  });

   it('handles Play Services not available error', async () => {
    // Mock Play Services error
     const error: any = new Error('Play Services unavailable.');
     error.code = statusCodes.PLAY_SERVICES_NOT_AVAILABLE;
    (GoogleSignin.signIn as jest.Mock).mockRejectedValue(error);


    const { getByText } = render(<LoginScreen />);
    const signInButton = getByText('Sign in with Google');

    fireEvent.press(signInButton);

     await waitFor(() => {
       expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
     });

     // Check that navigation did NOT happen and alert *was* shown
     expect(mockReplace).not.toHaveBeenCalled();
     expect(fetch).not.toHaveBeenCalled();
     expect(Alert.alert).toHaveBeenCalledWith('Error', 'Google Play Services not available or outdated.');
   });

   it('handles missing idToken from Google Sign-in', async () => {
    // Mock sign-in success but with no idToken
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
      // NO idToken
      user: { email: 'test@example.com', name: 'Test User' },
    });

    const { getByText } = render(<LoginScreen />);
    const signInButton = getByText('Sign in with Google');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
    });

    // Check that fetch and navigation did NOT happen, and alert was shown
    expect(fetch).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Sign In Error', 'Google Sign-in failed: No ID token received.');
   });

   it('handles backend authentication failure', async () => {
    // Mock successful sign-in
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
      idToken: 'test-id-token',
      user: { email: 'test@example.com', name: 'Test User' },
    });
    // Mock failed fetch
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Unauthorized',
      json: async () => ({ message: 'Invalid token' }), // Simulate error response from backend
    });


    const { getByText } = render(<LoginScreen />);
    const signInButton = getByText('Sign in with Google');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
    });
     await waitFor(() => {
       expect(fetch).toHaveBeenCalledTimes(1);
     });

     // Check that navigation did NOT happen and alert *was* shown
     expect(mockReplace).not.toHaveBeenCalled();
     expect(Alert.alert).toHaveBeenCalledWith('Sign In Error', 'Backend auth failed: Invalid token');
   });

   it('handles generic sign-in error', async () => {
    // Mock a generic error
    const error = new Error('Something went wrong');
    (GoogleSignin.signIn as jest.Mock).mockRejectedValue(error);

    const { getByText } = render(<LoginScreen />);
    const signInButton = getByText('Sign in with Google');

    fireEvent.press(signInButton);

     await waitFor(() => {
       expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
     });

     // Check that navigation did NOT happen and alert *was* shown
     expect(mockReplace).not.toHaveBeenCalled();
     expect(fetch).not.toHaveBeenCalled();
     expect(Alert.alert).toHaveBeenCalledWith('Sign In Error', 'Something went wrong');
   });

}); 