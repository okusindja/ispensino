// types/next.d.ts
import type { Server as IOServer } from 'socket.io';

declare module 'http' {
  interface Server {
    io?: IOServer;
  }
}
