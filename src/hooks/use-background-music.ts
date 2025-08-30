'use client';

import { useEffect, useRef, useState } from 'react';
import { useFocusStore } from '@/store/focus-store';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { hasSound, volume, isActive, isPaused } = useFocusStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    audioRef.current = new Audio('/sounds/focus-end.mp3');
    audioRef.current.loop = true; // Enable looping
    audioRef.current.volume = volume;
    audioRef.current.addEventListener('canplaythrough', () => setIsLoaded(true));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => setIsLoaded(true));
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    audioRef.current.volume = volume;
  }, [volume, isLoaded]);

  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;

    if (isActive && !isPaused && hasSound) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {
        console.log('Background music playback was prevented');
      });
    } else {
      if (audioRef.current) audioRef.current.pause();
    }
  }, [isActive, isPaused, hasSound, volume, isLoaded]);

  return null;
}
