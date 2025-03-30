module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))",
  ],
  moduleNameMapper: {
    // Add specific mappings for components, hooks, and constants (assuming they are at root)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    // Keep the mapping for files directly under app (like utils, context, routes)
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  // Tell Jest to run the setup file before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Define global variables for tests
  globals: {
    __TEST_API_URL__: 'http://mock-api-via-globals.com',
  },
};
