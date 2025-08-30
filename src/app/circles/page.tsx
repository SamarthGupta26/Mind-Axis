"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";

export default function CirclesPage() {
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
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Study Communities</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            >
              Study Circles
            </motion.h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Join study circles to collaborate with peers, share resources, and achieve learning goals together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="liquid-card rounded-3xl p-6 sm:p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Your Study Circles
              </h2>
              <p className="text-muted-foreground mb-6">
                Study circles feature is coming soon. Create and join study groups for collaborative learning.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Create Circle</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a new study circle for your subject
                </p>
                <Button size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <Search className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Find Circles</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover circles for your subjects
                </p>
                <Button size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Join Circle</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join using an invite code
                </p>
                <Button size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold mb-4">Alternative Study Options</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/group-study">
                  <Button variant="outline">
                    Group Study
                  </Button>
                </Link>
                <Link href="/rooms">
                  <Button variant="outline">
                    Study Rooms
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
