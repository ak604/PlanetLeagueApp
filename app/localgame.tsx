import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { InfiniteRunnerGame, PuzzleGame, MemoryGame } from './components/games/GameComponents';
import { useGame } from './context/GameContext';

const { width } = Dimensions.get('window');

const LocalGameScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Get game parameters from route
  const gameName = params.gameName as string || 'Unknown Game';
  const gameId = params.gameId as string || '1';
  
  // Game state
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState(null);
  
  // Try to get the game context if available
  let updateHighScore = null;
  let awardTokens = null;
  try {
    const gameContext = useGame();
    if (gameContext) {
      updateHighScore = gameContext.updateHighScore;
      awardTokens = gameContext.awardTokens;
    }
  } catch (err) {
    console.log('Game context not available:', err);
  }

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            handleGameComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, timeLeft]);

  const handleGameComplete = async () => {
    console.log(`Game ${gameId} completed with score: ${score}`);
    
    try {
      // Try to update high score and award tokens if context is available
      if (updateHighScore && awardTokens) {
        await Promise.all([
          updateHighScore(gameId, score),
          awardTokens(gameId, score),
        ]);
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }

    Alert.alert('Game Over', `Your final score: ${score}`);
    router.back();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setError(null);
  };

  const renderGameContent = () => {
    try {
      switch (gameId) {
        case '1': // Cosmic Runner (Infinite Runner)
          return <InfiniteRunnerGame onScoreUpdate={setScore} isPlaying={isPlaying} />;
        case '2': // Pattern Play (Puzzle Game)
          return <PuzzleGame onScoreUpdate={setScore} isPlaying={isPlaying} />;
        case '3': // Memo Match (Memory Game)
          return <MemoryGame onScoreUpdate={setScore} isPlaying={isPlaying} />;
        default:
          return (
            <View style={styles.gamePlaceholder}>
              <Text style={[styles.errorText, { color: colors.text }]}>
                Game ID {gameId} not found or not implemented yet.
              </Text>
            </View>
          );
      }
    } catch (err) {
      setError(err.message);
      console.error('Error rendering game:', err);
      return (
        <View style={styles.gamePlaceholder}>
          <Text style={styles.errorText}>Error loading game: {err.message}</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{gameName}</Text>
        <View style={styles.statsContainer}>
          <Text style={[styles.score, { color: colors.primary }]}>Score: {score}</Text>
          <Text style={[styles.timer, { color: colors.text }]}>Time: {timeLeft}s</Text>
        </View>
      </View>

      {error ? (
        <ScrollView style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Game</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.gameArea}>
          {!isPlaying ? (
            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              onPress={startGame}
            >
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          ) : (
            renderGameContent()
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: Theme.spacing.sm,
  },
  backButtonText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: 'bold',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  timer: {
    fontSize: Theme.typography.sizes.md,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  gamePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
  },
  startButton: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.lg,
    minWidth: width * 0.5,
    alignItems: 'center',
    backgroundColor: '#4285F4',
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    textAlign: 'center',
    color: '#FF3B30',
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
  },
  errorTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default LocalGameScreen; 