module.exports = function(api) {
  api.cache(true);
  
  // Check if we're in test environment
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Your existing plugins (if any)
      
      // Conditionally ignore the testing library in non-test environments
      !isTest && [
        'module-resolver',
        {
          alias: {
            // Map testing library imports to an empty module in development and production
            '@testing-library/react-native': './empty-module.js'
          },
        },
      ],
    ].filter(Boolean), // Remove any false entries
  };
}; 