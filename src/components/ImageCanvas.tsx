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
} from '@/atoms/imageAtoms';
import { drawImageWithEffects, ImagePosition } from '@/utils/canvas';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
} from '@/constants/canvas';
import { useAspectRatio } from '@/hooks/useAspectRatio';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function ImageCanvas({ canvasRef }: ImageCanvasProps) {
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
  const aspectRatioRef = useRef(aspectRatio);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<ImagePosition | null>(null);

  // Keep aspectRatioRef in sync with state
  aspectRatioRef.current = aspectRatio;

  const getCanvasDimensions = useCallback(() => {
    if (aspectRatioRef.current === '4:5') {
      return {
        width: CANVAS_ACTUAL_SIZE_4_5_WIDTH,
        height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
      };
    }
    if (aspectRatioRef.current === '9:16') {
      return {
        width: CANVAS_ACTUAL_SIZE_9_16_WIDTH,
        height: CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
      };
    }
    return {
      width: CANVAS_ACTUAL_SIZE,
      height: CANVAS_ACTUAL_SIZE,
    };
  }, []);

  const redrawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) => {
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
      const padding = paddingRef.current;
      const imageAreaWidth = canvasWidth - padding * 2;
      const imageAreaHeight = canvasHeight - padding * 2;

      if (img) {
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
      } else {
        // Fill background with solid color (no image loaded)
        ctx.fillStyle = backgroundColorRef.current;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
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
      redrawImage(ctx, newImg);
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

  // Handle effect changes imperatively
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
    ];

    const unsubscribes = atomsToWatch.map((atom) =>
      store.sub(atom, () => {
        // Update refs
        backgroundColorRef.current = store.get(backgroundColorAtom);
        glassBlurRef.current = store.get(glassBlurAtom);
        blurIntensityRef.current = store.get(blurIntensityAtom);
        overlayOpacityRef.current = store.get(overlayOpacityAtom);
        paddingRef.current = store.get(paddingAtom);
        copyrightEnabledRef.current = store.get(copyrightEnabledAtom);
        copyrightTextRef.current = store.get(copyrightTextAtom);
        shadowEnabledRef.current = store.get(shadowEnabledAtom);
        shadowIntensityRef.current = store.get(shadowIntensityAtom);
        shadowOffsetRef.current = store.get(shadowOffsetAtom);

        // Redraw imperatively
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            redrawImage(ctx, imageRef.current);
          }
        }
      })
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [store, canvasRef, redrawImage]);

  // Draw image when imageUrl or aspectRatio changes
  useEffect(() => {
    if (imageUrl) {
      imageRef.current = null;
      imagePositionRef.current = null;
      drawImageOnCanvas();
    } else {
      // Clear image reference when imageUrl is null (reset)
      imageRef.current = null;
      imagePositionRef.current = null;
      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const { width, height } = getCanvasDimensions();
          ctx.fillStyle = backgroundColorRef.current;
          ctx.fillRect(0, 0, width, height);
        }
      }
    }
  }, [imageUrl, aspectRatio, drawImageOnCanvas, getCanvasDimensions]);

  return (
    <CanvasContainer $aspectRatio={aspectRatio as '1:1' | '4:5' | '9:16'}>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div<{ $aspectRatio: '1:1' | '4:5' | '9:16' }>`
  width: ${props => props.$aspectRatio === '4:5'
    ? '256px'
    : props.$aspectRatio === '9:16'
      ? '180px' // 320 * 9/16 for display (rounded)
      : `${CANVAS_DISPLAY_SIZE}px`};
  height: ${CANVAS_DISPLAY_SIZE}px;
  background-color: white;
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
