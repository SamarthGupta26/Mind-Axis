'use client';
'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useFocusStore } from '@/store/focus-store';
import { cn } from '@/lib/utils';

const modes = [
  { 
    id: 'pomodoro',
    label: 'Focus',
    activeColor: 'bg-primary/10 border-primary/20',
    textColor: 'text-primary'
  },
  { 
    id: 'shortBreak',
    label: 'Short Break',
    activeColor: 'bg-blue-500/10 border-blue-500/20',
    textColor: 'text-blue-500'
  },
  { 
    id: 'longBreak',
    label: 'Long Break',
    activeColor: 'bg-green-500/10 border-green-500/20',
    textColor: 'text-green-500'
  },
] as const;

export function ModeSelector() {
  const { currentMode, setMode } = useFocusStore();

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-center p-1 rounded-full bg-background/50 backdrop-blur-sm border shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-6 space-x-0.5 sm:space-x-1"
    >
      {modes.map(({ id, label, activeColor, textColor }) => (
        <motion.div
          key={id}
          className="relative flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            onClick={() => setMode(id)}
            className={cn(
              "relative z-10 rounded-full px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 transition-colors text-xs sm:text-sm md:text-base w-full",
              currentMode === id && textColor
            )}
          >
            <span className="truncate">{label}</span>
          </Button>
          {currentMode === id && (
            <motion.div
              layoutId="activeMode"
              className={cn("absolute inset-0 rounded-full border", activeColor)}
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
