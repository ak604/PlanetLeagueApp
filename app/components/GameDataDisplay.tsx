import React from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

/**
 * Component to display user's game data
 * Shows loading state, error state, or the actual game data
 */
export default function GameDataDisplay() {
  const { gameData, isGameDataLoading, user, loadGameData } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // If data is loading, show a loading indicator
  if (isGameDataLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        <Text style={[styles.text, { color: colors.text }]}>Loading game data...</Text>
      </View>
    );
  }

  // If no data but we have a user, show error with refresh button
  if (!gameData && user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Could not load game data
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={loadGameData}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If we have game data, display it
  if (gameData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Your Game Data</Text>
        
        <View style={[styles.dataRow, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.label, { color: colors.subtext }]}>User ID:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{gameData.userId}</Text>
        </View>
        
        <View style={[styles.dataRow, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.label, { color: colors.subtext }]}>Wallet:</Text>
          <Text 
            style={[styles.value, styles.walletText, { color: colors.primary }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {gameData.walletAddress}
          </Text>
        </View>
        
        <View style={[styles.dataRow, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.label, { color: colors.subtext }]}>Created:</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {new Date(gameData.createdAt).toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={[styles.label, { color: colors.subtext }]}>Updated:</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {new Date(gameData.updatedAt).toLocaleString()}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.refreshButton, { borderColor: colors.primary }]} 
          onPress={loadGameData}
          activeOpacity={0.7}
        >
          <Text style={[styles.refreshButtonText, { color: colors.primary }]}>Refresh Data</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Default: No user or data yet
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.text, { color: colors.text }]}>Sign in to view your game data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    margin: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  loader: {
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  text: {
    fontSize: Theme.typography.sizes.md,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: '500',
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
    width: '30%',
  },
  value: {
    flex: 1,
    fontSize: Theme.typography.sizes.md,
  },
  walletText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: Theme.typography.sizes.sm,
  },
  button: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  refreshButton: {
    borderWidth: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.lg,
    alignSelf: 'center',
  },
  refreshButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '500',
  }
}); 