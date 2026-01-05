import { useParams } from 'react-router-dom';
import { DrawingCanvas } from '@/components/canvas/drawing-canvas';
import { Toolbar } from '@/components/toolbar/toolbar';
import { UserList } from '@/components/presence/user-list';
import { ConnectionStatus } from '@/components/presence/connection-status';
import { useSocket } from '@/hooks/use-socket';
import { useRoom } from '@/hooks/use-room';

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { isConnected } = useSocket();

  useRoom(roomId || '');

  if (!roomId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Invalid room ID</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-3">
          <Toolbar />
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus isConnected={isConnected} />
          <UserList />
        </div>
      </div>
      <div className="flex-1 relative bg-muted/30">
        <DrawingCanvas roomId={roomId} />
      </div>
    </div>
  );
}
