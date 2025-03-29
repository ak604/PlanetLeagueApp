import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width * 0.8;

const LoadingScreen = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Example: Simulate loading progress
    progress.value = withTiming(1, { duration: 3000, easing: Easing.linear });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: BAR_WIDTH * progress.value,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Replace with your actual Logo component */}
        <Text style={styles.logoPlaceholder}>PlanetLeagueApp</Text>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Or your app's background color
  },
  content: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333', // Or your app's primary color
  },
  progressBarContainer: {
    height: 10,
    width: BAR_WIDTH,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Or your app's primary color
    borderRadius: 5,
  },
});

export default LoadingScreen; 