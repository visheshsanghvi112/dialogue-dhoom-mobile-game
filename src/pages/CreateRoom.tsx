
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

const CreateRoom = () => {
  const navigate = useNavigate();
  const { createRoom } = useGameContext();
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    if (playerName.trim().length < 2) return;
    
    setIsLoading(true);
    createRoom(playerName.trim());
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/lobby");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="bollywood-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create a New Game Room</h1>
        
        <div className="space-y-6">
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
              maxLength={15}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">
              This name will be visible to other players
            </p>
          </div>
          
          <Button 
            onClick={handleCreate} 
            className="bollywood-primary-button w-full"
            disabled={playerName.trim().length < 2 || isLoading}
          >
            {isLoading ? "Creating Room..." : "Create Room"}
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

export default CreateRoom;
