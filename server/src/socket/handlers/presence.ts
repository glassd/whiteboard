import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../../types.js';

type IOServer = Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>;

export function setupPresenceHandlers(
  io: IOServer,
  socket: IOSocket
): void {
  socket.on('presence:cursor', ({ roomId, position }) => {
    if (socket.data.roomId !== roomId) return;

    socket.to(roomId).emit('presence:cursor', {
      userId: socket.data.userId,
      position,
      userName: socket.data.userName,
      color: socket.data.userColor,
    });
  });
}
