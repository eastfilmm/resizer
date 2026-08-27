import type { DrawImageOptions, ImagePosition } from './types';
import { drawPolaroidFrame, drawThinFrame, drawMediumFilmFrame } from './frames';
import { drawGlassBlurBackground } from './effects';

export function drawImageWithEffects(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  options: DrawImageOptions
): ImagePosition {
  const {
    actualCanvasWidth,
    actualCanvasHeight,
    imageAreaWidth,
    imageAreaHeight,
    padding,
    bgColor,
    useGlassBlur,
    blurIntensity,
    overlayOpacity,
    useShadow,
    shadowIntensity,
    shadowOffset,
    frameType,
    isSafari = false,
    scaleFactor = 1,
  } = options;

  ctx.clearRect(0, 0, actualCanvasWidth, actualCanvasHeight);

  switch (frameType) {
    case 'polaroid':
      return drawPolaroidFrame(ctx, img, actualCanvasWidth, actualCanvasHeight, bgColor, scaleFactor, padding, options.polaroidDate || '');
    case 'thin':
      return drawThinFrame(ctx, img, actualCanvasWidth, actualCanvasHeight, bgColor, scaleFactor, padding);
    case 'mediumFilm':
      return drawMediumFilmFrame(ctx, img, actualCanvasWidth, actualCanvasHeight, bgColor, scaleFactor, padding);
  }

  if (useGlassBlur) {
    drawGlassBlurBackground(ctx, img, actualCanvasWidth, actualCanvasHeight, blurIntensity, bgColor, overlayOpacity, isSafari);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, actualCanvasWidth, actualCanvasHeight);
  }

  const maxWidth = imageAreaWidth;
  const maxHeight = imageAreaHeight;

  let { width, height } = img;

  const scale = Math.min(maxWidth / width, maxHeight / height);
  width = width * scale;
  height = height * scale;

  const shadowAdjust = useShadow ? shadowOffset / 2 : 0;
  const x = (actualCanvasWidth - width) / 2 - shadowAdjust;
  const y = (actualCanvasHeight - height) / 2 - shadowAdjust;

  const imagePosition: ImagePosition = { x, y, width, height };

  if (useShadow) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = shadowIntensity;
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }

  ctx.drawImage(img, x, y, width, height);

  return imagePosition;
}
