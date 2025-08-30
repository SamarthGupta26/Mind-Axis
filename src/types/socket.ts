import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Socket as NetSocket } from 'net';
import { Server as HTTPServer } from 'http';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: SocketWithIO;
}
