
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Player = {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isHost?: boolean;
};

export type Dialogue = {
  id: string;
  text: string;
  movie: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
  category?: DialogueCategory;
  difficulty: Difficulty;
};

export type DialogueCategory = 'hero' | 'villain' | 'romantic' | 'comedy';

export type GameState = {
  roomCode: string;
  players: Player[];
  currentRound: number;
  maxRounds: number;
  currentDialogue?: Dialogue;
  timeRemaining: number;
  showHint: boolean;
  isGameActive: boolean;
  isRoundActive: boolean;
  answersSubmitted: Record<string, string>; // playerId: selectedAnswer
};

export type GameContextType = {
  gameState: GameState;
  createRoom: (playerName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  startGame: () => void;
  submitAnswer: (playerId: string, answer: string) => void;
  nextRound: () => void;
  resetGame: () => void;
};

export type RoomInfo = {
  roomCode: string;
  playersCount: number;
  isActive: boolean;
};
