"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { FloatingPanels } from "@/components/ui/floating-panels";
import { GridPattern } from "@/components/ui/grid-pattern";
import { ParticipantsPanel } from "@/components/rooms/ParticipantsPanel";
import { ChatPanel } from "@/components/rooms/ChatPanel";
import { UtilitiesPanel } from "@/components/rooms/UtilitiesPanel";
import { Socket } from 'socket.io-client';

// Extended socket interface to handle unknown properties
interface ExtendedSocket extends Socket {
  engine?: {
    transport?: {
      name?: string;
    };
    readyState?: string;
  };
}
import { getSocket, Message, RoomState } from "@/lib/socketClient";
import { generateUserId } from "@/lib/ids";
import { Users, MessageCircle, Timer, ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;

  // Always call hooks before any early returns
  const [isConnected, setIsConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState>({
    users: [],
    messages: [],
    timerState: {
      isActive: false,
      timeLeft: 25 * 60,
      mode: 'focus',
    },
  });
  const [currentUserId, setCurrentUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Array<{ userId: string; userName: string }>>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'timer'>('chat');

  // Validate room ID after hooks are initialized
  useEffect(() => {
    if (!roomId) {
      console.error('No room ID provided');
      router.push('/rooms');
      return;
    }
    
    if (typeof roomId !== 'string' || roomId.length !== 8) {
      console.error('Invalid room ID format:', roomId);
      router.push('/rooms');
      return;
    }
  }, [roomId, router]);

  // Initialize socket and user
  useEffect(() => {
    if (!roomId) {
      router.push('/rooms');
      return;
    }

    let initializationAttempts = 0;
    const maxAttempts = 3;
    
    const initializeSocket = async () => {
      try {
        // Initialize Socket.IO by making a request to the API route with retry
        await fetch('/api/socketio').catch(console.error);
        
        const socket = getSocket();
        const userId = generateUserId();
        setCurrentUserId(userId);

        socket.on('connect', () => {
          console.log('✅ Socket connected successfully:', socket?.id);
          setIsConnected(true);
          setConnectionError(null); // Clear any previous errors
        });

        socket.on('disconnect', () => {
          console.log('❌ Socket disconnected');
          setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
          console.error('🔥 Socket connection error:', error.message || error);
          setIsConnected(false);
          setConnectionError(error.message || 'Connection failed');
          
          // Retry initialization if we haven't exceeded max attempts
          if (initializationAttempts < maxAttempts) {
            initializationAttempts++;
            console.log(`🔄 Retrying socket initialization (${initializationAttempts}/${maxAttempts})`);
            setTimeout(initializeSocket, 2000 * initializationAttempts); // Exponential backoff
          } else {
            setConnectionError('Failed to connect after multiple attempts. Please refresh the page.');
          }
        });

            socket.on('room:state', (state: RoomState) => {
          console.log('Room state received:', state);
          setRoomState(state);
        });

        socket.on('room:message', (message: Message) => {
      setRoomState(prev => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    });

    socket.on('room:presence', ({ type, user }) => {
      setRoomState(prev => {
        let updatedUsers = [...prev.users];
        
        switch (type) {
          case 'join':
            if (!updatedUsers.find(u => u.id === user.id)) {
              updatedUsers.push(user);
            }
            break;
          case 'leave':
            updatedUsers = updatedUsers.filter(u => u.id !== user.id);
            break;
          case 'rename':
            updatedUsers = updatedUsers.map(u => 
              u.id === user.id ? { ...u, name: user.name } : u
            );
            break;
        }
        
        return {
          ...prev,
          users: updatedUsers,
        };
      });
    });

    socket.on('room:typing', ({ userId, userName, typing }) => {
      setTypingUsers(prev => {
        if (typing) {
          if (!prev.find(u => u.userId === userId)) {
            return [...prev, { userId, userName }];
          }
          return prev;
        } else {
          return prev.filter(u => u.userId !== userId);
        }
      });
    });

    socket.on('room:timer', (timerState) => {
      setRoomState(prev => ({
        ...prev,
        timerState,
      }));
    });

    socket.on('room:error', ({ message }) => {
      console.error('Room error:', message);
      alert(`Error: ${message}`);
    });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    // Start initialization
    initializeSocket();

    return () => {
      const socket = getSocket();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room:state');
      socket.off('room:message');
      socket.off('room:presence');
      socket.off('room:typing');
      socket.off('room:timer');
      socket.off('room:error');
    };
  }, [roomId, router]);

  // Join room when user sets their name
  const handleJoinRoom = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const socket = getSocket();
    socket.emit('room:join', { roomId, name: name.trim() });
    setUserName(name.trim());
    setShowNameInput(false);
  }, [roomId]);

  // Manual retry function for connection issues
  const handleRetryConnection = () => {
    setConnectionError(null);
    setIsConnected(false);
    
    // Disconnect and reconnect
    const socket = getSocket();
    socket.disconnect();
    
    setTimeout(() => {
      socket.connect();
    }, 1000);
  };

  // Debug connection function
  const handleDebugConnection = async () => {
    console.log('🔍 Starting connection debug...');
    
    // Test 1: Health check
    try {
      const healthResponse = await fetch('/api/socket-health');
      const health = await healthResponse.json();
      console.log('✅ Health check:', health);
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
    
    // Test 2: Socket.IO endpoint
    try {
      const socketResponse = await fetch('/api/socketio');
      console.log('✅ Socket.IO endpoint response status:', socketResponse.status);
    } catch (error) {
      console.error('❌ Socket.IO endpoint failed:', error);
    }
    
    // Test 3: Current connection state
    const socket = getSocket();
    console.log('🔍 Current socket state:', {
      connected: socket.connected,
      id: socket.id,
      transport: (socket as ExtendedSocket).engine?.transport?.name,
      readyState: (socket as ExtendedSocket).engine?.readyState
    });
  };

  // Leave room when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userName) {
        const socket = getSocket();
        socket.emit('room:leave', { roomId });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userName) {
        const socket = getSocket();
        socket.emit('room:leave', { roomId });
      }
    };
  }, [roomId, userName]);

  const handleSendMessage = useCallback((text: string) => {
    const socket = getSocket();
    socket.emit('room:message', { roomId, text });
  }, [roomId]);

  const handleTyping = useCallback((typing: boolean) => {
    const socket = getSocket();
    socket.emit('room:typing', { roomId, typing });
  }, [roomId]);

  const handleRename = useCallback((newName: string) => {
    const socket = getSocket();
    socket.emit('room:rename', { roomId, name: newName });
    setUserName(newName);
  }, [roomId]);

  const handleTimerAction = useCallback((action: 'start' | 'pause' | 'reset') => {
    const socket = getSocket();
    socket.emit('room:timer', { roomId, action });
  }, [roomId]);

  const handleLeaveRoom = () => {
    if (userName) {
      const socket = getSocket();
      socket.emit('room:leave', { roomId });
    }
    router.push('/rooms');
  };

  // Name input overlay
  if (showNameInput) {
    return (
      <PageTransition>
        <div className="relative flex flex-col items-center justify-center px-3 sm:px-4 py-12 sm:py-20 bg-gradient-to-br from-background via-background to-primary/5">
          <FloatingPanels />
          <GridPattern />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs sm:max-w-md"
          >
            <div className="liquid-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
              <div className="mb-4 sm:mb-6">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h1 className="text-xl sm:text-2xl font-bold mb-2">Join Study Room</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Room: <span className="font-mono text-primary">{roomId.toUpperCase()}</span>
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string;
                  handleJoinRoom(name);
                }}
                className="space-y-3 sm:space-y-4"
              >
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm text-center text-sm sm:text-base"
                  maxLength={20}
                  required
                  autoFocus
                />
                
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
                  disabled={!isConnected}
                >
                  {isConnected ? 'Join Room' : 'Connecting...'}
                </Button>
              </form>

              {/* Connection Status */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isConnected ? (
                    <>
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">Connected</span>
                    </>
                  ) : connectionError ? (
                    <>
                      <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      <span className="text-xs sm:text-sm text-red-600 dark:text-red-400">Connection Error</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                      <span className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">Connecting...</span>
                    </>
                  )}
                </div>

                {connectionError && (
                  <div className="text-xs text-center space-y-2">
                    <p className="text-red-600 dark:text-red-400">{connectionError}</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetryConnection}
                        className="text-xs h-6 sm:h-8"
                      >
                        Retry Connection
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDebugConnection}
                        className="text-xs h-6 sm:h-8"
                      >
                        Debug
                      </Button>
                    </div>
                    <details className="mt-3 sm:mt-4">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Troubleshooting
                      </summary>
                      <div className="mt-2 text-xs text-left text-muted-foreground space-y-1">
                        <p>• Check your internet connection</p>
                        <p>• Disable browser extensions that block connections</p>
                        <p>• Try refreshing the page</p>
                        <p>• If using VPN, try disconnecting it</p>
                        <p>• Open browser developer tools to see detailed errors</p>
                      </div>
                    </details>
                  </div>
                )}
              </div>

              <Button
                onClick={() => router.push('/rooms')}
                variant="ghost"
                className="mt-3 sm:mt-4 w-full text-xs sm:text-sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Back to Rooms
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative px-3 sm:px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <FloatingPanels />
        <GridPattern />
        
        <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4 sm:mb-6"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={handleLeaveRoom}
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Study Room</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Code: <span className="font-mono text-primary">{roomId.toUpperCase()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 hidden sm:inline">Connected</span>
                </>
              ) : connectionError ? (
                <>
                  <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs sm:text-sm text-red-600 dark:text-red-400">Error</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{connectionError}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryConnection}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Retry
                  </Button>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 hidden sm:inline">Connecting...</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 xl:gap-6 min-h-[500px] xl:min-h-[600px] max-h-[75vh]">
            {/* Participants Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <ParticipantsPanel
                users={roomState.users}
                currentUserId={currentUserId}
                roomId={roomId}
                onRename={handleRename}
              />
            </motion.div>

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6"
            >
              <ChatPanel
                messages={roomState.messages}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                typingUsers={typingUsers}
              />
            </motion.div>

            {/* Utilities Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <UtilitiesPanel
                timerState={roomState.timerState}
                onTimerAction={handleTimerAction}
              />
            </motion.div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Tabs */}
            <div className="flex mb-3 sm:mb-4 p-1 bg-muted/50 rounded-xl">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm ${
                  activeTab === 'chat'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('timer')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm ${
                  activeTab === 'timer'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Timer</span>
              </button>
            </div>

            {/* Mobile Content */}
            <div className="space-y-3 sm:space-y-4">
              {/* Participants (always visible on mobile, compact) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-20 sm:h-24"
              >
                <ParticipantsPanel
                  users={roomState.users}
                  currentUserId={currentUserId}
                  roomId={roomId}
                  onRename={handleRename}
                />
              </motion.div>

              {/* Active Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="h-[55vh] sm:h-[60vh]"
              >
                {activeTab === 'chat' ? (
                  <ChatPanel
                    messages={roomState.messages}
                    currentUserId={currentUserId}
                    onSendMessage={handleSendMessage}
                    onTyping={handleTyping}
                    typingUsers={typingUsers}
                  />
                ) : (
                  <UtilitiesPanel
                    timerState={roomState.timerState}
                    onTimerAction={handleTimerAction}
                  />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
