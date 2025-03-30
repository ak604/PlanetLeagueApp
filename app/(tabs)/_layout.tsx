import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { PLTTokenIcon } from '../components/ui/PLTTokenIcon';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useToken } from '../context/TokenContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { balance, refreshBalance, isLoading, walletAddress, lastUpdated } = useToken();

  // Function to handle token balance refresh
  const handleRefreshBalance = () => {
    if (walletAddress) {
      refreshBalance(walletAddress);
    } else {
      refreshBalance();
    }
  };

  // Format last updated time for tooltip
  const getLastUpdatedDisplay = () => {
    if (!lastUpdated) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    
    if (diffMs < 60000) { // Less than a minute
      return 'Updated just now';
    } else if (diffMs < 3600000) { // Less than an hour
      const minutes = Math.floor(diffMs / 60000);
      return `Updated ${minutes} min ago`;
    } else {
      return `Updated at ${lastUpdated.toLocaleTimeString()}`;
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerRight: () => (
          <TouchableOpacity 
            style={styles.headerTokenContainer}
            onPress={handleRefreshBalance}
            disabled={isLoading}
            accessibilityLabel={`PLT Balance: ${balance || 0}. ${getLastUpdatedDisplay()}`}
            accessibilityHint="Tap to refresh token balance"
          >
            <PLTTokenIcon 
              count={balance || 0} 
              size={24}
              showAmount={true}
            />
            {isLoading && (
              <View style={[styles.loadingDot, { backgroundColor: colors.primary }]} />
            )}
            {lastUpdated && (
              <Text style={[styles.lastUpdatedIndicator, { color: colors.subtext }]}>
                {getLastUpdatedDisplay()}
              </Text>
            )}
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTitleStyle: {
          color: colors.text,
          fontSize: Theme.typography.sizes.lg,
          fontWeight: 'bold',
        },
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

const styles = StyleSheet.create({
  headerTokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    opacity: 0.8,
  },
  lastUpdatedIndicator: {
    marginLeft: 8,
    fontSize: Theme.typography.sizes.xs,
    opacity: 0.8,
  }
});
