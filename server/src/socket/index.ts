import type { Server } from 'socket.io';
import type { RoomManager } from '../rooms/manager.js';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../types.js';
import { setupRoomHandlers, handleDisconnect } from './handlers/room.js';
import { setupDrawingHandlers } from './handlers/drawing.js';
import { setupPresenceHandlers } from './handlers/presence.js';

type IOServer = Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;

export function setupSocketHandlers(io: IOServer, roomManager: RoomManager): void {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Initialize socket data
    socket.data.userId = '';
    socket.data.userName = '';
    socket.data.userColor = '';
    socket.data.roomId = null;

    // Setup handlers
    setupRoomHandlers(io, socket, roomManager);
    setupDrawingHandlers(io, socket, roomManager);
    setupPresenceHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      handleDisconnect(io, socket, roomManager);
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
