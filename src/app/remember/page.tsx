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
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-3">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Active Recall System</span>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
          >
            Remember
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-black dark:text-white mb-4"
            style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
          >
            Flashcards & Cramming
          </motion.h2>
          
          <p className="text-muted-foreground text-center text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Master concepts with spaced repetition flashcards and last-minute cramming sessions for optimal learning retention.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="liquid-card rounded-2xl p-6 sm:p-8"
        >
          <Flashcards />
        </motion.div>
      </motion.div>
    </div>
  );
}
