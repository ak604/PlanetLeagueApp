import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

interface PLTTokenIconProps {
  count?: number | string;
  size?: number;
  showAmount?: boolean;
  onPress?: () => void;
}

export const PLTTokenIcon = ({ 
  count = 0, 
  size = 24, 
  showAmount = true,
  onPress
}: PLTTokenIconProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const formattedCount = typeof count === 'number' 
    ? count.toLocaleString() 
    : count;
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="11" fill="#235DDD" />
          <Path
            d="M7 12L10.5 15.5L17 9"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      
      {showAmount && (
        <Text style={[styles.count, { color: colors.text }]}>
          {formattedCount} PLT
        </Text>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 4,
  },
  count: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '600',
  },
}); 