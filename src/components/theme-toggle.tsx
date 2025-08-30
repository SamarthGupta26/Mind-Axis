"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ThemeToggle
 * - waits for client mount to avoid hydration mismatch
 * - provides an accessible button with aria-label and title (hover tooltip)
 * - keeps the glass / premium look via utility classes
 * - maintains framer-motion animations with a simple structure
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Keyboard shortcut: Shift+T to toggle theme
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 't' && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative w-10 h-10 rounded-full overflow-hidden glass-button"
        aria-hidden={true}
      >
        <span className="sr-only">Toggle theme</span>
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(nextTheme)}
        aria-pressed={isDark}
        aria-label={`Switch to ${nextTheme} theme (Ctrl+T)`}
        className="relative w-10 h-10 rounded-full overflow-hidden glass-button group"
      >
        {/* decorative gradient + blur for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />
        <div className="absolute inset-0 backdrop-blur-[8px] bg-white/10 dark:bg-black/10 group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors duration-400" />

        {/* animated icon */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500/95 drop-shadow-[0_0_8px_rgba(234,179,8,0.25)]" />
            ) : (
              <Moon className="w-5 h-5 text-sky-400/95 drop-shadow-[0_0_8px_rgba(96,165,250,0.25)]" />
            )}
          </motion.span>
        </AnimatePresence>

        {/* subtle inner glow that follows theme */}
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: isDark ? "0 0 18px rgba(234,179,8,0.22) inset" : "0 0 18px rgba(96,165,250,0.22) inset",
          }}
          transition={{ duration: 0.45 }}
        />
      </Button>
    </motion.div>
  );
}
