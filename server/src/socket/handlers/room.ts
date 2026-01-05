import type { Server, Socket } from 'socket.io';
import type { RoomManager } from '../../rooms/manager.js';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  UserInfo,
} from '../../types.js';

type IOServer = Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>;

export function setupRoomHandlers(
  io: IOServer,
  socket: IOSocket,
  roomManager: RoomManager
): void {
  socket.on('room:join', ({ roomId, user }) => {
    // Leave previous room if any
    if (socket.data.roomId) {
      socket.leave(socket.data.roomId);
      roomManager.removeUserFromRoom(socket.data.roomId, socket.data.userId);
      io.to(socket.data.roomId).emit('room:user-left', { userId: socket.data.userId });
    }

    // Store user info in socket data
    socket.data.userId = user.id;
    socket.data.userName = user.name;
    socket.data.userColor = user.color;
    socket.data.roomId = roomId;

    // Join the room
    socket.join(roomId);
    roomManager.addUserToRoom(roomId, user);

    // Send current room state to the joining user
    const state = roomManager.getRoomState(roomId);
    if (state) {
      socket.emit('room:state', state);
    }

    // Notify other users in the room
    socket.to(roomId).emit('room:user-joined', { user });

    console.log(`User ${user.name} (${user.id}) joined room ${roomId}`);
  });

  socket.on('room:leave', ({ roomId }) => {
    if (socket.data.roomId === roomId) {
      socket.leave(roomId);
      roomManager.removeUserFromRoom(roomId, socket.data.userId);
      io.to(roomId).emit('room:user-left', { userId: socket.data.userId });
      socket.data.roomId = null;
      console.log(`User ${socket.data.userName} left room ${roomId}`);
    }
  });
}

export function handleDisconnect(
  io: IOServer,
  socket: IOSocket,
  roomManager: RoomManager
): void {
  const { roomId, userId, userName } = socket.data;
  if (roomId && userId) {
    roomManager.removeUserFromRoom(roomId, userId);
    io.to(roomId).emit('room:user-left', { userId });
    console.log(`User ${userName} disconnected from room ${roomId}`);
  }
}
