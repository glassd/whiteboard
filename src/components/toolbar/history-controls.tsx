import { useEffect, useCallback } from 'react';
import { Undo2, Redo2, Trash2 } from 'lucide-react';
import { socket } from '@/lib/socket';
import { useCanvasStore } from '@/stores/canvas-store';
import { useRoomStore } from '@/stores/room-store';
import { Button } from '@/components/ui/button';

export function HistoryControls() {
  const { undoStack, redoStack, undo, redo, clearCanvas } = useCanvasStore();
  const roomId = useRoomStore((state) => state.roomId);

  const handleUndo = useCallback(() => {
    const stroke = undo();
    if (stroke && roomId) {
      socket.emit('draw:undo', { roomId, strokeId: stroke.id });
    }
  }, [undo, roomId]);

  const handleRedo = useCallback(() => {
    const stroke = redo();
    if (stroke && roomId) {
      socket.emit('draw:redo', { roomId, stroke });
    }
  }, [redo, roomId]);

  const handleClear = useCallback(() => {
    if (roomId) {
      clearCanvas();
      socket.emit('draw:clear', { roomId });
    }
  }, [clearCanvas, roomId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (modifier && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else if (modifier && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleUndo}
        disabled={undoStack.length === 0}
        aria-label="Undo (Ctrl+Z)"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleRedo}
        disabled={redoStack.length === 0}
        aria-label="Redo (Ctrl+Shift+Z)"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleClear}
        aria-label="Clear canvas"
        title="Clear canvas"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
