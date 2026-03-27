import type { DrawImageOptions, ImagePosition } from '@resizer/shared/canvas';

/**
 * Calculate image position and dimensions for rendering.
 * Pure math - no platform-specific drawing code.
 */
export function calculateImageLayout(
  imgWidth: number,
  imgHeight: number,
  options: DrawImageOptions
): ImagePosition {
  const {
    actualCanvasWidth,
    actualCanvasHeight,
    imageAreaWidth,
    imageAreaHeight,
    useShadow,
    shadowOffset,
  } = options;

  let { width, height } = { width: imgWidth, height: imgHeight };

  const scale = Math.min(imageAreaWidth / width, imageAreaHeight / height);
  width = width * scale;
  height = height * scale;

  const shadowAdjust = useShadow ? shadowOffset / 2 : 0;
  const x = (actualCanvasWidth - width) / 2 - shadowAdjust;
  const y = (actualCanvasHeight - height) / 2 - shadowAdjust;

  return { x, y, width, height };
}

/**
 * Calculate polaroid frame layout.
 */
export function calculatePolaroidLayout(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  scaleFactor: number = 1,
  canvasPadding: number = 0
) {
  const topPaddingRatio = 1;
  const sidePaddingRatio = 1;
  const bottomPaddingRatio = 3;

  const totalVerticalPadding = topPaddingRatio + bottomPaddingRatio;
  const totalHorizontalPadding = sidePaddingRatio * 2;

  const paddingUnit = Math.min(canvasWidth, canvasHeight) * 0.04;

  const totalHorizontalPaddingPx = totalHorizontalPadding * paddingUnit;
  const totalVerticalPaddingPx = totalVerticalPadding * paddingUnit;

  const imageAspectRatio = imgWidth / imgHeight;

  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;

  const availableImageWidth = maxFrameWidth - totalHorizontalPaddingPx;
  const availableImageHeight = maxFrameHeight - totalVerticalPaddingPx;

  let imageAreaWidth: number;
  let imageAreaHeight: number;

  if (imageAspectRatio > availableImageWidth / availableImageHeight) {
    imageAreaWidth = availableImageWidth;
    imageAreaHeight = imageAreaWidth / imageAspectRatio;
  } else {
    imageAreaHeight = availableImageHeight;
    imageAreaWidth = imageAreaHeight * imageAspectRatio;
  }

  const frameWidth = imageAreaWidth + totalHorizontalPaddingPx;
  const frameHeight = imageAreaHeight + totalVerticalPaddingPx;

  const frameX = (canvasWidth - frameWidth) / 2;
  const frameY = (canvasHeight - frameHeight) / 2;

  const topMargin = topPaddingRatio * paddingUnit;
  const sideMargin = sidePaddingRatio * paddingUnit;

  const imageX = frameX + sideMargin;
  const imageY = frameY + topMargin;

  const borderRadius = 24 * scaleFactor;

  return {
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    imageX,
    imageY,
    imageWidth: imageAreaWidth,
    imageHeight: imageAreaHeight,
    borderRadius,
  };
}

/**
 * Calculate thin frame layout.
 */
export function calculateThinFrameLayout(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  scaleFactor: number = 1,
  canvasPadding: number = 0
) {
  const frameBorderWidth = 12 * scaleFactor;

  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;

  const imageAspectRatio = imgWidth / imgHeight;

  const availableImageWidth = maxFrameWidth - frameBorderWidth * 2;
  const availableImageHeight = maxFrameHeight - frameBorderWidth * 2;

  let imageWidth: number;
  let imageHeight: number;

  if (imageAspectRatio > availableImageWidth / availableImageHeight) {
    imageWidth = availableImageWidth;
    imageHeight = imageWidth / imageAspectRatio;
  } else {
    imageHeight = availableImageHeight;
    imageWidth = imageHeight * imageAspectRatio;
  }

  const frameWidth = imageWidth + frameBorderWidth * 2;
  const frameHeight = imageHeight + frameBorderWidth * 2;

  const frameX = (canvasWidth - frameWidth) / 2;
  const frameY = (canvasHeight - frameHeight) / 2;

  const imageX = frameX + frameBorderWidth;
  const imageY = frameY + frameBorderWidth;

  return {
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
  };
}

/**
 * Calculate medium film frame layout.
 */
export function calculateMediumFilmLayout(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  scaleFactor: number = 1,
  canvasPadding: number = 0
) {
  const isLandscape = imgWidth > imgHeight;

  const frameBorderWidth = 36 * scaleFactor;
  const filmInfoHeight = 70 * scaleFactor;

  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;

  const imageAspectRatio = imgWidth / imgHeight;

  let imageWidth: number;
  let imageHeight: number;
  let frameWidth: number;
  let frameHeight: number;
  let imageX: number;
  let imageY: number;
  let frameX: number;
  let frameY: number;

  if (isLandscape) {
    const availableImageWidth = maxFrameWidth - filmInfoHeight - frameBorderWidth;
    const availableImageHeight = maxFrameHeight - frameBorderWidth * 2;

    if (imageAspectRatio > availableImageWidth / availableImageHeight) {
      imageWidth = availableImageWidth;
      imageHeight = imageWidth / imageAspectRatio;
    } else {
      imageHeight = availableImageHeight;
      imageWidth = imageHeight * imageAspectRatio;
    }

    frameWidth = imageWidth + filmInfoHeight + frameBorderWidth;
    frameHeight = imageHeight + frameBorderWidth * 2;

    frameX = (canvasWidth - frameWidth) / 2;
    frameY = (canvasHeight - frameHeight) / 2;

    imageX = frameX + filmInfoHeight;
    imageY = frameY + frameBorderWidth;
  } else {
    const availableImageWidth = maxFrameWidth - frameBorderWidth * 2;
    const availableImageHeight = maxFrameHeight - filmInfoHeight - frameBorderWidth;

    if (imageAspectRatio > availableImageWidth / availableImageHeight) {
      imageWidth = availableImageWidth;
      imageHeight = imageWidth / imageAspectRatio;
    } else {
      imageHeight = availableImageHeight;
      imageWidth = imageHeight * imageAspectRatio;
    }

    frameWidth = imageWidth + frameBorderWidth * 2;
    frameHeight = imageHeight + filmInfoHeight + frameBorderWidth;

    frameX = (canvasWidth - frameWidth) / 2;
    frameY = (canvasHeight - frameHeight) / 2;

    imageX = frameX + frameBorderWidth;
    imageY = frameY + filmInfoHeight;
  }

  return {
    isLandscape,
    frameBorderWidth,
    filmInfoHeight,
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
  };
}
