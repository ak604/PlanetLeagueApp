import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import GamePlayerScreen from '@/gameplayer'; // Corrected import path using alias
import * as rewardApi from '@/utils/rewardApi'; // Import to mock rewardUser
import * as AuthContext from '@/context/AuthContext'; // Import to mock useAuth

// Mock Alert specifically
jest.spyOn(Alert, 'alert');
// jest.unmock('react-native'); // Remove this line
// jest.mock('react-native', () => ({
//   ...jest.requireActual('react-native'), // Keep original RN modules
//   Alert: {
//     alert: jest.fn(),
//   },
// })); // Remove this block

// Mock react-native-webview
jest.mock('react-native-webview', () => {
  const MockWebView = jest.requireActual('react-native').View;
  // Add a testID to the mock for easier selection
  return (props: any) => <MockWebView {...props} testID="WebView" />;
});

// Mock expo-router hooks and Stack
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({ back: jest.fn() })),
  Stack: {
    Screen: jest.fn(({ options }: any) => <>{/* Mock Screen: {options?.title} */}</>),
  },
}));

// Mock rewardApi
const mockRewardUser = jest.spyOn(rewardApi, 'rewardUser').mockImplementation(async () => {}); // Add mock implementation

// Mock AuthContext
const mockUseAuth = jest.spyOn(AuthContext, 'useAuth');

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const MockSafeAreaView = jest.requireActual('react-native').View;
  return { SafeAreaView: MockSafeAreaView };
});


describe('<GamePlayerScreen />', () => {
  const mockGameUrl = 'https://test-game.com';
  const mockGameName = 'Test Game';
  const mockUser = { id: 'testUser123', name: 'Tester', email: 'test@example.com' }; // Add other fields if needed by component
  const mockRouter = { back: jest.fn() };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup default mocks for hooks
    (jest.requireMock('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({ 
      gameUrl: mockGameUrl,
      gameName: mockGameName,
    });
    (jest.requireMock('expo-router').useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockUseAuth.mockReturnValue({ user: mockUser } as any); // Cast as any to simplify mock
    (Alert.alert as jest.Mock).mockClear(); // Clear Alert mock specifically
  });

  it('renders WebView with correct URL', () => {
    render(<GamePlayerScreen />);
    const webview = screen.getByTestId('WebView'); // Use the testID from the mock
    expect(webview).toBeTruthy();
    expect(webview.props.source).toEqual({ uri: mockGameUrl });
  });

  it('renders screen title with game name', () => {
    render(<GamePlayerScreen />);
    // Check if Stack.Screen was called with the correct options
    expect(jest.requireMock('expo-router').Stack.Screen).toHaveBeenCalledWith(
      expect.objectContaining({ options: { title: mockGameName } }),
      {}
    );
  });

  it('renders reward buttons', () => {
    render(<GamePlayerScreen />);
    expect(screen.getByText('Complete Level (10 PLT)')).toBeTruthy();
    expect(screen.getByText('High Score (50 PLT)')).toBeTruthy();
  });

  it('calls rewardUser with 10 PLT when level complete button pressed', () => {
    render(<GamePlayerScreen />);
    fireEvent.press(screen.getByText('Complete Level (10 PLT)'));
    expect(mockRewardUser).toHaveBeenCalledTimes(1);
    expect(mockRewardUser).toHaveBeenCalledWith('PLT', 10, mockUser.id);
  });

  it('calls rewardUser with 50 PLT when high score button pressed', () => {
    render(<GamePlayerScreen />);
    fireEvent.press(screen.getByText('High Score (50 PLT)'));
    expect(mockRewardUser).toHaveBeenCalledTimes(1);
    expect(mockRewardUser).toHaveBeenCalledWith('PLT', 50, mockUser.id);
  });

  it('shows error and back button if gameUrl is missing', () => {
    (jest.requireMock('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({ 
      gameName: mockGameName, // gameUrl missing
    });
    render(<GamePlayerScreen />);
    expect(screen.getByText('Game URL not provided.')).toBeTruthy();
    expect(screen.getByText('Go Back')).toBeTruthy();
    expect(screen.queryByTestId('WebView')).toBeNull(); // WebView should not render
  });

  it('shows error and back button if user is missing', () => {
    mockUseAuth.mockReturnValue({ user: null } as any); // Mock no user
    render(<GamePlayerScreen />);
    expect(screen.getByText('User not found. Please log in.')).toBeTruthy();
    expect(screen.getByText('Go Back')).toBeTruthy();
    expect(screen.queryByTestId('WebView')).toBeNull(); // WebView should not render
  });

  it('calls router.back when back button is pressed (on error)', () => {
    (jest.requireMock('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({}); // Trigger error
    render(<GamePlayerScreen />);
    fireEvent.press(screen.getByText('Go Back'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('shows alert if rewardUser fails because user ID is missing (edge case)', () => {
    mockUseAuth.mockReturnValue({ user: { name: 'NoIDUser'} } as any); // User without ID
    render(<GamePlayerScreen />);
    fireEvent.press(screen.getByText('Complete Level (10 PLT)'));
    expect(mockRewardUser).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Could not determine user ID for reward.');
  });
}); 