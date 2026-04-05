import { drawImageWithEffects, getCanvasDimensions } from '@/utils/canvas';
import type { ImageSettings, AspectRatio } from '@/atoms/imageAtoms';

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = src;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });

  return img;
};

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
