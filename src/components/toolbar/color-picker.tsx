import { useCanvasStore } from '@/stores/canvas-store';
import { cn } from '@/lib/utils';

const COLORS = [
  '#000000', // Black
  '#6b7280', // Gray
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
];

export function ColorPicker() {
  const { color, setColor } = useCanvasStore();

  return (
    <div className="flex items-center gap-1">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => setColor(c)}
          className={cn(
            'w-6 h-6 rounded-full border-2 transition-transform hover:scale-110',
            color === c ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
          )}
          style={{ backgroundColor: c }}
          aria-label={`Select color ${c}`}
        />
      ))}
    </div>
  );
}
