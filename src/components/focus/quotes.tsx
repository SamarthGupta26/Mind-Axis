'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const quotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair"
  }
];

export function Quotes() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * quotes.length);
      setKey(prevKey => prevKey + 1);
      setCurrentQuote(quotes[newIndex]);
    }, 60000); // Change quote every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      key={key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-1 sm:space-y-2 bg-background/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
    >
      <motion.p 
        className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground italic leading-relaxed"
      >
        &ldquo;{currentQuote.text}&rdquo;
      </motion.p>
      <motion.p 
        className="text-xs sm:text-sm text-muted-foreground/80"
      >
        — {currentQuote.author}
      </motion.p>
    </motion.div>
  );
}
