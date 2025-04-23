
export type Difficulty = 'easy' | 'medium' | 'hard';

export type User = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type Player = {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isHost?: boolean;
  answerTime?: number; // Timestamp when answer was submitted
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
  roundEndTime?: number; // When the round will end
  answersSubmitted: Record<string, string>; // playerId: selectedAnswer
  answerTimes: Record<string, number>; // playerId: timestamp
  waitingForNextRound: boolean; // Flag for showing the waiting screen
};

export type GameContextType = {
  gameState: GameState;
  createRoom: (playerName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  startGame: () => void;
  submitAnswer: (playerId: string, answer: string) => void;
  changeAnswer: (playerId: string, answer: string) => void;
  nextRound: () => void;
  resetGame: () => void;
};

export type RoomInfo = {
  roomCode: string;
  playersCount: number;
  isActive: boolean;
};

export type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
};
