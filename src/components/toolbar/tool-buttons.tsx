import { Pencil, Eraser } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvas-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types';

const tools: { id: Tool; icon: typeof Pencil; label: string }[] = [
  { id: 'pen', icon: Pencil, label: 'Pen' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

export function ToolButtons() {
  const { tool, setTool } = useCanvasStore();

  return (
    <div className="flex items-center gap-1">
      {tools.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={tool === id ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => setTool(id)}
          aria-label={label}
          className={cn(tool === id && 'bg-primary text-primary-foreground')}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}
