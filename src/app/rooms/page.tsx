"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/page-transition";
import { FloatingPanels } from "@/components/ui/floating-panels";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateRoomId, isValidRoomId } from "@/lib/ids";
import { Users, Plus, ArrowRight, MessageCircle, Timer, Sparkles } from "lucide-react";

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Study Rooms - Mind Axis';
}

export default function StudyRoomsPage() {
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const router = useRouter();

  const handleCreateRoom = () => {
    const roomId = generateRoomId();
    router.push(`/rooms/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!joinRoomCode.trim()) return;
    
    const roomCode = joinRoomCode.trim().toUpperCase();
    if (!isValidRoomId(roomCode)) {
      alert("Please enter a valid room code (8 characters)");
      return;
    }

    setIsJoining(true);
    router.push(`/rooms/${roomCode}`);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <FloatingPanels />
        <GridPattern />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Real-time Collaboration</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 text-center text-black dark:text-white drop-shadow-lg">
            <span className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
              Study Rooms
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Connect with fellow students in real-time study sessions. Share ideas, stay motivated, and learn together in focused collaborative environments.
          </p>
        </motion.div>

        {/* Main Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.2 }}
          className="w-full max-w-sm sm:max-w-md mx-auto"
        >
          <div className="liquid-card rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
            {!showJoinInput ? (
              <>
                {/* Create Room Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleCreateRoom}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Create New Room
                  </Button>
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Join Room Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setShowJoinInput(true)}
                    variant="outline"
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Join Existing Room
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Enter Room Code</h3>
                
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="e.g., ABC123XY"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                    onKeyPress={handleInputKeyPress}
                    className="text-center text-base sm:text-lg font-mono tracking-widest uppercase h-10 sm:h-12 border-2 focus:border-primary"
                    maxLength={8}
                    autoFocus
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleJoinRoom}
                      disabled={!joinRoomCode.trim() || isJoining}
                      className="flex-1 h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isJoining ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          Join Room
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setShowJoinInput(false);
                        setJoinRoomCode("");
                        setIsJoining(false);
                      }}
                      variant="outline"
                      className="h-10 sm:h-12 px-4 rounded-xl border-2 text-sm sm:text-base"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          <div className="liquid-card rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Real-time Chat</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Instant messaging with typing indicators and system notifications
            </p>
          </div>
          
          <div className="liquid-card rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Live Participants</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              See who&apos;s in your study session and track active members
            </p>
          </div>
          
          <div className="liquid-card rounded-lg sm:rounded-xl p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
            <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Shared Pomodoro</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Synchronized focus sessions with automatic break reminders
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
