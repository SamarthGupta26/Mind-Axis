"use client";

// Core imports
import "./globals.css";
import { Suspense, lazy } from "react";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MouseFollowProvider } from "@/components/providers/mouse-follow-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";

// Lazy load non-critical components for better performance
const CursorEffect = lazy(() => import("@/components/ui/cursor-effect").then(module => ({ default: module.CursorEffect })));
const FloatingPanels = lazy(() => import("@/components/ui/floating-panels").then(module => ({ default: module.FloatingPanels })));
const PageTransition = lazy(() => import("@/components/ui/page-transition").then(module => ({ default: module.PageTransition })));
const LoadingScreen = lazy(() => import("@/components/ui/loading-screen").then(module => ({ default: module.LoadingScreen })));
const OfflineFallback = lazy(() => import("@/components/ui/offline-fallback").then(module => ({ default: module.OfflineFallback })));
const ScrollProgress = lazy(() => import("@/components/ui/scroll-progress").then(module => ({ default: module.ScrollProgress })));
const ErrorBoundary = lazy(() => import("@/components/ui/error-boundary").then(module => ({ default: module.ErrorBoundary })));
const AccessibilityPanel = lazy(() => import("@/components/ui/accessibility-panel").then(module => ({ default: module.AccessibilityPanel })));
const PerformanceTracker = lazy(() => import("@/components/ui/performance-tracker").then(module => ({ default: module.PerformanceTracker })));

// ...existing code...
// ...existing code...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Preload critical resources */}
        <link rel="preload" href="/noise.png" as="image" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LoadingProvider>
            <MouseFollowProvider>
              <Suspense fallback={<div className="fixed inset-0 bg-background z-50" />}>
                <LoadingScreen />
                <OfflineFallback />
              </Suspense>
              
              <div className="relative min-h-screen flex flex-col">
                {/* Optimized background layers with GPU acceleration */}
                <div 
                  className="fixed inset-0 transition-opacity duration-1000 will-change-transform" 
                  style={{ 
                    background: `radial-gradient(circle at 0% 0%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 100% 0%, hsl(var(--secondary)) 0%, transparent 50%), radial-gradient(circle at 50% 100%, hsl(var(--accent)) 0%, transparent 50%)`, 
                    opacity: 0.13,
                    transform: 'translateZ(0)' // Force GPU layer
                  }} 
                />
                
                {/* Optimized grid pattern */}
                <div className="pointer-events-none fixed inset-0 z-20 will-change-transform" style={{ transform: 'translateZ(0)' }}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]" />
                </div>
                
                {/* Mouse gradient follow effect with GPU acceleration */}
                <div 
                  className="pointer-events-none fixed inset-0 z-30 transition duration-300 will-change-transform" 
                  style={{ 
                    background: "radial-gradient(800px at var(--x, 700px) var(--y, 200px), rgba(var(--primary-rgb), 0.09), transparent 80%)",
                    transform: 'translateZ(0)'
                  }} 
                />
                
                {/* Optimized noise texture */}
                <div 
                  className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30 will-change-transform" 
                  style={{ 
                    backgroundImage: "url('/noise.png')", 
                    backgroundRepeat: 'repeat',
                    transform: 'translateZ(0)'
                  }} 
                />
                
                {/* Skip to content link for accessibility */}
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                
                {/* Lazy loaded effects */}
                <Suspense fallback={null}>
                  <CursorEffect />
                  <FloatingPanels />
                  <ScrollProgress />
                  <OfflineFallback />
                  <AccessibilityPanel />
                  <PerformanceTracker />
                </Suspense>
                
                {/* Main content with Error Boundary */}
                <div className="relative z-40 sticky-footer-layout">
                  <Header />
                  <main id="main-content" className="sticky-footer-content pt-20 lg:pt-24 px-2 sm:px-4 md:px-6 lg:px-8">
                    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                      <ErrorBoundary>
                        <PageTransition>
                          <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                            {children}
                          </div>
                        </PageTransition>
                      </ErrorBoundary>
                    </Suspense>
                  </main>
                  <div className="sticky-footer">
                    <Footer />
                  </div>
                </div>
              </div>
            </MouseFollowProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
