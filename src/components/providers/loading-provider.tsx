'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Hide loading screen after initial load
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 1200); // shorter initial splash

      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  // Show loading when pathname changes and hide after small delay.
  useEffect(() => {
    const prev = previousPathRef.current;
    if (prev === null) {
      previousPathRef.current = pathname;
      return;
    }

    if (pathname && pathname !== prev) {
      setIsLoading(true);
      previousPathRef.current = pathname;

      const t = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(t);
    }

    // If same path, ensure loading is off
    setIsLoading(false);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
