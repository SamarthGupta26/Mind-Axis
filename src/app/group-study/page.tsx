"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Video, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";

export default function GroupStudyPage() {
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
              <span>Collaborative Learning</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            >
              Group Study
            </motion.h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Connect with study partners and collaborate on learning goals together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="liquid-card rounded-3xl p-6 sm:p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Collaborative Study Tools
            </h2>
            <p className="text-muted-foreground mb-8">
              Group study features are coming soon. Connect with fellow students for enhanced learning experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-primary/10 rounded-lg p-4">
                <Video className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Virtual Study Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Join or create study rooms with video chat
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Group Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Discuss topics and share resources
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <Share2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Shared Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborate on notes and study materials
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-2">Study Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Find and join study groups by subject
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/circles">
                <Button className="bg-primary text-white">
                  Explore Study Circles
                </Button>
              </Link>
              <Link href="/rooms">
                <Button variant="outline">
                  Study Rooms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
