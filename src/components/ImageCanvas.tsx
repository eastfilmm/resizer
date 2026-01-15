'use client';

import styled from 'styled-components';
import { RefObject, useEffect, useCallback, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  imageUrlAtom,
  backgroundColorAtom,
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
  paddingAtom,
  copyrightEnabledAtom,
  copyrightTextAtom,
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
} from '@/atoms/imageAtoms';
import { drawImageWithEffects, ImagePosition } from '@/utils/canvas';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
} from '@/constants/canvas';
import { useAspectRatio } from '@/hooks/useAspectRatio';

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
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const shadowIntensity = useAtomValue(shadowIntensityAtom);
  const shadowOffset = useAtomValue(shadowOffsetAtom);
  const { aspectRatio } = useAspectRatio();

  // Refs to access current values in callbacks without re-triggering effects
  const backgroundColorRef = useRef(backgroundColor);
  const glassBlurRef = useRef(glassBlur);
  const blurIntensityRef = useRef(blurIntensity);
  const overlayOpacityRef = useRef(overlayOpacity);
  const copyrightEnabledRef = useRef(copyrightEnabled);
  const copyrightTextRef = useRef(copyrightText);
  const shadowEnabledRef = useRef(shadowEnabled);
  const shadowIntensityRef = useRef(shadowIntensity);
  const shadowOffsetRef = useRef(shadowOffset);
  const aspectRatioRef = useRef(aspectRatio);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<ImagePosition | null>(null);

  // Keep refs in sync with state
  backgroundColorRef.current = backgroundColor;
  glassBlurRef.current = glassBlur;
  blurIntensityRef.current = blurIntensity;
  overlayOpacityRef.current = overlayOpacity;
  copyrightEnabledRef.current = copyrightEnabled;
  copyrightTextRef.current = copyrightText;
  shadowEnabledRef.current = shadowEnabled;
  shadowIntensityRef.current = shadowIntensity;
  shadowOffsetRef.current = shadowOffset;
  aspectRatioRef.current = aspectRatio;

  const getCanvasDimensions = useCallback(() => {
    if (aspectRatioRef.current === '4:5') {
      return {
        width: CANVAS_ACTUAL_SIZE_4_5_WIDTH,
        height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
      };
    }
    return {
      width: CANVAS_ACTUAL_SIZE,
      height: CANVAS_ACTUAL_SIZE,
    };
  }, []);

  const redrawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, imageAreaWidth: number, imageAreaHeight: number) => {
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
      imagePositionRef.current = drawImageWithEffects(ctx, img, {
        actualCanvasWidth: canvasWidth,
        actualCanvasHeight: canvasHeight,
        imageAreaWidth,
        imageAreaHeight,
        bgColor: backgroundColorRef.current,
        useGlassBlur: glassBlurRef.current,
        blurIntensity: blurIntensityRef.current,
        overlayOpacity: overlayOpacityRef.current,
        showCopyright: copyrightEnabledRef.current,
        copyrightText: copyrightTextRef.current,
        useShadow: shadowEnabledRef.current,
        shadowIntensity: shadowIntensityRef.current,
        shadowOffset: shadowOffsetRef.current,
        isSafari: false,
      });
    },
    [getCanvasDimensions]
  );

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();

    // Set canvas actual size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set display size (scaled down with CSS)
    canvas.style.width = `${CANVAS_DISPLAY_SIZE}px`;
    canvas.style.height = `${CANVAS_DISPLAY_SIZE}px`;

    // Enable high quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Load new image
    const newImg = new Image();
    newImg.onload = () => {
      imageRef.current = newImg;
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
      redrawImage(ctx, newImg, canvasWidth, canvasHeight);
    };
    newImg.src = imageUrl;
  }, [imageUrl, canvasRef, redrawImage, getCanvasDimensions]);

  // Initialize canvas on mount
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${CANVAS_DISPLAY_SIZE}px`;
        canvas.style.height = `${CANVAS_DISPLAY_SIZE}px`;

        ctx.fillStyle = backgroundColorRef.current;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasRef, getCanvasDimensions]);

  // Draw image when imageUrl changes (not backgroundColor)
  useEffect(() => {
    if (imageUrl) {
      imageRef.current = null;
      imagePositionRef.current = null;
      drawImageOnCanvas();
    } else {
      // Clear image reference when imageUrl is null (reset)
      imageRef.current = null;
      imagePositionRef.current = null;
    }
  }, [imageUrl, drawImageOnCanvas]);

  // Update canvas when any effect settings change
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
    const effectivePadding = padding;
    const imageAreaWidth = canvasWidth - effectivePadding * 2;
    const imageAreaHeight = canvasHeight - effectivePadding * 2;

    // If we have an image, redraw it with new settings
    if (imageRef.current) {
      redrawImage(ctx, imageRef.current, imageAreaWidth, imageAreaHeight);
      return;
    }

    // Fill background with solid color (no image loaded)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, [
    backgroundColor,
    glassBlur,
    blurIntensity,
    overlayOpacity,
    padding,
    copyrightEnabled,
    copyrightText,
    shadowEnabled,
    shadowIntensity,
    shadowOffset,
    canvasRef,
    redrawImage,
    getCanvasDimensions,
  ]);

  return (
    <CanvasContainer $aspectRatio={aspectRatio}>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div<{ $aspectRatio: '1:1' | '4:5' }>`
  width: ${props => props.$aspectRatio === '4:5' ? '256px' : `${CANVAS_DISPLAY_SIZE}px`};
  height: ${CANVAS_DISPLAY_SIZE}px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
`;
