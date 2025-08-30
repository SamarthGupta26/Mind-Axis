import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Simple health check for Socket.IO
    res.status(200).json({
      status: 'ok',
      socketio: 'available',
      timestamp: new Date().toISOString(),
      transport: 'polling',
      path: '/api/socketio'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
