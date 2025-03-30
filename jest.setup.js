// Set up testing environment
process.env.NODE_ENV = 'test';

// Any other test setup can go here 

// You can add other global test setup here if needed
// e.g., mocking native modules, setting up global mocks

// Example: Mock react-native-gesture-handler if it causes issues
// jest.mock('react-native-gesture-handler', () => {
//   const View = require('react-native/Libraries/Components/View/View');
//   return {
//     Swipeable: View,
//     DrawerLayout: View,
//     State: {},
//     ScrollView: View,
//     Slider: View,
//     Switch: View,
//     TextInput: View,
//     ToolbarAndroid: View,
//     ViewPagerAndroid: View,
//     DrawerLayoutAndroid: View,
//     WebView: View,
//     NativeViewGestureHandler: View,
//     TapGestureHandler: View,
//     FlingGestureHandler: View,
//     ForceTouchGestureHandler: View,
//     LongPressGestureHandler: View,
//     PanGestureHandler: View,
//     PinchGestureHandler: View,
//     RotationGestureHandler: View,
//     /* Buttons */
//     RawButton: View,
//     BaseButton: View,
//     RectButton: View,
//     BorderlessButton: View,
//     /* Other */
//     FlatList: View,
//     gestureHandlerRootHOC: jest.fn(),
//     Directions: {},
//   };
// }); 

// Mock Expo modules that might cause issues in the test environment
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  appOwnership: 'standalone',
  Constants: {
    appOwnership: 'standalone',
    manifest: {
      extra: {},
    },
  },
}));

// Mock React Native components and APIs
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Set up a global fetch mock
global.fetch = jest.fn();

// Mock environment variables
process.env.EXPO_PUBLIC_PL_BASE_URL = 'http://test-api.example.com';
process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = 'test-client-id';

// Configure the test environment for React Native
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  
  rn.NativeModules.RNGoogleSignin = {
    SIGN_IN_CANCELLED: 0,
    IN_PROGRESS: 1,
    PLAY_SERVICES_NOT_AVAILABLE: 2,
    configure: jest.fn(),
    signIn: jest.fn(),
    hasPlayServices: jest.fn(),
  };
  
  return rn;
});

// Mock timers
jest.useFakeTimers();

// Silence console warnings/errors during tests
// Uncomment this if you want to suppress console output during tests
/*
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...args) => {
  if (args[0]?.includes?.('Warning:')) return;
  originalConsoleError(...args);
};
console.warn = (...args) => {
  if (args[0]?.includes?.('Warning:')) return;
  originalConsoleWarn(...args);
};
*/ 