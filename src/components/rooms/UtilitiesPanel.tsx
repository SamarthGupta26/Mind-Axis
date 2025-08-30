"use client";

import React from "react";
import { motion } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UtilitiesPanelProps {
  timerState: {
    isActive: boolean;
    timeLeft: number;
    mode: 'focus' | 'break';
    startedBy?: string;
  };
  onTimerAction: (action: 'start' | 'pause' | 'reset') => void;
  currentUserName: string;
}

export function UtilitiesPanel({ timerState, onTimerAction, currentUserName }: UtilitiesPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = timerState.mode === 'focus' ? 25 * 60 : 5 * 60;
    return ((totalTime - timerState.timeLeft) / totalTime) * 100;
  };

  const getTimeColor = () => {
    if (timerState.mode === 'focus') {
      return timerState.timeLeft <= 300 ? 'text-red-500' : 'text-blue-500'; // Last 5 minutes
    } else {
      return 'text-green-500';
    }
  };

  return (
    <div className="liquid-card rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary" />
          Pomodoro Timer
        </h2>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted stroke-current"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress Circle */}
            <motion.path
              className={`stroke-current ${
                timerState.mode === 'focus' ? 'text-blue-500' : 'text-green-500'
              }`}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100 - getProgress()}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - getProgress() }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
              {formatTime(timerState.timeLeft)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {timerState.mode === 'focus' ? 'Focus' : 'Break'}
            </div>
          </div>
        </div>

        {/* Mode Icon */}
        <div className="flex justify-center mb-4">
          {timerState.mode === 'focus' ? (
            <div className="flex items-center gap-2 text-blue-500">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-medium">Focus Time</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-500">
              <Coffee className="w-5 h-5" />
              <span className="text-sm font-medium">Break Time</span>
            </div>
          )}
        </div>

        {/* Timer Status */}
        {timerState.startedBy && (
          <div className="text-xs text-muted-foreground mb-4">
            {timerState.isActive 
              ? `Started by ${timerState.startedBy}` 
              : `Paused by ${timerState.startedBy}`
            }
          </div>
        )}
      </div>

      {/* Timer Controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={() => onTimerAction(timerState.isActive ? 'pause' : 'start')}
            className="flex-1 h-12 gap-2"
            variant={timerState.isActive ? "destructive" : "default"}
          >
            {timerState.isActive ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
          
          <Button
            onClick={() => onTimerAction('reset')}
            variant="outline"
            size="icon"
            className="h-12 w-12"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timer Info */}
      <div className="mt-6 space-y-3 text-sm">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="font-medium mb-2">Pomodoro Technique</div>
          <div className="text-muted-foreground space-y-1">
            <div>• 25 minutes focused work</div>
            <div>• 5 minute break</div>
            <div>• Synchronized across all participants</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Timer is shared with all participants in this room
        </div>
      </div>

      {/* Session Stats */}
      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Current Session</div>
          <div className="text-sm font-medium">
            {timerState.mode === 'focus' ? 'Focus Session' : 'Break Time'}
          </div>
        </div>
      </div>
    </div>
  );
}
