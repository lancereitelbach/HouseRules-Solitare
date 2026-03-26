import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  color: 'red' | 'black';
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  swayAmplitude: number;
  width: number;
  height: number;
}

export const WinScreen: React.FC = () => {
  const { stats, dealGame, startDrawSel, goToStart, recordWin } = useGameState();
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  const elapsed = stats.currentGameStartTime 
    ? Math.floor(((stats.currentGameFrozenTime || Date.now()) - stats.currentGameStartTime) / 1000)
    : 0;
  
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  
  const newGamesPlayed = stats.gamesPlayed + 1;
  const newGamesWon = stats.gamesWon + 1;
  const newWinRate = Math.round((newGamesWon / newGamesPlayed) * 100);

  // Generate confetti on mount
  useEffect(() => {
    const particles: ConfettiParticle[] = [];
    
    // Create 50 confetti particles - burst from top center
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        color: Math.random() > 0.5 ? 'red' : 'black',
        x: 50 + (Math.random() - 0.5) * 60, // Burst from center
        delay: Math.random() * 0.4, // Tighter burst timing
        duration: 4 + Math.random() * 3, // Slower fall (4-7 seconds)
        rotation: Math.random() * 720 - 360,
        swayAmplitude: 15 + Math.random() * 25, // Less sway
        width: 6 + Math.random() * 6,
        height: 10 + Math.random() * 12,
      });
    }
    
    setConfetti(particles);
  }, []);

  const handlePlayAgain = () => {
    recordWin();
    dealGame(startDrawSel);
  };

  const handleGoHome = () => {
    recordWin();
    goToStart();
  };

  const springConfig = {
    type: "spring" as const,
    damping: 25,
    stiffness: 200,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center p-8 bg-ink-900 bg-opacity-70 backdrop-blur-md overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...springConfig, delay: 0.1 }}
        className="w-full max-w-md bg-felt-dark bg-opacity-90 backdrop-blur-sm rounded-2xl border border-paper-300 border-opacity-20 p-12 relative z-10"
      >
        {/* Medal Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateZ: -20 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ ...springConfig, delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            {/* Medal circle with gradient and shine */}
            <div className="w-20 h-20 rounded-full border-4 border-accent-gold flex items-center justify-center bg-gradient-to-br from-accent-gold via-amber-600 to-yellow-700 shadow-xl relative overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-30" />
              
              {/* Star icon */}
              <svg 
                width="36" 
                height="36" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="text-paper-100 relative z-10"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            
            {/* Ribbon */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-12 flex gap-1">
              <div className="w-3 bg-accent-crimson transform -rotate-12 origin-top shadow-md" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 90%)' }} />
              <div className="w-3 bg-accent-crimson transform rotate-12 origin-top shadow-md" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%)' }} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-5xl font-serif text-paper-100 mb-3 tracking-wide" style={{ letterSpacing: '0.05em' }}>
            You <span className="italic font-light">Win</span>
          </h2>
          <p className="text-xs font-mono text-ink-500 tracking-ui uppercase">
            Game Complete
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <div className="bg-ink-900 bg-opacity-40 backdrop-blur-sm rounded-lg border border-paper-300 border-opacity-10 p-4">
            <p className="text-xs font-mono text-ink-500 tracking-ui uppercase mb-2">Time</p>
            <p className="text-3xl font-serif text-paper-100 font-light">{minutes}:{seconds}</p>
          </div>
          <div className="bg-ink-900 bg-opacity-40 backdrop-blur-sm rounded-lg border border-paper-300 border-opacity-10 p-4">
            <p className="text-xs font-mono text-ink-500 tracking-ui uppercase mb-2">Moves</p>
            <p className="text-3xl font-serif text-paper-100 font-light">{stats.currentGameMoves}</p>
          </div>
          <div className="bg-ink-900 bg-opacity-40 backdrop-blur-sm rounded-lg border border-paper-300 border-opacity-10 p-4">
            <p className="text-xs font-mono text-ink-500 tracking-ui uppercase mb-2">Games Won</p>
            <p className="text-3xl font-serif text-accent-gold font-light">{newGamesWon}</p>
          </div>
          <div className="bg-ink-900 bg-opacity-40 backdrop-blur-sm rounded-lg border border-paper-300 border-opacity-10 p-4">
            <p className="text-xs font-mono text-ink-500 tracking-ui uppercase mb-2">Win Rate</p>
            <p className="text-3xl font-serif text-accent-gold font-light">{newWinRate}%</p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 px-8 bg-paper-100 border border-paper-100 rounded-lg
                       font-mono text-sm tracking-ui uppercase text-ink-900
                       hover:bg-paper-200 transition-all duration-200"
          >
            Play Again
          </button>
          <button
            onClick={handleGoHome}
            className="w-full py-4 px-8 bg-transparent border border-paper-300 border-opacity-30 rounded-lg
                       font-mono text-sm tracking-ui uppercase text-ink-500
                       hover:border-paper-300 hover:border-opacity-50 transition-all duration-200"
          >
            Return Home
          </button>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-xs font-mono text-ink-500 tracking-ui text-center mt-6 opacity-60"
        >
          <span className="text-paper-300">Space</span> to play again · <span className="text-paper-300">Esc</span> to quit
        </motion.p>
      </motion.div>

      {/* Confetti particles - rendered AFTER modal so they appear on top */}
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -100, opacity: 0, rotateZ: 0 }}
          animate={{ 
            y: window.innerHeight + 100,
            x: [0, particle.swayAmplitude, -particle.swayAmplitude, particle.swayAmplitude, 0],
            opacity: [0, 1, 1, 1, 1, 0.8, 0],
            rotateZ: particle.rotation,
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: "easeIn", // Gravity effect
            opacity: {
              times: [0, 0.05, 0.2, 0.5, 0.8, 0.95, 1],
              ease: "easeOut",
            },
            x: {
              duration: particle.duration,
              times: [0, 0.25, 0.5, 0.75, 1],
              ease: "easeInOut",
            },
            rotateZ: {
              duration: particle.duration * 1.2,
              ease: "linear",
            }
          }}
          className="absolute pointer-events-none rounded-sm"
          style={{
            left: `${particle.x}%`,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            backgroundColor: particle.color === 'red' ? '#b83a3a' : '#2b2822',
            zIndex: 100,
          }}
        />
      ))}
    </motion.div>
  );
};
