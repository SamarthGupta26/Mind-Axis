"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Brain, Target } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";

export default function CrammingPage() {
  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-16 px-4 bg-transparent">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-3">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Quick Study</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            >
              Cramming Mode
            </motion.h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Intensive study sessions for when time is limited and you need to absorb information quickly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="liquid-card rounded-3xl p-6 sm:p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Quick Study Tools
            </h2>
            <p className="text-muted-foreground mb-8">
              This cramming mode feature is coming soon. It will provide specialized tools for intensive study sessions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary/10 rounded-lg p-4">
                <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Speed Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Rapid information absorption techniques
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Focused Study</h3>
                <p className="text-sm text-muted-foreground">
                  Concentrated study sessions for exam prep
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Time Management</h3>
                <p className="text-sm text-muted-foreground">
                  Efficient time allocation for last-minute prep
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/focus">
                <Button className="bg-primary text-white">
                  Use Focus Timer
                </Button>
              </Link>
              <Link href="/remember">
                <Button variant="outline">
                  Quick Flashcards
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
