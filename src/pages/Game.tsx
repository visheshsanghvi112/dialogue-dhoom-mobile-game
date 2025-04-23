
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DialogueCard from "@/components/DialogueCard";
import AnswerOptions from "@/components/AnswerOptions";
import GameTimer from "@/components/GameTimer";
import WaitingScreen from "@/components/WaitingScreen";
import { useGameContext } from "@/context/GameContext";
import { allPlayersAnswered } from "@/utils/gameUtils";

const Game = () => {
  const navigate = useNavigate();
  const { gameState, submitAnswer, changeAnswer, nextRound } = useGameContext();
  const {
    players,
    currentRound,
    maxRounds,
    currentDialogue,
    timeRemaining,
    showHint,
    isRoundActive,
    isGameActive,
    answersSubmitted,
    waitingForNextRound,
  } = gameState;

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [roundEndTimer, setRoundEndTimer] = useState<number | null>(null);
  const currentPlayer = players[0]; // For now we'll just use the first player (would be current user in real app)

  useEffect(() => {
    if (!isGameActive) {
      navigate("/");
    }
  }, [isGameActive, navigate]);

  useEffect(() => {
    // Reset state for new round
    if (isRoundActive && !showCorrectAnswer) {
      setShowCorrectAnswer(false);
      setRoundEndTimer(null);
    }
  }, [currentRound, isRoundActive]);

  // Provide hint after 30 seconds
  const handleHintTime = () => {
    // The context already handles setting showHint
  };

  // Time's up for answering
  const handleTimeUp = () => {
    setShowCorrectAnswer(true);
    setRoundEndTimer(5); // Show correct answer for 5 seconds
  };

  // Handle player answer submission
  const handleAnswerSubmit = (answer: string) => {
    // If player already answered, it's a change of answer
    if (answersSubmitted[currentPlayer.id]) {
      changeAnswer(currentPlayer.id, answer);
    } else {
      submitAnswer(currentPlayer.id, answer);
    }
    
    // Once all players answer or time's up, show correct answer
    if (allPlayersAnswered(answersSubmitted, players)) {
      setShowCorrectAnswer(true);
      setRoundEndTimer(5); // Show correct answer for 5 seconds
    }
  };

  // Countdown after showing answer
  useEffect(() => {
    if (roundEndTimer === null) return;

    if (roundEndTimer <= 0) {
      if (currentRound >= maxRounds) {
        navigate("/results");
      } else {
        nextRound();
        setShowCorrectAnswer(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setRoundEndTimer(roundEndTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [roundEndTimer, currentRound, maxRounds, navigate, nextRound]);

  if (!currentDialogue) {
    return <div className="text-center p-8 text-white">Loading...</div>;
  }

  const hasAnswered = Boolean(answersSubmitted[currentPlayer.id]);

  return (
    <div className="min-h-screen flex flex-col p-4 pt-8 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="bg-white/90 px-3 py-2 rounded-full text-bollywood-tertiary font-bold">
            Round {currentRound}/{maxRounds}
          </div>
          <div className="font-medium text-white">
            Score: {currentPlayer.score}
          </div>
        </div>
        
        {isRoundActive && !waitingForNextRound && (
          <div className="mt-4">
            <GameTimer
              initialTime={60}
              onTimeUp={handleTimeUp}
              onHintTime={handleHintTime}
              isActive={isRoundActive && !showCorrectAnswer && !waitingForNextRound}
            />
          </div>
        )}
      </div>

      {waitingForNextRound ? (
        <div className="w-full max-w-2xl mx-auto">
          <WaitingScreen
            players={players}
            answersSubmitted={answersSubmitted}
            timeRemaining={null}
            onNextRound={nextRound}
          />
        </div>
      ) : currentDialogue && (
        <>
          <DialogueCard dialogue={currentDialogue} showHint={showHint} />
          
          <div className="w-full max-w-2xl mx-auto">
            <AnswerOptions
              options={currentDialogue.options}
              correctAnswer={showCorrectAnswer ? currentDialogue.correctAnswer : null}
              onSelect={handleAnswerSubmit}
              disabled={showCorrectAnswer}
              selectedAnswer={answersSubmitted[currentPlayer.id]}
            />
          </div>
        </>
      )}

      {showCorrectAnswer && (
        <div className="w-full max-w-md mx-auto mt-4 text-center">
          <div className="bollywood-card bg-bollywood-gold/30">
            {answersSubmitted[currentPlayer.id] === currentDialogue.correctAnswer ? (
              <div className="text-green-600 font-bold text-lg">
                Correct! +{10} points
              </div>
            ) : (
              <div className="text-red-600 font-bold text-lg">
                Wrong answer! The correct movie was:
                <div className="text-xl mt-1">{currentDialogue.correctAnswer}</div>
              </div>
            )}
            
            {roundEndTimer !== null && (
              <div className="mt-2 text-sm">
                Next round in {roundEndTimer} seconds...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
