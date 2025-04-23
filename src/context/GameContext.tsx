
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameContextType, GameState, Player, Difficulty } from "@/types/gameTypes";
import { getDifficultyForRound, getRandomDialogue } from "@/data/sampleData";
import { toast } from "@/components/ui/use-toast";

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
  
  useEffect(() => {
    if (!gameState.roomCode) return;
    
    const channel = supabase
      .channel('room_player_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'room_players'
        },
        (payload) => {
          console.log('Room player change detected:', payload);
          if (gameState.roomCode) {
            refreshPlayers(gameState.roomCode);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameState.roomCode]);
  
  const refreshPlayers = async (roomCode: string) => {
    try {
      const { data: room } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode)
        .single();
        
      if (!room) {
        toast({
          title: "Error",
          description: "Room not found",
          variant: "destructive",
        });
        return;
      }
      
      const { data: playerRows } = await supabase
        .from("room_players")
        .select("user_id, score, avatar, user:profiles(username)")
        .eq("room_id", room.id);
        
      if (!playerRows) {
        toast({
          title: "Error",
          description: "Failed to fetch players",
          variant: "destructive",
        });
        return;
      }
      
      const updatedPlayers = playerRows.map((row: any) => ({
        id: row.user_id,
        name: row.user?.username || "Player",
        avatar: row.avatar,
        score: row.score,
        isHost: room.host_id === row.user_id,
      }));
      
      console.log("Updated players list:", updatedPlayers);
      
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers
      }));
    } catch (error) {
      console.error("Error refreshing players:", error);
      toast({
        title: "Error",
        description: "Failed to refresh player list",
        variant: "destructive",
      });
    }
  };

  const createRoom = async (playerName: string) => {
    try {
      const { data: generatedCode, error: codeError } = await supabase
        .rpc("generate_unique_room_code");
        
      if (codeError) {
        console.error("Failed to generate room code:", codeError);
        throw new Error("Could not generate a unique room code. Please try again.");
      }

      if (!generatedCode || generatedCode.length !== 6) {
        throw new Error("Invalid room code generated");
      }

      console.log("Generated unique room code:", generatedCode);

      const { data: userInfo, error: userError } = await supabase.auth.getUser();
      if (userError || !userInfo.user) {
        console.error("Authentication error:", userError);
        throw new Error("You must be logged in to create a room");
      }

      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert({
          code: generatedCode,
          host_id: userInfo.user.id,
          is_active: true,
          max_players: 10,
          max_rounds: 10,
        })
        .select()
        .single();

      if (roomError) {
        console.error("Room creation error:", roomError);
        throw new Error("Failed to create game room. Please try again.");
      }

      const avatar = "👑";
      const { error: playerError } = await supabase.from("room_players").insert({
        room_id: room.id,
        user_id: userInfo.user.id,
        score: 0,
        avatar,
      });

      if (playerError) {
        console.error("Failed to add player to room:", playerError);
        throw new Error("Could not join the created room");
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username: playerName, avatar })
        .eq("id", userInfo.user.id);

      if (profileError) {
        console.error("Failed to update profile:", profileError);
      }

      toast({
        title: "Room Created!",
        description: `Your room code is ${generatedCode}`,
      });

      setGameState({
        ...initialGameState,
        roomCode: generatedCode,
        players: [{
          id: userInfo.user.id,
          name: playerName,
          avatar,
          score: 0,
          isHost: true,
        }],
      });

      setTimeout(() => refreshPlayers(generatedCode), 500);

    } catch (error: any) {
      console.error("Create room error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
      });
      throw error;
    }
  };

  const joinRoom = async (roomCode: string, playerName: string) => {
    try {
      const { data: room, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode.toUpperCase())
        .eq("is_active", true)
        .single();
        
      if (error || !room) {
        console.error("Room not found or inactive:", error);
        throw new Error("Room not found or no longer active");
      }

      const { data: userInfo, error: userError } = await supabase.auth.getUser();
      if (userError || !userInfo.user) {
        console.error("Authentication error:", userError);
        throw new Error("You must be logged in to join a room");
      }

      // Fixed: Get the exact count of players in the room
      const { data: playerRows, error: countError } = await supabase
        .from("room_players")
        .select("*")
        .eq("room_id", room.id);
        
      if (countError) {
        console.error("Error checking room capacity:", countError);
        throw new Error("Could not verify room capacity");
      }
      
      const playerCount = playerRows ? playerRows.length : 0;
      console.log(`Room ${roomCode} has ${playerCount} players out of ${room.max_players} max`);
      
      if (playerCount >= room.max_players) {
        throw new Error(`Room is full (max ${room.max_players} players)`);
      }

      const { data: existingPlayer } = await supabase
        .from("room_players")
        .select("*")
        .eq("room_id", room.id)
        .eq("user_id", userInfo.user.id)
        .maybeSingle();

      const avatar = room.host_id === userInfo.user.id ? "👑" : "😎";

      if (!existingPlayer) {
        const { error: joinError } = await supabase.from("room_players").insert({
          room_id: room.id,
          user_id: userInfo.user.id,
          score: 0,
          avatar,
        });

        if (joinError) {
          console.error("Failed to join room:", joinError);
          throw new Error("Could not join the room");
        }
      } else {
        console.log("User already in room, updating profile");
        const { error: updateError } = await supabase
          .from("room_players")
          .update({ avatar })
          .eq("room_id", room.id)
          .eq("user_id", userInfo.user.id);
          
        if (updateError) {
          console.error("Failed to update player:", updateError);
        }
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username: playerName, avatar })
        .eq("id", userInfo.user.id);

      if (profileError) {
        console.error("Failed to update profile:", profileError);
      }

      const { data: playerRows, error: playersError } = await supabase
        .from("room_players")
        .select("user_id, score, avatar, user:profiles(username)")
        .eq("room_id", room.id);

      if (playersError) {
        console.error("Failed to get room players:", playersError);
        throw new Error("Could not retrieve room players");
      }

      const players = (playerRows || []).map((row: any) => ({
        id: row.user_id,
        name: row.user?.username || "Player",
        avatar: row.avatar,
        score: row.score,
        isHost: room.host_id === row.user_id,
      }));

      toast({
        title: "Room Joined!",
        description: `You've joined room ${roomCode.toUpperCase()}`,
      });

      setGameState((prev) => ({
        ...prev,
        roomCode: roomCode.toUpperCase(),
        players,
      }));
      
      setTimeout(() => refreshPlayers(roomCode.toUpperCase()), 500);
      
    } catch (error: any) {
      console.error("Join room error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join room",
        variant: "destructive",
      });
      throw error;
    }
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
