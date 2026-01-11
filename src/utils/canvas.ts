'use client';

export function resetCanvas(
  canvas: HTMLCanvasElement,
  backgroundColor: 'white' | 'black' = 'white',
  options?: { actualSize?: number; displaySize?: number }
) {
  const actualSize = options?.actualSize ?? 2000;
  const displaySize = options?.displaySize ?? 320;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = actualSize;
  canvas.height = actualSize;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, actualSize, actualSize);
}


