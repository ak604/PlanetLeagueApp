import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GameContextType = {
  highScores: Record<string, number>;
  updateHighScore: (gameId: string, score: number) => Promise<void>;
  awardTokens: (gameId: string, score: number) => Promise<void>;
  getTokens: () => number;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const HIGH_SCORES_KEY = '@game_high_scores';
const TOKENS_KEY = '@game_tokens';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    loadHighScores();
    loadTokens();
  }, []);

  const loadHighScores = async () => {
    try {
      const scores = await AsyncStorage.getItem(HIGH_SCORES_KEY);
      if (scores) {
        setHighScores(JSON.parse(scores));
      }
    } catch (error) {
      console.error('Error loading high scores:', error);
    }
  };

  const loadTokens = async () => {
    try {
      const storedTokens = await AsyncStorage.getItem(TOKENS_KEY);
      if (storedTokens) {
        setTokens(parseInt(storedTokens, 10));
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  };

  const updateHighScore = async (gameId: string, score: number) => {
    try {
      const newHighScores = {
        ...highScores,
        [gameId]: Math.max(highScores[gameId] || 0, score),
      };
      await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(newHighScores));
      setHighScores(newHighScores);
    } catch (error) {
      console.error('Error updating high score:', error);
    }
  };

  const awardTokens = async (gameId: string, score: number) => {
    try {
      // Award tokens based on game type and score
      let tokensToAward = 0;
      switch (gameId) {
        case '1': // Cosmic Runner
          tokensToAward = Math.floor(score / 10); // 1 token per 10 points
          break;
        case '2': // Pattern Play
          tokensToAward = Math.floor(score / 20); // 1 token per 20 points
          break;
        case '3': // Memo Match
          tokensToAward = Math.floor(score / 15); // 1 token per 15 points
          break;
      }

      const newTokens = tokens + tokensToAward;
      await AsyncStorage.setItem(TOKENS_KEY, newTokens.toString());
      setTokens(newTokens);
    } catch (error) {
      console.error('Error awarding tokens:', error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        highScores,
        updateHighScore,
        awardTokens,
        getTokens: () => tokens,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Add a default export to fix the warning
export default {
  GameProvider,
  useGame
}; 