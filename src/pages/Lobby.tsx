
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RoomCode from "@/components/RoomCode";
import PlayerList from "@/components/PlayerList";
import { useGameContext } from "@/context/GameContext";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

const Lobby = () => {
  const navigate = useNavigate();
  const { gameState, startGame } = useGameContext();
  const { roomCode, players } = gameState;
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the current player and check if they are the host
  const currentHostPlayer = players.find(player => player.isHost);
  const isHost = currentHostPlayer !== undefined && players.some(player => player.isHost && player.id === currentHostPlayer.id);

  // Redirect if no room code (user didn't create/join a room)
  useEffect(() => {
    if (!roomCode) {
      navigate("/");
    }
  }, [roomCode, navigate]);

  const handleStartGame = () => {
    // Start a countdown
    setIsLoading(true);
    setCountdown(3);
  };

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown <= 0) {
      startGame();
      setIsLoading(false);
      navigate("/game");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, startGame, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-10 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Game Lobby</h1>
        
        {roomCode && <RoomCode code={roomCode} />}
        
        <div className="my-6">
          <PlayerList players={players} />
        </div>

        {countdown !== null ? (
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-white mb-4">
              Game starting in...
            </div>
            <div className="text-7xl font-bold text-bollywood-gold animate-pulse-soft">
              {countdown}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {isHost ? (
              <Button 
                onClick={handleStartGame} 
                className="bollywood-primary-button w-full"
                disabled={players.length < 1 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Game"
                )}
              </Button>
            ) : (
              <div className="bollywood-card p-4 text-center">
                <p>Waiting for host to start the game...</p>
                {currentHostPlayer && (
                  <p className="mt-2 text-bollywood-gold font-semibold">
                    {currentHostPlayer.name} {currentHostPlayer.avatar} is the host
                  </p>
                )}
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full bg-white/80" 
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Leave Room
            </Button>
          </div>
        )}
        
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Game will have 10 rounds with increasing difficulty</p>
          <p className="mt-1">Faster answers earn more points!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Lobby;
