
import { Dialogue } from "@/types/gameTypes";
import { useState, useEffect } from "react";

interface DialogueCardProps {
  dialogue: Dialogue;
  showHint: boolean;
}

const DialogueCard = ({ dialogue, showHint }: DialogueCardProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Reset animation when dialogue changes
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timeout);
  }, [dialogue.id]);

  return (
    <div className={`w-full max-w-2xl mx-auto my-6 transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <div className="bollywood-card">
        <div className="flex justify-between items-center mb-2">
          <span className="px-3 py-1 rounded-full bg-bollywood-primary/20 text-bollywood-primary text-xs font-medium">
            {dialogue.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 
                dialogue.difficulty === 'easy' ? 'rgba(74, 222, 128, 0.2)' : 
                dialogue.difficulty === 'medium' ? 'rgba(250, 204, 21, 0.2)' : 
                'rgba(248, 113, 113, 0.2)',
              color:
                dialogue.difficulty === 'easy' ? 'rgb(34, 197, 94)' : 
                dialogue.difficulty === 'medium' ? 'rgb(234, 179, 8)' : 
                'rgb(239, 68, 68)'
            }}
          >
            {dialogue.difficulty}
          </span>
        </div>
        
        <blockquote className="bollywood-dialogue relative">
          <span className="text-5xl text-bollywood-primary/20 absolute top-0 left-2">"</span>
          {dialogue.text}
          <span className="text-5xl text-bollywood-primary/20 absolute bottom-0 right-2">"</span>
        </blockquote>

        {showHint && (
          <div className="mt-4 p-3 bg-bollywood-gold/30 rounded-lg border border-bollywood-gold animate-pulse-soft">
            <p className="text-center font-medium text-sm">
              <span className="block text-xs uppercase tracking-wider mb-1 opacity-70">Hint</span>
              {dialogue.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueCard;
