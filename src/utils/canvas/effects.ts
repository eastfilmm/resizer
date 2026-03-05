import { canvasRGB } from 'stackblur-canvas';

export function drawGlassBlurBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  intensity: number,
  overlayColor: string,
  opacity: number,
  isSafari: boolean = false
): void {
  const minDim = Math.min(img.width, img.height);
  const sx = (img.width - minDim) / 2;
  const sy = (img.height - minDim) / 2;

  const margin = Math.ceil(intensity * 3);
  const expandedWidth = canvasWidth + margin * 2;
  const expandedHeight = canvasHeight + margin * 2;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = expandedWidth;
  tempCanvas.height = expandedHeight;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.drawImage(img, sx, sy, minDim, minDim, margin, margin, canvasWidth, canvasHeight);

  // Edge clamp
  tempCtx.drawImage(tempCanvas, margin, margin, canvasWidth, 1, margin, 0, canvasWidth, margin);
  tempCtx.drawImage(
    tempCanvas,
    margin,
    margin + canvasHeight - 1,
    canvasWidth,
    1,
    margin,
    margin + canvasHeight,
    canvasWidth,
    margin
  );
  tempCtx.drawImage(tempCanvas, margin, 0, 1, expandedHeight, 0, 0, margin, expandedHeight);
  tempCtx.drawImage(
    tempCanvas,
    margin + canvasWidth - 1,
    0,
    1,
    expandedHeight,
    margin + canvasWidth,
    0,
    margin,
    expandedHeight
  );

  if (isSafari) {
    canvasRGB(tempCanvas, 0, 0, expandedWidth, expandedHeight, Math.round(intensity));
    ctx.drawImage(tempCanvas, margin, margin, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  } else {
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = expandedWidth;
    blurCanvas.height = expandedHeight;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return;

    blurCtx.filter = `blur(${intensity}px)`;
    blurCtx.drawImage(tempCanvas, 0, 0);
    blurCtx.filter = 'none';

    ctx.drawImage(blurCanvas, margin, margin, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  }

  ctx.globalAlpha = opacity;
  ctx.fillStyle = overlayColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalAlpha = 1.0;
}
