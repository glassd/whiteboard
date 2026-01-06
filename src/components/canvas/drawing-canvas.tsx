import { useEffect, useRef, useCallback } from "react";
import { useCanvas } from "@/hooks/use-canvas";
import { CursorOverlay } from "./cursor-overlay";
import { cn } from "@/lib/utils";

interface DrawingCanvasProps {
  roomId: string;
  className?: string;
}

export function DrawingCanvas({ roomId, className }: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    mainCanvasRef,
    previewCanvasRef,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
  } = useCanvas({ roomId });

  // Handle canvas resize
  const updateCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const mainCanvas = mainCanvasRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (!container || !mainCanvas || !previewCanvas) return;

    const rect = container.getBoundingClientRect();

    // Set canvas dimensions to match container
    mainCanvas.width = rect.width;
    mainCanvas.height = rect.height;
    previewCanvas.width = rect.width;
    previewCanvas.height = rect.height;
  }, [mainCanvasRef, previewCanvasRef]);

  // Initial resize and observer setup
  useEffect(() => {
    updateCanvasSize();

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCanvasSize]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-4 rounded-lg bg-white dark:bg-zinc-900 shadow-sm border overflow-hidden",
        className,
      )}
    >
      {/* Main canvas for committed strokes */}
      <canvas
        ref={mainCanvasRef}
        className="absolute inset-0 touch-none"
        style={{ cursor: "crosshair" }}
      />

      {/* Preview canvas for current stroke - also handles pointer events */}
      <canvas
        ref={previewCanvasRef}
        className="absolute inset-0 touch-none"
        style={{ cursor: "crosshair" }}
        onPointerDown={startDrawing}
        onPointerMove={continueDrawing}
        onPointerUp={endDrawing}
        onPointerLeave={cancelDrawing}
        onPointerCancel={cancelDrawing}
      />

      {/* Remote cursors overlay */}
      <CursorOverlay />
    </div>
  );
}
