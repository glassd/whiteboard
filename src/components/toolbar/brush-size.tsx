import { useCanvasStore } from '@/stores/canvas-store';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MIN_SIZE = 1;
const MAX_SIZE = 50;
const STEP = 2;

export function BrushSize() {
  const { brushSize, setBrushSize } = useCanvasStore();

  const decrease = () => {
    setBrushSize(Math.max(MIN_SIZE, brushSize - STEP));
  };

  const increase = () => {
    setBrushSize(Math.min(MAX_SIZE, brushSize + STEP));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={decrease}
        disabled={brushSize <= MIN_SIZE}
        aria-label="Decrease brush size"
      >
        <Minus className="w-3 h-3" />
      </Button>

      <div className="flex items-center justify-center w-16 gap-2">
        <div
          className="rounded-full bg-foreground"
          style={{
            width: Math.min(brushSize, 20),
            height: Math.min(brushSize, 20),
          }}
        />
        <span className="text-xs text-muted-foreground w-6 text-right">
          {brushSize}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={increase}
        disabled={brushSize >= MAX_SIZE}
        aria-label="Increase brush size"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}
