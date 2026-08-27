import type { ImagePosition } from './types';

export function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  bgColor: string,
  scaleFactor: number = 1,
  canvasPadding: number = 0,
  dateText: string = ''
): ImagePosition {
  const isLandscape = img.width >= img.height;

  const topPaddingRatio = 1;
  const sidePaddingRatio = 1;
  const bottomPaddingRatio = 3;

  const totalVerticalPadding = topPaddingRatio + bottomPaddingRatio;
  const totalHorizontalPadding = sidePaddingRatio * 2;

  const paddingUnit = Math.min(canvasWidth, canvasHeight) * 0.04;

  const totalHorizontalPaddingPx = totalHorizontalPadding * paddingUnit;
  const totalVerticalPaddingPx = totalVerticalPadding * paddingUnit;

  const imageAspectRatio = img.width / img.height;

  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;

  let frameWidth: number;
  let frameHeight: number;

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

  frameWidth = imageAreaWidth + totalHorizontalPaddingPx;
  frameHeight = imageAreaHeight + totalVerticalPaddingPx;

  const frameX = (canvasWidth - frameWidth) / 2;
  const frameY = (canvasHeight - frameHeight) / 2;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const borderRadius = 24 * scaleFactor;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(frameX, frameY, frameWidth, frameHeight, borderRadius);
  } else {
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

  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 30 * scaleFactor;
  ctx.shadowOffsetX = 10 * scaleFactor;
  ctx.shadowOffsetY = 10 * scaleFactor;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const topMargin = topPaddingRatio * paddingUnit;
  const sideMargin = sidePaddingRatio * paddingUnit;
  const bottomMargin = bottomPaddingRatio * paddingUnit;

  const imageAreaX = frameX + sideMargin;
  const imageAreaY = frameY + topMargin;

  const drawWidth = imageAreaWidth;
  const drawHeight = imageAreaHeight;

  const imageX = imageAreaX;
  const imageY = imageAreaY;

  ctx.drawImage(img, imageX, imageY, drawWidth, drawHeight);

  if (dateText) {
    const fontSize = 48 * scaleFactor;
    const dateMargin = 12 * scaleFactor;
    
    ctx.save();
    ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    const dateX = imageX + drawWidth - dateMargin;
    const dateY = imageY + drawHeight - dateMargin;
    
    ctx.shadowColor = '#FF6B00';
    ctx.shadowBlur = 4 * scaleFactor;
    
    ctx.fillStyle = '#FF6B00';
    ctx.fillText(dateText, dateX, dateY);
    ctx.restore();
  }

  return { x: imageX, y: imageY, width: drawWidth, height: drawHeight };
}

export function drawThinFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  bgColor: string,
  scaleFactor: number = 1,
  canvasPadding: number = 0
): ImagePosition {
  const frameBorderWidth = 12 * scaleFactor;
  
  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;
  
  const imageAspectRatio = img.width / img.height;
  
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
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
  
  const imageX = frameX + frameBorderWidth;
  const imageY = frameY + frameBorderWidth;
  
  ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
  
  return { x: imageX, y: imageY, width: imageWidth, height: imageHeight };
}

export function drawMediumFilmFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  bgColor: string,
  scaleFactor: number = 1,
  canvasPadding: number = 0
): ImagePosition {
  const isLandscape = img.width > img.height;
  
  const frameBorderWidth = 36 * scaleFactor;
  const filmInfoHeight = 70 * scaleFactor;
  
  const maxFrameWidth = canvasWidth - canvasPadding * 2;
  const maxFrameHeight = canvasHeight - canvasPadding * 2;
  
  const imageAspectRatio = img.width / img.height;
  
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
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
  
  ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
  
  const fontSize = 32 * scaleFactor;
  ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
  ctx.fillStyle = '#FF6B00';
  
  const leftText = '1  ◀  RVP100';
  const rightText = '2  ◀  RVP100';
  
  if (isLandscape) {
    ctx.save();
    
    const textAreaCenterX = frameX + filmInfoHeight / 2;
    const textAreaTop = frameY + frameBorderWidth;
    const textAreaBottom = frameY + frameBorderWidth + imageHeight;
    
    ctx.translate(textAreaCenterX, textAreaBottom);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(leftText, 12 * scaleFactor, 0);
    
    ctx.restore();
    ctx.save();
    
    ctx.translate(textAreaCenterX, textAreaTop);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(rightText, -12 * scaleFactor, 0);
    
    ctx.restore();
  } else {
    const textY = frameY + filmInfoHeight / 2;
    const textLeftX = frameX + frameBorderWidth + 12 * scaleFactor;
    const textRightX = frameX + frameWidth - frameBorderWidth - 12 * scaleFactor;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(leftText, textLeftX, textY);
    
    ctx.textAlign = 'right';
    ctx.fillText(rightText, textRightX, textY);
  }
  
  return { x: imageX, y: imageY, width: imageWidth, height: imageHeight };
}
