import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_PREVIEW_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_PREVIEW_SIZE_4_5_WIDTH,
  CANVAS_PREVIEW_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
  CANVAS_PREVIEW_SIZE_9_16_WIDTH,
  CANVAS_PREVIEW_SIZE_9_16_HEIGHT,
} from '@/constants/CanvasContents';

export function getCanvasDimensions(
  aspectRatio: '1:1' | '4:5' | '9:16',
  isSafari: boolean
): { width: number; height: number } {
  if (aspectRatio === '4:5') {
    return isSafari
      ? { width: CANVAS_PREVIEW_SIZE_4_5_WIDTH, height: CANVAS_PREVIEW_SIZE_4_5_HEIGHT }
      : { width: CANVAS_ACTUAL_SIZE_4_5_WIDTH, height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT };
  }
  if (aspectRatio === '9:16') {
    return isSafari
      ? { width: CANVAS_PREVIEW_SIZE_9_16_WIDTH, height: CANVAS_PREVIEW_SIZE_9_16_HEIGHT }
      : { width: CANVAS_ACTUAL_SIZE_9_16_WIDTH, height: CANVAS_ACTUAL_SIZE_9_16_HEIGHT };
  }
  const size = isSafari ? CANVAS_PREVIEW_SIZE : CANVAS_ACTUAL_SIZE;
  return { width: size, height: size };
}

export function getCanvasDisplaySize(
  aspectRatio: '1:1' | '4:5' | '9:16'
): { width: number; height: number } {
  if (aspectRatio === '4:5') {
    return { width: 256, height: CANVAS_DISPLAY_SIZE };
  }
  if (aspectRatio === '9:16') {
    return { width: 180, height: CANVAS_DISPLAY_SIZE };
  }
  return { width: CANVAS_DISPLAY_SIZE, height: CANVAS_DISPLAY_SIZE };
}

export function resetCanvas(
  canvas: HTMLCanvasElement,
  backgroundColor: 'white' | 'black' = 'white',
  options?: { actualSize?: number; displaySize?: number; aspectRatio?: '1:1' | '4:5' | '9:16' }
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
