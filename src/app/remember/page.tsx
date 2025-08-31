'use client';

import { motion } from 'framer-motion';
import { Flashcards } from '@/components/remember/flashcards';
import { BookOpen } from "lucide-react";

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Remember - Mind Axis';
}

export default function RememberPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 flex-1 flex flex-col"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 px-2 sm:px-4"
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 rounded-full liquid-card text-primary text-xs sm:text-sm md:text-base font-medium mb-3 sm:mb-4">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span>Active Recall System</span>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg leading-tight"
            style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
          >
            Remember
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-black dark:text-white mb-3 sm:mb-4"
            style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
          >
            Flashcards & Cramming
          </motion.h2>
          
          <p className="text-muted-foreground text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto px-2 sm:px-4 leading-relaxed">
            Master concepts with spaced repetition flashcards and last-minute cramming sessions for optimal learning retention.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="liquid-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 flex-1"
        >
          <Flashcards />
        </motion.div>
      </motion.div>
    </div>
  );
}
