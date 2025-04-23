
import { Player } from "@/types/gameTypes";
import { useState, useEffect } from "react";

interface PlayerListProps {
  players: Player[];
  showScores?: boolean;
}

const PlayerList = ({ players, showScores = false }: PlayerListProps) => {
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([...players]);

  // Sort players by score when showScores is true
  useEffect(() => {
    if (showScores) {
      setSortedPlayers([...players].sort((a, b) => b.score - a.score));
    } else {
      // Put host at the top, then alphabetically
      setSortedPlayers(
        [...players].sort((a, b) => {
          if (a.isHost && !b.isHost) return -1;
          if (!a.isHost && b.isHost) return 1;
          return a.name.localeCompare(b.name);
        })
      );
    }
  }, [players, showScores]);

  return (
    <div className="bollywood-card w-full max-w-md mx-auto">
      <h3 className="text-center font-semibold mb-2">
        {showScores ? "Leaderboard" : "Players"} ({players.length}/10)
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              showScores
                ? index === 0
                  ? "bg-bollywood-gold/60 border border-yellow-500"
                  : "bg-white/50"
                : player.isHost
                ? "bg-bollywood-primary/20 border border-bollywood-primary/30"
                : "bg-white/50"
            }`}
          >
            <div className="flex items-center">
              {showScores && <span className="text-lg font-bold mr-2">{index + 1}</span>}
              <span className="text-xl mr-2">{player.avatar}</span>
              <span className="font-medium">
                {player.name} {player.isHost && <span className="text-xs">(Host)</span>}
              </span>
            </div>
            {showScores && (
              <span className="font-bold text-lg text-bollywood-primary">
                {player.score}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
