'use client';

import { canvasRGB } from 'stackblur-canvas';
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

export interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Get canvas actual dimensions based on aspect ratio and Safari flag
 */
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

/**
 * Get canvas display size for CSS styling (same for Safari and non-Safari)
 */
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

/**
 * Reset canvas to initial state with solid background color
 */
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

/**
 * Draw glass blur background: crop center square and fill canvas with blur
 * Uses edge clamp technique to prevent vignetting effect at edges
 * Safari uses JavaScript-based stackblur, Chrome/Firefox use CSS filter
 */
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
  // Calculate center square crop from source image
  const minDim = Math.min(img.width, img.height);
  const sx = (img.width - minDim) / 2;
  const sy = (img.height - minDim) / 2;

  // Calculate margin for edge clamping (3x blur intensity)
  const margin = Math.ceil(intensity * 3);
  const expandedWidth = canvasWidth + margin * 2;
  const expandedHeight = canvasHeight + margin * 2;

  // Create a temporary canvas with expanded size for edge clamping
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = expandedWidth;
  tempCanvas.height = expandedHeight;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Draw cropped center square to the center of expanded canvas
  tempCtx.drawImage(img, sx, sy, minDim, minDim, margin, margin, canvasWidth, canvasHeight);

  // Edge clamp: extend edges by copying edge pixels
  // Top edge
  tempCtx.drawImage(tempCanvas, margin, margin, canvasWidth, 1, margin, 0, canvasWidth, margin);
  // Bottom edge
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
  // Left edge (including corners)
  tempCtx.drawImage(tempCanvas, margin, 0, 1, expandedHeight, 0, 0, margin, expandedHeight);
  // Right edge (including corners)
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
    // Safari: Use JavaScript-based stackblur (CSS filter has caching issues)
    canvasRGB(tempCanvas, 0, 0, expandedWidth, expandedHeight, Math.round(intensity));
    // Copy only the center portion (without margins) to the main canvas
    ctx.drawImage(tempCanvas, margin, margin, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  } else {
    // Chrome/Firefox: Use fast CSS filter blur
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = expandedWidth;
    blurCanvas.height = expandedHeight;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return;

    blurCtx.filter = `blur(${intensity}px)`;
    blurCtx.drawImage(tempCanvas, 0, 0);
    blurCtx.filter = 'none';

    // Copy only the center portion (without margins) to the main canvas
    ctx.drawImage(blurCanvas, margin, margin, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  }

  // Apply color overlay with configurable transparency
  ctx.globalAlpha = opacity;
  ctx.fillStyle = overlayColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalAlpha = 1.0;
}

/**
 * Draw polaroid frame with image inside
 * Frame ratio: 9:6 (3:2) for landscape images, 6:9 for portrait images (rotated 90 degrees)
 * Frame has white border with wider bottom margin (classic polaroid style)
 */
