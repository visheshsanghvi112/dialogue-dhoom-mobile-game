
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useAuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { joinRoom } = useGameContext();
  const { authState } = useAuthContext();
  const [playerName, setPlayerName] = useState(authState.user?.username || "");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
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
    try {
      await joinRoom(roomCode.toUpperCase().trim(), playerName.trim());
      navigate("/lobby");
    } catch (e: any) {
      setError(e.message || "Failed to join room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              className="bollywood-input text-2xl tracking-[0.3em] text-center"
              autoComplete="off"
              maxLength={6}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleJoin} 
            className="bollywood-primary-button w-full"
            disabled={roomCode.length !== 6 || playerName.trim().length < 2 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Room"
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

export default JoinRoom;
