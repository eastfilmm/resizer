'use client';

import styled from 'styled-components';
import { RefObject, useEffect, useCallback, useRef } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { imageUrlAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import type { AspectRatio } from '@/atoms/imageAtoms';
import { drawImageWithEffects, getCanvasDimensions, getCanvasDisplaySize } from '@/utils/canvas';
import type { ImagePosition } from '@/utils/canvas';
import {
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_DESKTOP,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP,
  CANVAS_PREVIEW_SIZE,
} from '@/constants/CanvasContents';
import { useAspectRatio } from '@/hooks/useAspectRatio';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isSafari?: boolean;
  isDesktop?: boolean;
}

export default function ImageCanvas({ canvasRef, isSafari = false, isDesktop = false }: ImageCanvasProps) {
  const store = useStore();
  const imageUrl = useAtomValue(imageUrlAtom);
  const { aspectRatio } = useAspectRatio();

  // Refs to access current values in callbacks without re-triggering effects
  const settingsRef = useRef(store.get(imageSettingsAtom));
  const aspectRatioRef = useRef(aspectRatio);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<ImagePosition | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Safari RAF throttle refs
  const rafIdRef = useRef<number | null>(null);
  const pendingRenderRef = useRef(false);

  // Scale factor: 800/2000 = 0.4 (Safari only)
  const SCALE_FACTOR = isSafari ? CANVAS_PREVIEW_SIZE / 2000 : 1;

  // Keep aspectRatioRef in sync with state
  aspectRatioRef.current = aspectRatio;

  const redrawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) => {
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatioRef.current, isSafari);
      const settings = settingsRef.current;
      const padding = settings.padding;
      const effectivePadding = isSafari ? padding * SCALE_FACTOR : padding;
      const imageAreaWidth = canvasWidth - effectivePadding * 2;
      const imageAreaHeight = canvasHeight - effectivePadding * 2;

      if (img) {
        imagePositionRef.current = drawImageWithEffects(ctx, img, {
          actualCanvasWidth: canvasWidth,
          actualCanvasHeight: canvasHeight,
          imageAreaWidth,
          imageAreaHeight,
          padding: effectivePadding,
          bgColor: settings.backgroundColor,
          useGlassBlur: settings.glassBlurEnabled,
          blurIntensity: settings.blurIntensity * (isSafari ? SCALE_FACTOR : 1),
          overlayOpacity: settings.overlayOpacity,
          useShadow: settings.shadowEnabled,
          shadowIntensity: settings.shadowIntensity * (isSafari ? SCALE_FACTOR : 1),
          shadowOffset: settings.shadowOffset * (isSafari ? SCALE_FACTOR : 1),
          frameType: settings.frameType,
          scaleFactor: SCALE_FACTOR,
          isSafari,
          polaroidDate: settings.polaroidDate,
        });
      } else {
        // Fill background with solid color (no image loaded)
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    },
    [isSafari, SCALE_FACTOR]
  );

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatioRef.current, isSafari);
    const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(aspectRatioRef.current, isDesktop);

    // Set canvas actual size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set display size (scaled down with CSS)
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Enable high quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If image is already loaded, redraw immediately to avoid flicker
    if (imageRef.current && imageRef.current.src === imageUrl) {
      redrawImage(ctx, imageRef.current);
      return;
    }

    // Load new image
    const newImg = new Image();
    newImg.onload = () => {
      imageRef.current = newImg;
      redrawImage(ctx, newImg);
    };
    newImg.src = imageUrl;
  }, [imageUrl, canvasRef, redrawImage, isSafari, isDesktop]);

  // Initialize canvas on mount (skip when image is already loaded to avoid double-clear flicker)
  useEffect(() => {
    if (canvasRef.current && !imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, isSafari);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.fillStyle = settingsRef.current.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasRef, aspectRatio, isSafari]);

  // Handle effect changes imperatively with conditional RAF throttle for Safari
  useEffect(() => {
    const performRender = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          redrawImage(ctx, imageRef.current);
        }
      }
    };

    const unsubscribe = store.sub(imageSettingsAtom, () => {
      // Update refs
      const newSettings = store.get(imageSettingsAtom);
      settingsRef.current = newSettings;

      // Update container background color imperatively (no re-render)
      if (containerRef.current) {
        containerRef.current.style.backgroundColor = newSettings.backgroundColor;
      }

      // Safari: Use RAF throttle for smooth slider performance
      // Non-Safari: Immediate rendering
      if (isSafari) {
        pendingRenderRef.current = true;
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            if (pendingRenderRef.current) {
              pendingRenderRef.current = false;
              performRender();
            }
          });
        }
      } else {
        performRender();
      }
    });

    return () => {
      unsubscribe();
      if (isSafari && rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [store, canvasRef, redrawImage, isSafari]);

  // Track the current image URL to detect changes
  const lastImageUrlRef = useRef<string | null>(null);

  // Draw image when imageUrl or aspectRatio changes
  useEffect(() => {
    if (imageUrl) {
      // Only clear cache if the URL itself changed
      if (lastImageUrlRef.current !== imageUrl) {
        imageRef.current = null;
        imagePositionRef.current = null;
        lastImageUrlRef.current = imageUrl;
      }
      drawImageOnCanvas();
    } else {
      // Clear image reference when imageUrl is null (reset)
      imageRef.current = null;
      imagePositionRef.current = null;
      lastImageUrlRef.current = null;
      // Clear canvas and update display size
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { width, height } = getCanvasDimensions(aspectRatio, isSafari);
          const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(aspectRatio, isDesktop);
          canvas.width = width;
          canvas.height = height;
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${displayHeight}px`;
          ctx.fillStyle = settingsRef.current.backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
      }
    }
  }, [imageUrl, aspectRatio, drawImageOnCanvas, isSafari, isDesktop]);

  // Initialize container background color on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = settingsRef.current.backgroundColor;
    }
  }, []);

  return (
    <CanvasContainer
      ref={containerRef}
      $aspectRatio={aspectRatio as AspectRatio}
    >
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div<{
  $aspectRatio: AspectRatio;
}>`
  width: ${props => props.$aspectRatio === '4:5'
    ? '256px'
    : props.$aspectRatio === '9:16'
      ? '180px'
      : `${CANVAS_DISPLAY_SIZE}px`};
  height: ${CANVAS_DISPLAY_SIZE}px;
  background-color: white; /* Initial value, updated imperatively via ref */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  ${props => props.$aspectRatio === '1:1' ? 'will-change: transform;' : ''}

  @media (min-width: 768px) {
    width: ${props => props.$aspectRatio === '4:5'
      ? `${CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP}px`
      : props.$aspectRatio === '9:16'
        ? `${CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP}px`
        : `${CANVAS_DISPLAY_SIZE_DESKTOP}px`};
    height: ${CANVAS_DISPLAY_SIZE_DESKTOP}px;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
`;
