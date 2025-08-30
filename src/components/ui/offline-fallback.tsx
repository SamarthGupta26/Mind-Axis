'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export function OfflineFallback() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="relative flex flex-col items-center max-w-md mx-auto p-8 liquid-card rounded-xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="relative"
        >
          <motion.div
            className="p-4 rounded-full glass-gradient"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 0.6, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Globe className="w-12 h-12 text-primary/80" />
          </motion.div>
          
          {/* Connection status indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-destructive"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-xl font-semibold text-foreground"
        >
          No Internet Connection
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-muted-foreground"
        >
          Please check your internet connection and try again.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm text-muted-foreground/60"
        >
          You can still use some features while offline
        </motion.div>
      </div>
    </div>
  );
}
