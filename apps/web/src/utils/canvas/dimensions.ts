import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH,
  CANVAS_DISPLAY_SIZE_DESKTOP,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP,
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
import type { AspectRatio, BackgroundColor } from '@/atoms/imageAtoms';

export function getCanvasDimensions(
  aspectRatio: AspectRatio,
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
  aspectRatio: AspectRatio,
  isDesktop: boolean = false
): { width: number; height: number } {
  if (isDesktop) {
    if (aspectRatio === '4:5') {
      return { width: CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP, height: CANVAS_DISPLAY_SIZE_DESKTOP };
    }
    if (aspectRatio === '9:16') {
      return { width: CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP, height: CANVAS_DISPLAY_SIZE_DESKTOP };
    }
    return { width: CANVAS_DISPLAY_SIZE_DESKTOP, height: CANVAS_DISPLAY_SIZE_DESKTOP };
  }
  if (aspectRatio === '4:5') {
    return { width: CANVAS_DISPLAY_SIZE_4_5_WIDTH, height: CANVAS_DISPLAY_SIZE };
  }
  if (aspectRatio === '9:16') {
    return { width: CANVAS_DISPLAY_SIZE_9_16_WIDTH, height: CANVAS_DISPLAY_SIZE };
  }
  return { width: CANVAS_DISPLAY_SIZE, height: CANVAS_DISPLAY_SIZE };
}

export function getThumbnailCanvasSize(
  aspectRatio: AspectRatio,
  displayHeight: number,
  renderScale: number = 2
): { width: number; height: number; displayWidth: number; displayHeight: number } {
  const ratio = aspectRatio === '4:5' ? 4 / 5 : aspectRatio === '9:16' ? 9 / 16 : 1;
  const displayWidth = Math.round(displayHeight * ratio);

  return {
    width: Math.round(displayWidth * renderScale),
    height: Math.round(displayHeight * renderScale),
    displayWidth,
    displayHeight,
  };
}

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
