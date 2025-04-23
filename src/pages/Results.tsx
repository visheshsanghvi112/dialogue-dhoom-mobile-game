
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/Leaderboard";
import { useGameContext } from "@/context/GameContext";
import { getWinners } from "@/utils/gameUtils";

const Results = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGameContext();
  const { players } = gameState;
  
  // Make sure players is initialized before getting winners
  const winners = players && players.length > 0 ? getWinners(players) : [];

  useEffect(() => {
    // Redirect if no players data
    if (!players || players.length === 0) {
      navigate("/");
    }
  }, [players, navigate]);

  const handlePlayAgain = () => {
    resetGame();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-10 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Game Over!</h1>
          {winners && winners.length > 0 ? (
            winners.length === 1 ? (
              <div className="mt-4 text-center">
                <div className="text-2xl text-bollywood-gold font-bold mb-2">
                  {winners[0].name} is the Bollywood Guru!
                </div>
                <div className="text-5xl mb-3">🏆</div>
                <div className="text-white/80">
                  With {winners[0].score} points
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <div className="text-2xl text-bollywood-gold font-bold mb-2">
                  It's a tie between {winners.map(w => w.name).join(" & ")}!
                </div>
                <div className="text-3xl mb-3">🏆 🏆</div>
                <div className="text-white/80">
                  With {winners[0] && winners[0].score} points each
                </div>
              </div>
            )
          ) : (
            <div className="mt-4 text-center">
              <div className="text-2xl text-bollywood-gold font-bold mb-2">
                No winners yet!
              </div>
            </div>
          )}
        </div>

        {players && players.length > 0 && (
          <div className="mt-8">
            <Leaderboard players={players} title="Final Scores" />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Button 
            onClick={handlePlayAgain}
            className="bollywood-primary-button w-full"
          >
            Play Again
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-white/80"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>

      <div className="mt-12 py-8 text-center">
        <div className="text-white/60 text-sm">
          <p>Thanks for playing Dialogues Ka Jadoo!</p>
          <p>The Ultimate Bollywood Dialogue Guessing Game</p>
        </div>

        {/* Confetti elements */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: [
                "#9b87f5", "#7E69AB", "#FEF7CD", "#FFDEE2",
                "#F2FCE2", "#FEC6A1", "#D6BCFA", "#E5DEFF"
              ][Math.floor(Math.random() * 8)]
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Results;
