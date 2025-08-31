'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { FullScreenToggle } from '@/components/ui/fullscreen-toggle';
import { Tooltip } from '@/components/ui/tooltip';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 912);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navItems = [
    { href: '/tasks', label: 'Tasks' },
    { href: '/understand', label: 'Understand' },
    { href: '/remember', label: 'Remember' },
    { href: '/focus', label: 'Focus' },
    { href: '/rooms', label: 'Study Rooms' },
    { href: '/companion', label: 'Study Companion' },
  ];

  const router = useRouter();

  function navigate(href: string) {
    setIsMenuOpen(false);
    if (typeof window !== 'undefined' && href === '/focus') {
      window.location.href = href;
    } else {
      router.push(href);
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 lg:top-6 left-0 lg:left-1/2 w-full lg:w-[calc(100%-2rem)] lg:-translate-x-1/2 z-50 lg:max-w-5xl px-4 lg:px-0"
    >
      <motion.nav 
        className={cn(
          "mx-auto px-4 lg:px-8 py-4 liquid-card",
          "transition-all duration-300 ease-in-out overflow-hidden"
        )}
        animate={{
          borderRadius: isMenuOpen || isMobile ? "1rem" : "9999px"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <motion.span
            onClick={() => navigate('/')}
            className="text-lg sm:text-xl font-bold drop-shadow-lg tracking-wide animate-glow cursor-pointer select-none"
            style={{
              fontFamily: 'var(--font-geist), Inter, sans-serif',
              color: 'black',
            }}
            data-dark
          >
            <span className="dark:text-white">MindAxis</span>
          </motion.span>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <ThemeToggle />
              <FullScreenToggle />
              <div className="h-4 w-px bg-border" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "lg:hidden relative rounded-lg transition-all duration-200",
                "hover:bg-primary/10 hover:scale-105 active:scale-95",
                "min-h-[44px] min-w-[44px]", // Better touch target
                isMenuOpen && "bg-primary/10"
              )}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.div>
            </Button>
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const linkClass = cn(
                  buttonVariants({ variant: 'ghost', size: 'default' }),
                  'relative group px-3 h-9 inline-flex items-center'
                );

                return (
                  <Tooltip content={item.label} key={item.href}>
                    <button 
                      onClick={() => navigate(item.href)} 
                      className={cn(
                        linkClass,
                        'interactive-glow',
                        isActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      <span className={isActive ? 'text-primary' : ''}>{item.label}</span>
                      {isActive ? (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-md bg-primary/10"
                          transition={{ type: 'spring', duration: 0.6 }}
                        />
                      ) : (
                        <motion.div
                          className="absolute bottom-0 left-0 h-px w-0 bg-primary"
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="space-y-1 border-t border-white/10 pt-4 mt-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <Tooltip content={item.label}>
                        <button 
                          onClick={() => navigate(item.href)} 
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'default' }),
                            'w-full justify-start relative rounded-lg px-4 py-3',
                            'hover:bg-primary/10 hover:backdrop-blur-md',
                            'transition-all duration-200 ease-in-out',
                            'min-h-[48px] text-left', // Better touch target
                            isActive && 'bg-primary/10 text-primary'
                          )}
                        >
                          <span className={cn(
                            'text-sm font-medium transition-colors',
                            isActive ? 'text-primary' : 'text-foreground'
                          )}>
                            {item.label}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="activeMobileNav"
                              className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                              transition={{ type: 'spring', duration: 0.6 }}
                            />
                          )}
                        </button>
                      </Tooltip>
                    </motion.div>
                  );
                })}
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-4 pb-2 border-t border-white/10 flex items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <FullScreenToggle />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
