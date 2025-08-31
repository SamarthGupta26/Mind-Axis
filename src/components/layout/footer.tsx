'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full mt-16 border-t border-border/50 bg-background/50 backdrop-blur-sm"
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <motion.div 
            className="flex items-center text-sm text-muted-foreground order-2 sm:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span>© {year} Mind Axis. All rights are <span className="inline-block animate-pulse bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold transform hover:scale-110 transition-transform duration-200">not</span> reserved.</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm order-1 sm:order-2"
          >
            <Link 
              href="mailto:samarth.gupta1226@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              samarth.gupta1226@gmail.com
            </Link>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <Link 
              href="mailto:aayushvasgi@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              aayushvasgi@gmail.com
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
