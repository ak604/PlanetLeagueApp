import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
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
  const { updateHighScore, awardTokens } = useGame();
  
  const gameName = params.gameName as string;
  const gameId = params.gameId as string;
  
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Changed from 60 to 30 seconds game time

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
    
    // Update high score and award tokens
    await Promise.all([
      updateHighScore(gameId, score),
      awardTokens(gameId, score),
    ]);

    Alert.alert('Game Over', `Your final score: ${score}`);
    router.back();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30); // Changed from 60 to 30
    setIsPlaying(true);
  };

  const renderGameContent = () => {
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
              Game not found or not implemented yet.
            </Text>
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
    ...Theme.shadows.lg,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: Theme.typography.sizes.lg,
    textAlign: 'center',
  },
});

export default LocalGameScreen; 