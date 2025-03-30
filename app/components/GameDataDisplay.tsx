import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

/**
 * Component to display user's game data
 * Shows loading state, error state, or the actual game data
 */
export default function GameDataDisplay() {
  const { gameData, isGameDataLoading, user, loadGameData } = useAuth();

  // If data is loading, show a loading indicator
  if (isGameDataLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={styles.text}>Loading game data...</ThemedText>
      </ThemedView>
    );
  }

  // If no data but we have a user, show error with refresh button
  if (!gameData && user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          Could not load game data
        </ThemedText>
        <View style={styles.button} onTouchEnd={loadGameData}>
          <ThemedText style={styles.buttonText}>Retry</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // If we have game data, display it
  if (gameData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Your Game Data</ThemedText>
        
        <View style={styles.dataRow}>
          <ThemedText style={styles.label}>User ID:</ThemedText>
          <ThemedText style={styles.value}>{gameData.userId}</ThemedText>
        </View>
        
        <View style={styles.dataRow}>
          <ThemedText style={styles.label}>Wallet:</ThemedText>
          <ThemedText style={styles.value}>{gameData.walletAddress}</ThemedText>
        </View>
        
        <View style={styles.dataRow}>
          <ThemedText style={styles.label}>Created:</ThemedText>
          <ThemedText style={styles.value}>
            {new Date(gameData.createdAt).toLocaleString()}
          </ThemedText>
        </View>
        
        <View style={styles.dataRow}>
          <ThemedText style={styles.label}>Updated:</ThemedText>
          <ThemedText style={styles.value}>
            {new Date(gameData.updatedAt).toLocaleString()}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Default: No user or data yet
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Sign in to view your game data</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    width: '30%',
  },
  value: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
}); 