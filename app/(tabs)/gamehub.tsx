import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { useToken } from '../context/TokenContext';
import { useAuth } from '../context/AuthContext';

// Define Game type
interface Game {
  id: string;
  name: string;
  description: string;
  icon: any; // Changed from string to any to support image requires
  gameUrl: string;
  highScore: number;
  isLocal: boolean;
}

// Updated local game data with actual image assets
const localGames: Game[] = [
  {
    id: '1',
    name: 'Cosmic Runner',
    description: 'Dodge asteroids, run forever!',
    icon: require('../../assets/games/runner.png'),
    gameUrl: 'local://infiniterunner',
    highScore: 0,
    isLocal: true
  },
  {
    id: '2',
    name: 'Pattern Play',
    description: 'Repeat the pattern to win PLT',
    icon: require('../../assets/games/puzzle-1.png'),
    gameUrl: 'local://puzzlegame',
    highScore: 0,
    isLocal: true
  },
  {
    id: '3',
    name: 'Memo Match',
    description: 'Match the pairs, test your memory',
    icon: require('../../assets/games/memory-back.png'),
    gameUrl: 'local://memorygame',
    highScore: 0,
    isLocal: true
  }
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns - 30;

const GameHubScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { refreshBalance } = useToken();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>(localGames);
  const router = useRouter();

  // Handle game completion (reward logic remains the same)
  const handleGameComplete = async (gameId: string, score: number) => {
    try {
      // Award 10 PLT for completing the game
      await refreshBalance(); 
      
      // Check if it's a high score
      const gameIndex = games.findIndex(g => g.id === gameId);
      if (gameIndex !== -1 && score > games[gameIndex].highScore) {
        // Award additional 20 PLT for high score
        await refreshBalance(); 
        
        // Update high score in state
        setGames(prevGames => {
          const newGames = [...prevGames];
          newGames[gameIndex] = { ...newGames[gameIndex], highScore: score };
          return newGames;
        });
        
        Alert.alert(
          'New High Score! 🎉',
          `Congratulations! You've earned:\n• 10 PLT for completing the game\n• 20 PLT for achieving a high score!`
        );
      } else {
        Alert.alert(
          'Game Complete! 🎉',
          'You\'ve earned 10 PLT for completing the game!'
        );
      }
    } catch (error) {
      console.error('Error handling game completion:', error);
      Alert.alert('Error', 'Failed to process rewards. Please try again.');
    }
  };

  // Pass the handleGameComplete function via context or state management if needed
  // For now, passing via params might cause serialization issues in native
  // A better approach would be using context or a shared state management library

  const renderGameItem = ({ item, index }: { item: Game; index: number }) => (
    <TouchableOpacity
      style={[styles.gameItem, { backgroundColor: colors.card }]}
      onPress={() => {
        router.push({
          pathname: '/localgame',
          params: {
            gameId: item.id,
            gameName: item.name,
          },
        });
      }}
    >
      <Image 
        source={item.icon} 
        style={styles.gameIcon} 
        resizeMode="cover"
      />
      <View style={styles.gameInfo}>
        <Text style={[styles.gameName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.gameDescription, { color: colors.subtext }]}>{item.description}</Text>
      </View>
      <View style={styles.highScoreContainer}>
        <Text style={[styles.highScoreLabel, { color: colors.subtext }]}>High Score:</Text>
        <Text style={[styles.highScoreValue, { color: colors.primary }]}>
          {item.highScore > 0 ? item.highScore : '0'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Game Hub</Text>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        // Add extraData to force re-render when high score changes
        extraData={games.map(g => g.highScore).join('-')}
      />
    </SafeAreaView>
  );
};

// Styles remain largely the same, adjust if needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: Theme.spacing.lg,
  },
  gridContainer: {
    paddingHorizontal: Theme.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.sm,
  },
  gameIcon: {
    width: 50,
    height: 50,
    marginRight: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#333', // Add background color for transparent images
  },
  gameInfo: {
    flex: 1, // Allow game info to take available space
    marginRight: Theme.spacing.md, // Add space between info and score
    justifyContent: 'center', // Center text vertically
  },
  gameName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  gameDescription: {
    fontSize: Theme.typography.sizes.sm,
    marginTop: Theme.spacing.xs,
  },
  highScoreContainer: {
    alignItems: 'flex-end', // Align score to the right
  },
  highScoreLabel: {
    fontSize: Theme.typography.sizes.xs,
  },
  highScoreValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
});

export default GameHubScreen; 