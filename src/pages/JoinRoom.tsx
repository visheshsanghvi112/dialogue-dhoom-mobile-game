
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { joinRoom } = useGameContext();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    if (playerName.trim().length < 2) {
      setError("Please enter a name with at least 2 characters");
      return;
    }
    
    if (roomCode.trim().length !== 6) {
      setError("Room code must be 6 characters");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    // For now, we'll just simulate joining
    joinRoom(roomCode.toUpperCase().trim(), playerName.trim());
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/lobby");
    }, 1000);
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only uppercase letters and numbers
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 6);
    setRoomCode(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="bollywood-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Join a Game Room</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium mb-2">
              Room Code
            </label>
            <Input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={handleRoomCodeChange}
              placeholder="Enter 6-digit code"
              className="bollywood-input text-2xl tracking-[0.3em]"
              autoComplete="off"
              maxLength={6}
            />
          </div>
          
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Your Name
            </label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="bollywood-input"
              autoComplete="off"
              maxLength={15}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button 
            onClick={handleJoin} 
            className="bollywood-primary-button w-full"
            disabled={roomCode.length !== 6 || playerName.trim().length < 2 || isLoading}
          >
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
