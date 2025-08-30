'use client';

import { useEffect, useRef } from 'react';
import { useFocusStore } from '@/store/focus-store';

const NOTIFICATION_SOUNDS = {
  pomodoro: '/sounds/focus-end.mp3',
  shortBreak: '/sounds/break-end.mp3',
  longBreak: '/sounds/long-break-end.mp3',
};

export function useTimerSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { hasSound, volume, currentMode, timeLeft } = useFocusStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!hasSound || timeLeft !== 0 || !audioRef.current) return;

    const sound = NOTIFICATION_SOUNDS[currentMode];
    if (sound) {
      audioRef.current.src = sound;
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Audio playback was prevented');
      });
    }
  }, [hasSound, currentMode, timeLeft]);

  return null;
}
