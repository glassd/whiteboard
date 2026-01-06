import type { Point, Stroke } from "@/types";

export function normalizePoint(
  x: number,
  y: number,
  canvas: HTMLCanvasElement,
): Point {
  return {
    x: x / canvas.width,
    y: y / canvas.height,
  };
}

export function denormalizePoint(
  point: Point,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  return {
    x: point.x * canvas.width,
    y: point.y * canvas.height,
  };
}

export function getPointerPosition(
  event: PointerEvent | React.PointerEvent,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export function renderStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  canvas: HTMLCanvasElement,
): void {
  if (stroke.points.length < 2) {
    // Draw a single point as a circle
    if (stroke.points.length === 1) {
      const point = denormalizePoint(stroke.points[0], canvas);
      ctx.beginPath();
      ctx.arc(point.x, point.y, stroke.brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
      ctx.fill();
    }
    return;
  }

  ctx.beginPath();
  ctx.strokeStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
  ctx.lineWidth = stroke.brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
  }

  const firstPoint = denormalizePoint(stroke.points[0], canvas);
  ctx.moveTo(firstPoint.x, firstPoint.y);

  // Use quadratic bezier curves for smooth lines
  for (let i = 1; i < stroke.points.length - 1; i++) {
    const current = denormalizePoint(stroke.points[i], canvas);
    const next = denormalizePoint(stroke.points[i + 1], canvas);
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    ctx.quadraticCurveTo(current.x, current.y, midX, midY);
  }

  // Draw to the last point
  const lastPoint = denormalizePoint(
    stroke.points[stroke.points.length - 1],
    canvas,
  );
  ctx.lineTo(lastPoint.x, lastPoint.y);

  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

export function renderStrokePreview(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  canvas: HTMLCanvasElement,
): void {
  if (stroke.points.length < 2) {
    if (stroke.points.length === 1) {
      const point = denormalizePoint(stroke.points[0], canvas);
      ctx.beginPath();
      ctx.arc(point.x, point.y, stroke.brushSize / 2, 0, Math.PI * 2);
      if (stroke.tool === "eraser") {
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
      } else {
        ctx.fillStyle = stroke.color;
      }
      ctx.fill();
    }
    return;
  }

  ctx.beginPath();
  if (stroke.tool === "eraser") {
    ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
  } else {
    ctx.strokeStyle = stroke.color;
  }
  ctx.lineWidth = stroke.brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const firstPoint = denormalizePoint(stroke.points[0], canvas);
  ctx.moveTo(firstPoint.x, firstPoint.y);

  for (let i = 1; i < stroke.points.length - 1; i++) {
    const current = denormalizePoint(stroke.points[i], canvas);
    const next = denormalizePoint(stroke.points[i + 1], canvas);
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    ctx.quadraticCurveTo(current.x, current.y, midX, midY);
  }

  const lastPoint = denormalizePoint(
    stroke.points[stroke.points.length - 1],
    canvas,
  );
  ctx.lineTo(lastPoint.x, lastPoint.y);

  ctx.stroke();
}

export function renderAllStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  canvas: HTMLCanvasElement,
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const stroke of strokes) {
    renderStroke(ctx, stroke, canvas);
  }
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
