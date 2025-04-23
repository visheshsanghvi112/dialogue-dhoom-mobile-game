
import { useEffect, useState } from "react";
import { Player } from "@/types/gameTypes";
import { Clock, Check, Loader } from "lucide-react";

interface WaitingScreenProps {
  players: Player[];
  answersSubmitted: Record<string, string>;
  timeRemaining: number | null;
  onNextRound?: () => void;
}

const WaitingScreen = ({
  players,
  answersSubmitted,
  timeRemaining,
  onNextRound
}: WaitingScreenProps) => {
  const [autoProgress, setAutoProgress] = useState(5);
  const totalPlayers = players.length;
  const answeredPlayers = Object.keys(answersSubmitted).length;
  
  // Auto progress to next round if all players answered
  useEffect(() => {
    if (answeredPlayers === totalPlayers) {
      const timer = setInterval(() => {
        setAutoProgress((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (onNextRound) onNextRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [answeredPlayers, totalPlayers, onNextRound]);
  
  return (
    <div className="bollywood-card p-6 text-center">
      <h3 className="text-xl font-bold mb-4">Waiting for all players...</h3>
      
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="text-3xl font-bold">
          {answeredPlayers}/{totalPlayers}
        </div>
        <div className="text-lg">players answered</div>
      </div>
      
      {timeRemaining !== null && (
        <div className="flex justify-center items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-bollywood-accent" />
          <div className="text-lg">
            {timeRemaining} seconds remaining
          </div>
        </div>
      )}
      
      <div className="space-y-3 mt-4">
        {players.map((player) => (
          <div 
            key={player.id} 
            className="flex justify-between items-center p-3 bg-white/10 rounded-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{player.avatar || "👤"}</span>
              <span>{player.name}</span>
            </div>
            {answersSubmitted[player.id] ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Loader className="h-5 w-5 text-orange-500 animate-spin" />
            )}
          </div>
        ))}
      </div>
      
      {answeredPlayers === totalPlayers && (
        <div className="mt-6 text-bollywood-accent">
          Next round in {autoProgress} seconds...
        </div>
      )}
    </div>
  );
};

export default WaitingScreen;
