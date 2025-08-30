import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FocusState {
  isActive: boolean;
  isPaused: boolean;
  currentSession: number;
  timeLeft: number;
  sessions: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  currentMode: 'pomodoro' | 'shortBreak' | 'longBreak';
  completedSessions: number;
  sessionsUntilLongBreak: number;
  hasSound: boolean;
  volume: number;
  totalFocusTime: number;
  currentStreak: number;
  bestStreak: number;
}

interface FocusActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  setMode: (mode: FocusState['currentMode']) => void;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  tick: () => void;
  resetStats: () => void;
}

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds
const SESSIONS_UNTIL_LONG_BREAK = 4;

export const useFocusStore = create<FocusState & FocusActions>()(
  persist(
    (set, get) => ({
      isActive: false,
      isPaused: false,
      currentSession: 1,
      timeLeft: POMODORO_TIME,
      sessions: {
        pomodoro: POMODORO_TIME,
        shortBreak: SHORT_BREAK_TIME,
        longBreak: LONG_BREAK_TIME,
      },
      currentMode: 'pomodoro',
      completedSessions: 0,
      sessionsUntilLongBreak: SESSIONS_UNTIL_LONG_BREAK,
      hasSound: true,
      volume: 0.5,
      totalFocusTime: 0,
      currentStreak: 0,
      bestStreak: 0,

      startTimer: () => {
        set({ isActive: true, isPaused: false });
      },

      pauseTimer: () => {
        set({ isPaused: true });
      },

      resetTimer: () => {
        const { currentMode, sessions } = get();
        set({
          isActive: false,
          isPaused: false,
          timeLeft: sessions[currentMode],
        });
      },

      skipSession: () => {
        const state = get();
        let nextMode: FocusState['currentMode'] = 'pomodoro';
        let nextSession = state.currentSession;
        let completedSessions = state.completedSessions;
        let totalFocusTime = state.totalFocusTime;
        let currentStreak = state.currentStreak;
        let bestStreak = state.bestStreak;

        if (state.currentMode === 'pomodoro') {
          completedSessions += 1;
          totalFocusTime += POMODORO_TIME - state.timeLeft;
          currentStreak += 1;
          bestStreak = Math.max(currentStreak, bestStreak);
          
          if (completedSessions % state.sessionsUntilLongBreak === 0) {
            nextMode = 'longBreak';
          } else {
            nextMode = 'shortBreak';
          }
        } else {
          nextMode = 'pomodoro';
          if (state.currentMode === 'longBreak') {
            nextSession += 1;
          }
        }

        set({
          currentMode: nextMode,
          timeLeft: state.sessions[nextMode],
          isActive: false,
          isPaused: false,
          currentSession: nextSession,
          completedSessions,
          totalFocusTime,
          currentStreak,
          bestStreak,
        });
      },

      setMode: (mode) => {
        const { sessions } = get();
        set({
          currentMode: mode,
          timeLeft: sessions[mode],
          isActive: false,
          isPaused: false,
        });
      },

      toggleSound: () => {
        set((state) => ({ hasSound: !state.hasSound }));
      },

      setVolume: (volume) => {
        set({ volume });
      },

      tick: () => {
        const state = get();
        if (!state.isActive || state.isPaused || state.timeLeft <= 0) return;

        const newTimeLeft = state.timeLeft - 1;
        set({ timeLeft: newTimeLeft });

        if (newTimeLeft <= 0) {
          state.skipSession();
        }
      },

      resetStats: () => {
        set({
          completedSessions: 0,
          totalFocusTime: 0,
          currentStreak: 0,
          bestStreak: 0,
        });
      },
    }),
    {
      name: 'focus-storage',
      partialize: (state) => ({
        hasSound: state.hasSound,
        volume: state.volume,
        totalFocusTime: state.totalFocusTime,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        completedSessions: state.completedSessions,
      }),
    }
  )
);
