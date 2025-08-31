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
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent px-3 sm:px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        className="container max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto py-4 sm:py-6 md:py-8 lg:py-12 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12 w-full"
      >
        <div className="text-center space-y-1 sm:space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-2 sm:mb-3"
          >
            <Target className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span>Deep Focus Mode</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 text-center text-black dark:text-white drop-shadow-lg"
            style={{ fontFamily: 'var(--font-geist), Inter, sans-serif' }}
          >
            Focus
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
            className="text-muted-foreground mt-2 sm:mt-4 md:mt-8 text-xs sm:text-sm md:text-base"
          >
            Stay concentrated with our enhanced Pomodoro timer
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.1 }}
          className="relative flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 liquid-card rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10"
        >
          <ModeSelector />
          <Timer />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 mt-2 w-full justify-center"
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
                className="w-20 sm:w-24 md:w-32 accent-primary"
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

