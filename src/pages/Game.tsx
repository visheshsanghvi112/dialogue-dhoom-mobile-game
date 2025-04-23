import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/context/GameContext";
import { supabase } from "@/integrations/supabase/client";
import DialogueCard from "@/components/DialogueCard";
import AnswerOptions from "@/components/AnswerOptions";
import GameTimer from "@/components/GameTimer";
import WaitingScreen from "@/components/WaitingScreen";
import Footer from "@/components/Footer";

const Game = () => {
  const navigate = useNavigate();
  const { gameState, submitAnswer, changeAnswer, nextRound } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!gameState.isGameActive) {
      navigate("/");
    }
  }, [gameState.isGameActive, navigate]);

  useEffect(() => {
    if (
      !gameState.isRoundActive &&
      !gameState.waitingForNextRound &&
      gameState.currentRound > 0
    ) {
      navigate("/results");
    }
  }, [gameState.isRoundActive, gameState.waitingForNextRound, gameState.currentRound, navigate]);

  const handleAnswerSelect = (answer: string) => {
    if (!userId || !gameState.isRoundActive) return;

    setSelectedAnswer(answer);

    const hasSubmitted = gameState.answersSubmitted[userId];
    if (hasSubmitted) {
      changeAnswer(userId, answer);
    } else {
      submitAnswer(userId, answer);
    }
  };

  const handleTimeUp = () => {
    if (!userId) return;
    
    if (!selectedAnswer) {
      submitAnswer(userId, "skipped");
    }
  };

  const handleHintTime = () => {
    console.log("Hint time reached!");
  };

  const submittedAnswer = userId ? gameState.answersSubmitted[userId] : null;

  return (
    <div className="min-h-screen flex flex-col p-4 pt-8 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <span className="font-medium">Round {gameState.currentRound}</span>
            <span className="text-sm text-white/70"> of {gameState.maxRounds}</span>
          </div>

          {gameState.isRoundActive && !gameState.waitingForNextRound && (
            <GameTimer 
              initialTime={gameState.timeRemaining}
              onTimeUp={handleTimeUp}
              onHintTime={handleHintTime}
              isActive={gameState.isRoundActive}
            />
          )}
        </div>

        {gameState.waitingForNextRound ? (
          <WaitingScreen 
            players={gameState.players} 
            answersSubmitted={gameState.answersSubmitted}
            timeRemaining={null}
            onNextRound={nextRound}
          />
        ) : (
          <>
            {gameState.currentDialogue && (
              <>
                <DialogueCard
                  dialogue={gameState.currentDialogue}
                  showHint={gameState.showHint}
                />

                <div className="mt-6">
                  <AnswerOptions 
                    options={gameState.currentDialogue.options}
                    selectedAnswer={selectedAnswer || submittedAnswer || null}
                    onSelect={handleAnswerSelect}
                    disabled={!gameState.isRoundActive}
                    correctAnswer={
                      gameState.waitingForNextRound 
                        ? gameState.currentDialogue.correctAnswer 
                        : undefined
                    }
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Game;
