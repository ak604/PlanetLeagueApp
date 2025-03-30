/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Planet League App theme colors
 * A consistent color palette for both light and dark modes
 */

// Primary brand colors
const primaryColor = '#4285F4';      // Main brand color (Google Blue)
const secondaryColor = '#34A853';    // Secondary color (Google Green)
const accentColor = '#FBBC05';       // Accent color (Google Yellow)
const errorColor = '#EA4335';        // Error/Alert color (Google Red)

// Light mode
const textLight = '#202124';         // Dark gray, almost black
const subtextLight = '#5F6368';      // Medium gray for secondary text
const backgroundLight = '#FFFFFF';   // White
const surfaceLight = '#F8F9FA';      // Very light gray
const borderLight = '#DADCE0';       // Light gray for borders
const dividerLight = '#E8EAED';      // Slightly lighter gray for dividers

// Dark mode
const textDark = '#E8EAED';          // Off-white
const subtextDark = '#9AA0A6';       // Light gray for secondary text
const backgroundDark = '#202124';    // Dark gray
const surfaceDark = '#303134';       // Slightly lighter dark gray
const borderDark = '#5F6368';        // Medium gray for borders
const dividerDark = '#3C4043';       // Dark gray for dividers

export const Colors = {
  light: {
    text: textLight,
    subtext: subtextLight,
    background: backgroundLight,
    surface: surfaceLight,
    border: borderLight,
    divider: dividerLight,
    tint: primaryColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    error: errorColor,
    success: secondaryColor,
    icon: subtextLight,
    tabIconDefault: subtextLight,
    tabIconSelected: primaryColor,
    card: '#FFFFFF',
    input: backgroundLight,
    inputBorder: borderLight,
    button: primaryColor,
    buttonText: '#FFFFFF',
  },
  dark: {
    text: textDark,
    subtext: subtextDark,
    background: backgroundDark,
    surface: surfaceDark,
    border: borderDark,
    divider: dividerDark,
    tint: primaryColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    error: errorColor,
    success: secondaryColor,
    icon: subtextDark,
    tabIconDefault: subtextDark,
    tabIconSelected: primaryColor,
    card: surfaceDark,
    input: surfaceDark,
    inputBorder: borderDark,
    button: primaryColor,
    buttonText: '#FFFFFF',
  },
};
