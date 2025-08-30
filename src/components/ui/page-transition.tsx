'use client';

import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.4,
          }}
          className="relative will-change-transform"
          style={{ transform: 'translateZ(0)' }} // Force GPU layer
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