export function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  bgColor: string,
  scaleFactor: number = 1,
  canvasPadding: number = 0
): ImagePosition {
  // Determine if image is landscape or portrait
  const isLandscape = img.width >= img.height;

  // Define padding ratios (relative to a base unit)/
  // Top/Left/Right: 1 unit, Bottom: 3 units (polaroid characteristic)
  const topPaddingRatio = 1;
  const sidePaddingRatio = 1;
  const bottomPaddingRatio = 3;

  // Calculate total padding units
  const totalVerticalPadding = topPaddingRatio + bottomPaddingRatio; // 4 units
  const totalHorizontalPadding = sidePaddingRatio * 2; // 2 units

  // Use 8% of smaller canvas dimension as base padding unit
  const paddingUnit = Math.min(canvasWidth, canvasHeight) * 0.04;

  // Calculate required padding in pixels
  const totalHorizontalPaddingPx = totalHorizontalPadding * paddingUnit;
  const totalVerticalPaddingPx = totalVerticalPadding * paddingUnit;

  // Calculate image aspect ratio
  const imageAspectRatio = img.width / img.height;

  // Available space for the entire frame (canvas minus canvas padding)
  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;

  // Calculate frame size based on image + padding
  // Frame needs to fit: image area + padding
  let frameWidth: number;
  let frameHeight: number;

  // Calculate what size image area we can fit
  const availableImageWidth = maxFrameWidth - totalHorizontalPaddingPx;
  const availableImageHeight = maxFrameHeight - totalVerticalPaddingPx;

  // Fit image to available space
  let imageAreaWidth: number;
  let imageAreaHeight: number;

  if (imageAspectRatio > availableImageWidth / availableImageHeight) {
    // Image is wider - fit to width
    imageAreaWidth = availableImageWidth;
    imageAreaHeight = imageAreaWidth / imageAspectRatio;
  } else {
    // Image is taller - fit to height
    imageAreaHeight = availableImageHeight;
    imageAreaWidth = imageAreaHeight * imageAspectRatio;
  }

  // Frame size = image area + padding
  frameWidth = imageAreaWidth + totalHorizontalPaddingPx;
  frameHeight = imageAreaHeight + totalVerticalPaddingPx;

  // Center frame on canvas
  const frameX = (canvasWidth - frameWidth) / 2;
  const frameY = (canvasHeight - frameHeight) / 2;

  // Fill canvas background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw polaroid frame (white background with border radius)
  const borderRadius = 24 * scaleFactor;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(frameX, frameY, frameWidth, frameHeight, borderRadius);
  } else {
    // Fallback for older browsers
    ctx.moveTo(frameX + borderRadius, frameY);
    ctx.lineTo(frameX + frameWidth - borderRadius, frameY);
    ctx.quadraticCurveTo(frameX + frameWidth, frameY, frameX + frameWidth, frameY + borderRadius);
    ctx.lineTo(frameX + frameWidth, frameY + frameHeight - borderRadius);
    ctx.quadraticCurveTo(frameX + frameWidth, frameY + frameHeight, frameX + frameWidth - borderRadius, frameY + frameHeight);
    ctx.lineTo(frameX + borderRadius, frameY + frameHeight);
    ctx.quadraticCurveTo(frameX, frameY + frameHeight, frameX, frameY + frameHeight - borderRadius);
    ctx.lineTo(frameX, frameY + borderRadius);
    ctx.quadraticCurveTo(frameX, frameY, frameX + borderRadius, frameY);
  }
  ctx.fill();

  // Add subtle shadow to frame
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 30 * scaleFactor;
  ctx.shadowOffsetX = 10 * scaleFactor;
  ctx.shadowOffsetY = 10 * scaleFactor;
  ctx.fill(); // Re-fill the rounded path to apply shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Calculate actual padding based on padding unit
  const topMargin = topPaddingRatio * paddingUnit;
  const sideMargin = sidePaddingRatio * paddingUnit;
  const bottomMargin = bottomPaddingRatio * paddingUnit;

  // Calculate image area inside frame
  const imageAreaX = frameX + sideMargin;
  const imageAreaY = frameY + topMargin;
  // imageAreaWidth and imageAreaHeight already calculated above (lines 285-293)

  // Calculate image size to fit inside frame while maintaining aspect ratio
  // imageAspectRatio already calculated above (line 269)
  // Image area was already sized to match image aspect ratio, so just use it directly
  const drawWidth = imageAreaWidth;
  const drawHeight = imageAreaHeight;

  // Position image in the image area
  const imageX = imageAreaX;
  const imageY = imageAreaY;

  // Draw image
  ctx.drawImage(img, imageX, imageY, drawWidth, drawHeight);

  return { x: imageX, y: imageY, width: drawWidth, height: drawHeight };
}

export interface DrawImageOptions {
  actualCanvasWidth: number;
  actualCanvasHeight: number;
  imageAreaWidth: number;
  imageAreaHeight: number;
  padding: number;
  bgColor: string;
  useGlassBlur: boolean;
  blurIntensity: number;
  overlayOpacity: number;
  useShadow: boolean;
  shadowIntensity: number;
  shadowOffset: number;
  usePolaroid: boolean;
  isSafari?: boolean;
  scaleFactor?: number;
}

/**
 * Draw image on canvas with all effects applied
 * Returns the image position for future reference
 */
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
    usePolaroid,
    isSafari = false,
    scaleFactor = 1,
  } = options;

  // Initialize canvas with selected background color
  ctx.clearRect(0, 0, actualCanvasWidth, actualCanvasHeight);

  // If polaroid mode is enabled, use dedicated polaroid rendering
  if (usePolaroid) {
    return drawPolaroidFrame(ctx, img, actualCanvasWidth, actualCanvasHeight, bgColor, scaleFactor, padding);
  }

  // If glass blur is enabled, draw blurred background from image
  if (useGlassBlur) {
    drawGlassBlurBackground(ctx, img, actualCanvasWidth, actualCanvasHeight, blurIntensity, bgColor, overlayOpacity, isSafari);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, actualCanvasWidth, actualCanvasHeight);
  }

  // Maximum area for image (excluding padding)
  const maxWidth = imageAreaWidth;
  const maxHeight = imageAreaHeight;

  let { width, height } = img;

  // Scale image to fit maximum area while maintaining aspect ratio
  // This handles both upscaling (small images) and downscaling (large images)
  const scale = Math.min(maxWidth / width, maxHeight / height);
  width = width * scale;
  height = height * scale;

  // Center image on canvas (considering padding)
  // If shadow is enabled, offset image slightly to top-left to make room for shadow
  const shadowAdjust = useShadow ? shadowOffset / 2 : 0;
  const x = (actualCanvasWidth - width) / 2 - shadowAdjust;
  const y = (actualCanvasHeight - height) / 2 - shadowAdjust;

  const imagePosition: ImagePosition = { x, y, width, height };

  // Draw shadow if enabled (draw before image so it appears behind)
  if (useShadow) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = shadowIntensity;
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;
    // Draw a filled rectangle as shadow source (same size as image)
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }

  // Draw image with high quality
  ctx.drawImage(img, x, y, width, height);

  return imagePosition;
}
