'use client';

import styled from 'styled-components';
import { RefObject, useEffect, useCallback, useRef } from 'react';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
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
  polaroidModeAtom,
} from '@/atoms/imageAtoms';
import { drawImageWithEffects, ImagePosition, getCanvasDimensions, getCanvasDisplaySize } from '@/utils/CanvasUtils';
import { CANVAS_DISPLAY_SIZE, CANVAS_PREVIEW_SIZE } from '@/constants/CanvasContents';
import { useAspectRatio } from '@/hooks/useAspectRatio';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isSafari?: boolean;
}

export default function ImageCanvas({ canvasRef, isSafari = false }: ImageCanvasProps) {
  const store = useStore();
  const imageUrl = useAtomValue(imageUrlAtom);
  const { aspectRatio } = useAspectRatio();

  // Refs to access current values in callbacks without re-triggering effects
  const backgroundColorRef = useRef(store.get(backgroundColorAtom));
  const glassBlurRef = useRef(store.get(glassBlurAtom));
  const blurIntensityRef = useRef(store.get(blurIntensityAtom));
  const overlayOpacityRef = useRef(store.get(overlayOpacityAtom));
  const paddingRef = useRef(store.get(paddingAtom));
  const copyrightEnabledRef = useRef(store.get(copyrightEnabledAtom));
  const copyrightTextRef = useRef(store.get(copyrightTextAtom));
  const shadowEnabledRef = useRef(store.get(shadowEnabledAtom));
  const shadowIntensityRef = useRef(store.get(shadowIntensityAtom));
  const shadowOffsetRef = useRef(store.get(shadowOffsetAtom));
  const polaroidModeRef = useRef(store.get(polaroidModeAtom));
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
      const padding = paddingRef.current;
      const effectivePadding = isSafari ? padding * SCALE_FACTOR : padding;
      const imageAreaWidth = canvasWidth - effectivePadding * 2;
      const imageAreaHeight = canvasHeight - effectivePadding * 2;

      if (img) {
        imagePositionRef.current = drawImageWithEffects(ctx, img, {
          actualCanvasWidth: canvasWidth,
          actualCanvasHeight: canvasHeight,
          imageAreaWidth,
          imageAreaHeight,
          bgColor: backgroundColorRef.current,
          useGlassBlur: glassBlurRef.current,
          blurIntensity: blurIntensityRef.current * (isSafari ? SCALE_FACTOR : 1),
          overlayOpacity: overlayOpacityRef.current,
          showCopyright: copyrightEnabledRef.current,
          copyrightText: copyrightTextRef.current,
          useShadow: shadowEnabledRef.current,
          shadowIntensity: shadowIntensityRef.current * (isSafari ? SCALE_FACTOR : 1),
          shadowOffset: shadowOffsetRef.current * (isSafari ? SCALE_FACTOR : 1),
          usePolaroid: polaroidModeRef.current,
          scaleFactor: SCALE_FACTOR,
          isSafari,
        });
      } else {
        // Fill background with solid color (no image loaded)
        ctx.fillStyle = backgroundColorRef.current;
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
    const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(aspectRatioRef.current);

    // Set canvas actual size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set display size (scaled down with CSS) - match container size
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
  }, [imageUrl, canvasRef, redrawImage, isSafari]);

  // Initialize canvas on mount
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, isSafari);
        const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(aspectRatio);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        ctx.fillStyle = backgroundColorRef.current;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasRef, aspectRatio, isSafari]);

  // Handle effect changes imperatively with conditional RAF throttle for Safari
  useEffect(() => {
    const atomsToWatch = [
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
      polaroidModeAtom,
    ];

    const performRender = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          redrawImage(ctx, imageRef.current);
        }
      }
    };

    const unsubscribes = atomsToWatch.map((atom) =>
      store.sub(atom, () => {
        // Update refs
        const newBackgroundColor = store.get(backgroundColorAtom);
        backgroundColorRef.current = newBackgroundColor;
        glassBlurRef.current = store.get(glassBlurAtom);
        blurIntensityRef.current = store.get(blurIntensityAtom);
        overlayOpacityRef.current = store.get(overlayOpacityAtom);
        paddingRef.current = store.get(paddingAtom);
        copyrightEnabledRef.current = store.get(copyrightEnabledAtom);
        copyrightTextRef.current = store.get(copyrightTextAtom);
        shadowEnabledRef.current = store.get(shadowEnabledAtom);
        shadowIntensityRef.current = store.get(shadowIntensityAtom);
        shadowOffsetRef.current = store.get(shadowOffsetAtom);
        polaroidModeRef.current = store.get(polaroidModeAtom);

        // Update container background color imperatively (no re-render)
        if (containerRef.current) {
          containerRef.current.style.backgroundColor = newBackgroundColor;
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
      })
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
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
          const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(aspectRatio);
          canvas.width = width;
          canvas.height = height;
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${displayHeight}px`;
          ctx.fillStyle = backgroundColorRef.current;
          ctx.fillRect(0, 0, width, height);
        }
      }
    }
  }, [imageUrl, aspectRatio, drawImageOnCanvas, isSafari]);

  // Initialize container background color on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = backgroundColorRef.current;
    }
  }, []);

  return (
    <CanvasContainer
      ref={containerRef}
      $aspectRatio={aspectRatio as '1:1' | '4:5' | '9:16'}
    >
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div<{
  $aspectRatio: '1:1' | '4:5' | '9:16';
}>`
  width: ${props => props.$aspectRatio === '4:5'
    ? '256px'
    : props.$aspectRatio === '9:16'
      ? '180px' // 320 * 9/16 for display (rounded)
      : `${CANVAS_DISPLAY_SIZE}px`};
  height: ${CANVAS_DISPLAY_SIZE}px;
  background-color: white; /* Initial value, updated imperatively via ref */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  ${props => props.$aspectRatio === '1:1' ? 'will-change: transform;' : ''}
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
`;
