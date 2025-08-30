'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative w-10 h-10 glass-gradient"
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <Button
        variant="outline"
        size="icon"
        className="relative w-10 h-10 glass-gradient"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme === "light" ? "light" : "dark"}
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {theme === "light" ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(33,150,243,0.25)]" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Moon className="w-5 h-5 text-blue-400/90 drop-shadow-[0_0_8px_rgba(96,165,250,0.25)]" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
