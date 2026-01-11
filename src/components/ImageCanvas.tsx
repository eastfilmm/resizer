'use client';

import styled from 'styled-components';
import { RefObject, useEffect, useCallback, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageUrlAtom, backgroundColorAtom, glassBlurAtom, blurIntensityAtom, overlayOpacityAtom, paddingAtom } from '@/atoms/imageAtoms';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function ImageCanvas({ canvasRef }: ImageCanvasProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const blurIntensity = useAtomValue(blurIntensityAtom);
  const overlayOpacity = useAtomValue(overlayOpacityAtom);
  const padding = useAtomValue(paddingAtom);
  const setPadding = useSetAtom(paddingAtom);
  const backgroundColorRef = useRef(backgroundColor);
  const glassBlurRef = useRef(glassBlur);
  const blurIntensityRef = useRef(blurIntensity);
  const overlayOpacityRef = useRef(overlayOpacity);
  const paddingRef = useRef(padding);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Keep ref in sync with state
  backgroundColorRef.current = backgroundColor;
  glassBlurRef.current = glassBlur;
  blurIntensityRef.current = blurIntensity;
  overlayOpacityRef.current = overlayOpacity;
  paddingRef.current = padding;

  // Draw glass blur background: crop center square and fill canvas with blur
  const drawGlassBlurBackground = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasSize: number,
    intensity: number,
    overlayColor: string,
    opacity: number
  ) => {
    // Calculate center square crop from source image
    const minDim = Math.min(img.width, img.height);
    const sx = (img.width - minDim) / 2;
    const sy = (img.height - minDim) / 2;
    
    // Create a temporary canvas for blur effect
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Draw cropped center square to fill temp canvas
    tempCtx.drawImage(img, sx, sy, minDim, minDim, 0, 0, canvasSize, canvasSize);
    
    // Apply blur filter with configurable intensity
    ctx.filter = `blur(${intensity}px)`;
    ctx.drawImage(tempCanvas, 0, 0, canvasSize, canvasSize);
    ctx.filter = 'none';
    
    // Apply color overlay with configurable transparency
    ctx.globalAlpha = opacity;
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.globalAlpha = 1.0;
  };

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas actual size: 2000px x 2000px
    const actualCanvasSize = 2000;

    // Set canvas actual size
    canvas.width = actualCanvasSize;
    canvas.height = actualCanvasSize;

    // Set display size (scaled down with CSS)
    canvas.style.width = '320px';
    canvas.style.height = '320px';

    // Enable high quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Load new image
    const newImg = new Image();
    newImg.onload = () => {
      imageRef.current = newImg;
      // Reset padding to 0 when new image is loaded (image fills canvas edge-to-edge)
      setPadding(0);
      const imageAreaSize = actualCanvasSize; // No padding initially
      drawImage(ctx, newImg, actualCanvasSize, imageAreaSize, backgroundColorRef.current, glassBlurRef.current, blurIntensityRef.current, overlayOpacityRef.current);
    };
    newImg.src = imageUrl;
  }, [imageUrl, canvasRef, setPadding]);

  const drawImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    actualCanvasSize: number,
    imageAreaSize: number,
    bgColor: string,
    useGlassBlur: boolean,
    intensity: number,
    opacity: number
  ) => {
    // Initialize canvas with selected background color
    ctx.clearRect(0, 0, actualCanvasSize, actualCanvasSize);
    
    // If glass blur is enabled, draw blurred background from image
    if (useGlassBlur) {
      drawGlassBlurBackground(ctx, img, actualCanvasSize, intensity, bgColor, opacity);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, actualCanvasSize, actualCanvasSize);
    }
    
    // Maximum area for image (excluding padding)
    const maxWidth = imageAreaSize;
    const maxHeight = imageAreaSize;
    
    let { width, height } = img;
    
    // Maintain aspect ratio while fitting to maximum area
    if (width > height) {
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
    }
    
    // Center image on canvas (considering padding)
    const x = (actualCanvasSize - width) / 2;
    const y = (actualCanvasSize - height) / 2;
    
    // Save position for background updates
    imagePositionRef.current = { x, y, width, height };
    
    // Draw image with high quality
    ctx.drawImage(img, x, y, width, height);
  };

  // Initialize canvas on mount
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.style.width = '320px';
        canvas.style.height = '320px';
        
        ctx.fillStyle = backgroundColorRef.current;
        ctx.fillRect(0, 0, 2000, 2000);
      }
    }
  }, [canvasRef]);

  // Draw image when imageUrl changes (not backgroundColor)
  useEffect(() => {
    if (imageUrl) {
      imageRef.current = null;
      imagePositionRef.current = null;
      drawImageOnCanvas();
    }
  }, [imageUrl, drawImageOnCanvas]);

  // Update background color only (no image reload)
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const actualCanvasSize = 2000;
    const imageAreaSize = actualCanvasSize - (padding * 2);

    // If we have an image, redraw it with new settings
    if (imageRef.current) {
      drawImage(ctx, imageRef.current, actualCanvasSize, imageAreaSize, backgroundColor, glassBlur, blurIntensity, overlayOpacity);
      return;
    }

    // Fill background with solid color (no image loaded)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 2000, 2000);
  }, [backgroundColor, glassBlur, blurIntensity, overlayOpacity, padding, canvasRef]);

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div`
  width: 320px;
  height: 320px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 320px;
  height: 320px;
  object-fit: contain;
`;
