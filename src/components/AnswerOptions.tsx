
import { useState } from "react";

interface AnswerOptionsProps {
  options: string[];
  correctAnswer: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string;
}

const AnswerOptions = ({
  options,
  correctAnswer,
  onSelect,
  disabled = false,
  selectedAnswer,
}: AnswerOptionsProps) => {
  const [selected, setSelected] = useState<string | null>(selectedAnswer || null);

  const handleSelect = (answer: string) => {
    if (disabled || selected) return;
    
    setSelected(answer);
    onSelect(answer);
  };

  const getButtonStyle = (option: string) => {
    // If no selection has been made yet
    if (!selected && !correctAnswer) {
      return "bg-white border-bollywood-secondary";
    }

    // If this is the correct answer and we're showing results
    if (correctAnswer && option === correctAnswer) {
      return "bg-bollywood-correct border-green-500 font-bold";
    }

    // If this was selected but is incorrect
    if (selected === option && option !== correctAnswer && correctAnswer) {
      return "bg-bollywood-incorrect border-red-500 text-white";
    }

    // If this was selected (and we're not showing results yet)
    if (selected === option && !correctAnswer) {
      return "bg-bollywood-primary/30 border-bollywood-primary";
    }

    // Default state for unselected options when showing results
    if (correctAnswer) {
      return "bg-white/50 border-gray-300 opacity-70";
    }

    // Default state for unselected options
    return "bg-white border-bollywood-secondary";
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-2 my-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleSelect(option)}
          disabled={disabled || !!selected}
          className={`bollywood-answer ${getButtonStyle(option)} ${
            disabled ? "opacity-80 cursor-not-allowed" : ""
          }`}
        >
          <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-bollywood-primary/20 text-bollywood-primary font-bold">
            {String.fromCharCode(65 + index)}
          </span>
          {option}
        </button>
      ))}
    </div>
  );
};

export default AnswerOptions;
