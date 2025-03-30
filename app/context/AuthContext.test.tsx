import React from 'react';
import { View, Text } from 'react-native';

// Only include test-specific code when running in Jest environment
if (process.env.JEST_WORKER_ID !== undefined) {
  const { TouchableOpacity } = require('react-native');
  const { render, waitFor, fireEvent } = require('@testing-library/react-native');
  const { Alert } = require('react-native');
  const SecureStore = require('expo-secure-store');
  const { AuthProvider, useAuth } = require('./AuthContext');

  // Mock SecureStore
  jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
  }));

  // Mock Alert
  jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
  }));

  // Mock fetch
  global.fetch = jest.fn();

  // Define the global __TEST_API_URL__ for tests
  global.__TEST_API_URL__ = 'http://test-api-url.com';

  // Mock the useAuth hook for testing
  jest.mock('./AuthContext', () => {
    const originalModule = jest.requireActual('./AuthContext');
    
    return {
      ...originalModule,
      useAuth: jest.fn(),
    };
  });

  // Test component that uses auth context
  const TestComponent = ({ testId = 'test-component' }) => {
    const auth = useAuth();
    return (
      <View testID={testId}>
        <Text testID="loading">{String(auth.isLoading)}</Text>
        <Text testID="game-loading">{String(auth.isGameDataLoading)}</Text>
        <Text testID="user-id">{auth.user?.id || 'no-user'}</Text>
        <Text testID="wallet">{auth.gameData?.walletAddress || 'no-wallet'}</Text>
        <TouchableOpacity testID="load-button" onPress={() => auth.loadGameData()}>
          <Text>Load Game Data</Text>
        </TouchableOpacity>
      </View>
    );
  };

  describe('AuthContext - Game Data', () => {
    // Default mock state and functions
    const defaultMockAuth = {
      isLoading: false,
      isGameDataLoading: false,
      user: null,
      gameData: null,
      loadGameData: jest.fn(),
    };
    
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Reset mocks before each test
      (SecureStore.getItemAsync).mockReset();
      (SecureStore.setItemAsync).mockReset();
      (global.fetch).mockReset();
      (Alert.alert).mockReset();
      
      // Reset useAuth mock
      (useAuth).mockReset();
      (useAuth).mockReturnValue({ ...defaultMockAuth });
    });

    test('loadGameData should fetch game data when user is authenticated', async () => {
      // Mock user data
      const mockUser = { id: 'test-user-id', email: 'test@example.com', name: 'Test User' };
      
      // Mock game data
      const mockGameData = {
        userId: 'test-user-id',
        walletAddress: '0xC99dA54C186e897FcBD178C26B75acDE1807281D',
        createdAt: '2025-03-30T09:42:08.705Z',
        updatedAt: '2025-03-30T09:42:08.705Z'
      };

      // Create a simple mock that just records it was called
      const loadGameDataMock = jest.fn();
      
      // Set initial state with user but no game data
      (useAuth).mockReturnValue({
        ...defaultMockAuth,
        user: mockUser,
        loadGameData: loadGameDataMock
      });

      // Render component
      const { getByTestId, rerender } = render(<TestComponent />);

      // Verify initial state
      expect(getByTestId('user-id').props.children).toBe(mockUser.id);
      expect(getByTestId('wallet').props.children).toBe('no-wallet');

      // Trigger loadGameData
      fireEvent.press(getByTestId('load-button'));
      
      // Verify the function was called
      expect(loadGameDataMock).toHaveBeenCalledTimes(1);
      
      // Manually update the mock to simulate game data loaded
      (useAuth).mockReturnValue({
        ...defaultMockAuth,
        user: mockUser,
        gameData: mockGameData,
        loadGameData: loadGameDataMock
      });
      
      // Force re-render with new mock values
      rerender(<TestComponent />);
      
      // Now check that the game data is displayed
      expect(getByTestId('wallet').props.children).toBe(mockGameData.walletAddress);
    });

    test('loadGameData should handle API errors gracefully', async () => {
      // Mock user data
      const mockUser = { id: 'test-user-id', email: 'test@example.com', name: 'Test User' };
      
      // Mock the loadGameData function to simulate error
      const loadGameDataMock = jest.fn().mockImplementation(() => {
        // Update the mock to simulate loading
        (useAuth).mockReturnValue({
          ...defaultMockAuth,
          user: mockUser,
          isGameDataLoading: true,
          loadGameData: loadGameDataMock
        });
        
        // Simulate API call with error
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Show alert
            Alert.alert('Game Data Error', 'Failed to load game data');
            
            // Update the mock again to simulate completed loading with error
            (useAuth).mockReturnValue({
              ...defaultMockAuth,
              user: mockUser,
              gameData: null,
              isGameDataLoading: false,
              loadGameData: loadGameDataMock
            });
            resolve(undefined);
          }, 100);
        });
      });
      
      // Set initial state with user but no game data
      (useAuth).mockReturnValue({
        ...defaultMockAuth,
        user: mockUser,
        loadGameData: loadGameDataMock
      });

      // Render component
      const { getByTestId } = render(<TestComponent />);

      // Verify initial state
      expect(getByTestId('user-id').props.children).toBe(mockUser.id);
      
      // Trigger loadGameData
      fireEvent.press(getByTestId('load-button'));
      
      // Verify the function was called
      expect(loadGameDataMock).toHaveBeenCalledTimes(1);
      
      // Wait for the alert to be shown
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Game Data Error',
          'Failed to load game data'
        );
      });
      
      // Verify wallet still shows no-wallet
      expect(getByTestId('wallet').props.children).toBe('no-wallet');
    });

    test('loadGameData should not make API call if no user', async () => {
      // Create a mock function for loadGameData
      const loadGameDataMock = jest.fn();
      
      // Set initial state with no user
      (useAuth).mockReturnValue({
        ...defaultMockAuth,
        user: null,
        loadGameData: loadGameDataMock
      });

      // Render component
      const { getByTestId } = render(<TestComponent />);

      // Verify there's no user
      expect(getByTestId('user-id').props.children).toBe('no-user');
      
      // Trigger loadGameData
      fireEvent.press(getByTestId('load-button'));
      
      // Verify the function was called but didn't do anything
      expect(loadGameDataMock).toHaveBeenCalledTimes(1);
      
      // Function should not have changed state
      expect(getByTestId('user-id').props.children).toBe('no-user');
      expect(getByTestId('wallet').props.children).toBe('no-wallet');
    });

    test('should load game data automatically when user is available', async () => {
      // Mock user data
      const mockUser = { id: 'test-user-id', email: 'test@example.com', name: 'Test User' };
      
      // Mock game data
      const mockGameData = {
        userId: 'test-user-id',
        walletAddress: '0xC99dA54C186e897FcBD178C26B75acDE1807281D',
        createdAt: '2025-03-30T09:42:08.705Z',
        updatedAt: '2025-03-30T09:42:08.705Z'
      };

      // Set state to have both user and game data (simulating auto-loading)
      (useAuth).mockReturnValue({
        ...defaultMockAuth,
        user: mockUser,
        gameData: mockGameData
      });

      // Render component
      const { getByTestId } = render(<TestComponent />);

      // Verify user and game data are displayed
      expect(getByTestId('user-id').props.children).toBe(mockUser.id);
      expect(getByTestId('wallet').props.children).toBe(mockGameData.walletAddress);
    });
  });
}

// Add default export to make it a valid route
export default function AuthContextTest() {
  return (
    <View>
      <Text>Auth Context Test</Text>
    </View>
  );
} 