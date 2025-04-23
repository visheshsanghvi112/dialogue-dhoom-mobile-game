
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import PlayerList from "@/components/PlayerList";
import Footer from "@/components/Footer";

const Results = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGameContext();
  const { players, roomCode } = gameState;

  useEffect(() => {
    // If there's no game data, redirect to home
    if (!roomCode) {
      navigate("/");
    }
  }, [roomCode, navigate]);

  const handlePlayAgain = () => {
    navigate("/lobby");
  };

  const handleNewGame = () => {
    resetGame();
    navigate("/");
  };

  // Find the winner (player with highest score)
  const winner = [...players].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 pt-10 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Game Results</h1>

        {winner && (
          <div className="bollywood-card p-6 text-center mb-6">
            <h2 className="text-2xl mb-3">Winner</h2>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-2">{winner.avatar || "🏆"}</span>
              <span className="text-2xl font-bold text-bollywood-gold">{winner.name}</span>
              <span className="text-xl mt-2">{winner.score} points</span>
            </div>
          </div>
        )}

        <div className="my-6">
          <PlayerList players={players} showScores={true} />
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={handlePlayAgain} className="bollywood-primary-button w-full">
            Play Again with Same Players
          </Button>
          <Button
            onClick={handleNewGame}
            variant="outline"
            className="w-full bg-white/80"
          >
            New Game
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Results;
