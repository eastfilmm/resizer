import { drawImageWithEffects, getCanvasDimensions } from '@resizer/canvas';
import type { ImageSettings, AspectRatio, UploadedImage } from '../atoms/imageAtoms';
import { loadEditableImage } from './imageSource';
import { toDrawOptions } from './drawOptions';

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
  image: UploadedImage,
  settings: ImageSettings,
  aspectRatio: AspectRatio,
): Promise<Blob> => {
  const canvas = await renderImageToCanvas(image, settings, aspectRatio);
  return canvasToBlob(canvas);
};

export const renderImageToCanvas = async (
  image: UploadedImage,
  settings: ImageSettings,
  aspectRatio: AspectRatio,
): Promise<HTMLCanvasElement> => {
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, false);
  const img = await loadImage(image.objectUrl);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  drawImageWithEffects(ctx, img, toDrawOptions(settings, image, canvas, 1));

  return canvas;
};
