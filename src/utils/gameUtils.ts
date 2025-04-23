
import { Player } from "@/types/gameTypes";

// Generate a random avatar emoji
export const generateAvatar = (): string => {
  const avatars = [
    "😎", "🤩", "😊", "🧐", "🤠", "👻", "🤓", "👽", "🤖", 
    "👑", "🐱", "🦊", "🐶", "🐼", "🐯", "🦁", "🐮", "🐵"
  ];
  
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Calculate score for a correct answer based on time remaining
export const calculateScore = (timeRemaining: number): number => {
  // Base score of 10 points, plus bonus for speed (max 10 bonus points)
  const timeBonus = Math.ceil(timeRemaining / 6);
  return 10 + timeBonus;
};

// Get winner(s) - can handle ties
export const getWinners = (players: Player[]): Player[] => {
  if (players.length === 0) return [];
  
  // Find the highest score
  const highestScore = Math.max(...players.map(p => p.score));
  
  // Return all players with the highest score (handles ties)
  return players.filter(player => player.score === highestScore);
};

// Shuffle an array (for randomizing answer options)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Check if all players have submitted their answers
export const allPlayersAnswered = (answersSubmitted: Record<string, string>, players: Player[]): boolean => {
  return Object.keys(answersSubmitted).length === players.length;
};

// Format time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
