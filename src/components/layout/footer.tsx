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
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div 
            className="flex items-center space-x-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span>© {year} Mind Axis. All rights reserved.</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-sm text-muted-foreground"
          >
            <Link 
              href="mailto:samarth.gupta1226@gmail.com"
              className="hover:text-primary transition-colors duration-200"
            >
              samarth.gupta1226@gmail.com
            </Link>
            <span>|</span>
            <Link 
              href="mailto:aayushvasgi@gmail.com"
              className="hover:text-primary transition-colors duration-200"
            >
              aayushvasgi@gmail.com
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
