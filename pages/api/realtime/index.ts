/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/realtime.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

const socketHandler = (
  req: NextApiRequest,
  res: NextApiResponse & { socket: any }
) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('subscribe', (userId: string) => {
        socket.join(userId);
      });

      socket.on('disconnect', () => {});
    });
  }
  res.end();
};

export default socketHandler;
