import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { useRoomStore } from '@/stores/room-store';
import { useCanvasStore } from '@/stores/canvas-store';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { setConnected, addUser, removeUser, updateCursor, setUsers } = useRoomStore();
  const { addStroke, removeStroke, loadStrokes, clearCanvas } = useCanvasStore();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Room events
    socket.on('room:state', ({ strokes, users }) => {
      loadStrokes(strokes);
      setUsers(users);
    });

    socket.on('room:user-joined', ({ user }) => {
      addUser(user);
    });

    socket.on('room:user-left', ({ userId }) => {
      removeUser(userId);
    });

    // Drawing events
    socket.on('draw:stroke', ({ stroke }) => {
      addStroke(stroke);
    });

    socket.on('draw:undo', ({ strokeId }) => {
      removeStroke(strokeId);
    });

    socket.on('draw:redo', ({ stroke }) => {
      addStroke(stroke);
    });

    socket.on('draw:clear', () => {
      clearCanvas();
    });

    // Presence events
    socket.on('presence:cursor', ({ userId, position, userName, color }) => {
      updateCursor(userId, { position, userName, color });
    });

    socket.on('presence:users', ({ users }) => {
      setUsers(users);
    });

    // Connect
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room:state');
      socket.off('room:user-joined');
      socket.off('room:user-left');
      socket.off('draw:stroke');
      socket.off('draw:undo');
      socket.off('draw:redo');
      socket.off('draw:clear');
      socket.off('presence:cursor');
      socket.off('presence:users');
    };
  }, [setConnected, addUser, removeUser, updateCursor, setUsers, addStroke, removeStroke, loadStrokes, clearCanvas]);

  return { isConnected, socket };
}
