module.exports = function(api) {
  api.cache(true);
  
  // Check if we're in test environment
  const isTest = process.env.NODE_ENV === 'test';
  
  // Define base aliases for application paths
  const aliases = {
    '@/components': './components', // Assuming components is at the root
    '@/hooks': './hooks',           // Assuming hooks is at the root
    '@/constants': './constants',     // Assuming constants is at the root
    '@': './app',                 // Map '@/' to the 'app' directory
  };

  // Conditionally add alias for testing library in non-test environments
  if (!isTest) {
    aliases['@testing-library/react-native'] = './empty-module.js'; // Ensure this file exists
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Configure module-resolver with the aliases
      [
        'module-resolver',
        {
          root: ['./'], // Project root
          alias: aliases,
          // extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'] // Optional: ensure TS/TSX are resolved
        },
      ],
      // IMPORTANT: Add other plugins like 'react-native-reanimated/plugin' HERE if you use them.
      // Reanimated plugin should typically be listed last.
    ].filter(Boolean), // Keep filtering just in case
  };
}; 