import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type LogoProps = {
  size?: number;
  withText?: boolean;
};

export function PlanetLeagueLogo({ size = 100, withText = true }: LogoProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Scale factors based on size
  const planetSize = size * 0.6;
  const orbitSize = size * 0.9;
  const fontSize = size * 0.13;
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={withText ? size * 1.2 : size} viewBox={`0 0 100 ${withText ? 120 : 100}`}>
        {/* Orbit rings */}
        <Circle
          cx="50"
          cy="50"
          r={orbitSize / 2}
          stroke={colors.primary}
          strokeWidth="1"
          fill="none"
        />
        
        <Circle
          cx="50"
          cy="50"
          r={orbitSize / 2.5}
          stroke={colors.secondary}
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="3,3"
        />
        
        {/* Small orbiting planets/tokens */}
        <Circle
          cx={50 + (orbitSize / 2) * Math.cos(Math.PI / 4)}
          cy={50 + (orbitSize / 2) * Math.sin(Math.PI / 4)}
          r={size * 0.06}
          fill={colors.accent}
        />
        
        <Circle
          cx={50 + (orbitSize / 2.5) * Math.cos(Math.PI * 1.2)}
          cy={50 + (orbitSize / 2.5) * Math.sin(Math.PI * 1.2)}
          r={size * 0.04}
          fill={colors.error}
        />
        
        <Circle
          cx={50 + (orbitSize / 2) * Math.cos(Math.PI * 1.7)}
          cy={50 + (orbitSize / 2) * Math.sin(Math.PI * 1.7)}
          r={size * 0.05}
          fill={colors.secondary}
        />
        
        {/* Main planet */}
        <Circle
          cx="50"
          cy="50"
          r={planetSize / 2}
          fill={colors.primary}
        />
        
        {/* Planet rings */}
        <Path
          d={`M${50 - planetSize * 0.6} 50 a${planetSize * 0.6} ${planetSize * 0.15} 0 1 0 ${planetSize * 1.2} 0 a${planetSize * 0.6} ${planetSize * 0.15} 0 1 0 -${planetSize * 1.2} 0`}
          fill="none"
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        
        {/* Optional text */}
        {withText && (
          <G>
            <SvgText
              x="50"
              y={size + 10}
              fontSize={fontSize}
              fontWeight="bold"
              fill={colors.text}
              textAnchor="middle"
            >
              Planet League
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 