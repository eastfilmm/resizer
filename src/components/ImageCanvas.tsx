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
  paddingEnabledAtom,
  paddingAtom,
  copyrightEnabledAtom,
  copyrightTextAtom,
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
} from '@/atoms/imageAtoms';
import { drawImageWithEffects, ImagePosition } from '@/utils/canvas';
import { CANVAS_ACTUAL_SIZE, CANVAS_DISPLAY_SIZE } from '@/constants/canvas';
import { useIsSafari } from '@/hooks/useIsSafari';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function ImageCanvas({ canvasRef }: ImageCanvasProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const blurIntensity = useAtomValue(blurIntensityAtom);
  const overlayOpacity = useAtomValue(overlayOpacityAtom);
  const paddingEnabled = useAtomValue(paddingEnabledAtom);
  const padding = useAtomValue(paddingAtom);
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const shadowIntensity = useAtomValue(shadowIntensityAtom);
  const shadowOffset = useAtomValue(shadowOffsetAtom);
  const setPaddingEnabled = useSetAtom(paddingEnabledAtom);
  const isSafari = useIsSafari();

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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<ImagePosition | null>(null);
  
  // Safari RAF throttle refs
  const rafIdRef = useRef<number | null>(null);
  const pendingRenderRef = useRef(false);

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

  const redrawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, imageAreaSize: number, useSafariFallback: boolean) => {
      imagePositionRef.current = drawImageWithEffects(ctx, img, {
        actualCanvasSize: CANVAS_ACTUAL_SIZE,
        imageAreaSize,
        bgColor: backgroundColorRef.current,
        useGlassBlur: glassBlurRef.current,
        blurIntensity: blurIntensityRef.current,
        overlayOpacity: overlayOpacityRef.current,
        showCopyright: copyrightEnabledRef.current,
        copyrightText: copyrightTextRef.current,
        useShadow: shadowEnabledRef.current,
        shadowIntensity: shadowIntensityRef.current,
        shadowOffset: shadowOffsetRef.current,
        isSafari: useSafariFallback,
      });
    },
    []
  );

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas actual size
    canvas.width = CANVAS_ACTUAL_SIZE;
    canvas.height = CANVAS_ACTUAL_SIZE;

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
      // Reset padding to disabled when new image is loaded (image fills canvas edge-to-edge)
      setPaddingEnabled(false);
      const imageAreaSize = CANVAS_ACTUAL_SIZE; // No padding initially
      redrawImage(ctx, newImg, imageAreaSize, isSafari);
    };
    newImg.src = imageUrl;
  }, [imageUrl, canvasRef, setPaddingEnabled, redrawImage, isSafari]);

  // Initialize canvas on mount
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = CANVAS_ACTUAL_SIZE;
        canvas.height = CANVAS_ACTUAL_SIZE;
        canvas.style.width = `${CANVAS_DISPLAY_SIZE}px`;
        canvas.style.height = `${CANVAS_DISPLAY_SIZE}px`;

        ctx.fillStyle = backgroundColorRef.current;
        ctx.fillRect(0, 0, CANVAS_ACTUAL_SIZE, CANVAS_ACTUAL_SIZE);
      }
    }
  }, [canvasRef]);

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

    const performRender = () => {
      const effectivePadding = paddingEnabled ? padding : 0;
      const imageAreaSize = CANVAS_ACTUAL_SIZE - effectivePadding * 2;

      // If we have an image, redraw it with new settings
      if (imageRef.current) {
        redrawImage(ctx, imageRef.current, imageAreaSize, isSafari);
        return;
      }

      // Fill background with solid color (no image loaded)
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, CANVAS_ACTUAL_SIZE, CANVAS_ACTUAL_SIZE);
    };

    // Safari: throttle rendering with RAF to prevent lag
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
      // Chrome/Firefox: render immediately for best performance
      performRender();
    }

    // Cleanup RAF on unmount or before next effect
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [
    backgroundColor,
    glassBlur,
    blurIntensity,
    overlayOpacity,
    paddingEnabled,
    padding,
    copyrightEnabled,
    copyrightText,
    shadowEnabled,
    shadowIntensity,
    shadowOffset,
    canvasRef,
    redrawImage,
    isSafari,
  ]);

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div`
  width: ${CANVAS_DISPLAY_SIZE}px;
  height: ${CANVAS_DISPLAY_SIZE}px;
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
  width: ${CANVAS_DISPLAY_SIZE}px;
  height: ${CANVAS_DISPLAY_SIZE}px;
  object-fit: contain;
`;
