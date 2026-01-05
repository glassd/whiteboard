import { useCallback, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { socket } from "@/lib/socket";
import { useCanvasStore } from "@/stores/canvas-store";
import { useUserStore } from "@/stores/user-store";
import {
  normalizePoint,
  getPointerPosition,
  renderStroke,
  renderAllStrokes,
  clearCanvas as clearCanvasUtil,
} from "@/lib/canvas-utils";
import type { Stroke } from "@/types";

interface UseCanvasOptions {
  roomId: string;
}

export function useCanvas({ roomId }: UseCanvasOptions) {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastCursorUpdateRef = useRef(0);

  const { color, brushSize, tool, strokes, addStroke } = useCanvasStore();
  const user = useUserStore();

  // Render all strokes to main canvas
  const renderMainCanvas = useCallback(() => {
    const canvas = mainCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    renderAllStrokes(ctx, strokes, canvas);
  }, [strokes]);

  // Render current stroke to preview canvas
  const renderPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !currentStrokeRef.current) return;

    clearCanvasUtil(ctx, canvas);
    renderStroke(ctx, currentStrokeRef.current, canvas);
  }, []);

  // Clear preview canvas
  const clearPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    clearCanvasUtil(ctx, canvas);
  }, []);

  // Re-render main canvas when strokes change
  useEffect(() => {
    renderMainCanvas();
  }, [renderMainCanvas]);

  // Start drawing
  const startDrawing = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const canvas = mainCanvasRef.current;
      if (!canvas) return;

      isDrawingRef.current = true;
      const pos = getPointerPosition(e.nativeEvent, canvas);
      const normalizedPoint = normalizePoint(pos.x, pos.y, canvas);

      currentStrokeRef.current = {
        id: nanoid(),
        userId: user.id,
        points: [normalizedPoint],
        color,
        brushSize,
        tool,
        timestamp: Date.now(),
      };

      renderPreview();

      // Capture pointer for smooth drawing
      canvas.setPointerCapture(e.pointerId);
    },
    [color, brushSize, tool, user.id, renderPreview],
  );

  // Continue drawing
  const continueDrawing = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const canvas = mainCanvasRef.current;
      if (!canvas) return;

      const pos = getPointerPosition(e.nativeEvent, canvas);

      // Throttled cursor broadcast
      const now = Date.now();
      if (now - lastCursorUpdateRef.current > 16) {
        // ~60fps
        const normalizedPos = normalizePoint(pos.x, pos.y, canvas);
        socket.emit("presence:cursor", {
          roomId,
          position: normalizedPos,
        });
        lastCursorUpdateRef.current = now;
      }

      if (!isDrawingRef.current || !currentStrokeRef.current) return;

      const normalizedPoint = normalizePoint(pos.x, pos.y, canvas);
      currentStrokeRef.current.points.push(normalizedPoint);

      renderPreview();
    },
    [roomId, renderPreview],
  );

  // End drawing
  const endDrawing = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const canvas = mainCanvasRef.current;
      if (!canvas) return;

      canvas.releasePointerCapture(e.pointerId);

      if (!isDrawingRef.current || !currentStrokeRef.current) return;

      isDrawingRef.current = false;
      const stroke = currentStrokeRef.current;
      currentStrokeRef.current = null;

      // Only add stroke if it has points
      if (stroke.points.length > 0) {
        addStroke(stroke);
        socket.emit("draw:stroke", { roomId, stroke });
      }

      clearPreview();
    },
    [roomId, addStroke, clearPreview],
  );

  // Cancel drawing (e.g., pointer leaves canvas)
  const cancelDrawing = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      currentStrokeRef.current = null;
      clearPreview();
    }
  }, [clearPreview]);

  return {
    mainCanvasRef,
    previewCanvasRef,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
  };
}
