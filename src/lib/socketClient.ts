import { io, Socket } from 'socket.io-client';

// Extended socket interface to handle unknown properties
interface ExtendedSocket extends Socket {
  engine?: {
    upgradeTimeout?: number;
  };
}

// Types for socket events
export interface User {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface TimerState {
  isActive: boolean;
  timeLeft: number; // in seconds
  mode: 'focus' | 'break';
  startedBy?: string;
  startedAt?: Date;
}

export interface RoomState {
  users: User[];
  messages: Message[];
  timerState: TimerState;
}

export interface ClientToServerEvents {
  'room:join': (data: { roomId: string; name: string }) => void;
  'room:leave': (data: { roomId: string }) => void;
  'room:message': (data: { roomId: string; text: string }) => void;
  'room:typing': (data: { roomId: string; typing: boolean }) => void;
  'room:rename': (data: { roomId: string; name: string }) => void;
  'room:timer': (data: { roomId: string; action: 'start' | 'pause' | 'reset' }) => void;
}

export interface ServerToClientEvents {
  'room:state': (data: RoomState) => void;
  'room:message': (data: Message) => void;
  'room:presence': (data: { type: 'join' | 'leave' | 'rename'; user: User; oldName?: string }) => void;
  'room:typing': (data: { userId: string; userName: string; typing: boolean }) => void;
  'room:timer': (data: TimerState) => void;
  'room:error': (data: { message: string }) => void;
}

// Create socket instance
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    // Use current window location to avoid port conflicts
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      : window.location.origin;
    
    console.log('🚀 Initializing Socket.IO connection to:', serverUrl);
    
    socket = io(serverUrl, {
      path: '/api/socketio',
      // Use only polling for maximum compatibility with Next.js
      transports: ['polling'],
      autoConnect: true,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000, // Reduced timeout
      upgrade: false, // Disable WebSocket upgrade
      // Additional options for reliability
      rememberUpgrade: false,
      closeOnBeforeunload: true,
    });

    // Connection event logging with better error details
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', socket?.id);
    });

    socket.on('disconnect', (reason, details) => {
      console.log('❌ Socket disconnected:', reason, details || '');
    });

    socket.on('connect_error', (error) => {
      console.error('🔥 Socket connection error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        toString: error.toString(),
        // Additional properties that might exist on socket errors
        ...Object.keys(error).reduce((acc, key) => ({ ...acc, [key]: (error as unknown as Record<string, unknown>)[key] }), {})
      });
    });

    // Handle reconnection events using the raw socket instance
    (socket as ExtendedSocket).on('reconnect', (attemptNumber: number) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    (socket as ExtendedSocket).on('reconnect_error', (error: Error) => {
      console.error('❌ Socket reconnection failed:', {
        message: error.message,
        stack: error.stack,
        attempt: (socket as ExtendedSocket).engine?.upgradeTimeout
      });
    });

    (socket as ExtendedSocket).on('reconnect_attempt', (attemptNumber: number) => {
      console.log('🔄 Socket reconnection attempt:', attemptNumber);
    });

    (socket as ExtendedSocket).on('reconnect_failed', () => {
      console.error('💥 Socket reconnection failed permanently after all attempts');
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
