import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH,
  CANVAS_DISPLAY_SIZE_DESKTOP,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP,
  CANVAS_PREVIEW_SIZE,
  CANVAS_PREVIEW_SIZE_DESKTOP,
} from '@/constants/CanvasContents';
import type { AspectRatio, BackgroundColor } from '@/atoms/imageAtoms';

// 캔버스 높이는 비율과 무관하게 고정이고, 너비만 비율에 따라 줄어든다.
const ASPECT_RATIO_WIDTH_FACTOR: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '9:16': 9 / 16,
};

/**
 * 프리뷰 렌더 해상도(높이 기준). 브라우저 종류와 무관하게 항상 적용된다.
 * 다운로드는 항상 CANVAS_ACTUAL_SIZE로 렌더하므로 결과물 품질에는 영향이 없다.
 */
export function getPreviewCanvasHeight(isDesktop: boolean = false): number {
  return isDesktop ? CANVAS_PREVIEW_SIZE_DESKTOP : CANVAS_PREVIEW_SIZE;
}

/**
 * 2000px 기준으로 정의된 설정값(padding, blur, shadow 등)을 프리뷰 해상도로 환산하는 배율.
 * 모바일 0.4, 데스크톱 0.6
 */
export function getPreviewScaleFactor(isDesktop: boolean = false): number {
  return getPreviewCanvasHeight(isDesktop) / CANVAS_ACTUAL_SIZE;
}

export function getCanvasDimensions(
  aspectRatio: AspectRatio,
  usePreviewSize: boolean,
  isDesktop: boolean = false
): { width: number; height: number } {
  const height = usePreviewSize ? getPreviewCanvasHeight(isDesktop) : CANVAS_ACTUAL_SIZE;
  return {
    width: Math.round(height * ASPECT_RATIO_WIDTH_FACTOR[aspectRatio]),
    height,
  };
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
  const { width: actualWidth, height: actualHeight } = getCanvasDimensions(aspectRatio, false);
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
