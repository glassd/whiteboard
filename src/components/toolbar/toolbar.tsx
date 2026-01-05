import { ToolButtons } from './tool-buttons';
import { ColorPicker } from './color-picker';
import { BrushSize } from './brush-size';
import { HistoryControls } from './history-controls';
import { Separator } from '@/components/ui/separator';

export function Toolbar() {
  return (
    <div className="flex items-center gap-3">
      <ToolButtons />
      <Separator orientation="vertical" className="h-6" />
      <ColorPicker />
      <Separator orientation="vertical" className="h-6" />
      <BrushSize />
      <Separator orientation="vertical" className="h-6" />
      <HistoryControls />
    </div>
  );
}
