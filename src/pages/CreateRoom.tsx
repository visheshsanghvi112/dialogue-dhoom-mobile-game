
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useAuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateRoom = () => {
  const navigate = useNavigate();
  const { createRoom } = useGameContext();
  const { authState } = useAuthContext();
  const [playerName, setPlayerName] = useState(authState.user?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (playerName.trim().length < 2) {
      setError("Please enter a name with at least 2 characters");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createRoom(playerName.trim());
      navigate("/lobby");
    } catch (e: any) {
      setError(e.message || "Failed to create room");
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This name will be visible to other players
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleCreate} 
            className="bollywood-primary-button w-full"
            disabled={playerName.trim().length < 2 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Room...
              </>
            ) : (
              "Create Room"
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Back to Home
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRoom;
