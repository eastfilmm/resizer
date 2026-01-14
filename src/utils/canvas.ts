'use client';

import { canvasRGB } from 'stackblur-canvas';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  COPYRIGHT_FONT_SIZE,
  COPYRIGHT_OFFSET,
  COPYRIGHT_RIGHT_MARGIN,
} from '@/constants/canvas';

export interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Reset canvas to initial state with solid background color
 */
export function resetCanvas(
  canvas: HTMLCanvasElement,
  backgroundColor: 'white' | 'black' = 'white',
  options?: { actualSize?: number; displaySize?: number }
) {
  const actualSize = options?.actualSize ?? CANVAS_ACTUAL_SIZE;
  const displaySize = options?.displaySize ?? CANVAS_DISPLAY_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = actualSize;
  canvas.height = actualSize;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, actualSize, actualSize);
}

/**
 * Draw glass blur background: crop center square and fill canvas with blur
 * Uses edge clamp technique to prevent vignetting effect at edges
 * Safari uses JavaScript-based stackblur, Chrome/Firefox use CSS filter
 */
export function drawGlassBlurBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasSize: number,
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
  const expandedSize = canvasSize + margin * 2;

  // Create a temporary canvas with expanded size for edge clamping
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = expandedSize;
  tempCanvas.height = expandedSize;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Draw cropped center square to the center of expanded canvas
  tempCtx.drawImage(img, sx, sy, minDim, minDim, margin, margin, canvasSize, canvasSize);

  // Edge clamp: extend edges by copying edge pixels
  // Top edge
  tempCtx.drawImage(tempCanvas, margin, margin, canvasSize, 1, margin, 0, canvasSize, margin);
  // Bottom edge
  tempCtx.drawImage(
    tempCanvas,
    margin,
    margin + canvasSize - 1,
    canvasSize,
    1,
    margin,
    margin + canvasSize,
    canvasSize,
    margin
  );
  // Left edge (including corners)
  tempCtx.drawImage(tempCanvas, margin, 0, 1, expandedSize, 0, 0, margin, expandedSize);
  // Right edge (including corners)
  tempCtx.drawImage(
    tempCanvas,
    margin + canvasSize - 1,
    0,
    1,
    expandedSize,
    margin + canvasSize,
    0,
    margin,
    expandedSize
  );

  if (isSafari) {
    // Safari: Use JavaScript-based stackblur (CSS filter has caching issues)
    canvasRGB(tempCanvas, 0, 0, expandedSize, expandedSize, Math.round(intensity));
    // Copy only the center portion (without margins) to the main canvas
    ctx.drawImage(tempCanvas, margin, margin, canvasSize, canvasSize, 0, 0, canvasSize, canvasSize);
  } else {
    // Chrome/Firefox: Use fast CSS filter blur
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = expandedSize;
    blurCanvas.height = expandedSize;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return;

    blurCtx.filter = `blur(${intensity}px)`;
    blurCtx.drawImage(tempCanvas, 0, 0);
    blurCtx.filter = 'none';

    // Copy only the center portion (without margins) to the main canvas
    ctx.drawImage(blurCanvas, margin, margin, canvasSize, canvasSize, 0, 0, canvasSize, canvasSize);
  }

  // Apply color overlay with configurable transparency
  ctx.globalAlpha = opacity;
  ctx.fillStyle = overlayColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.globalAlpha = 1.0;
}

/**
 * Draw copyright text on the image
 * For landscape: below the image, right-aligned, with offset below image bottom
 * For portrait: right side of image, rotated 90 degrees, with offset right of image
 * Text color is automatically determined based on background color
 */
export function drawCopyrightText(
  ctx: CanvasRenderingContext2D,
  text: string,
  imagePosition: ImagePosition,
  backgroundColor: 'white' | 'black',
  scaleFactor: number = 1
): void {
  if (!text.trim()) return;

  const isLandscape = imagePosition.width >= imagePosition.height;

  // Auto-detect text color based on background (white bg = black text, black bg = white text)
  const textColor = backgroundColor === 'white' ? 'black' : 'white';
  ctx.fillStyle = textColor;
  ctx.font = `${COPYRIGHT_FONT_SIZE * scaleFactor}px sans-serif`;

  if (isLandscape) {
    // Landscape: horizontal text below image, right-aligned with margin
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    const textX = imagePosition.x + imagePosition.width - COPYRIGHT_RIGHT_MARGIN * scaleFactor;
    const textY = imagePosition.y + imagePosition.height + COPYRIGHT_OFFSET * scaleFactor;
    ctx.fillText(text, textX, textY);
  } else {
    // Portrait: rotated 90 degrees, right side of image with margin
    ctx.save();
    const textX = imagePosition.x + imagePosition.width + COPYRIGHT_OFFSET * scaleFactor;
    const textY = imagePosition.y + imagePosition.height;
    ctx.translate(textX, textY);
    ctx.rotate(Math.PI / 2); // Rotate 90 degrees (text reads from bottom to top)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, -COPYRIGHT_RIGHT_MARGIN * scaleFactor, 0);
    ctx.restore();
  }
}

export interface DrawImageOptions {
  actualCanvasSize: number;
  imageAreaSize: number;
  bgColor: string;
  useGlassBlur: boolean;
  blurIntensity: number;
  overlayOpacity: number;
  showCopyright: boolean;
  copyrightText: string;
  useShadow: boolean;
  shadowIntensity: number;
  shadowOffset: number;
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
    actualCanvasSize,
    imageAreaSize,
    bgColor,
    useGlassBlur,
    blurIntensity,
    overlayOpacity,
    showCopyright,
    copyrightText,
    useShadow,
    shadowIntensity,
    shadowOffset,
    isSafari = false,
    scaleFactor = 1,
  } = options;

  // Initialize canvas with selected background color
  ctx.clearRect(0, 0, actualCanvasSize, actualCanvasSize);

  // If glass blur is enabled, draw blurred background from image
  if (useGlassBlur) {
    drawGlassBlurBackground(ctx, img, actualCanvasSize, blurIntensity, bgColor, overlayOpacity, isSafari);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, actualCanvasSize, actualCanvasSize);
  }

  // Maximum area for image (excluding padding)
  const maxWidth = imageAreaSize;
  const maxHeight = imageAreaSize;

  let { width, height } = img;

  // Scale image to fit maximum area while maintaining aspect ratio
  // This handles both upscaling (small images) and downscaling (large images)
  const scale = Math.min(maxWidth / width, maxHeight / height);
  width = width * scale;
  height = height * scale;

  // Center image on canvas (considering padding)
  // If shadow is enabled, offset image slightly to top-left to make room for shadow
  const shadowAdjust = useShadow ? shadowOffset / 2 : 0;
  const x = (actualCanvasSize - width) / 2 - shadowAdjust;
  const y = (actualCanvasSize - height) / 2 - shadowAdjust;

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

  // Draw copyright text if enabled
  if (showCopyright && copyrightText) {
    // Determine background color from bgColor string
    const backgroundColor: 'white' | 'black' = bgColor === 'white' || bgColor === '#ffffff' ? 'white' : 'black';
    drawCopyrightText(ctx, copyrightText, imagePosition, backgroundColor, scaleFactor);
  }

  return imagePosition;
}
