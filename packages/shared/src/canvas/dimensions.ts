import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH,
  CANVAS_PREVIEW_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_PREVIEW_SIZE_4_5_WIDTH,
  CANVAS_PREVIEW_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
  CANVAS_PREVIEW_SIZE_9_16_WIDTH,
  CANVAS_PREVIEW_SIZE_9_16_HEIGHT,
} from '../constants/CanvasContents';
import type { AspectRatio } from '../atoms/imageAtoms';

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
  aspectRatio: AspectRatio
): { width: number; height: number } {
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
