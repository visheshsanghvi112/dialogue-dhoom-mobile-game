
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
  answerTimes: {},
  waitingForNextRound: false,
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
      answerTimes: {},
      waitingForNextRound: false,
      roundEndTime: Date.now() + 60000, // 60 seconds from now
    }));
  };

  // Submit an answer for a player
  const submitAnswer = (playerId: string, answer: string) => {
    setGameState((prevState) => {
      // Skip if the round is not active or player already answered
      if (!prevState.isRoundActive) {
        return prevState;
      }

      const now = Date.now();
      const updatedAnswers = {
        ...prevState.answersSubmitted,
        [playerId]: answer,
      };
      
      const updatedAnswerTimes = {
        ...prevState.answerTimes,
        [playerId]: now,
      };

      // Calculate score if answer is correct
      let updatedPlayers = [...prevState.players];
      if (answer === prevState.currentDialogue?.correctAnswer) {
        // Give more points for faster answers
        const elapsedSeconds = prevState.roundEndTime ? 
          Math.max(0, 60 - (now - (prevState.roundEndTime - 60000)) / 1000) : 
          prevState.timeRemaining;
        
        const timeBonus = Math.ceil(elapsedSeconds / 10);
        const pointsAwarded = 10 + timeBonus;

        updatedPlayers = updatedPlayers.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              score: player.score + pointsAwarded,
              answerTime: now,
            };
          }
          return player;
        });
      } else {
        // Still record answer time for incorrect answers
        updatedPlayers = updatedPlayers.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              answerTime: now,
            };
          }
          return player;
        });
      }

      // Check if all players have answered
      const allAnswered = updatedPlayers.length === Object.keys(updatedAnswers).length;
      
      return {
        ...prevState,
        players: updatedPlayers,
        answersSubmitted: updatedAnswers,
        answerTimes: updatedAnswerTimes,
        waitingForNextRound: allAnswered,
      };
    });
  };
  
  // Change an already submitted answer
  const changeAnswer = (playerId: string, answer: string) => {
    setGameState((prevState) => {
      // Skip if the round is not active
      if (!prevState.isRoundActive) {
        return prevState;
      }
      
      // Update the answer
      const updatedAnswers = {
        ...prevState.answersSubmitted,
        [playerId]: answer,
      };
      
      // Update the answer time
      const now = Date.now();
      const updatedAnswerTimes = {
        ...prevState.answerTimes,
        [playerId]: now,
      };
      
      // Recalculate score
      let updatedPlayers = [...prevState.players];
      
      // First, remove any previous points for this question
      const previousAnswer = prevState.answersSubmitted[playerId];
      if (previousAnswer === prevState.currentDialogue?.correctAnswer) {
        // Find how many points were awarded for the previous correct answer
        const player = prevState.players.find(p => p.id === playerId);
        if (player) {
          const prevElapsedSeconds = prevState.roundEndTime ?
            Math.max(0, 60 - (player.answerTime || 0 - (prevState.roundEndTime - 60000)) / 1000) :
            prevState.timeRemaining;
          
          const prevTimeBonus = Math.ceil(prevElapsedSeconds / 10);
          const prevPointsAwarded = 10 + prevTimeBonus;
          
          // Remove these points
          updatedPlayers = updatedPlayers.map((p) => {
            if (p.id === playerId) {
              return {
                ...p,
                score: p.score - prevPointsAwarded,
              };
            }
            return p;
          });
        }
      }
      
      // Now add points if the new answer is correct
      if (answer === prevState.currentDialogue?.correctAnswer) {
        const elapsedSeconds = prevState.roundEndTime ?
          Math.max(0, 60 - (now - (prevState.roundEndTime - 60000)) / 1000) :
          prevState.timeRemaining;
        
        const timeBonus = Math.ceil(elapsedSeconds / 10);
        const pointsAwarded = 10 + timeBonus;
        
        updatedPlayers = updatedPlayers.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              score: player.score + pointsAwarded,
              answerTime: now,
            };
          }
          return player;
        });
      } else {
        // Still record answer time for incorrect answers
        updatedPlayers = updatedPlayers.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              answerTime: now,
            };
          }
          return player;
        });
      }
      
      return {
        ...prevState,
        players: updatedPlayers,
        answersSubmitted: updatedAnswers,
        answerTimes: updatedAnswerTimes,
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
          waitingForNextRound: false,
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
        waitingForNextRound: false,
        answersSubmitted: {},
        answerTimes: {},
        roundEndTime: Date.now() + 60000, // 60 seconds from now
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
    changeAnswer,
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
