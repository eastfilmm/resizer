import { drawImageWithEffects, getCanvasDimensions } from '@resizer/canvas';
import type { ImageSettings, AspectRatio } from '../atoms/imageAtoms';
import { loadEditableImage } from './imageSource';

/**
 * 다운로드 렌더도 편집 화면과 같은 축소본을 쓴다.
 * 소스는 2000px로 줄여둔 것이고 출력도 2000px이라 화질 손실이 없다.
 */
export const loadImage = (src: string): Promise<HTMLCanvasElement> => loadEditableImage(src);

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (!b) reject(new Error('Failed to create blob'));
      else resolve(b);
    }, 'image/png', 1.0);
  });

export const renderImageToBlob = async (
  objectUrl: string,
  settings: ImageSettings,
  aspectRatio: AspectRatio,
): Promise<Blob> => {
  const canvas = await renderImageToCanvas(objectUrl, settings, aspectRatio);
  return canvasToBlob(canvas);
};

export const renderImageToCanvas = async (
  objectUrl: string,
  settings: ImageSettings,
  aspectRatio: AspectRatio,
): Promise<HTMLCanvasElement> => {
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, false);
  const img = await loadImage(objectUrl);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const imageAreaWidth = canvasWidth - settings.padding * 2;
  const imageAreaHeight = canvasHeight - settings.padding * 2;

  drawImageWithEffects(ctx, img, {
    actualCanvasWidth: canvasWidth,
    actualCanvasHeight: canvasHeight,
    imageAreaWidth,
    imageAreaHeight,
    padding: settings.padding,
    bgColor: settings.backgroundColor,
    useGlassBlur: settings.glassBlurEnabled,
    blurIntensity: settings.blurIntensity,
    overlayOpacity: settings.overlayOpacity,
    useShadow: settings.shadowEnabled,
    shadowIntensity: settings.shadowIntensity,
    shadowOffset: settings.shadowOffset,
    frameType: settings.frameType,
    polaroidDate: settings.polaroidDate,
  });

  return canvas;
};
