'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFocusStore } from '@/store/focus-store';
import { cn } from '@/lib/utils';

export function Timer() {
  const { 
    isActive,
    isPaused,
    timeLeft,
    currentMode,
    sessions,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    tick
  } = useFocusStore();

  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, tick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8"
    >
      <motion.div
        className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 flex items-center justify-center rounded-full liquid-card interactive-glow"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full",
            currentMode === 'pomodoro' && "bg-primary/5",
            currentMode === 'shortBreak' && "bg-blue-500/5",
            currentMode === 'longBreak' && "bg-green-500/5"
          )}
          style={{
            background: `conic-gradient(from 0deg, ${
              currentMode === 'pomodoro' ? 'var(--primary)' :
              currentMode === 'shortBreak' ? 'rgb(59, 130, 246)' :
              'rgb(34, 197, 94)'
            } ${(timeLeft / sessions[currentMode]) * 100}%, transparent ${(timeLeft / sessions[currentMode]) * 100}%)`
          }}
        />
        <motion.div
          className="absolute inset-1 sm:inset-2 rounded-full bg-background/95 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${minutes}:${seconds}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className={cn(
                "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-tighter",
                "text-black dark:text-white"
              )}
            >
              {formatTime(minutes)}:{formatTime(seconds)}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetTimer}
            className="rounded-full liquid-card interactive-glow h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
          >
            <RotateCcw className="h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={isActive && !isPaused ? pauseTimer : startTimer}
            variant={isActive && !isPaused ? "outline" : "default"}
            className="rounded-full min-w-[60px] sm:min-w-[80px] md:min-w-[100px] h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-base interactive-glow px-3 sm:px-4 md:px-6"
          >
            {isActive && !isPaused ? (
              <Pause className="h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 sm:mr-2" />
            ) : (
              <Play className="h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 sm:mr-2" />
            )}
            {isActive && !isPaused ? 'Pause' : 'Start'}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={skipSession}
            className="rounded-full liquid-card interactive-glow h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
          >
            <SkipForward className="h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
