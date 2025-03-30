import React from 'react';
import { render, screen, within } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import GameHubScreen from '@/(tabs)/gamehub'; // Corrected import path using alias

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions.get = jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 }));
  return RN;
});

// Mock expo-router Link component
jest.mock('expo-router', () => ({
  Link: jest.fn(({ href, children, ...props }) => {
    // Provide a basic mock that renders children and includes href data for testing
    const MockLink = jest.requireActual('react-native').TouchableOpacity;
    return <MockLink {...props} testID={`link-${JSON.stringify(href)}`}>{children}</MockLink>;
  }),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// Mock SafeAreaView for simplicity
jest.mock('react-native-safe-area-context', () => {
  const MockSafeAreaView = jest.requireActual('react-native').View;
  return { SafeAreaView: MockSafeAreaView };
});

describe('<GameHubScreen />', () => {
  beforeEach(() => {
    // Reset mocks if needed
    jest.clearAllMocks();
  });

  it('renders the header', () => {
    render(<GameHubScreen />);
    expect(screen.getByText('Game Hub')).toBeTruthy();
  });

  it('renders the list of games', () => {
    render(<GameHubScreen />);
    expect(screen.getByText('Puzzle Mania')).toBeTruthy();
    expect(screen.getByText('Trivia Time')).toBeTruthy();
    expect(screen.getByText('2048')).toBeTruthy();
  });

  it('renders game items with correct descriptions', () => {
    render(<GameHubScreen />);
    expect(screen.getByText('Solve puzzles, earn $PLT')).toBeTruthy();
    expect(screen.getByText('Answer questions, earn $PLT')).toBeTruthy();
    expect(screen.getByText('Combine tiles, earn $PLT')).toBeTruthy();
  });

  it('renders links for each game pointing to /gameplayer with correct params', () => {
    render(<GameHubScreen />);

    const puzzleLinkHref = JSON.stringify({ pathname: '/gameplayer', params: { gameUrl: 'https://puzzles.example.com', gameName: 'Puzzle Mania' } });
    expect(screen.getByTestId(`link-${puzzleLinkHref}`)).toBeTruthy();
    expect(within(screen.getByTestId(`link-${puzzleLinkHref}`)).getByText('Puzzle Mania')).toBeTruthy();

    const triviaLinkHref = JSON.stringify({ pathname: '/gameplayer', params: { gameUrl: 'https://trivia.example.com', gameName: 'Trivia Time' } });
    expect(screen.getByTestId(`link-${triviaLinkHref}`)).toBeTruthy();
    expect(within(screen.getByTestId(`link-${triviaLinkHref}`)).getByText('Trivia Time')).toBeTruthy();

    const game2048LinkHref = JSON.stringify({ pathname: '/gameplayer', params: { gameUrl: 'https://play2048.co/', gameName: '2048' } });
    expect(screen.getByTestId(`link-${game2048LinkHref}`)).toBeTruthy();
    expect(within(screen.getByTestId(`link-${game2048LinkHref}`)).getByText('2048')).toBeTruthy();
  });
}); 