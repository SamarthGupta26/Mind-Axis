'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer?: PerformanceObserver;

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObserver();
      this.measureNavigationTiming();
    }
  }

  private initializeObserver() {
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              this.metrics.FCP = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            this.metrics.LCP = entry.startTime;
            break;
          case 'first-input':
            this.metrics.FID = (entry as any).processingStart - entry.startTime;
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              this.metrics.CLS = (this.metrics.CLS || 0) + (entry as any).value;
            }
            break;
        }
      }
      
      this.reportMetrics();
    });

    try {
      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Some performance metrics are not supported:', e);
    }
  }

  private measureNavigationTiming() {
    if ('performance' in window && 'timing' in window.performance) {
      const timing = window.performance.timing;
      this.metrics.TTFB = timing.responseStart - timing.navigationStart;
    }
  }

  private reportMetrics() {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.table(this.metrics);
    }

    // In production, you could send these to an analytics service
    // Example: analytics.track('performance_metrics', this.metrics);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

let performanceMonitor: PerformanceMonitor | null = null;

export function PerformanceTracker() {
  useEffect(() => {
    if (!performanceMonitor) {
      performanceMonitor = new PerformanceMonitor();
    }

    return () => {
      if (performanceMonitor) {
        performanceMonitor.cleanup();
        performanceMonitor = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything
}

export function usePerformanceMetrics(): PerformanceMetrics {
  return performanceMonitor?.getMetrics() || {};
}

// Utility function to measure specific operations
export function measureOperation<T>(name: string, operation: () => T): T {
  if (typeof window === 'undefined' || !window.performance) {
    return operation();
  }

  const startTime = performance.now();
  const result = operation();
  const duration = performance.now() - startTime;

  if (process.env.NODE_ENV === 'development') {
    console.log(`Operation "${name}" took ${duration.toFixed(2)}ms`);
  }

  return result;
}

// Hook to measure component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Component "${componentName}" render time: ${duration.toFixed(2)}ms`);
      }
    };
  });
}
