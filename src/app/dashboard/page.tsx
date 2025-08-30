"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Clock, Target } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-16 px-4 bg-transparent">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-3">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Overview</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            >
              Dashboard
            </motion.h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Track your study progress and access all your learning tools in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="liquid-card rounded-3xl p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
              Study Hub
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link href="/tasks">
                <div className="bg-primary/10 rounded-lg p-4 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-primary mb-2 text-center">Tasks</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Manage your study tasks
                  </p>
                </div>
              </Link>
              
              <Link href="/focus">
                <div className="bg-primary/10 rounded-lg p-4 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-primary mb-2 text-center">Focus</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Pomodoro study sessions
                  </p>
                </div>
              </Link>
              
              <Link href="/remember">
                <div className="bg-primary/10 rounded-lg p-4 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-primary mb-2 text-center">Remember</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Flashcards and revision
                  </p>
                </div>
              </Link>
              
              <Link href="/companion">
                <div className="bg-primary/10 rounded-lg p-4 hover:bg-primary/20 transition-colors cursor-pointer">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-primary mb-2 text-center">Companion</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    AI study assistant
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                This dashboard will show your study statistics and progress tracking.
              </p>
              <Link href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
