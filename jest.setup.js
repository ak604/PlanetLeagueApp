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