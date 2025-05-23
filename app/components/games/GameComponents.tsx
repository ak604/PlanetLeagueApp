import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Animated } from 'react-native';
import { Theme } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// Game Assets
const GAME_ASSETS = {
  runner: {
    player: require('../../../assets/games/runner.png'),
    obstacle: require('../../../assets/games/asteroid.png'),
    background: require('../../../assets/games/space-bg.png'),
  },
  puzzle: {
    tiles: [
      require('../../../assets/games/puzzle-1.png'),
      require('../../../assets/games/puzzle-2.png'),
      require('../../../assets/games/puzzle-3.png'),
      require('../../../assets/games/puzzle-4.png'),
    ],
    background: require('../../../assets/games/puzzle-bg.png'),
  },
  memory: {
    cards: [
      require('../../../assets/games/memory-1.png'),
      require('../../../assets/games/memory-2.png'),
      require('../../../assets/games/memory-3.png'),
      require('../../../assets/games/memory-4.png'),
    ],
    back: require('../../../assets/games/memory-back.png'),
  },
};

// Infinite Runner Game Component
export const InfiniteRunnerGame = ({ onScoreUpdate, isPlaying }) => {
  const playerBaseY = height * 0.7;
  const [obstacles, setObstacles] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const jumpAnimation = useRef(new Animated.Value(0)).current;
  const gameLoop = useRef(null);
  const playerSize = 50;
  const obstacleSize = 40;
  const jumpHeight = 100;
  
  // Simple collision flag
  const [hasCollided, setHasCollided] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setHasCollided(false);
      setObstacles([]);
      startGameLoop();
    } else {
      stopGameLoop();
    }
    return () => stopGameLoop();
  }, [isPlaying]);

  const startGameLoop = () => {
    gameLoop.current = setInterval(() => {
      if (hasCollided) return;
      
      // Update obstacles
      setObstacles(prev => {
        // Move existing obstacles
        const updatedObstacles = prev
          .map(obs => ({ ...obs, x: obs.x - 10 }))
          .filter(obs => obs.x > -obstacleSize);
        
        // Add new obstacle randomly (max 3 on screen)
        if (Math.random() < 0.03 && 
            updatedObstacles.length < 3 && 
            updatedObstacles.every(o => o.x < width - 200)) {
          updatedObstacles.push({
            id: Date.now(),
            x: width,
            y: playerBaseY - 10,
          });
        }
        
        return updatedObstacles;
      });
      
      // Check for collisions manually - we use a simple approach
      const jumpValue = jumpAnimation.__getValue();
      const playerY = playerBaseY - (jumpValue * jumpHeight);
      
      obstacles.forEach(obs => {
        // Simple rectangular collision check
        if (
          obs.x < 100 + playerSize && 
          obs.x + obstacleSize > 100 && 
          playerY < obs.y + obstacleSize && 
          playerY + playerSize > obs.y
        ) {
          console.log("COLLISION!");
          setHasCollided(true);
          stopGameLoop();
        }
      });
      
      // Update score
      onScoreUpdate(prev => prev + 1);
    }, 50);
  };

  const stopGameLoop = () => {
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
      gameLoop.current = null;
    }
  };

  const jump = () => {
    if (!isJumping && !hasCollided) {
      setIsJumping(true);
      Animated.sequence([
        Animated.timing(jumpAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsJumping(false));
    }
  };

  return (
    <View style={styles.gameContainer}>
      {/* Background */}
      <Image source={GAME_ASSETS.runner.background} style={StyleSheet.absoluteFill} />
      
      {/* Game Over Message */}
      {hasCollided && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
        </View>
      )}
      
      {/* Jump button */}
      <TouchableOpacity
        style={styles.jumpButton}
        onPress={jump}
        disabled={!isPlaying || hasCollided}
      >
        <Text style={styles.buttonText}>Jump!</Text>
      </TouchableOpacity>
      
      {/* Game area */}
      <View style={styles.gameArea}>
        {/* Player */}
        <Animated.View
          style={[
            styles.player,
            {
              left: 100,
              top: playerBaseY,
              transform: [{
                translateY: jumpAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -jumpHeight],
                }),
              }],
            },
          ]}
        >
          <Image
            source={GAME_ASSETS.runner.player}
            style={styles.playerImage}
          />
        </Animated.View>

        {/* Ground line */}
        <View style={[styles.groundLine, {top: playerBaseY + playerSize - 5}]} />

        {/* Obstacles */}
        {obstacles.map(obs => (
          <View
            key={obs.id}
            style={[
              styles.obstacle,
              { left: obs.x, top: obs.y },
            ]}
          >
            <Image
              source={GAME_ASSETS.runner.obstacle}
              style={styles.obstacleImage}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// Puzzle Game Component
export const PuzzleGame = ({ onScoreUpdate, isPlaying }) => {
  const [pattern, setPattern] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (isPlaying) {
      generateNewPattern();
    }
  }, [isPlaying]);

  const generateNewPattern = () => {
    const newPattern = Array(level)
      .fill(0)
      .map(() => Math.floor(Math.random() * 4));
    setPattern(newPattern);
    setPlayerInput([]);
    showPattern(newPattern);
  };

  const showPattern = async (pattern) => {
    setIsShowingPattern(true);
    for (let i = 0; i < pattern.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsShowingPattern(false);
  };

  const handleTilePress = (index) => {
    if (isShowingPattern) return;
    
    const newInput = [...playerInput, index];
    setPlayerInput(newInput);

    // Check if input matches pattern
    const isCorrect = newInput.every((input, i) => input === pattern[i]);
    
    if (newInput.length === pattern.length) {
      if (isCorrect) {
        onScoreUpdate(prev => prev + level * 10);
        setLevel(prev => prev + 1);
        generateNewPattern();
      } else {
        // Game over
        onScoreUpdate(prev => prev + Math.floor(level / 2) * 5);
      }
    }
  };

  return (
    <View style={styles.puzzleContainer}>
      <Text style={styles.levelText}>Level {level}</Text>
      
      <View style={styles.patternDisplay}>
        {pattern.map((tile, index) => (
          <View
            key={index}
            style={[
              styles.patternTile,
              {
                backgroundColor: isShowingPattern ? '#FFD700' : '#333',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.tileGrid}>
        {[0, 1, 2, 3].map((index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            onPress={() => handleTilePress(index)}
            disabled={isShowingPattern}
          >
            <Image
              source={GAME_ASSETS.puzzle.tiles[index]}
              style={styles.tileImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Memory Game Component
export const MemoryGame = ({ onScoreUpdate, isPlaying }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      initializeGame();
    }
  }, [isPlaying]);

  const initializeGame = () => {
    const cardPairs = [...GAME_ASSETS.memory.cards, ...GAME_ASSETS.memory.cards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        image: card,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardPress = (cardId) => {
    if (flippedCards.length === 2 || cards[cardId].isMatched) return;

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedIds) => {
    const [first, second] = flippedIds;
    const isMatch = cards[first].image === cards[second].image;

    setTimeout(() => {
      if (isMatch) {
        const newMatchedPairs = [...matchedPairs, first, second];
        setMatchedPairs(newMatchedPairs);
        setFlippedCards([]);
        
        if (newMatchedPairs.length === cards.length) {
          onScoreUpdate(prev => prev + (100 - moves * 5));
        }
      } else {
        const newCards = cards.map(card =>
          flippedIds.includes(card.id) ? { ...card, isFlipped: false } : card
        );
        setCards(newCards);
        setFlippedCards([]);
      }
    }, 1000);
  };

  return (
    <View style={styles.memoryContainer}>
      <Text style={styles.movesText}>Moves: {moves}</Text>
      
      <View style={styles.memoryGrid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.memoryCard,
              card.isFlipped && styles.flippedCard,
              card.isMatched && styles.matchedCard,
            ]}
            onPress={() => handleCardPress(card.id)}
            disabled={!isPlaying}
          >
            <Image
              source={card.isFlipped ? card.image : GAME_ASSETS.memory.back}
              style={styles.cardImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  obstacle: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  obstacleImage: {
    width: '100%',
    height: '100%',
  },
  jumpButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 25,
    zIndex: 1,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  gameOverText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  groundLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  puzzleContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  patternDisplay: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  patternTile: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 5,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tile: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  memoryContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  movesText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  memoryCard: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flippedCard: {
    backgroundColor: '#FFD700',
  },
  matchedCard: {
    backgroundColor: '#4CAF50',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

// Make the file have a default export as required by Expo Router
export default {
  InfiniteRunnerGame,
  PuzzleGame,
  MemoryGame
}; 