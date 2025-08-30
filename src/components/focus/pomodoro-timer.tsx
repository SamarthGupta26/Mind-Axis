'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PomodoroTimerProps {
  onSessionComplete: () => void;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [session] = useState(1);
  const timerRef = useRef<NodeJS.Timeout>(0 as unknown as NodeJS.Timeout);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progress = 1 - (timeLeft / (25 * 60));

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            onSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, onSessionComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center justify-center p-8"
    >
      <div className="relative w-64 h-64">
        {/* Timer Circle Background */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-muted fill-none"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-primary fill-none"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              strokeDasharray: "283",
              strokeDashoffset: "283",
            }}
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            key={`${minutes}:${seconds}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold tabular-nums"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-1">
            Session {session}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full"
        >
          {isRunning ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-1" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <Music2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
