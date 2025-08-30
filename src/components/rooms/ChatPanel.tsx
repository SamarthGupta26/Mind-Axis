"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/lib/socketClient";
import { Send, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatPanelProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  onTyping: (typing: boolean) => void;
  typingUsers: Array<{ userId: string; userName: string }>;
}

export function ChatPanel({ 
  messages, 
  currentUserId, 
  onSendMessage, 
  onTyping, 
  typingUsers 
}: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicators
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      onTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    } else {
      onTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, onTyping]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    onSendMessage(message.trim());
    setMessage("");
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const groupMessagesByTime = (messages: Message[]) => {
    const groups: Array<{ time: string; messages: Message[] }> = [];
    let currentGroup: Message[] = [];
    let currentTime = "";

    messages.forEach((msg) => {
      const msgTime = formatTime(msg.timestamp);
      
      if (msgTime !== currentTime) {
        if (currentGroup.length > 0) {
          groups.push({ time: currentTime, messages: currentGroup });
        }
        currentTime = msgTime;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ time: currentTime, messages: currentGroup });
    }

    return groups;
  };

  const messageGroups = groupMessagesByTime(messages);

  return (
    <div className="liquid-card rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          💬 Chat
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
        {messageGroups.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages yet.</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {/* Time divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded-full border">
                  {group.time}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Messages in this time group */}
              <AnimatePresence>
                {group.messages.map((msg) => {
                  const isOwnMessage = msg.userId === currentUserId;
                  const isSystemMessage = msg.userId === 'system' || msg.userName === 'System';

                  if (isSystemMessage) {
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-center"
                      >
                        <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                          {msg.text}
                        </span>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                        {!isOwnMessage && (
                          <div className="text-xs text-muted-foreground mb-1 px-1">
                            {msg.userName}
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl break-words ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground ml-4"
                              : "bg-muted text-muted-foreground mr-4"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ))
        )}

        {/* Typing indicators */}
        <AnimatePresence>
          {typingUsers.filter(user => user.userId !== currentUserId).map((user) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start"
            >
              <div className="bg-muted text-muted-foreground p-3 rounded-2xl mr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{user.userName} is typing</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="mt-4 border-t border-border/50 pt-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              className="w-full p-3 pr-12 rounded-xl border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none bg-background/50 backdrop-blur-sm transition-all duration-200 min-h-[44px] max-h-32"
              rows={1}
              style={{
                height: "auto",
                minHeight: "44px",
                maxHeight: "128px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
            className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
