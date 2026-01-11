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
  const backgroundColorRef = useRef(backgroundColor);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Keep ref in sync with state
  backgroundColorRef.current = backgroundColor;

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas actual size: 2000px x 2000px
    const actualCanvasSize = 2000;
    const padding = 20;
    const imageAreaSize = actualCanvasSize - (padding * 2); // 1960px

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
      drawImage(ctx, newImg, actualCanvasSize, imageAreaSize, backgroundColorRef.current);
    };
    newImg.src = imageUrl;
  }, [imageUrl, canvasRef]);

  const drawImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    actualCanvasSize: number,
    imageAreaSize: number,
    bgColor: string
  ) => {
    // Initialize canvas with selected background color
    ctx.clearRect(0, 0, actualCanvasSize, actualCanvasSize);
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

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 2000, 2000);

    // Redraw image if exists
    if (imageRef.current && imagePositionRef.current) {
      const img = imageRef.current;
      const pos = imagePositionRef.current;
      ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
    }
  }, [backgroundColor, canvasRef]);

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
