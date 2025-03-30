import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

interface LoadingBarProps {
  message?: string;
  progress?: number; // If provided, will show determinate progress, otherwise indeterminate
  color?: string; // Optional override for bar color
}

export const LoadingBar = ({ 
  message = 'Loading data...', 
  progress, 
  color 
}: LoadingBarProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const barColor = color || colors.primary;
  
  // Animation value for indeterminate loading
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Start animation for indeterminate loading
  useEffect(() => {
    if (progress === undefined) {
      // Create indeterminate loading animation
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    } else {
      // For determinate loading, set the progress directly
      animatedValue.setValue(progress);
    }
    
    return () => {
      // Clean up animation
      animatedValue.stopAnimation();
    };
  }, [progress, animatedValue]);
  
  // Define the animation for indeterminate loading
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 400], // Move from left to right
  });
  
  // Width for determinate loading
  const width = progress !== undefined 
    ? `${Math.min(Math.max(progress * 100, 0), 100)}%` 
    : '100%';
  
  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      
      <View style={[styles.trackBar, { backgroundColor: colors.border }]}>
        {progress === undefined ? (
          // Indeterminate loading
          <Animated.View 
            style={[
              styles.indeterminateBar, 
              { 
                backgroundColor: barColor,
                transform: [{ translateX }]
              }
            ]} 
          />
        ) : (
          // Determinate loading
          <Animated.View 
            style={[
              styles.progressBar,
              { 
                backgroundColor: barColor,
                width,
              }
            ]} 
          />
        )}
      </View>
      
      {progress !== undefined && (
        <Text style={[styles.percentage, { color: colors.text }]}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  message: {
    fontSize: Theme.typography.sizes.md,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  trackBar: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  indeterminateBar: {
    height: '100%',
    width: 150,
    borderRadius: 4,
  },
  percentage: {
    fontSize: Theme.typography.sizes.sm,
    marginTop: Theme.spacing.sm,
    fontWeight: '500',
  }
}); 