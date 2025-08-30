'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { FullScreenToggle } from '@/components/ui/fullscreen-toggle';
import { Tooltip } from '@/components/ui/tooltip';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
      className="fixed top-0 sm:top-6 left-0 sm:left-1/2 w-full sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 z-50 sm:max-w-5xl px-4 sm:px-0"
    >
      <motion.nav 
        className={cn("mx-auto px-4 sm:px-8 py-4 sm:rounded-full", "liquid-card")}
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
            <div className="hidden sm:flex items-center space-x-2">
              <ThemeToggle />
              <FullScreenToggle />
              <div className="h-4 w-px bg-border" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="hidden sm:flex items-center space-x-1">
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sm:hidden mt-4 space-y-1 border-t pt-4 divide-y divide-border/50"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="relative"
                  >
                    <Tooltip content={item.label} key={item.href}>
                      <button onClick={() => navigate(item.href)} className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'w-full justify-start relative inline-flex')}>
                        <span className={isActive ? 'text-primary' : ''}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeMobileNav"
                            className="absolute inset-0 rounded-md bg-primary/10"
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
                className="pt-4 flex items-center gap-2"
              >
                <ThemeToggle />
                <FullScreenToggle />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
