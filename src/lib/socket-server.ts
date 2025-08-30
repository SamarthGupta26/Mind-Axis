import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'socket.io';

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

// In-memory storage for rooms (in production, use Redis or database)
const rooms = new Map<string, RoomState>();
const userRooms = new Map<string, string>(); // userId -> roomId

// Timer intervals for each room
const timerIntervals = new Map<string, NodeJS.Timeout>();

export function initializeSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Helper function to get or create room
  function getOrCreateRoom(roomId: string): RoomState {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: [],
        messages: [],
        timerState: {
          isActive: false,
          timeLeft: 25 * 60, // 25 minutes
          mode: 'focus',
        },
      });
    }
    return rooms.get(roomId)!;
  }

  // Helper function to start timer
  function startTimer(roomId: string, startedBy: string) {
    const room = getOrCreateRoom(roomId);
    
    // Clear existing timer
    const existingInterval = timerIntervals.get(roomId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    room.timerState.isActive = true;
    room.timerState.startedBy = startedBy;
    room.timerState.startedAt = new Date();

    const interval = setInterval(() => {
      const room = rooms.get(roomId);
      if (!room || !room.timerState.isActive) {
        clearInterval(interval);
        timerIntervals.delete(roomId);
        return;
      }

      room.timerState.timeLeft -= 1;

      if (room.timerState.timeLeft <= 0) {
        // Timer finished - switch mode
        if (room.timerState.mode === 'focus') {
          room.timerState.mode = 'break';
          room.timerState.timeLeft = 5 * 60; // 5 minute break
        } else {
          room.timerState.mode = 'focus';
          room.timerState.timeLeft = 25 * 60; // 25 minute focus
        }
        room.timerState.isActive = false;
        clearInterval(interval);
        timerIntervals.delete(roomId);
      }

      // Broadcast timer update
      io.to(roomId).emit('room:timer', room.timerState);
    }, 1000);

    timerIntervals.set(roomId, interval);
  }

  // Helper function to stop timer
  function stopTimer(roomId: string) {
    const interval = timerIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      timerIntervals.delete(roomId);
    }

    const room = rooms.get(roomId);
    if (room) {
      room.timerState.isActive = false;
    }
  }

  // Helper function to reset timer
  function resetTimer(roomId: string) {
    stopTimer(roomId);
    const room = rooms.get(roomId);
    if (room) {
      room.timerState.timeLeft = room.timerState.mode === 'focus' ? 25 * 60 : 5 * 60;
      room.timerState.isActive = false;
      room.timerState.startedBy = undefined;
      room.timerState.startedAt = undefined;
    }
  }

  // Handle client connections
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join room
    socket.on('room:join', ({ roomId, name }) => {
      try {
        if (!roomId || !name) {
          socket.emit('room:error', { message: 'Room ID and name are required' });
          return;
        }

        const room = getOrCreateRoom(roomId);
        
        // Check if user already exists in room
        const existingUser = room.users.find(u => u.id === socket.id);
        if (existingUser) {
          socket.emit('room:error', { message: 'You are already in this room' });
          return;
        }

        // Add user to room
        const user: User = {
          id: socket.id,
          name: name.trim(),
          joinedAt: new Date(),
        };

        room.users.push(user);
        userRooms.set(socket.id, roomId);
        
        // Join socket room
        socket.join(roomId);

        // Send room state to joining user
        socket.emit('room:state', room);

        // Notify others about new user
        socket.to(roomId).emit('room:presence', {
          type: 'join',
          user,
        });

        console.log(`User ${name} (${socket.id}) joined room ${roomId}`);

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('room:error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('room:leave', ({ roomId }) => {
      handleUserLeave(socket, roomId);
    });

    // Send message
    socket.on('room:message', ({ roomId, text }) => {
      try {
        if (!roomId || !text) {
          socket.emit('room:error', { message: 'Room ID and message text are required' });
          return;
        }

        const room = rooms.get(roomId);
        if (!room) {
          socket.emit('room:error', { message: 'Room not found' });
          return;
        }

        const user = room.users.find(u => u.id === socket.id);
        if (!user) {
          socket.emit('room:error', { message: 'You are not in this room' });
          return;
        }

        const message: Message = {
          id: Date.now().toString(),
          userId: socket.id,
          userName: user.name,
          text: text.trim(),
          timestamp: new Date(),
        };

        room.messages.push(message);

        // Broadcast message to all users in room
        io.to(roomId).emit('room:message', message);

        console.log(`Message from ${user.name} in room ${roomId}: ${text}`);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('room:error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('room:typing', ({ roomId, typing }) => {
      try {
        const room = rooms.get(roomId);
        if (!room) return;

        const user = room.users.find(u => u.id === socket.id);
        if (!user) return;

        // Broadcast typing status to others
        socket.to(roomId).emit('room:typing', {
          userId: socket.id,
          userName: user.name,
          typing,
        });

      } catch (error) {
        console.error('Error handling typing:', error);
      }
    });

    // Rename user
    socket.on('room:rename', ({ roomId, name }) => {
      try {
        if (!roomId || !name) {
          socket.emit('room:error', { message: 'Room ID and name are required' });
          return;
        }

        const room = rooms.get(roomId);
        if (!room) {
          socket.emit('room:error', { message: 'Room not found' });
          return;
        }

        const user = room.users.find(u => u.id === socket.id);
        if (!user) {
          socket.emit('room:error', { message: 'You are not in this room' });
          return;
        }

        const oldName = user.name;
        user.name = name.trim();

        // Notify all users about rename
        io.to(roomId).emit('room:presence', {
          type: 'rename',
          user,
          oldName,
        });

        console.log(`User ${oldName} renamed to ${user.name} in room ${roomId}`);

      } catch (error) {
        console.error('Error renaming user:', error);
        socket.emit('room:error', { message: 'Failed to rename user' });
      }
    });

    // Timer actions
    socket.on('room:timer', ({ roomId, action }) => {
      try {
        if (!roomId || !action) {
          socket.emit('room:error', { message: 'Room ID and action are required' });
          return;
        }

        const room = rooms.get(roomId);
        if (!room) {
          socket.emit('room:error', { message: 'Room not found' });
          return;
        }

        const user = room.users.find(u => u.id === socket.id);
        if (!user) {
          socket.emit('room:error', { message: 'You are not in this room' });
          return;
        }

        switch (action) {
          case 'start':
            if (!room.timerState.isActive) {
              startTimer(roomId, user.name);
            }
            break;
          case 'pause':
            if (room.timerState.isActive) {
              stopTimer(roomId);
            }
            break;
          case 'reset':
            resetTimer(roomId);
            break;
        }

        // Broadcast timer state
        io.to(roomId).emit('room:timer', room.timerState);

        console.log(`Timer ${action} by ${user.name} in room ${roomId}`);

      } catch (error) {
        console.error('Error handling timer action:', error);
        socket.emit('room:error', { message: 'Failed to handle timer action' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      const roomId = userRooms.get(socket.id);
      if (roomId) {
        handleUserLeave(socket, roomId);
      }
    });

    // Helper function to handle user leaving
    function handleUserLeave(socket: Socket, roomId?: string) {
      try {
        const actualRoomId = roomId || userRooms.get(socket.id);
        if (!actualRoomId) return;

        const room = rooms.get(actualRoomId);
        if (!room) return;

        const userIndex = room.users.findIndex(u => u.id === socket.id);
        if (userIndex === -1) return;

        const user = room.users[userIndex];
        room.users.splice(userIndex, 1);
        userRooms.delete(socket.id);

        // Leave socket room
        socket.leave(actualRoomId);

        // Notify others about user leaving
        socket.to(actualRoomId).emit('room:presence', {
          type: 'leave',
          user,
        });

        // Clean up empty rooms
        if (room.users.length === 0) {
          stopTimer(actualRoomId);
          rooms.delete(actualRoomId);
          console.log(`Room ${actualRoomId} deleted (empty)`);
        }

        console.log(`User ${user.name} (${socket.id}) left room ${actualRoomId}`);

      } catch (error) {
        console.error('Error handling user leave:', error);
      }
    }
  });

  console.log('Socket.IO server initialized');
  return io;
}
