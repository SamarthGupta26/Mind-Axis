
'use client';
import React from 'react';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const { theme } = useTheme();
  // Use a default value for SSR, then update on client
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);
  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-[0%] pointer-events-none"
        style={{
          scaleX,
          background: isDark
            ? 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3))'
            : 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-[0%] pointer-events-none blur-[1px]"
        style={{
          scaleX,
          background: isDark
            ? 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.4))'
            : 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
          opacity: 0.5,
        }}
      />

      {/* Moving highlight */}
      <motion.div
        className="fixed top-0 h-[2px] w-[100px] z-50 pointer-events-none"
        style={{
          left: '0%',
          x: '-50%',
          scaleX: 0.5,
          transformOrigin: '50% 50%',
          background: isDark
            ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)'
            : 'linear-gradient(to right, transparent, rgba(0,0,0,0.5), transparent)',
        }}
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
// ...existing code...
  );
}
