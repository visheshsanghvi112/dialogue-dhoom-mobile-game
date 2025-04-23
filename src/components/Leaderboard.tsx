
import { Player } from "@/types/gameTypes";

interface LeaderboardProps {
  players: Player[];
  title?: string;
}

const Leaderboard = ({ players, title = "Leaderboard" }: LeaderboardProps) => {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  // Function to determine podium position styling
  const getPodiumStyle = (index: number) => {
    switch (index) {
      case 0: // Gold
        return "bg-gradient-to-r from-yellow-300 to-yellow-100 border-yellow-500";
      case 1: // Silver
        return "bg-gradient-to-r from-gray-300 to-gray-100 border-gray-400";
      case 2: // Bronze
        return "bg-gradient-to-r from-amber-700 to-amber-500 border-amber-800";
      default:
        return "bg-white/80";
    }
  };

  // Function to get trophy or position number
  const getPosition = (index: number) => {
    switch (index) {
      case 0:
        return "🏆";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}`;
    }
  };

  return (
    <div className="bollywood-card w-full max-w-md mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center p-3 rounded-lg border ${getPodiumStyle(
              index
            )} transform transition-all duration-300 hover:scale-[1.02] ${
              index < 3 ? "shadow-md" : ""
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center font-bold">
              {getPosition(index)}
            </div>
            <div className="flex-1 mx-3">
              <div className="flex items-center">
                <span className="text-xl mr-2">{player.avatar}</span>
                <span className="font-semibold">{player.name}</span>
              </div>
            </div>
            <div className="text-xl font-bold">
              {player.score}
              <span className="text-xs font-normal ml-1">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
