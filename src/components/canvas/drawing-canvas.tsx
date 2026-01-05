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
    const dpr = window.devicePixelRatio || 1;

    // Set display size
    mainCanvas.style.width = `${rect.width}px`;
    mainCanvas.style.height = `${rect.height}px`;
    previewCanvas.style.width = `${rect.width}px`;
    previewCanvas.style.height = `${rect.height}px`;

    // Set actual size in memory (scaled for retina)
    mainCanvas.width = rect.width * dpr;
    mainCanvas.height = rect.height * dpr;
    previewCanvas.width = rect.width * dpr;
    previewCanvas.height = rect.height * dpr;

    // Scale context for retina
    const mainCtx = mainCanvas.getContext("2d");
    const previewCtx = previewCanvas.getContext("2d");

    if (mainCtx) mainCtx.scale(dpr, dpr);
    if (previewCtx) previewCtx.scale(dpr, dpr);

    // Reset canvas dimensions for drawing calculations
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

      {/* Preview canvas for current stroke */}
      <canvas
        ref={previewCanvasRef}
        className="absolute inset-0 touch-none pointer-events-none"
      />

      {/* Interactive layer for pointer events */}
      <div
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
