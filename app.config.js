// Get the base config from app.json
const baseConfig = require('./app.json');

// Create a modified config for development
module.exports = {
  ...baseConfig.expo,
  extra: {
    eas: {
      projectId: "da192295-4854-4f88-b99f-91e641a08f6d"
    }
  },
  // Explicitly enable new architecture as recommended by the warning
  newArchEnabled: true,
  // Set assets to null to make them optional during development
  icon: null,
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  android: {
    ...baseConfig.expo.android,
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    }
  },
  web: {
    ...baseConfig.expo.web,
    favicon: null
  },
  // Use the same plugins as in app.json
  plugins: [
    ...baseConfig.expo.plugins
  ]
}; 