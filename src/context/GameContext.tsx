import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameContextType, GameState, Player, Difficulty } from "@/types/gameTypes";

const initialGameState: GameState = {
  roomCode: "",
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

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const createRoom = async (playerName: string) => {
    const { data, error } = await supabase
      .rpc("generate_unique_room_code", {})
    if (error) throw new Error("Failed to generate room code");

    const code = data;
    const { data: userInfo } = await supabase.auth.getUser();
    if (!userInfo.user) throw new Error("Not authenticated");

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({
        code,
        host_id: userInfo.user.id,
        is_active: true,
        max_players: 10,
        max_rounds: 10,
      })
      .select()
      .single();

    if (roomError) throw new Error("Failed to create room");

    const avatar = "👑";
    await supabase.from("room_players").insert({
      room_id: room.id,
      user_id: userInfo.user.id,
      score: 0,
      avatar,
    });
    await supabase
      .from("profiles")
      .update({ username: playerName, avatar })
      .eq("id", userInfo.user.id);

    setGameState({
      ...initialGameState,
      roomCode: code,
      players: [{
        id: userInfo.user.id,
        name: playerName,
        avatar,
        score: 0,
        isHost: true,
      }],
    });
  };

  const joinRoom = async (roomCode: string, playerName: string) => {
    const { data: room, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode)
      .single();
    if (error || !room) throw new Error("Room not found");

    const { data: userInfo } = await supabase.auth.getUser();
    if (!userInfo.user) throw new Error("Not authenticated");

    const { data: existing } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", room.id)
      .eq("user_id", userInfo.user.id)
      .maybeSingle();

    const avatar = "😎";
    if (!existing) {
      await supabase.from("room_players").insert({
        room_id: room.id,
        user_id: userInfo.user.id,
        score: 0,
        avatar,
      });
    }

    await supabase
      .from("profiles")
      .update({ username: playerName, avatar })
      .eq("id", userInfo.user.id);

    const { data: playerRows } = await supabase
      .from("room_players")
      .select("user_id, score, avatar, user:profiles(username)")
      .eq("room_id", room.id);

    const players = (playerRows || []).map((row: any) => ({
      id: row.user_id,
      name: row.user?.username || "Player",
      avatar: row.avatar,
      score: row.score,
      isHost: room.host_id === row.user_id,
    }));

    setGameState((prev) => ({
      ...prev,
      roomCode,
      players,
    }));
  };

  const startGame = () => {
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
      roundEndTime: Date.now() + 60000,
    }));
  };

  const submitAnswer = (playerId: string, answer: string) => {
    setGameState((prevState) => {
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

      let updatedPlayers = [...prevState.players];
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

  const changeAnswer = (playerId: string, answer: string) => {
    setGameState((prevState) => {
      if (!prevState.isRoundActive) {
        return prevState;
      }
      
      const updatedAnswers = {
        ...prevState.answersSubmitted,
        [playerId]: answer,
      };
      
      const now = Date.now();
      const updatedAnswerTimes = {
        ...prevState.answerTimes,
        [playerId]: now,
      };
      
      let updatedPlayers = [...prevState.players];
      
      const previousAnswer = prevState.answersSubmitted[playerId];
      if (previousAnswer === prevState.currentDialogue?.correctAnswer) {
        const player = prevState.players.find(p => p.id === playerId);
        if (player) {
          const prevElapsedSeconds = prevState.roundEndTime ?
            Math.max(0, 60 - (player.answerTime || 0 - (prevState.roundEndTime - 60000)) / 1000) :
            prevState.timeRemaining;
          
          const prevTimeBonus = Math.ceil(prevElapsedSeconds / 10);
          const prevPointsAwarded = 10 + prevTimeBonus;
          
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

  const nextRound = () => {
    setGameState((prevState) => {
      const nextRoundNumber = prevState.currentRound + 1;

      if (nextRoundNumber > prevState.maxRounds) {
        return {
          ...prevState,
          isRoundActive: false,
          isGameActive: false,
          waitingForNextRound: false,
        };
      }

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
        roundEndTime: Date.now() + 60000,
      };
    });
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

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

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
