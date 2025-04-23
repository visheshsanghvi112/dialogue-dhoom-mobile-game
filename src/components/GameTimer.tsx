
import { useState, useEffect } from "react";

interface GameTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  onHintTime?: () => void;
  isActive: boolean;
}

const GameTimer = ({
  initialTime,
  onTimeUp,
  onHintTime,
  isActive,
}: GameTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [showHintAnimation, setShowHintAnimation] = useState(false);

  useEffect(() => {
    setTimeRemaining(initialTime);
    setShowHintAnimation(false);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        
        // If we hit the hint time (30 seconds left)
        if (prev === 30 && onHintTime) {
          setShowHintAnimation(true);
          onHintTime();
          setTimeout(() => setShowHintAnimation(false), 2000);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, isActive, onTimeUp, onHintTime]);

  const getTimerColor = () => {
    if (timeRemaining > 30) return "text-green-600";
    if (timeRemaining > 10) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressPercent = () => {
    return (timeRemaining / initialTime) * 100;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear rounded-full"
          style={{
            width: `${getProgressPercent()}%`,
            backgroundColor:
              timeRemaining > 30
                ? "#4ade80"
                : timeRemaining > 10
                ? "#facc15"
                : "#f87171",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${getTimerColor()}`}>
            {Math.floor(timeRemaining / 60)}:
            {String(timeRemaining % 60).padStart(2, "0")}
          </span>
        </div>
      </div>
      
      {showHintAnimation && (
        <div className="mt-2 text-center text-sm animate-bounce text-bollywood-gold">
          Hint is available now!
        </div>
      )}
    </div>
  );
};

export default GameTimer;
