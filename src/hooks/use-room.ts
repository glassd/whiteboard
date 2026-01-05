import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useRoomStore } from '@/stores/room-store';
import { useUserStore } from '@/stores/user-store';
import { useCanvasStore } from '@/stores/canvas-store';

export function useRoom(roomId: string) {
  const { setRoomId, reset: resetRoom } = useRoomStore();
  const { reset: resetCanvas } = useCanvasStore();
  const user = useUserStore();

  useEffect(() => {
    if (!roomId) return;

    setRoomId(roomId);

    // Join room when socket is connected
    const joinRoom = () => {
      socket.emit('room:join', {
        roomId,
        user: {
          id: user.id,
          name: user.name,
          color: user.color,
        },
      });
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on('connect', joinRoom);

    return () => {
      socket.off('connect', joinRoom);
      socket.emit('room:leave', { roomId });
      resetRoom();
      resetCanvas();
    };
  }, [roomId, user.id, user.name, user.color, setRoomId, resetRoom, resetCanvas]);
}
