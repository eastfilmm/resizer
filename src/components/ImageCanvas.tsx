'use client';

import styled from 'styled-components';
import { RefObject, useEffect, useCallback, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { imageUrlAtom, backgroundColorAtom } from '@/atoms/imageAtoms';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function ImageCanvas({ canvasRef }: ImageCanvasProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const drawImageOnCanvas = useCallback((img?: HTMLImageElement, skipCanvasInit = false) => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas actual size: 2000px x 2000px
    const actualCanvasSize = 2000;
    const padding = 20;
    const imageAreaSize = actualCanvasSize - (padding * 2); // 1960px

    // Only initialize canvas if not skipping (for background color changes)
    if (!skipCanvasInit) {
      // Set canvas actual size
      canvas.width = actualCanvasSize;
      canvas.height = actualCanvasSize;

      // Set display size (scaled down with CSS)
      canvas.style.width = '320px';
      canvas.style.height = '320px';

      // Enable high quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    const imageToDraw = img || imageRef.current;
    
    if (imageToDraw && imageToDraw.complete) {
      // Image already loaded, draw immediately
      drawImage(ctx, imageToDraw, actualCanvasSize, imageAreaSize, backgroundColor, skipCanvasInit);
    } else if (!skipCanvasInit) {
      // Load new image (only when not skipping init)
      const newImg = new Image();
      newImg.onload = () => {
        imageRef.current = newImg;
        drawImage(ctx, newImg, actualCanvasSize, imageAreaSize, backgroundColor, false);
      };
      newImg.src = imageUrl;
    }
  }, [imageUrl, canvasRef, backgroundColor]);

  const drawImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    actualCanvasSize: number,
    imageAreaSize: number,
    bgColor: string,
    skipCanvasInit = false
  ) => {
    // Initialize canvas with selected background color
    if (!skipCanvasInit) {
      ctx.clearRect(0, 0, actualCanvasSize, actualCanvasSize);
    }
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, actualCanvasSize, actualCanvasSize);
    
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

  // Initialize canvas with selected background color on mount
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.style.width = '320px';
        canvas.style.height = '320px';
        
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, 2000, 2000);
      }
    }
  }, []);

  // Draw image when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      imageRef.current = null; // Reset image ref when URL changes
      drawImageOnCanvas();
    } else if (canvasRef.current) {
      // If no image, just update background color
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, 2000, 2000);
      }
    }
  }, [imageUrl, drawImageOnCanvas]);

  // Update background color when it changes (only if image already exists)
  useEffect(() => {
    if (imageUrl && imageRef.current && imagePositionRef.current && canvasRef.current) {
      // Image already loaded, update background and redraw image immediately
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imageRef.current;
      const pos = imagePositionRef.current;

      // Use requestAnimationFrame to ensure smooth update
      requestAnimationFrame(() => {
        // Fill background with new color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, 2000, 2000);
        
        // Immediately redraw image at saved position (no recalculation)
        ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
      });
    } else if (!imageUrl && canvasRef.current) {
      // No image, just update background
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, 2000, 2000);
      }
    }
  }, [backgroundColor, imageUrl]);

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
