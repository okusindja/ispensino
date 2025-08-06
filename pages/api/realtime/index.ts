/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/realtime.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

const socketHandler = (
  req: NextApiRequest,
  res: NextApiResponse & { socket: any }
) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('subscribe', (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} subscribed to notifications`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  res.end();
};

export default socketHandler;
