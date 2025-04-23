
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
          <span className="text-bollywood-gold">Dialogues</span> Ka{" "}
          <span className="text-bollywood-accent">Jadoo</span>
        </h1>
        <p className="text-white/80 text-lg md:text-xl">
          The Ultimate Bollywood Dialogue Guessing Game
        </p>
      </div>

      <div className="bollywood-card w-full max-w-md p-8 shadow-2xl">
        <div className="flex flex-col gap-4">
          <Button 
            className="bollywood-primary-button h-14 text-lg"
            onClick={() => navigate("/create-room")}
          >
            Create Room
          </Button>
          <Button 
            className="bollywood-secondary-button h-14 text-lg"
            onClick={() => navigate("/join-room")} 
          >
            Join Room
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Create a room and invite your friends to play!
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Test your Bollywood knowledge with famous movie dialogues.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-white/60 text-xs">
        <p>Up to 10 players • 10 rounds • Increasing difficulty</p>
        <p className="mt-1">Famous dialogues from Hero, Villain, Romance & Comedy scenes</p>
      </div>
    </div>
  );
};

export default Index;
