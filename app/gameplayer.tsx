import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import { rewardUser } from '@/utils/rewardApi'; // Import the reward function
import { useAuth } from '@/context/AuthContext'; // Import AuthContext to get user ID

const GamePlayerScreen = () => {
  const { gameUrl, gameName } = useLocalSearchParams<{ gameUrl: string; gameName: string }>();
  const { user } = useAuth(); // Get user from Auth context
  const router = useRouter();

  if (!gameUrl) {
    // Handle missing URL parameter
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>Game URL not provided.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  if (!user) {
    // Handle missing user (should ideally not happen if routed correctly)
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>User not found. Please log in.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const handleReward = (amount: number) => {
    // Call the reward API
    // Make sure user.id exists and is the correct identifier your backend expects
    if (user && user.id) { 
      rewardUser('PLT', amount, user.id);
    } else {
      Alert.alert('Error', 'Could not determine user ID for reward.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: gameName || 'Game' }} />
      <WebView
        source={{ uri: gameUrl }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        )}
      />
      {/* Example buttons to trigger rewards */}
      <View style={styles.rewardContainer}>
        <Button title="Complete Level (10 PLT)" onPress={() => handleReward(10)} />
        <Button title="High Score (50 PLT)" onPress={() => handleReward(50)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webview: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
});

export default GamePlayerScreen; 