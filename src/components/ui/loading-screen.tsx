'use client';

import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useLoading } from '@/components/providers/loading-provider';

export function LoadingScreen() {
  const { isLoading } = useLoading();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl will-change-transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="relative flex flex-col items-center">
              {/* Optimized morphing blob */}
              <div className="relative w-24 h-24">
                <motion.div
                  className="absolute inset-0 loading-animation will-change-transform"
                  style={{
                    filter: 'blur(1px)',
                    transform: 'translateZ(0)'
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Optimized loading text */}
              <motion.div
                className="mt-8 text-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Loading
                </motion.span>
                <motion.span
                  className="inline-block"
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                >
                  .
                </motion.span>
                <motion.span
                  className="inline-block"
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                >
                  .
                </motion.span>
                <motion.span
                  className="inline-block"
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                >
                  .
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
