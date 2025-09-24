import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer, type Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketWithServer extends NetSocket {
  server: HTTPServer & { io?: IOServer };
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithServer;
}

interface SignalMessage {
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

type User = {
  id: string;
  name: string;
  muted: boolean;
};

const rooms: Record<string, User[]> = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  const server: HTTPServer & { io?: IOServer } = res.socket.server;

  if (!server.io) {
    console.log('🔌 Initializing Socket.IO...');
    const io = new IOServer(server, { path: '/api/socket.io' });

    io.on('connection', (socket: Socket) => {
      console.log('✅ Client connected:', socket.id);

      socket.on(
        'join-room',
        ({ roomId, name }: { roomId: string; name: string }) => {
          socket.join(roomId);

          const user: User = { id: socket.id, name, muted: false };
          if (!rooms[roomId]) rooms[roomId] = [];
          rooms[roomId].push(user);

          io.to(roomId).emit('room-users', rooms[roomId]);
        }
      );

      socket.on('signal', ({ roomId, data }: { roomId: string; data: any }) => {
        socket.to(roomId).emit('signal', { senderId: socket.id, data });
      });

      socket.on(
        'toggle-mute',
        ({ roomId, muted }: { roomId: string; muted: boolean }) => {
          const users = rooms[roomId] || [];
          const user = users.find((u) => u.id === socket.id);
          if (user) user.muted = muted;
          io.to(roomId).emit('room-users', users);
        }
      );

      socket.on('disconnecting', () => {
        for (const roomId of socket.rooms) {
          if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);
            io.to(roomId).emit('room-users', rooms[roomId]);
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });

    server.io = io;
  }

  res.end();
}
