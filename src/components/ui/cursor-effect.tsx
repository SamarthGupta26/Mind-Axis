'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function CursorEffect() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isPressed, setIsPressed] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isInputHover, setIsInputHover] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  // Optimized spring configurations for better performance
  const springConfig = { damping: 30, stiffness: 400, restDelta: 0.01 };
  const morphConfig = { damping: 25, stiffness: 300, restDelta: 0.01 };
  
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorScale = useSpring(1, morphConfig);
  const cursorOpacity = useSpring(0.5, { damping: 20, stiffness: 300, restDelta: 0.01 });
  
  const size = useTransform(cursorScale, [0.8, 1, 1.5], ["16px", "20px", "32px"]);
  const ringSize = useTransform(cursorScale, [0.8, 1, 1.5], ["24px", "32px", "48px"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let rafId: number;
    
    const moveCursor = (e: MouseEvent) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        const target = e.target as HTMLElement;
        const computedStyle = window.getComputedStyle(target);
        
        // Check for interactive elements
        const isInteractive = 
          target.tagName.toLowerCase() === 'button' ||
          target.tagName.toLowerCase() === 'a' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          computedStyle.cursor === 'pointer';

        // Check for text input areas
        const isInput = 
          target.tagName.toLowerCase() === 'input' ||
          target.tagName.toLowerCase() === 'textarea' ||
          target.getAttribute('contenteditable') === 'true' ||
          target.closest('[contenteditable=true]');

        // Check for text selection areas
        const isText = 
          computedStyle.cursor === 'text' ||
          target.tagName.toLowerCase() === 'p' ||
          target.tagName.toLowerCase() === 'span' ||
          target.tagName.toLowerCase() === 'h1' ||
          target.tagName.toLowerCase() === 'h2' ||
          target.tagName.toLowerCase() === 'h3' ||
          target.tagName.toLowerCase() === 'h4' ||
          target.tagName.toLowerCase() === 'h5' ||
          target.tagName.toLowerCase() === 'h6';

        setIsPointer(!!isInteractive);
        setIsInputHover(!!isInput);
        setIsTextHover(isText);
      });
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    if (isInputHover) {
      cursorScale.set(0.8);
      cursorOpacity.set(0.9);
    } else if (isTextHover) {
      cursorScale.set(0.6);
      cursorOpacity.set(0.7);
    } else if (isPointer) {
      cursorScale.set(1.5);
      cursorOpacity.set(0.8);
    } else {
      cursorScale.set(isPressed ? 0.9 : 1);
      cursorOpacity.set(0.6);
    }
  }, [isPointer, isPressed, isInputHover, isTextHover, cursorScale, cursorOpacity]);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[60] will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: ringSize,
          height: ringSize,
          transform: 'translateZ(0)'
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ 
            x: '-50%',
            y: '-50%',
          }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              opacity: cursorOpacity,
            }}
            animate={{
              scale: isPointer ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isPointer ? Infinity : undefined,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[61] will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: size,
          height: size,
          transform: 'translateZ(0)'
        }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{ 
            x: '-50%',
            y: '-50%',
          }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{
              background: isDark
                ? `linear-gradient(135deg, 
                    rgba(255, 255, 255, ${isInputHover ? 0.3 : 0.15}), 
                    rgba(255, 255, 255, ${isInputHover ? 0.15 : 0.05}))`
                : `linear-gradient(135deg, 
                    rgba(0, 0, 0, ${isInputHover ? 0.3 : 0.15}), 
                    rgba(0, 0, 0, ${isInputHover ? 0.15 : 0.05}))`,
              backdropFilter: 'blur(4px)',
              border: `1px solid ${
                isDark 
                  ? `rgba(255, 255, 255, ${isPointer ? 0.2 : 0.1})`
                  : `rgba(0, 0, 0, ${isPointer ? 0.2 : 0.1})`
              }`,
              boxShadow: `0 0 10px ${
                isDark
                  ? `rgba(255, 255, 255, ${isPointer ? 0.2 : 0.1})`
                  : `rgba(0, 0, 0, ${isPointer ? 0.2 : 0.1})`
              }`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Text cursor indicator */}
      {isTextHover && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[59] will-change-transform"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            transform: 'translateZ(0)'
          }}
        >
          <motion.div
            className="absolute"
            style={{ 
              x: '-50%',
              y: '-50%',
              width: "2px",
              height: "16px",
              background: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
            }}
            animate={{
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}

      {/* Input cursor indicator */}
      {isInputHover && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[59] will-change-transform"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            transform: 'translateZ(0)'
          }}
        >
          <motion.div
            style={{ 
              x: '-50%',
              y: '-50%',
              width: "12px",
              height: "12px",
              border: `2px solid ${isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}`,
              borderRadius: "2px",
            }}
          />
        </motion.div>
      )}
    </>
  );
}
