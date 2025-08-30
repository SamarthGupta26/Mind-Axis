'use client';

import { motion, MotionConfig } from 'framer-motion';

export function FloatingPanels() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40 rounded-full glass opacity-20 will-change-transform"
          animate={{
            y: [0, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            transform: 'translateZ(0)'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full glass opacity-20 will-change-transform"
          animate={{
            y: [0, -50, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            transform: 'translateZ(0)'
          }}
        />
      </div>
    </MotionConfig>
  );
}
