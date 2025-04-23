
import { createContext, useContext, useState, ReactNode } from 'react';
import { GameContextType, GameState, Player, Difficulty } from '@/types/gameTypes';
import { generateRoomCode, getRandomDialogue, getDifficultyForRound } from '@/data/sampleData';

// Initial game state
const initialGameState: GameState = {
  roomCode: '',
  players: [],
  currentRound: 0,
  maxRounds: 10,
  timeRemaining: 60,
  showHint: false,
  isGameActive: false,
  isRoundActive: false,
  answersSubmitted: {},
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Create a new game room
  const createRoom = (playerName: string) => {
    const roomCode = generateRoomCode();
    const hostPlayer: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      avatar: '👑', // Host gets a crown
      score: 0,
      isHost: true,
    };

    setGameState({
      ...initialGameState,
      roomCode,
      players: [hostPlayer],
    });
  };

  // Join an existing room
  const joinRoom = (roomCode: string, playerName: string) => {
    // For now, we'll just simulate joining by adding a player
    // In a real app, this would verify the room exists
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      avatar: '😎', // Default avatar for joining players
      score: 0,
    };

    setGameState((prevState) => {
      // Prevent joining if game is active or if room is full
      if (prevState.isGameActive || prevState.players.length >= 10) {
        return prevState;
      }

      return {
        ...prevState,
        roomCode,
        players: [...prevState.players, newPlayer],
      };
    });
  };

  // Start the game
  const startGame = () => {
    // Get the first dialogue based on round 1 difficulty
    const difficulty = getDifficultyForRound(1);
    const firstDialogue = getRandomDialogue(difficulty);

    setGameState((prevState) => ({
      ...prevState,
      isGameActive: true,
      isRoundActive: true,
      currentRound: 1,
      currentDialogue: firstDialogue,
      timeRemaining: 60,
      showHint: false,
      answersSubmitted: {},
    }));
  };

  // Submit an answer for a player
  const submitAnswer = (playerId: string, answer: string) => {
    setGameState((prevState) => {
      // Skip if the round is not active or player already answered
      if (!prevState.isRoundActive || prevState.answersSubmitted[playerId]) {
        return prevState;
      }

      const updatedAnswers = {
        ...prevState.answersSubmitted,
        [playerId]: answer,
      };

      // Calculate score if answer is correct
      let updatedPlayers = [...prevState.players];
      if (answer === prevState.currentDialogue?.correctAnswer) {
        // Give more points for faster answers
        const timeBonus = Math.ceil(prevState.timeRemaining / 10);
        const pointsAwarded = 10 + timeBonus;

        updatedPlayers = updatedPlayers.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              score: player.score + pointsAwarded,
            };
          }
          return player;
        });
      }

      return {
        ...prevState,
        players: updatedPlayers,
        answersSubmitted: updatedAnswers,
      };
    });
  };

  // Move to the next round
  const nextRound = () => {
    setGameState((prevState) => {
      const nextRoundNumber = prevState.currentRound + 1;

      // Check if game is over
      if (nextRoundNumber > prevState.maxRounds) {
        return {
          ...prevState,
          isRoundActive: false,
          isGameActive: false,
        };
      }

      // Get new dialogue for the next round
      const difficulty = getDifficultyForRound(nextRoundNumber);
      const nextDialogue = getRandomDialogue(difficulty);

      return {
        ...prevState,
        currentRound: nextRoundNumber,
        currentDialogue: nextDialogue,
        timeRemaining: 60,
        showHint: false,
        isRoundActive: true,
        answersSubmitted: {},
      };
    });
  };

  // Reset the game to initial state
  const resetGame = () => {
    setGameState(initialGameState);
  };

  // Context value
  const contextValue: GameContextType = {
    gameState,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    nextRound,
    resetGame,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

// Custom hook for using the game context
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
