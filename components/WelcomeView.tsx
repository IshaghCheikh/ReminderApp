
import React from 'react';
import { SunIcon } from './icons';

interface WelcomeViewProps {
  onStart: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      <SunIcon className="w-24 h-24 text-yellow-400 mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">
        {getGreeting()}
      </h1>
      <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-md">
        It's a new day, full of possibilities. What's your plan to make it amazing?
      </p>
      <button
        onClick={onStart}
        className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Let's Plan My Day
      </button>
    </div>
  );
};

export default WelcomeView;
