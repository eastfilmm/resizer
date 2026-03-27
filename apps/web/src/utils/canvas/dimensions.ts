export { getCanvasDimensions, getCanvasDisplaySize, getThumbnailCanvasSize } from '@resizer/shared/canvas';

import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
} from '@resizer/shared/constants';
import type { AspectRatio, BackgroundColor } from '@resizer/shared/atoms';

export function resetCanvas(
  canvas: HTMLCanvasElement,
  backgroundColor: BackgroundColor = 'white',
  options?: { actualSize?: number; displaySize?: number; aspectRatio?: AspectRatio }
) {
  const aspectRatio = options?.aspectRatio ?? '1:1';
  let actualWidth: number;
  let actualHeight: number;
  if (aspectRatio === '4:5') {
    actualWidth = CANVAS_ACTUAL_SIZE_4_5_WIDTH;
    actualHeight = CANVAS_ACTUAL_SIZE_4_5_HEIGHT;
  } else if (aspectRatio === '9:16') {
    actualWidth = CANVAS_ACTUAL_SIZE_9_16_WIDTH;
    actualHeight = CANVAS_ACTUAL_SIZE_9_16_HEIGHT;
  } else {
    actualWidth = CANVAS_ACTUAL_SIZE;
    actualHeight = CANVAS_ACTUAL_SIZE;
  }
  const displaySize = options?.displaySize ?? CANVAS_DISPLAY_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = actualWidth;
  canvas.height = actualHeight;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, actualWidth, actualHeight);
}
