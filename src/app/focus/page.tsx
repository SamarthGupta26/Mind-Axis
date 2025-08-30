"use client";
import { motion } from "framer-motion";
import { Timer } from "@/components/focus/timer";
import { ModeSelector } from "@/components/focus/mode-selector";
import { Quotes } from "@/components/focus/quotes";
import { useBackgroundMusic } from "@/hooks/use-background-music";
import { useFocusStore } from "@/store/focus-store";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Focus Timer - Mind Axis';
}

export default function FocusPage() {
  useBackgroundMusic();
  const { hasSound, toggleSound, volume, setVolume } = useFocusStore();

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        className="container max-w-4xl mx-auto py-8 sm:py-12 space-y-8 sm:space-y-12 w-full"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-3"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Deep Focus Mode</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            style={{ fontFamily: 'var(--font-geist), Inter, sans-serif' }}
          >
            Focus
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
            className="text-muted-foreground mt-4 sm:mt-8 text-sm sm:text-base"
          >
            Stay concentrated with our enhanced Pomodoro timer
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.1 }}
          className="relative flex flex-col items-center space-y-6 sm:space-y-8 liquid-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
        >
          <ModeSelector />
          <Timer />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 w-full justify-center"
          >
            <Button
              variant={hasSound ? "default" : "outline"}
              size="sm"
              onClick={toggleSound}
              className="rounded-full text-xs sm:text-sm px-3 sm:px-4 interactive-glow"
            >
              {hasSound ? "Music On" : "Music Off"}
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.input
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-24 sm:w-32 accent-primary"
              />
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
                className="text-xs text-muted-foreground"
              >
                Volume
              </motion.span>
            </div>
          </motion.div>
          <Quotes />
        </motion.div>
        </motion.div>
      </main>
    );
  }

