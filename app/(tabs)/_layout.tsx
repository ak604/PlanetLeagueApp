import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            android: {
              elevation: 8,
            },
            default: {},
          }),
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 60,
        },
        tabBarLabelStyle: {
          fontSize: Theme.typography.sizes.xs,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 8 : 4,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 6 : 0,
        }
      }}>
      <Tabs.Screen
        name="liveops"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <View style={{ marginBottom: -4 }}>
              <IconSymbol size={size || 24} name="star.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="gamehub"
        options={{
          title: 'Game Hub',
          tabBarIcon: ({ color, size }) => (
            <View style={{ marginBottom: -4 }}>
              <IconSymbol size={size || 24} name="gamecontroller.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={{ marginBottom: -4 }}>
              <IconSymbol size={size || 24} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
