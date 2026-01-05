import type { Server, Socket } from 'socket.io';
import type { RoomManager } from '../../rooms/manager.js';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../../types.js';

type IOServer = Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>;

export function setupDrawingHandlers(
  io: IOServer,
  socket: IOSocket,
  roomManager: RoomManager
): void {
  socket.on('draw:stroke', ({ roomId, stroke }) => {
    if (socket.data.roomId !== roomId) return;

    roomManager.addStroke(roomId, stroke);
    socket.to(roomId).emit('draw:stroke', { stroke });
  });

  socket.on('draw:undo', ({ roomId, strokeId }) => {
    if (socket.data.roomId !== roomId) return;

    const removed = roomManager.removeStroke(roomId, strokeId);
    if (removed) {
      socket.to(roomId).emit('draw:undo', { strokeId });
    }
  });

  socket.on('draw:redo', ({ roomId, stroke }) => {
    if (socket.data.roomId !== roomId) return;

    roomManager.addStrokeBack(roomId, stroke);
    socket.to(roomId).emit('draw:redo', { stroke });
  });

  socket.on('draw:clear', ({ roomId }) => {
    if (socket.data.roomId !== roomId) return;

    roomManager.clearStrokes(roomId);
    socket.to(roomId).emit('draw:clear');
  });
}
