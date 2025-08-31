"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/socketClient";
import { Users, Copy, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParticipantsPanelProps {
  users: User[];
  currentUserId: string;
  roomId: string;
  onRename: (newName: string) => void;
}

export function ParticipantsPanel({ users, currentUserId, roomId, onRename }: ParticipantsPanelProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const currentUser = users.find(u => u.id === currentUserId);
  const sortedUsers = [...users].sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/rooms/${roomId}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleRename = () => {
    if (!newName.trim()) return;
    onRename(newName.trim());
    setEditingName(false);
    setNewName("");
  };

  const formatDuration = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / (1000 * 60));
    if (minutes < 1) return "Just joined";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <div className="liquid-card rounded-xl p-3 sm:p-4 md:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold">Participants</h2>
          <span className="text-xs sm:text-sm text-muted-foreground bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            {users.length}
          </span>
        </div>
      </div>

      {/* Invite Link */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <Button
          onClick={copyInviteLink}
          variant="outline"
          className="w-full justify-center gap-1 sm:gap-2 h-8 sm:h-10 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-xs sm:text-sm"
        >
          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          {showCopied ? "Copied!" : "Copy Invite Link"}
        </Button>
      </div>

      {/* Room Code Display */}
      <div className="mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 bg-primary/5 rounded-lg text-center">
        <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1">Room Code</div>
        <div className="font-mono text-sm sm:text-lg font-bold text-primary tracking-widest">
          {roomId.toUpperCase()}
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto">
        <AnimatePresence>
          {sortedUsers.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            const isHost = index === 0;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
                  isCurrentUser 
                    ? "border-primary bg-primary/5" 
                    : "border-border/50 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="relative">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      {isHost && (
                        <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {editingName && isCurrentUser ? (
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleRename()}
                            onBlur={handleRename}
                            className="bg-background border border-primary rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-medium w-full"
                            placeholder={user.name}
                            autoFocus
                            maxLength={20}
                          />
                        ) : (
                          <div 
                            className={`text-xs sm:text-sm font-medium truncate ${
                              isCurrentUser ? "text-primary cursor-pointer" : ""
                            }`}
                            onClick={() => {
                              if (isCurrentUser) {
                                setEditingName(true);
                                setNewName(user.name);
                              }
                            }}
                          >
                            {user.name}
                            {isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                          </div>
                        )}
                        {isHost && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            Host
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{formatDuration(user.joinedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          {currentUser && "Click your name to rename"}
        </div>
      </div>
    </div>
  );
}
